import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/theme'

function Chat() {
   return (
      <SafeAreaView style={styles.container}>
         <Text>Chat</Text>
      </SafeAreaView>
   )
}

export default Chat

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.backgroundContent,
      paddingHorizontal: SIZES.medium,
   },
})
