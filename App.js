import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/Login/Login';
import RegisterScreen from './screens/Login/Register.js';
import ForgetScreen from './screens/Login/Forget.js';
import MainScreen from './screens/User/Main.js';
import AdminScreen from './screens/Admin/Admin.js';



const Stack = createStackNavigator();

export default function App() {
  return (
 <NavigationContainer >
<Stack.Navigator
  screenOptions={{
    headerShown: false
  }}
>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='Forget' component={ForgetScreen} />
      <Stack.Screen name='Main' component={MainScreen} />
      <Stack.Screen name='Admin' component={AdminScreen} />

    </Stack.Navigator>
    
 </NavigationContainer>
  );
}

