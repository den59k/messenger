import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { colors, fonts } from 'src/styles'
import AnimatedView from '../animated'

function ModalWindow ({title, children}){
  return (
    <AnimatedView style={styles.modal}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {children}
      </View>
    </AnimatedView>
  )
}

export default ModalWindow

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.background,
    borderRadius: 16
  },
  title: {
    textAlign: "center",
    lineHeight: 50,
    fontFamily: fonts.bold,
    backgroundColor: colors.rippleEffect,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    fontSize: 16,
    color: "white",
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20
  }
})