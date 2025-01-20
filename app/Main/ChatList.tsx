import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { chatService } from '@/backend/services/chatService'
import ChatListItem from '@/components/ChatListItem'
import ChatListItemSkeleton from '@/components/ChatListItemSkeleton'
import { useSelector } from 'react-redux'
import { API_BASE_URL } from '@/store/IPv4'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

export default function ChatList({ navigation }: { navigation: any }) {
   const [conversations, setConversations] = useState<any[]>([])
   const [searchQuery, setSearchQuery] = useState('')
   const [isLoading, setIsLoading] = useState(true)
   const userId = useSelector((state: any) => state.userState.userId)

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
               setIsLoading(false)
            } catch (error) {
               console.error('Error processing conversations:', error)
               setIsLoading(false)
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

   const renderContent = () => {
      if (isLoading) {
         return (
            <FlatList
               data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // Số lượng skeleton items
               renderItem={() => <ChatListItemSkeleton />}
               keyExtractor={(item) => item.toString()}
            />
         )
      }

      return (
         <FlatList
            data={conversations}
            renderItem={({ item }) => (
               <ChatListItem conversation={item} onPress={() => handlePress(item)} />
            )}
            keyExtractor={(item) => item.id}
         />
      )
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
               <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
               />
               {searchQuery.length > 0 && (
                  <TouchableOpacity
                     onPress={() => setSearchQuery('')}
                     style={styles.clearButton}
                  >
                     <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
               )}
            </View>
         </View>

         {renderContent()}
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   searchContainer: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      backgroundColor: COLORS.white,
   },
   searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 45,
   },
   searchIcon: {
      marginRight: 10,
   },
   searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#000',
      height: '100%',
   },
   clearButton: {
      padding: 5,
   },
})
