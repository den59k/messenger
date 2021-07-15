import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useForm, Input, Button, getProps } from 'src/components/controls'
import { useAuthStore } from 'src/providers/auth'
import { REST } from 'src/services'
import { colors, fonts, paddings } from 'src/styles'

export default function RegisterScreen ({ navigation, route }){

  const { name } = route.params

  const form = useForm()
  const auth = useAuthStore()

  const onSubmit = () => {
    const { login, password, confirmPassword } = form.formData

    if(!login) return form.setErrors({ login: "Введите свой логин"})
    if(!password) return form.setErrors({ password: "Введите пароль от аккаунта"})
    if(password !== confirmPassword) return form.setErrors({ confirmPassword: "Пароли не совпадают!" })

    auth.register({ name, login, password}).then(err => {
      if(err) return form.setErrors(err)
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Добро пожаловать, { name }!</Text>
      <Text style={styles.subText}>Придумайте себе логин и пароль</Text>
      <Input {...getProps("login", form, "password")} label="Логин" autoCapitalize="none" style={styles.input}/>
      <Input {...getProps("password", form, "confirmPassword")} label="Пароль" secureTextEntry={true} style={styles.input}/>
      <Input {...getProps("confirmPassword", form, onSubmit)} label="Повторите пароль" secureTextEntry={true} style={styles.input}/>
      <Button style={styles.button} title="Зарегистрироваться" onPress={onSubmit}/>
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
    fontSize: 19,
    textAlign: 'center'
  },
  subText: {
    fontFamily: fonts.regular,
    color: colors.subText,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 5,
    fontSize: 14
  },
  button: {
    shadowColor: colors.secondary,
    backgroundColor: colors.secondary,
    marginTop: 20
  },
  input: {
    marginTop: 20
  }
})