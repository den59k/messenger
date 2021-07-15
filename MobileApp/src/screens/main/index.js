import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MessagesScreen from './messages';
import CallsScreen from './calls';
import GroupsScreen from './groups';
import ProfileScreen from './profile';
import { colors } from 'src/styles';
import UserIcon from 'src/components/user-icon';

const Tab = createBottomTabNavigator();

const icons = {
  "Messages": "md-chatbubbles",
  "Calls": "ios-call",
  "Groups": "md-people"
}

const screenOptions = ({route}) => ({
  tabBarIcon: ({ focused, color, size}) => {
    if(route.name in icons) return <Ionicons name={icons[route.name]} size={size*1.1} color={color} />
    return <UserIcon size={size*1.6} style={{ opacity: focused? 1: 0.5 }} />
  }
})

const tabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.subText,
  showLabel: false,
  style: {
    borderTopColor: "#222222",
    borderTopWidth: 2,
    height: 70
  }
}

export default function MainScreen (){
  return (
    <Tab.Navigator  screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

