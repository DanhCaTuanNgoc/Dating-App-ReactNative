import React, { useEffect, useState } from 'react'
import {
   View,
   FlatList,
   TextInput,
   StyleSheet,
   TouchableOpacity,
   Text,
   Alert,
   KeyboardAvoidingView,
   Platform,
} from 'react-native'
import { chatService } from '@/backend/services/chatService'
import MessageBubble from './MessageBubble'
import { useSelector } from 'react-redux'
import { COLORS } from '@/constants/theme'
import { Message } from '@/components/chat'

export default function ChatRoom({ route, navigation }: { route: any; navigation: any }) {
   const { conversationId, otherUser } = route.params
   const [messages, setMessages] = useState<Message[]>([])
   const [inputText, setInputText] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const { userId } = useSelector((state: any) => state.userState)

   useEffect(() => {
      if (!conversationId) {
         console.error('No conversationId provided')
         navigation.goBack()
         return
      }

      try {
         const unsubscribe = chatService.subscribeToMessages(
            conversationId,
            (newMessages: Message[]) => {
               setMessages(newMessages)
            },
         )
         return () => unsubscribe && unsubscribe()
      } catch (error) {
         console.error('Error subscribing to messages:', error)
         Alert.alert('Error', 'Failed to load messages')
      }
   }, [conversationId])

   const handleSend = async () => {
      if (!inputText.trim() || isLoading) return
      setIsLoading(true)
      try {
         await chatService.sendMessage(conversationId, userId, inputText.trim())
         setInputText('')
      } catch (error) {
         console.error('Error sending message:', error)
         Alert.alert('Error', 'Failed to send message')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
         <FlatList
            data={messages}
            renderItem={({ item }) => (
               <MessageBubble message={item} isOwn={item.senderId === userId} />
            )}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.messageList}
         />
         <View style={styles.inputContainer}>
            <TextInput
               style={styles.input}
               value={inputText}
               onChangeText={setInputText}
               placeholder="Nhập tin nhắn..."
               multiline
               maxLength={500}
            />
            <TouchableOpacity
               style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
               ]}
               onPress={handleSend}
               disabled={!inputText.trim() || isLoading}
            >
               <Text style={styles.sendButtonText}>
                  {isLoading ? 'Đang gửi...' : 'Gửi'}
               </Text>
            </TouchableOpacity>
         </View>
      </KeyboardAvoidingView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   messageList: {
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   inputContainer: {
      flexDirection: 'row',
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      backgroundColor: '#fff',
   },
   input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      maxHeight: 100,
   },
   sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
      paddingHorizontal: 16,
      borderRadius: 20,
   },
   sendButtonDisabled: {
      backgroundColor: '#ccc',
   },
   sendButtonText: {
      color: '#fff',
      fontWeight: '600',
   },
})
