export interface Message {
   id: string
   text: string
   senderId: string
   timestamp: string
   read: boolean
}
export interface Conversation {
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
   createdAt: string
   updatedAt: string
}
