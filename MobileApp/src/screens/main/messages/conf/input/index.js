import React, { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { REST } from 'src/services'
import { colors, fonts } from 'src/styles'

function ChatInput ({ confStore }){

  const [ value, setValue ] = useState()
  const [ sending, setSending ] = useState(false)

  const send = () => {
    if(!value || sending) return
    setSending(true)
    confStore.send(value).then(err => {
      setSending(false)
      if(err) return console.log(err)
      setValue("")
    })
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Ваше сообщение" 
        multiline={true} 
        value={value} 
        onChangeText={setValue}
        placeholderTextColor={colors.placeholder}
      />
      <Pressable style={styles.button} android_ripple={{color: colors.rippleEffect, borderless: true}}>
        <Ionicons name="md-send" size={26} style={styles.buttonIcon} onPress={send}/>
      </Pressable>
    </View>
  )
}

export default ChatInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: "#1B1B1B",
    borderColor: colors.rippleEffect,
    borderTopWidth: 1
  },
  input: {
    color: "white",
    fontFamily: fonts.regular,
    flex: 1,
    paddingLeft: 16,
    fontSize: 16,
    maxHeight: 160,
    lineHeight: 22
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 25,
    alignSelf: "flex-end"
  },
  buttonIcon: {
    color: "white"
  }
})