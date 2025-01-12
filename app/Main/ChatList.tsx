import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { chatService } from '@/backend/services/chatService'
import ChatListItem from '@/components/ChatListItem'
import { useSelector } from 'react-redux'
import { getUserInfo, getUserPhotos } from '@/store/user/userAction'
import { API_BASE_URL } from '@/store/IPv4'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

export default function ChatList({ navigation }: { navigation: any }) {
   const [conversations, setConversations] = useState<any[]>([])
   const userId = useSelector((state: any) => state.userState.userId)
   const dispatch = useDispatch()

   useEffect(() => {
      const unsubscribe = chatService.subscribeToConversations(
         userId,
         async (newConversations: any) => {
            try {
               const conversationsWithUsers = await Promise.all(
                  newConversations.map(async (conv: any) => {
                     const otherUserId = conv.participants.find(
                        (id: any) => id !== userId,
                     )
                     try {
                        const response = await fetch(
                           `${API_BASE_URL}/userInfo/get/${otherUserId}`,
                        )
                        const avatar = await fetch(
                           `${API_BASE_URL}/userPhotos/get/${otherUserId}`,
                        )

                        if (!response.ok || !avatar.ok)
                           throw new Error('Failed to fetch user')
                        const userData = await response.json()
                        const avatarData = await avatar.json()
                        return {
                           ...conv,
                           otherUser: {
                              name: userData.name,
                              avatar_url:
                                 avatarData.find((photo: any) => photo.is_primary)
                                    ?.photo_url || '',
                           },
                        }
                     } catch (error) {
                        console.error('Error fetching user:', error)
                        return {
                           ...conv,
                           otherUser: {
                              name: 'Unknown User',
                              avatar_url: '',
                           },
                        }
                     }
                  }),
               )
               setConversations(conversationsWithUsers)
               console.log(conversationsWithUsers)
            } catch (error) {
               console.error('Error processing conversations:', error)
            }
         },
      )

      return () => unsubscribe()
   }, [userId])

   const handlePress = (conversation: any) => {
      navigation.navigate('ChatRoom', {
         conversationId: conversation.id,
         otherUser: conversation.otherUser,
      })
   }

   return (
      <SafeAreaView style={styles.container}>
         <FlatList
            data={conversations}
            renderItem={({ item }) => (
               <ChatListItem conversation={item} onPress={() => handlePress(item)} />
            )}
            keyExtractor={(item) => item.id}
         />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
})
