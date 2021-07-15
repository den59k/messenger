import React, { useEffect, useRef } from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
import { colors, fonts, MyTheme } from 'src/styles'

import MainScreen from '../main'
import CreateGroupScreen from '../main/groups/create-group'
import ConfScreen from '../main/messages/conf'
import CreateConfScreen from '../main/messages/create-conf'
import { useWS } from 'src/providers/ws'
import { useMessageStore } from 'src/providers/messages'
import { useAuthStore } from 'src/providers/auth'
import CallScreen from '../call'
import { useCallStore } from 'src/providers/call'


const Stack = createStackNavigator()
const _options = {
  title: '',
  headerStyle: {
    height: 75,
    backgroundColor: 'transparent'
  },
  headerTitleStyle: {
    fontFamily: fonts.regular,
    fontSize: 20
  }
}

const options = {   ...TransitionPresets.DefaultTransition, ..._options }
const messageOptions = { ...TransitionPresets.SlideFromRightIOS, ..._options }

function AppContainer (){

  const navigationRef = useRef(null);
  const authStore = useAuthStore()
  const ws = useWS()
  const messageStore = useMessageStore()
  const callStore = useCallStore()

  useEffect(() => {
    
    ws.init()
    const messageCallback = ws.on("message", messageStore.receiveMessage.bind(messageStore))
    const callCallback = ws.on("call", callStore.receiveCall.bind(callStore))

    messageStore.init({ user_id: authStore.userData.id })
    callStore.init()

    return () => {
      ws.off("message", messageCallback)
      ws.off("call", callCallback)
    }
  }, [])

  if(callStore.call)
    return <CallScreen/>

  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <StatusBar backgroundColor={colors.statusBar}/>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen options={{...options, headerShown: false }} name="Call" component={CallScreen} />
          <Stack.Screen options={{...options, headerShown: false }} name="Main" component={MainScreen}/>
          <Stack.Screen options={{...options, title: "Создание группы"}} name="CreateGroup" component={CreateGroupScreen}/>
          <Stack.Screen options={{...options, title: "Написать сообщение"}} name="CreateConf" component={CreateConfScreen}/>
          <Stack.Screen options={{...messageOptions, headerShown: false }} name="Conf" component={ConfScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default AppContainer