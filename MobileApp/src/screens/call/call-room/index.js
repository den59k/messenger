import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react";
import { Layout } from 'src/components/layout';
import { useCallStore } from 'src/providers/call';
import RoomStore from './store'
import { RTCView } from 'react-native-webrtc'

import CallHeader from './header'
import BottomPanel from './bottom-panel'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useWS } from 'src/providers/ws';
import UsersContainer from './containers/users';

function CallRoomScreen (){

  const ws = useWS()
  const callStore = useCallStore()
  const [ roomStore ] = useState(() => new RoomStore(callStore.roomInfo.id, ws))
  useEffect(() => {
    roomStore.init(callStore.roomInfo.users)

    const callbacks = {
      "call-deleteUser": roomStore.deleteUser.bind(roomStore),
      "call-newUser": roomStore.addUser.bind(roomStore),
      "call-consume": roomStore.onConsume.bind(roomStore)
    }

    for(let key in callbacks)
      ws.on(key, callbacks[key])

    return () => {
      roomStore.dispose()
      for(let key in callbacks)
        ws.off(key, callbacks[key])
    }
  }, [ callStore, ws ])

  const streamURL = roomStore.produceVideoUrl

  return (
    <Layout style={{paddingHorizontal: 0}}>
      <CallHeader info={callStore.info} roomStore={roomStore}/>
      <View style={{flex: 1}}>
        {roomStore.type === 'ls' && roomStore.produceVideoUrl && roomStore.constraints.video && (
          <RTCView objectFit="contain" streamURL={streamURL} style={styles.ownVideo} zOrder={2}/> 
        )}
        <UsersContainer roomStore={roomStore} />
      </View>
      <BottomPanel roomStore={roomStore}/>
    </Layout>
  )
}

export default observer(CallRoomScreen)

const styles = StyleSheet.create({
  ownVideo: {
    position: "absolute",
    width: 150,
    height: 150,
    right: 10,
    top: 10
  }
})