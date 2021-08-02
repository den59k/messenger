import { observer } from 'mobx-react'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { RTCView } from 'react-native-webrtc'
import UserIcon from 'src/components/user-icon'
import { useCallStore } from 'src/providers/call'
import { colors, fonts } from 'src/styles'
import Ionicons from 'react-native-vector-icons/Ionicons';

function UsersContainer({ roomStore }){

  const callStore = useCallStore()
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {Array.from(roomStore.users).map(([key, userInfo]) => (
        <ViewBox key={key} connection={roomStore.streams.get(key)} userInfo={userInfo}/>
      ))}
      <ViewBox 
        connection={{stream: roomStore.stream, constraints: roomStore.constraints}} 
        userInfo={callStore.userInfo} 
        selected={true}
      />
    </ScrollView>
  )
}

export default observer(UsersContainer)

function ViewBox ({connection, userInfo, selected}){
  if(connection && connection.stream && connection.constraints.video)
    return (
      <View style={styles.userBox}>
        <RTCView style={styles.rtcView} objectFit="contain" streamURL={connection.stream.toURL()} zOrder={0}/>
        <Text style={[styles.userNameSub, selected && { color: colors.primary }]}>{userInfo.name}</Text>
      </View>
    )

  return (
    <View style={styles.userBox}>
      <UserIcon size={65} src={userInfo.avatar}/>
      {connection && connection.constraints.audio && (
        <View style={styles.mic}>
          <Ionicons name="md-mic" size={16} color="white"/>
        </View>
      )}
      <Text style={[styles.userName, selected && { color: colors.primary }]}>{userInfo.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  userBox: {
    width: "50%",
    height: 200,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    position: "relative"
  },
  userName: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: 16,
    marginTop: 10,
    zIndex: 2
  },
  userNameSub: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#00000070",
    borderRadius: 5,
    position: "absolute",
    bottom: 5
  },
  rtcView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mic: {
    position: 'absolute',
    top: 95,
    left: "50%",
    marginLeft: 12,
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  }
})