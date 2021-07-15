import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from 'src/styles';

function CallButton ({ style, icon, title, size, rotate, ...otherProps }){

  const _size = size || 70
  const { backgroundColor, color, ...otherStyle } = (style || {})

  return (
    <TouchableOpacity activeOpacity={0.7} style={otherStyle} {...otherProps}>
      <View style={{ alignItems: "center" }}>
        <View style={[styles.button, { 
          width: _size, 
          height: _size,
          borderRadius: _size/2, 
          backgroundColor: backgroundColor || "#04BD00",
          transform: rotate? [{ rotate }]: []
        }]}>
          <Ionicons  name={icon || "ios-call"} color={color || "white"} size={_size*0.35}/>
        </View>
        { title && <Text style={styles.title}>{title}</Text>}
      </View>
    </TouchableOpacity>
  )

}

export default CallButton

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35
  },
  title: {
    color: "white",
    fontFamily: fonts.demi,
    fontSize: 13,
    marginTop: 6
  }
})