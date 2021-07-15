import React from 'react'
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import Button from 'src/components/controls/button';
import { colors, fonts, paddings } from 'src/styles'

export default function HelloScreen ({ navigation }){

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.title}>Мессенджер</Text>
        <Text style={styles.subTitle}>Просто мессенджер</Text>
      </View>
      <View style={{marginBottom: 30 }}>
        <Text style={[styles.text, { color: colors.subText }]}>Добро пожаловать!</Text>
        <Text style={styles.text}>В наших кругах уже 3 пользователя</Text>
      </View>
      <Button 
        onPress={() => navigation.navigate('RegisterHello')} 
        title="Зарегистрироваться" 
        style={{marginBottom: 20, backgroundColor: colors.secondary, shadowColor: 'white'}} 
      />
      <Button 
        onPress={() => navigation.navigate('Login')} 
        title="Вход"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: paddings.auth
  },
  logo: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontFamily: fonts.bold,
    color: 'white',
    fontSize: 40,
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: fonts.regular,
    color: colors.primary,
    textAlign: 'center'
  },
  text: {
    fontFamily: fonts.regular,
    textAlign: 'center',
    color: colors.secondary,
    marginBottom: 13,
    fontSize: 14
  }
})