import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { colors, fonts } from "src/styles"

export default function Button ({style, color, enableShadow, title, ...otherProps}){
  return (
    <TouchableOpacity activeOpacity={0.85} {...otherProps}>
      <View style={[styles.button, (style && style.shadowColor)?styles.buttonShadow: {}, style]}>
        <Text style={[styles.text, { color: color || "black" }]}>{ title }</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    color: colors.background,
    borderRadius: 8
  },
  text: {
    color: colors.background,
    fontFamily: fonts.bold,
    lineHeight: 50,
    textAlign: 'center',
  },
  buttonShadow: {
    shadowColor: "#fff",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  }
 
})