import { observer } from "mobx-react-lite";
import CallRoomPage from "pages/call-room";
import CallWaitingPage from "pages/call-waiting";
import UserGroupsPage from "pages/groups";
import UserListPage from "pages/users";
import { useWS } from "providers/ws";
import { useEffect, useState } from "react";
import MainStore from "./store";

const _callbacks = [
  "handshake",
  "call-decline",
  "call-ok"
]

function MainPage (){

  const ws = useWS()
  const [ mainStore ] = useState(() => new MainStore(ws))

  useEffect(() => {
    ws.init()
    const cb = {}
    for(let type of _callbacks)
      cb[type] = ws.on(type, mainStore[type].bind(mainStore))

    return () => {
      for(let type in cb)
        ws.off(type, cb[type])
    }
  }, [ ws, mainStore ])

  if(mainStore.status === "")
    return <UserGroupsPage store={mainStore}/>
  
  if(mainStore.status === "incoming" || mainStore.status === "outcoming")
    return <CallWaitingPage 
      onCancel={() => mainStore.cancel()} 
      callee={mainStore.callee} 
      status={mainStore.status}
    />

  if(mainStore.status === "active")
    return <CallRoomPage store={mainStore} room_id={mainStore.room_id}/>

  return (
    <h1>App</h1>
  );

}

export default observer(MainPage)