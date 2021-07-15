import React, { useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
import { colors, MyTheme } from 'src/styles'
import messaging from '@react-native-firebase/messaging';


import HelloScreen from './hello'
import LoginScreen from './login'
import RegisterHelloScreen from './register-hello'
import RegisterScreen from './register'

const Stack = createStackNavigator()

const options = {
  ...TransitionPresets.SlideFromRightIOS,
  title: ''
}


export default function AuthScreen(){

  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <NavigationContainer theme={MyTheme}>
        <StatusBar backgroundColor={colors.statusBar}/>
        <Stack.Navigator>
          <Stack.Screen options={{...options, headerShown: false }} name="Hello" component={HelloScreen}/>
          <Stack.Screen options={options} name="Login" component={LoginScreen}/>
          <Stack.Screen options={options} name="RegisterHello" component={RegisterHelloScreen}/>
          <Stack.Screen options={options} name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}
