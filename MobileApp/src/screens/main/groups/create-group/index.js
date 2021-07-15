import React from 'react'
import { REST } from 'src/services'
import { Input, Button, useForm, getProps, SegmentButton } from 'src/components/controls' 
import { Layout } from 'src/components/layout'
import { colors } from 'src/styles'
import { mutate } from 'swr'
import { useNavigation } from '@react-navigation/core'

const options = {
  "public": "Открытая",
  "private": "Закрытая"
}

function CreateGroupScreen (){

  const navigation = useNavigation()

  const form = useForm({ access: "public" })
  const creteGroup = () => {
    const { name, access } = form.formData
    REST("/groups", { name, access }).then(err => {
      if(err.error) return form.setErrors(err.error)
      mutate("/groups")
      navigation.goBack()
    })
  }

  return (
    <Layout>
      <Input {...getProps("name", form)} label="Название группы"/>
      <SegmentButton {...getProps("access", form)} options={options} style={{marginTop: 25}}/>
      <Button title="Создать группу" style={{ shadowColor: colors.primary, marginTop: 25 }} onPress={creteGroup}/>
    </Layout>
  )
}

export default CreateGroupScreen
