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
import { observer } from 'mobx-react'


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

    const callbacks = {
      "message": messageStore.receiveMessage.bind(messageStore),
      "call-invite": callStore.onInvite.bind(callStore),
      "call-ok": callStore.onOk.bind(callStore),
      "call-decline": callStore.onDecline.bind(callStore),
      "call-cancel": callStore.onCancel.bind(callStore)
    }
    
    for(let key in callbacks)
      ws.on(key, callbacks[key])

    messageStore.init({ user_id: authStore.userData.id })
    callStore.init(ws)

    return () => {
      console.log("dispose ws")
      ws.dispose()
      for(let key in callbacks)
        ws.off(key, callbacks[key])
    }
  }, [])

  if(callStore.callStatus && callStore.callStatus !== "none")
    return <CallScreen/>

  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <StatusBar backgroundColor={colors.statusBar}/>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen options={{...options, headerShown: false }} name="Main" component={MainScreen}/>
          <Stack.Screen options={{...options, title: "Создание группы"}} name="CreateGroup" component={CreateGroupScreen}/>
          <Stack.Screen options={{...options, title: "Написать сообщение"}} name="CreateConf" component={CreateConfScreen}/>
          <Stack.Screen options={{...messageOptions, headerShown: false }} name="Conf" component={ConfScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default observer(AppContainer)