import React, { useEffect } from 'react'
import { useAuthStore } from '.'
import { observer } from 'mobx-react'

import AuthScreen from 'src/screens/auth'
import Loader from 'src/components/loader'

function AuthLayout ({ children }) {

  const auth = useAuthStore()
  useEffect(() => {
    auth.init()
  }, [])

  if(auth.status === "authorized") return children
  if(auth.status === "not-authorized") return <AuthScreen/>

  return <Loader/>
}

export default observer(AuthLayout)

