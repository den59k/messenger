import React from 'react'
import { Text, View } from 'react-native'
import { Layout } from 'src/components/layout'
import UserIcon from 'src/components/user-icon'
import { useCallStore } from 'src/providers/call'
import { colors } from 'src/styles'
import CallButton from './call-button'
import styles from './styles'

function IncomingCallScreen ({}){

  const callStore = useCallStore()
  const callee = callStore.callee

  return (
    <Layout title="Входящий звонок">
      <View style={styles.container}>
        <View style={styles.calleeInfo}>
          <UserIcon src={callee.avatar} size={90}/>
          <Text style={styles.name}>{callee.name}</Text>
          <Text style={styles.sub}>@{callee.login}</Text>
        </View>
        <View style={styles.buttons}>
          <CallButton onClick={() => callStore.decline()} title="отклонить" style={{backgroundColor: colors.red}} rotate="135deg" size={65}/>
          <CallButton onClick={() => callStore.answer()} title="принять" size={65}/>
        </View>
      </View>
    </Layout>
  )
}

export default IncomingCallScreen