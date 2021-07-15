import React, { createContext, useContext } from 'react'
import MessageStore from './store'

const Context = createContext()

export function MessageProvider ({children}){
	
	return (
		<Context.Provider value={new MessageStore()}>
			{children}
		</Context.Provider>
	)
}

export function useMessageStore (){
	return useContext(Context)
}