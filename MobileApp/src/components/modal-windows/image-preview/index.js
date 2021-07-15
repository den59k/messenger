import React from 'react'
import ModalWindow from "..";
import { Image } from 'react-native'
import { Button } from 'src/components/controls';
import { sendPhoto } from 'src/services';
import { useModal } from 'src/providers/modal';
import { mutate } from 'swr';

export default function ImagePreivewModal ({ photo, uploadUrl }){

  const modal = useModal()

  const upload = () => {
    sendPhoto(uploadUrl, photo).then(({error}) => {
      if(error) return console.log(error)
      modal.close()
      mutate("/profile")
    })
  }

  return (
    <ModalWindow title="Изображение">
      <Image source={{ uri: photo.uri }} style={{ width: "100%", height: 300 }}/>
      <Button title="Загрузить" style={{marginTop: 20}} onPress={upload}/>
    </ModalWindow>
  )
}