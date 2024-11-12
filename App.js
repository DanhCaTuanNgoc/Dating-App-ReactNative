import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
   Login,
   Register,
   Home,
   PhoneLogin,
   VerifyPhoneNumber,
   Infomation,
} from './app/index'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
const Stack = createNativeStackNavigator()

function App() {
   return (
      <SafeAreaView style={{ flex: 1 }}>
         <NavigationContainer>
            <Stack.Navigator
               screenOptions={{
                  headerShown: false,
               }}
               initialRouteName="Login"
            >
               <Stack.Screen name="Login" component={Login} />
               <Stack.Screen name="Register" component={Register} />
               <Stack.Screen name="Home" component={Home} />
               <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
               <Stack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} />
               <Stack.Screen name="Infomation" component={Infomation} />
            </Stack.Navigator>
         </NavigationContainer>
      </SafeAreaView>
   )
}

export default App
