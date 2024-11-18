import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
   Login,
   Register,
   Home,
   PhoneLogin,
   VerifyPhoneNumber,
   Infomation,
   Interests,
   Pictures,
} from './app/index'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { store } from './store/store'
const Stack = createNativeStackNavigator()

function App() {
   return (
      <Provider store={store}>
         <SafeAreaProvider>
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
                  <Stack.Screen
                     name="VerifyPhoneNumber"
                     component={VerifyPhoneNumber}
                  />
                  <Stack.Screen name="Infomation" component={Infomation} />
                  <Stack.Screen name="Interests" component={Interests} />
                  <Stack.Screen name="Pictures" component={Pictures} />
               </Stack.Navigator>
            </NavigationContainer>
         </SafeAreaProvider>
      </Provider>
   )
}

export default App
