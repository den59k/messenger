import { useState, useEffect, useRef } from 'react'
import { useWS } from 'providers/ws'
import RoomStore from './store'
import styles from './style.module.sass'
import { observer } from 'mobx-react-lite'
import { autorun, toJS } from 'mobx'

function CallRoomPage ({ store, room_id }){

  const ws = useWS()
  const [ roomStore ] = useState(() => new RoomStore(room_id, ws))
  const videoRefs = useRef(() => new Map())

  useEffect(() => {
    roomStore.init(store.users)
    const callbacks = {
      "call-consume": roomStore.onConsume.bind(roomStore),
      "call-deleteUser": roomStore.deleteUser.bind(roomStore),
      "call-newUser": roomStore.addUser.bind(roomStore)
    }

    for(let key in callbacks)
      ws.on(key, callbacks[key])

    return () => {
      for(let key in callbacks)
        ws.off(key, callbacks[key])
    }
  }, [ roomStore, store, ws ])

  const streams = toJS(roomStore.streams)
  useEffect(() => {
    console.log(streams)
    for(let [ key, stream ] of streams)
      if(stream)
        videoRefs.current.get(key).srcObject = stream.stream

  }, [ streams ])

  videoRefs.current = new Map()

  return (
    <div className={styles.container}>
      {Array.from(roomStore.streams).map(([key, stream]) => (
        <div className={styles.userBox} key={key}>
          <h3>{roomStore.users.get(key).name}</h3>
          <img src={roomStore.users.get(key).avatar} alt="Img" className={styles.userAvatar}/>
          <video 
            className={styles.userVideo} 
            ref={el => videoRefs.current.set(key, el)} 
            autoPlay={true} 
            muted={false} 
            controls={true}
          ></video>
        </div>
      ))}
      <button className={styles.button} onClick={() => roomStore.initBroadcast({ audio: true, video: true })}>
        Запустить свой поток
      </button>
    </div>
  )
}

export default observer(CallRoomPage)