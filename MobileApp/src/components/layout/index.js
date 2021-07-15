import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { fonts, paddings } from 'src/styles'

export function Layout ({ children, title, style }){

  return (
    <View style={[styles.container, style]}>
      { title && <Text style={styles.text}>{title}</Text> }
      { children }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: paddings.layout
  },
  text: {
    color: "white",
    fontFamily: fonts.regular,
    fontSize: 22,
    paddingTop: 25,
    paddingBottom: 25
  }
})

