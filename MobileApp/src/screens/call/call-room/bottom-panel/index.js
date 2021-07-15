import React from 'react'
import { StyleSheet, View } from "react-native";
import { colors, paddings } from 'src/styles';
import CallButton from "../../call-button";

export default function BottomPanel (){

  return (
    <View style={styles.container}>
      <CallButton icon="md-mic" style={{ backgroundColor: "#0086D1" }} size={60}/>
      <CallButton icon="ios-videocam" style={{ backgroundColor: "#0086D1" }} size={60}/>
      <CallButton style={{ backgroundColor: colors.red }} size={60} rotate="135deg"/>
    </View>
  )
}

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