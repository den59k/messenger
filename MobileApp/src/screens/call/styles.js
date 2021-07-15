import { StyleSheet } from 'react-native'
import { colors, fonts } from 'src/styles'

export default StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
    flex: 1
  },
  calleeInfo: {
    alignItems: "center"
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: "white",
    marginTop: 18
  },
  sub: {
    fontSize: 16,
    fontFamily: fonts.demi,
    color: colors.subText,
    marginTop: 4
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
})