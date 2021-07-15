import React, { useMemo } from 'react'
import { observer } from "mobx-react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from 'src/providers/auth';
import UserIcon from 'src/components/user-icon';
import { time } from 'src/libs/rus';
import { colors, fonts } from 'src/styles';

function Messages ({confStore}){
  
  const authStore = useAuthStore()

  const data = confStore.messages

  return (
    <FlatList
      inverted={true}
      data={data.slice()}
      renderItem={({ item, index }) => <_Message 
        data={item} 
        isMine={item.sender_id === authStore.userData.id} 
        nextElement={index < data.length-1 && data[index+1]}
        lastElement={index > 0 && data[index-1]}
        showAvatars={confStore.type === "group"}
      />}
      keyExtractor={item => item.id}
    />
  )
}

export default observer(Messages)

const _Message = observer(Message)

function Message ({ data, isMine, nextElement, lastElement, showAvatars, sended }){

  const isFirst = !nextElement || nextElement.sender_id !== data.sender_id || (data.time-nextElement.time > 60*1000*5)
  const isLast = !lastElement || lastElement.sender_id !== data.sender_id || (lastElement.time-data.time > 60*1000*5)
  
  if(isMine)
    return (
      <View style={[styles.messageWrapper, {justifyContent: "flex-end"}, !lastElement && {marginBottom: 10} ]}>
        <View style={styles.messageInner}>
          {isFirst && <Text style={[styles.time, { alignSelf: "flex-end" }]}>{time(data.time)}</Text>}
          <Text style={[styles.message, styles.mine, data.sending && styles.notSended]}>{data.text}</Text>
        </View>
      </View>
    )
  return (
    <View style={[styles.messageWrapper, {justifyContent: "flex-start"}, !lastElement && {marginBottom: 10} ]}>

      {showAvatars && (
        <View style={{width: 45, justifyContent: "flex-end"}}>
          {isLast && <UserIcon src={data.sender_avatar} size={36}/>}
        </View>
      )}
      
      <View style={styles.messageInner}>
        {isFirst && (
          <View style={styles.messageHeader}>
            {showAvatars && <Text style={[styles.time, { paddingRight: 0 }]}>{data.sender_name}</Text>}
            <Text style={[styles.time]}>{time(data.time)}</Text>
          </View>
        )}
        <Text style={[styles.message]}>{data.text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  mine: {
    backgroundColor: colors.primaryBkg
  },
  notSended: {
    opacity: 0.5
  },
  messageInner: {
    maxWidth: "88%"
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  time: {
    fontFamily: fonts.bold,
    color: colors.placeholder,
    fontSize: 11,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2
  },
  message: {
    backgroundColor: colors.backgroundLight,
    color: "white",
    fontFamily: fonts.demi,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 9,
    minWidth: 70,
    lineHeight: 19,
    fontSize: 14
  }
})