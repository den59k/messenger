import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/core'
import { observer } from 'mobx-react'
import ConfStore from './store'
import { Layout } from 'src/components/layout'
import ConfHeader from './header'
import Messages from './messages'
import ChatInput from './input'
import { useMessageStore } from 'src/providers/messages'
import ConfButton from './button'
import { useWS } from 'src/providers/ws'

function ConfScreen (){

  const route = useRoute()
  const ws = useWS()
  const [ confStore ] = useState(() => new ConfStore())
  useEffect(() => {
    confStore.init(route.params)
    const messageCallback = ws.on("message", confStore.receiveMessage.bind(confStore))
    return () => {
      ws.off("message", messageCallback)
    }
  }, [])

  return (
    <Layout style={{paddingHorizontal: 0}}>
      <ConfHeader confStore={confStore}/>
      <Messages confStore={confStore}/>
      {confStore.status === "loaded" && (( confStore.type === "group" && !confStore.info.consists )?(
        <ConfButton confStore={confStore}/>
      ):(
        <ChatInput confStore={confStore}/>
      ))}
    </Layout>
  )

}

export default observer(ConfScreen)