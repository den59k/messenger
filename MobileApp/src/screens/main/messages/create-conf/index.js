import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import useSWR from 'swr'
import { GET } from 'src/services'
import { getProps, Input, useForm } from 'src/components/controls'
import { Layout } from 'src/components/layout'
import Loader from 'src/components/loader'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import UserIcon from 'src/components/user-icon'
import { colors, fonts, paddings } from 'src/styles'

function CreateConfScreen(){

  const navigation = useNavigation()
  const form = useForm()
  
  const { data } = useSWR("/users", GET)
  const usersData = useMemo(() => data, [ data ])


  if(!data || data.error) return <Loader/>

  return (
    <Layout>
      <Input {...getProps("search", form)} returnKeyType="search" label="Поиск людей" />
      <FlatList
        style={{marginHorizontal: -paddings.layout, marginTop: 10}}
        data={usersData}
        renderItem={({ item }) => <UserItem data={item} onPress={() => navigation.navigate("Conf", { user_id: item.id })}/>}
        keyExtractor={item => item.id}
      />
    </Layout>
  )

}

export default CreateConfScreen

function UserItem ({data, onPress}){
  return (
    <Pressable style={styles.element} onPress={onPress} android_ripple={{color: colors.rippleEffect}}>
      <UserIcon size={50} src={data.avatar}/>
      <View style={{marginLeft: 15 }}>
        <Text style={styles.elementTitle}>{data.name}</Text>
        <Text style={styles.elementSub}>{data.status || ("@"+data.login)}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  element: {
    height: 75,
    flexDirection: 'row',
    alignItems: "center",
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