import React from 'react'
import { useMessageStore } from 'src/providers/messages'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native'
import { Layout } from 'src/components/layout'
import { colors, fonts, paddings } from 'src/styles'
import FloatButton from 'src/components/commons/float-button'
import { observer } from 'mobx-react'
import Loader from 'src/components/loader'
import UserIcon from 'src/components/user-icon'
import { useAuthStore } from 'src/providers/auth'
import { getTime } from 'src/libs/rus'

function MessagesScreen () {

  const navigation = useNavigation()
  const authStore = useAuthStore()
  const messageStore = useMessageStore()

  if(messageStore.status !== "loaded" && messageStore.status !== "refresh") return <Loader/>

  const onRefresh = () => {
    messageStore.refresh()
  }

  const refresh = messageStore.status === "refresh"

  return (
    <Layout title="Сообщения">
      <FlatList
        style={{marginHorizontal: -paddings.layout}}
        renderItem={({ item }) => <Item data={item} isMine={item.message_sender_id === authStore.userData.id} />}
        data={messageStore.messages.slice()}
        keyExtractor={item => item.conf_id}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}
      />
      <FloatButton iconName="md-person-add" size={25} onPress={() => navigation.navigate("CreateConf")} />
    </Layout>
  )
}

export default observer(MessagesScreen)

function Item ({ data, isMine }) {

  const type = data.group_id?"group":"user"
  const navigation = useNavigation()
  const onPress = () => {
    if(data.user_id)
      navigation.navigate("Conf", { user_id: data.user_id })
    else
      navigation.navigate("Conf", { group_id: data.group_id })
  }

  return (
    <Pressable style={styles.element} android_ripple={{color: colors.rippleEffect}} onPress={onPress}>
      <UserIcon src={data.user_avatar || data.group_avatar}  type={type} size={52}/>
      <View style={{marginLeft: 12, flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.elementTitle}>{data.user_name || data.group_name}</Text>
          <Text style={styles.time}>{getTime(data.message_time, false)}</Text>
        </View>
        <View>
          <Text style={styles.elementSub} numberOfLines={1}>
            {(isMine || data.group_id) && <Text style={styles.elementName}>{isMine? "Вы": data.message_sender_name}: </Text>}
            {data.message_text}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  element: {
    height: 80,
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: paddings.layout
  },
  time: {
    color: colors.subText,
    fontSize: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
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
    fontSize: 14,
    paddingTop: 1
  },
  elementName: {
    fontFamily: fonts.demi,
    color: colors.primary
  }
})