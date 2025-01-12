import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, set, update } from 'firebase/database'
import firebaseConfig from '../config/firebase-config'

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const chatService = {
   async createConversation(userId1: string, userId2: string) {
      try {
         const newConversationRef = push(ref(db, 'conversations'))
         await set(newConversationRef, {
            participants: [userId1, userId2],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastMessage: null,
         })
         return newConversationRef.key
      } catch (error) {
         console.error('Error creating conversation:', error)
         throw error
      }
   },

   subscribeToConversations(userId: string, callback: (conversations: any[]) => void) {
      const conversationsRef = ref(db, 'conversations')
      return onValue(conversationsRef, (snapshot) => {
         const conversations: any[] = []
         snapshot.forEach((childSnapshot) => {
            const conversation = childSnapshot.val()
            if (conversation.participants.includes(userId)) {
               conversations.push({
                  id: childSnapshot.key,
                  ...conversation,
               })
            }
         })
         callback(conversations)
      })
   },

   subscribeToMessages(conversationId: string, callback: (messages: any[]) => void) {
      const messagesRef = ref(db, `messages/${conversationId}`)
      return onValue(messagesRef, (snapshot) => {
         const messages: any[] = []
         snapshot.forEach((childSnapshot) => {
            messages.push({
               id: childSnapshot.key,
               ...childSnapshot.val(),
            })
         })
         callback(
            messages.sort(
               (a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            ),
         )
      })
   },

   async sendMessage(conversationId: string, senderId: string, text: string) {
      try {
         // Add new message
         const newMessageRef = push(ref(db, `messages/${conversationId}`))
         const timestamp = new Date().toISOString()

         await set(newMessageRef, {
            text,
            senderId,
            timestamp,
            read: false,
         })

         // Update conversation's last message
         const conversationRef = ref(db, `conversations/${conversationId}`)
         await update(conversationRef, {
            lastMessage: {
               text,
               senderId,
               timestamp,
            },
            updatedAt: timestamp,
         })
      } catch (error) {
         console.error('Error sending message:', error)
         throw error
      }
   },
}
