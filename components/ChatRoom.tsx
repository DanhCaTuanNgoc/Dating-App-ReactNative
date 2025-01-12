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
   Image,
} from 'react-native'
import { chatService } from '@/backend/services/chatService'
import MessageBubble from './MessageBubble'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '@/constants/theme'
import { Message } from '@/types/chat'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

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

   const renderHeader = () => (
      <LinearGradient
         colors={[COLORS.primary, COLORS.secondary]}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 0 }}
         style={styles.header}
      >
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
         </TouchableOpacity>

         <View style={styles.userInfo}>
            <Image
               source={{
                  uri: otherUser.avatar_url || 'https://via.placeholder.com/40',
               }}
               style={styles.avatar}
            />
            <View>
               <Text style={styles.userName}>{otherUser.name}</Text>
               <Text style={styles.userStatus}>Online</Text>
            </View>
         </View>

         <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
         </TouchableOpacity>
      </LinearGradient>
   )

   return (
      <SafeAreaView style={styles.safeArea}>
         {renderHeader()}
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
               <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
               </TouchableOpacity>
               <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập tin nhắn..."
                  placeholderTextColor={'#999'}
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
                  <Ionicons
                     name="send"
                     size={20}
                     color={!inputText.trim() || isLoading ? '#999' : COLORS.white}
                  />
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: COLORS.white,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
   },
   backButton: {
      padding: 8,
   },
   userInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
   },
   avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 2,
      borderColor: COLORS.white,
   },
   userName: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.white,
   },
   userStatus: {
      fontSize: 12,
      color: '#E0E0E0',
   },
   moreButton: {
      padding: 8,
   },
   container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
   },
   messageList: {
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: COLORS.white,
      borderTopWidth: 1,
      borderTopColor: '#eee',
   },
   attachButton: {
      padding: 8,
      marginRight: 8,
   },
   input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      maxHeight: 100,
      backgroundColor: '#F8F8F8',
   },
   sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
   },
   sendButtonDisabled: {
      backgroundColor: '#eee',
   },
})
