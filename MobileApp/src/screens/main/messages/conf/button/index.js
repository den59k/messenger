import React from 'react'
import { Button } from 'src/components/controls'
import { StyleSheet, View } from 'react-native'
import { colors } from 'src/styles'

function ConfButton ({ confStore }){
  
  const onButtonPress = () => confStore.subscribe()

  return (
    <View style={styles.container}>
      <Button style={styles.button} title="Подписаться на группу" color="white" onPress={onButtonPress}/>
    </View>
  )
}

export default ConfButton

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18, 
    paddingVertical: 15,
    borderColor: colors.border,
    borderTopWidth: 1
  },
  button: {
    backgroundColor: colors.primaryBkg
  }
})