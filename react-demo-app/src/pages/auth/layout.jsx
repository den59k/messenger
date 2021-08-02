import { observer } from "mobx-react-lite";
import { useAuth } from "providers/auth";
import { useEffect } from "react";
import AuthPage from '.'

function AuthLayout ({ children }){
  
  const authStore = useAuth()

  useEffect(() => {
    authStore.init()
  }, [ authStore ])

  if(authStore.status === 'authorized') return children

  if(authStore.status === 'not-authorized') return <AuthPage/>

  return <div></div>
}

export default observer(AuthLayout)