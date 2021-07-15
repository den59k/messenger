import { useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import UserIcon from 'src/components/user-icon'
import { num } from 'src/libs/rus'
import { colors, fonts, paddings } from 'src/styles'

function CallHeader ({ callee }){

  
  return (
    <View style={styles.header}>
      <UserIcon src={callee.avatar} size={44} type={callee.type} style={{marginLeft: 2}}/>
      <View style={{marginLeft: 20}}>
        <Text style={styles.elementTitle}>{callee.name}</Text>
        <Text style={styles.elementSub}>0:00</Text>
      </View>
    </View>
  )

}

export default observer(CallHeader)

const styles = StyleSheet.create({
  header: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.rippleEffect,
    borderBottomWidth: 1,
    paddingHorizontal: paddings.layout
  },
  elementTitle: {
    fontFamily: fonts.bold,
    color: "white",
    marginBottom: 3,
    fontSize: 16
  },
  elementSub: {
    fontFamily: fonts.regular,
    color: colors.subText,
    fontSize: 13
  }
})