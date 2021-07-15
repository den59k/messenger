import React, { useState, useMemo } from 'react'
import { Input } from 'src/components/controls'
import { View, Text, StyleSheet, SectionList, Pressable, TouchableHighlight } from 'react-native'
import { Layout } from 'src/components/layout'
import { colors, fonts, paddings } from 'src/styles'
import UserIcon from 'src/components/user-icon'
import FloatButton from 'src/components/commons/float-button'
import { useNavigation } from '@react-navigation/native'
import useSWR from 'swr'
import { GET } from 'src/services'
import Loader from 'src/components/loader'
import { num } from 'src/libs/rus'
import { useAuthStore } from 'src/providers/auth'


function GroupsScreen () {
  
  const navigation = useNavigation()
  const authStore = useAuthStore()
  const [ search, setSearch ] = useState("")
    
  const groupMap = (item) => ({
    title: item.name,
    description: num(item.users_count, "участник", "участника", "участников"),
    onPress: () => navigation.navigate("Conf", { group_id: item.id })
  })

  const { data } = useSWR("/groups", GET)

  const groupsData = useMemo(() => data && !data.error && [
    { title: "Ваши группы", data: data.own.map(groupMap) },
    { title: "Остальные группы", data: data.other.map(groupMap) }
  ], [ data ])
  
  if(!data) return <Loader/>

  return (
    <Layout title="Группы">
      <Input value={search} onChange={setSearch} returnKeyType="search" label="Поиск групп"/>
      <SectionList
        style={{marginHorizontal: -paddings.layout}}
        sections={groupsData}
        keyExtractor={ (item, index) => item.title + index }
        renderItem={( {item} ) => <Item item={item} onPress={item.onPress}/>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text> }
      />
      <FloatButton iconName="md-add" onPress={() => navigation.navigate("CreateGroup")}/>
    </Layout>
  )
}

export default GroupsScreen


function Item ({ item, onPress }){

  return (
    <Pressable style={styles.element} android_ripple={{color: colors.rippleEffect}} onPress={onPress}>
      <UserIcon type="group" size={50}/>
      <View style={{marginLeft: 15 }}>
        <Text style={styles.elementTitle}>{item.title}</Text>
        <Text style={styles.elementSub}>{item.description}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: "white",
    fontFamily: fonts.regular,
    fontSize: 20
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    color: colors.subText,
    fontSize: 12,
    marginTop: 15,
    marginBottom: 2,
    paddingHorizontal: paddings.layout
  },
  element: {
    height: 77,
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

