import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login'
import SignUpScreen from './src/screens/SignUp';
import ForgetPasswordScreen from './src/screens/ForgetPassword';
import { RootSiblingParent } from 'react-native-root-siblings';
import AuthContextProvider from './src/store/context/AuthContext'
import ListTaskScreen from './src/screens/ListTask';
import UserHomeScreen from './src/screens/UserHome';


export default function App() {

  const AppStack = createNativeStackNavigator();


  return (

    <RootSiblingParent>
      <AuthContextProvider>
          <NavigationContainer >
            <AppStack.Navigator initialRouteName='Login'>
              <AppStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}></AppStack.Screen>
              <AppStack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}></AppStack.Screen>
              <AppStack.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={{ headerShown: false }}></AppStack.Screen>
              <AppStack.Screen name='ListTask' component={ListTaskScreen} options={{ headerShown: false }}></AppStack.Screen>
              <AppStack.Screen name='UserHome' component={UserHomeScreen} options={{ headerShown: false }}></AppStack.Screen>
            </AppStack.Navigator>
          </NavigationContainer>
      </AuthContextProvider>
    </RootSiblingParent>

  );
}




