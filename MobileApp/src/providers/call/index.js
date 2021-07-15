import React, { createContext, useContext } from 'react'
import CallStore from './store'

const Context = createContext()

export function CallProvider ({children}){
	
	return (
		<Context.Provider value={new CallStore()}>
			{children}
		</Context.Provider>
	)
}

export function useCallStore (){
	return useContext(Context)
}