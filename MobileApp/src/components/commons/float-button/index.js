import React from 'react'
import { TouchableHighlight, View, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from 'src/styles';

function FloatButton ({ style, onPress, iconName, size }){

  return (
    <TouchableHighlight style={ [styles.button, styles.buttonView, styles.buttonShadow, style ] } underlayColor={"#8BEDFF"} onPress={onPress}>
      <View >
        <Ionicons name={iconName} size={size || 28} color={colors.background}/>
      </View>
    </TouchableHighlight>
  )
}

export default FloatButton

const size = 60

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 25,
  },
  buttonView: {
    width: size,
    height: size,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: size/2,
  },
  buttonShadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  }
})