import { observer } from 'mobx-react';
import React from 'react'
import { StyleSheet, View } from "react-native";
import { useCallStore } from 'src/providers/call';
import { colors, paddings } from 'src/styles';
import CallButton from "../../call-button";

const getStyle = (active) => active?{ backgroundColor: colors.primary }: { backgroundColor: "#565656", color: colors.background }

function BottomPanel ({ roomStore }){

  const { audio, video } = roomStore.constraints
  const callStore = useCallStore()

  const onMicClick = () => {
    const newConstraints = { ...roomStore.constraints, audio: !audio }
    roomStore.initBroadcast(newConstraints)
  }

  const onCamClick = () => {
    const newConstraints = { ...roomStore.constraints, video: !video }
    roomStore.initBroadcast(newConstraints)
  }

  const onClose = () => {
    callStore.bye()
  }

  return (
    <View style={styles.container}>
      <CallButton icon={audio?"md-mic": "md-mic-off"} style={getStyle(audio)} size={60} onPress={onMicClick}/>
      <CallButton icon="ios-videocam" style={getStyle(video)} size={60} onPress={onCamClick}/>
      <CallButton style={{ backgroundColor: colors.red }} size={60} rotate="135deg" onPress={onClose}/>
    </View>
  )
}

export default observer(BottomPanel)

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: paddings.layout,
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row"
  }
})