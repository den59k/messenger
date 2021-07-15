import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Layout } from 'src/components/layout'
import { fonts } from 'src/styles'

function CallsScreen () {

  return (
    <Layout title="Звонки">
      
    </Layout>
  )
}

export default CallsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: "white",
    fontFamily: fonts.regular,
    fontSize: 20
  }
})

