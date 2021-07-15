import React from 'react'
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native'
import { colors, fonts } from 'src/styles'

export default function SegmentButton ({ options, style, onChange, value, name }){

  const keys = Object.keys(options)

  return (
    <View style={[styles.container, style]}>
      {keys.map((key, i) => (
        <TouchableHighlight 
          key={key} 
          underlayColor={value !== key? colors.rippleEffect: "#CCCCCC" }
          style={[styles.button, i===0 && styles.buttonStart, i === keys.length-1 && styles.buttonEnd, value === key && styles.active]}
          onPress={() => onChange(key, name)}
        >
          <Text style={[styles.text, value === key && styles.activeText]}>{options[key]}</Text>
        </TouchableHighlight>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  active: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  buttonStart: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftWidth: 2
  },
  buttonEnd: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 2
  },
  button: {
    borderColor: colors.border,
    borderWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    height: 54,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text:{
    fontFamily: fonts.demi,
    color: colors.subText
  },
  activeText: {
    color: colors.background
  }
})