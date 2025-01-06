import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AlertModalProps {
   visible: boolean
   title: string
   message: string
   iconName: keyof typeof Ionicons.glyphMap
   color: string
   onClose: () => void
}

const AlertModal = ({
   visible,
   title,
   message,
   iconName,
   color,
   onClose,
}: AlertModalProps) => {
   return (
      <Modal
         animationType="fade"
         transparent={true}
         visible={visible}
         onRequestClose={onClose}
      >
         <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Ionicons name={iconName} size={40} color={color} />
               </View>
               <Text style={styles.modalTitle}>{title}</Text>
               <Text style={styles.modalMessage}>{message}</Text>
               <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: color }]}
                  onPress={onClose}
               >
                  <Text style={styles.modalButtonText}>OK</Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContent: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      width: '80%',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
   },
   modalHeader: {
      marginBottom: 12,
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
   },
   modalMessage: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
   },
   modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 12,
      minWidth: 200,
      alignItems: 'center',
   },
   modalButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
   },
})

export default AlertModal
