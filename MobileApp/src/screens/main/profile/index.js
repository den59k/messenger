import React, { useEffect, useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import { Alert, Modal, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { Button } from 'src/components/controls'
import { Layout } from 'src/components/layout'
import Loader from 'src/components/loader'
import ImagePreviewModal from 'src/components/modal-windows/image-preview'
import UserInfoModal from 'src/components/modal-windows/user-info'
import UserIcon from 'src/components/user-icon'
import { useAuthStore } from 'src/providers/auth'
import { useModal } from 'src/providers/modal'
import { GET } from 'src/services'
import { colors, fonts } from 'src/styles'
import useSWR from 'swr'

function ProfileScreen () {

  const modal = useModal()
  const auth = useAuthStore()
  const { data: userData } = useSWR("/profile", GET)

  const openModal = () => {
    modal.open(<UserInfoModal userData={userData}/>)
  }
  
  const uploadPhoto = () => {
    launchImageLibrary({
      mediaType: "photo",
    }, ({ assets }) => {
      if(assets)
        modal.open(<ImagePreviewModal photo={assets[0]} uploadUrl={"/profile/avatar"}/>)
    })
  }

  if(!userData) return <Loader/>

  return (
    <Layout title="Ваш профиль">
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={uploadPhoto}>
          <UserIcon size={70} src={userData.avatar}/>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={openModal}>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.status}>{userData.status || "Нет статуса"}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={{flex: 1}}></View>
      <Button title="Выйти из аккаунта" color="#CBCBCB" style={styles.logoutButton} onPress={() => auth.logout()}/>
    </Layout>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row'
  },
  profileInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,
    flex: 1
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.secondary,
    paddingBottom: 4
  },
  status: {
    color: colors.subText
  },
  logoutButton: {
    backgroundColor: "#2B2B2B",
    marginBottom: 20
  }
})
