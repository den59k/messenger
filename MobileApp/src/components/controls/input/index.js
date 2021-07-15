import React, { useRef } from 'react'
import { Animated, View, StyleSheet, Text, TextInput } from "react-native";
import { colors, fonts } from "src/styles";

const il = (start, end) => ({ inputRange: [ 0, 1 ], outputRange: [ start, end ] })

export default function Input ({ label, name, onChange, value, style, formRef, error, ...otherProps  }){

  const animValue = useRef(new Animated.Value(value? 1: 0)).current;

  const onFocus = () => {
    Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true }).start()
  }

  const onBlur = () => {
    if(!value)
      Animated.timing(animValue, { toValue: 0, duration: 100, useNativeDriver: true }).start()
  }

  const _onChange = (e) => {
    onChange(e, name)
  }

  return (
    <View style={[styles.container, style]}>
      { label && (
        <Animated.Text style={[ styles.label, { 
          transform: [
            { translateY: animValue.interpolate( il(0, -30) ) },
            { translateX: animValue.interpolate( il(0, -label.length*0.6) ) },
            { scale: animValue.interpolate( il(1, 0.85 ) ) },
          ],
        }]} pointerEvents="none">{label}</Animated.Text>
      ) }
      <TextInput onFocus={onFocus} onBlur={onBlur} style={styles.text} value={value} ref={formRef} onChangeText={_onChange} {...otherProps}/>
      { error && <Text style={styles.error}>{ error }</Text> }
    </View>
  )
}

const height = 54
const paddingLeft = 18

const styles = StyleSheet.create({
  container: {
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 8,
    height
  },
  text: {
    color: 'white',
    fontFamily: fonts.regular,
    height,
    paddingLeft
  },
  label: {
    position: 'absolute',
    color: colors.placeholder,
    lineHeight: height-36,
    top: 18,
    backgroundColor: colors.background,
    left: paddingLeft+1-6,
    paddingHorizontal: 6,
  },
  error: {
    color: colors.red,
    fontSize: 10,
    position: 'absolute',
    bottom: -7,
    left: paddingLeft+1-6,
    paddingHorizontal: 6,
    backgroundColor: colors.background
  }
})