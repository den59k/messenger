import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import userIconPng from './icon.png'
import groupIconPng from './group-icon.png'
import { url } from 'src/services'

function getIcon(type){
  if(type === 'group') return groupIconPng
  return userIconPng
}

function UserIcon ({ src, style, size, type }){

  const icon = src? ({ uri: url+"/"+src }): getIcon(type)
  return <Image source={icon} style={[styles.icon, { width: size, height: size, borderRadius: size/2 }, style ]}/>

}

UserIcon.defaultProps = {
  size: 40
}

export default UserIcon

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40
  }
})