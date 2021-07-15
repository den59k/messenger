import { DefaultTheme } from '@react-navigation/native'

export const fonts = {
  regular: "avenirnextcyr-regular",
  medium: "avenirnextcyr-medium",
  demi: "avenirnextcyr-demi",
  bold: "avenirnextcyr-bold"
}

export const colors = {
  primary: "#00BBDE",
  primaryBkg: "#0086D1",
  secondary: "#E2E2E2",
  subText: "#8C8C8C",
  background: "#171717",
  border: "#363636",
  placeholder: "#787878",
  red: "#DA2630",
  statusBar: "#262626",
  rippleEffect: "#333333",
  backgroundLight: "#2F2F2F"
}

export const paddings = {
  auth: 25,
  layout: 18
}

export const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    border: colors.background,
    primary: 'white',
    text: 'white'
  },
};