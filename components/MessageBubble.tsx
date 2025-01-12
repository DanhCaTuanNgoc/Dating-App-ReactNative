import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '@/constants/theme'
import { Message } from '@/components/chat'

interface MessageBubbleProps {
   message: Message
   isOwn: boolean
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
   const formatMessageTime = (timestamp: string) => {
      try {
         const date = new Date(timestamp)
         return date.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
         })
      } catch (error) {
         return ''
      }
   }

   return (
      <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
         <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
            {message.text}
         </Text>
         <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
            {formatMessageTime(message.timestamp)}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      maxWidth: '80%',
      padding: 10,
      borderRadius: 20,
      marginVertical: 5,
      marginHorizontal: 10,
   },
   ownMessage: {
      alignSelf: 'flex-end',
      backgroundColor: COLORS.primary,
   },
   otherMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#e5e5e5',
   },
   text: {
      fontSize: 16,
   },
   ownText: {
      color: '#fff',
   },
   otherText: {
      color: '#000',
   },
   time: {
      fontSize: 12,
      color: '#999',
      marginTop: 5,
   },
   ownTime: {
      color: '#fff',
   },
   otherTime: {
      color: '#000',
   },
})

export default MessageBubble
