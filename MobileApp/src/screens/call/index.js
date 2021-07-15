import React, { useState } from 'react'
import { StatusBar, View } from 'react-native'
import { useCallStore } from 'src/providers/call'
import { colors } from 'src/styles'

import IncomingCallScreen from './incoming'
import OutcomingCallScreen from './outcoming'
import CallRoomScreen from './call-room'
import { observer } from 'mobx-react'

function getScreen(call){

  return <CallRoomScreen/>
  return <OutcomingCallScreen/>
  return <IncomingCallScreen/>
}

function CallScreen (){

  const callStore = useCallStore()
  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <StatusBar backgroundColor={colors.statusBar}/>
      {getScreen(callStore.call)}
    </View>
  )
}

export default observer(CallScreen)

