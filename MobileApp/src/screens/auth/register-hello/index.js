import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useForm, Input, Button, getProps } from 'src/components/controls'
import { colors, fonts, paddings } from 'src/styles'

export default function RegisterHelloScreen ({ navigation }){

  const form = useForm()
  const onSubmit = () => {
    if(!form.formData.name) return form.setErrors({ name: "Введите имя, чтобы продолжить"})
    
    navigation.navigate('Register', { name: form.formData.name })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Представьтесь, пожалуйста</Text>
      <Input {...getProps("name", form, onSubmit)} label="Ваше имя" style={{ marginVertical: 30 }} />
      <Button style={styles.button} title="Далее" onPress={onSubmit}/>
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
  button: {
    shadowColor: colors.secondary,
    backgroundColor: colors.secondary
  }
})