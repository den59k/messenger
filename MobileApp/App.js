import React from 'react'
import AuthLayout from 'src/providers/auth/layout'
import AppContainer from 'src/screens/layout'

import { AuthProvider } from 'src/providers/auth'
import { WsProvider } from 'src/providers/ws'
import { ModalWindowProvider } from 'src/providers/modal'
import { MessageProvider } from 'src/providers/messages'
import { CallProvider } from 'src/providers/call'

export default function App (){

  return (
    <AuthProvider>
      <WsProvider>
        <ModalWindowProvider>
          <MessageProvider>
            <CallProvider>
              <AuthLayout>
                <AppContainer/>
              </AuthLayout>
            </CallProvider>
          </MessageProvider>
        </ModalWindowProvider>
      </WsProvider>
    </AuthProvider>
  )
  
}

