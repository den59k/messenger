import React, { useState } from 'react'
import { observer } from "mobx-react";
import { Layout } from 'src/components/layout';
import { useCallStore } from 'src/providers/call';
import RoomStore from './store'

import CallHeader from './header'
import BottomPanel from './bottom-panel'
import { View } from 'react-native';

function CallRoomScreen (){

  const callStore = useCallStore()
  const [ roomStore ] = useState(() => new RoomStore(callStore))

  return (
    <Layout style={{paddingHorizontal: 0}}>
      <CallHeader callee={callStore.callee}/>
      <View style={{flex: 1}}></View>
      <BottomPanel/>
    </Layout>
  )
}

export default observer(CallRoomScreen)