import React, { useState } from 'react'
import Loader from 'src/components/loader'
import { Button, getProps, Input, useForm } from 'src/components/controls'
import { useModal } from 'src/providers/modal'
import { REST } from 'src/services'
import { colors } from 'src/styles'
import { mutate } from 'swr'
import ModalWindow from '..'

export default function UserInfoModal ({ userData }){

  const [ loader, setLoader ] = useState(false)
  const form = useForm(userData)
  const modal = useModal()

  const onSubmit = () => {
    setLoader(true)
    REST("/profile", form.formData, "PUT").then(({ error }) => {
      if(error) {
        setLoader(false)
        form.setErrors(error)
        return 
      }
      mutate("/profile")
      modal.close()
    })
  }

  return (
    <ModalWindow title="Данные пользователя">
      <Input {...getProps("name", form, "status")} style={{marginBottom: 18}} label="Имя"/>
      <Input {...getProps("status", form, onSubmit)} style={{marginBottom: 18}} label="Ваш статус"/>
      <Button title="Сохранить" onPress={onSubmit} style={{backgroundColor: colors.secondary, shadowColor: colors.secondary}}/>
      { loader && <Loader /> }
    </ModalWindow>
  )
}