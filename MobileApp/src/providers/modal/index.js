import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, BackHandler } from 'react-native'
import { observer } from "mobx-react-lite"
import ModalWindowStore from "./store"

const ModalWindowContext = createContext()


export const ModalWindowProvider = observer(
	function ModalWindowProvider({children}){

		const blackRef = useRef()
		const [ modal ] = useState(() => new ModalWindowStore())

		const onPress = (evt, gestureState) => {
			if(evt.target !== blackRef.current) return
			modal.close()
		}

		const opened = modal.opened
		useEffect(() => {
			if(opened){
				const backHandler = () => {
					modal.close()
					return true
				}
				BackHandler.addEventListener("hardwareBackPress", backHandler)
				return () => BackHandler.removeEventListener("hardwareBackPress", backHandler)
			}
		}, [ opened ])

		return(
			<ModalWindowContext.Provider value={modal}>
				{children}
				{modal.opened && (
					<View ref={blackRef} style={styles.black} onStartShouldSetResponder={onPress}>
						<View style={{width: '90%'}}>
							{ modal.currentWindow }
						</View>
					</View>
				)}
			</ModalWindowContext.Provider>
		)
	}
)

export function useModal(){
	const modal = useContext(ModalWindowContext)
	return modal
}

const styles = StyleSheet.create({
	black: {
		backgroundColor: '#000000BB',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
	}
})