import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useForm, getProps, Button, Input } from 'src/components/controls'
import { useAuthStore } from 'src/providers/auth'
import { GET } from 'src/services'
import { colors, fonts, paddings } from 'src/styles'

export default function LoginScreen (){

  const form = useForm()
  const auth = useAuthStore()

  const onSubmit= () => {
    const { login, password } = form.formData
    if(!login) return form.setErrors({ login: "Введите логин" })
    if(!password) return form.setErrors({ password: "Введите пароль" })

    auth.login({ login, password }).then(err => {
      if(err) return form.setErrors(err)
    })
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Text style={styles.text}>С возвращением!</Text>
      <Input 
        {...getProps("login", form, "password")} 
        label="Логин" 
        style={styles.control}
        autoCapitalize="none"
      />
      <Input 
        {...getProps("password", form, onSubmit)} 
        label="Пароль"
        style={styles.control} 
        secureTextEntry={true}
      />
      <Button style={styles.button} title="Войти" onPress={onSubmit}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: paddings.auth,
    paddingTop: 5
  },
  text: {
    fontFamily: fonts.regular,
    color: colors.secondary,
    fontSize: 21,
    textAlign: 'center'
  },
  button: {
    shadowColor: colors.primary,
    marginTop: 24
  },
  control: {
    marginTop: 24
  }
})