import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { colors } from 'src/styles'

export default function Loader (){

  return (
    <View style={styles.loadContainer}>
      <ActivityIndicator size="large" color={colors.primary}  />
    </View>
  )
}

const styles = StyleSheet.create({
  loadContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background
  }
})