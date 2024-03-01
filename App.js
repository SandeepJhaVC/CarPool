import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import Register from './screens/Register';

import DrawerNavigator from './navigation/DrawerNavigator';


const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}