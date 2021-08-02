import { useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import UserIcon from 'src/components/user-icon'
import { num } from 'src/libs/rus'
import { colors, fonts } from 'src/styles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCallStore } from 'src/providers/call'

function ConfHeader ({ confStore }){

  const navigation = useNavigation()
  const callStore = useCallStore()

  if(!confStore.info) return (
    <View style={styles.header}>
      <HeaderBackButton onPress={() => navigation.goBack()}/>
      <Text style={[styles.elementTitle, { marginLeft: 4 }]}>Загрузка...</Text>
    </View>
  )

  let sub = ""
  if(confStore.type === "user")
    sub = "В сети: сегодя в 19:00"
  if(confStore.type === "group")
    sub = num(confStore.info.users_count, "участник", "участника", "участников")

  return (
    <View style={styles.header}>
      <HeaderBackButton onPress={() => navigation.goBack()}/>
      <UserIcon src={confStore.info.avatar} size={44} type={confStore.type} style={{marginLeft: 2}}/>
      <View style={{marginLeft: 12}}>
        <Text style={styles.elementTitle}>{confStore.info.name}</Text>
        <Text style={styles.elementSub}>{sub}</Text>
      </View>
      {confStore.type === "group" && (
        <TouchableOpacity 
          style={{ marginLeft: "auto", width: 50 }} 
          onPress={() => callStore.callGroup(confStore.info.id)}
        >
          <Ionicons size={23} name={"ios-call"} color={confStore.activeCall? colors.primary: colors.secondary}/>
        </TouchableOpacity>
      )}
    </View>
  )

}

export default observer(ConfHeader)

const styles = StyleSheet.create({
  header: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.rippleEffect,
    borderBottomWidth: 1
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