import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SIZES } from '@/constants/theme'

interface ChatListItemProps {
   conversation: {
      id: string
      participants: string[]
      lastMessage: {
         text: string
         timestamp: string
         senderId: string
      } | null
      otherUser: {
         name: string
         avatar_url: string
      }
   }
   onPress: () => void
}

const ChatListItem = ({ conversation, onPress }: ChatListItemProps) => {
   const { lastMessage, otherUser } = conversation

   const formatTime = (timestamp: string) => {
      try {
         const date = new Date(timestamp)
         return date.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
         })
      } catch (error) {
         console.error('Error formatting time:', error)
         return ''
      }
   }

   return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
         <Image
            source={{
               uri: otherUser.avatar_url || 'https://via.placeholder.com/50',
            }}
            style={styles.avatar}
         />
         <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
               <Text style={styles.name}>{otherUser.name}</Text>
               {lastMessage && (
                  <Text style={styles.time}>{formatTime(lastMessage.timestamp)}</Text>
               )}
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
               {lastMessage?.text || 'Bắt đầu cuộc trò chuyện'}
            </Text>
         </View>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      padding: SIZES.medium,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: SIZES.medium,
   },
   contentContainer: {
      flex: 1,
      justifyContent: 'center',
   },
   headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
   },
   name: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textColor,
   },
   time: {
      fontSize: 12,
      color: COLORS.textColor,
   },
   lastMessage: {
      fontSize: 14,
      color: COLORS.textColor,
      marginTop: 2,
   },
})

export default ChatListItem
