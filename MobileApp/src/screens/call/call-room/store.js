import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';
import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx"
import { REST } from 'src/services';

class RoomStore {

  users = observable.map([], { deep: false })
  streams = observable.map([], { deep: false })
  type = 'ls'

  //Так, это понятно - это наши потоки, и наши же constraints
  produceVideoUrl = null
  stream = null
  constraints = { audio: false, video: false }

  room_id = null
  _ws = null

  constructor(room_id, ws){
    makeObservable(this, {
      users: observable,
      streams: observable,
      stream: observable,
      type: observable,
      produceVideoUrl: observable,
      constraints: observable,

      init: action,
      addUser: action,
      deleteUser: action,
      setStream: action,
      onaddstream: action
    })
    this.room_id = room_id
    this._ws = ws
  }

  pc = null

  init(users = []){

    for(let user of users){
      this.users.set(user.userId, user)
      if(user.offer)
        this.onConsume(user)
    }
  }

  onaddstream(e, userId){
    console.log(e.stream)
    this.streams.set(userId, {
      ...this.streams.get(userId),
      stream: e.stream
    })
  }

  async onConsume({ offer, userId, constraints }){
    //console.log({offer, userId, constraints})
    let pc = this.streams.get(userId)?.pc
    if(!pc){
      console.log("created PC connection")
      pc = new RTCPeerConnection()
      pc.onaddstream = (e) => this.onaddstream(e, userId)

      runInAction(() => {
        this.streams.set(userId, {
          pc,
          constraints,
          stream: null
        })
      })
    }else{
      runInAction(() => {
        this.streams.set(userId, {
          ...this.streams.get(userId),
          constraints
        })
      })
    }

    if(this.streams.get(userId).stream)
      for(let track of this.streams.get(userId).stream.getTracks()){
        if(constraints[track.kind] === true)
          track.enabled = true
        else
          track.enabled = false
      }
    if(offer){
      const sdpDescription = new RTCSessionDescription(offer)
      await pc.setRemoteDescription(sdpDescription)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      await REST(`/calls/rooms/${this.room_id}/consume`, { answer, userId, ws_id: this._ws.id })
    }
  }

  addUser({userId, userInfo}){
    this.users.set(userId, userInfo)
  }

  deleteUser({ userId, userInfo }){
    this.users.delete(userId)
    const stream = this.streams.get(userId)
    if(stream){
      stream.pc.close()
      for(let track of stream.stream.getTracks())
        track.stop()
      this.streams.delete(userId)
    }
  }

  async initBroadcast(constraints){

    if(!this.pc)
      this.pc = new RTCPeerConnection({ iceServers: [] })
    
    let offer = null

    //Если у нас есть constraint, которого нет в потоке - пересоздаем stream
    const kinds = this.stream?(this.stream.getTracks().map(track => track.kind)): []
    for(let key in constraints)
      if(constraints[key] === true && !kinds.includes(key)){
        await this._updateStream(constraints)
        offer = await this.pc.createOffer()
        await this.pc.setLocalDescription(offer)
        break
      }

    runInAction(() => {
      this.constraints = constraints
    })

    for(let track of this.stream.getTracks()){
      if(constraints[track.kind] === true)
        track.enabled = true
      if(constraints[track.kind] === false)
        track.enabled = false
    }

    const { answer } = await REST("/calls/rooms/"+this.room_id+"/produce", { 
      offer, 
      userId: this._ws.id, 
      constraints
    })

    if(answer)
      await this.pc.setRemoteDescription(answer)
  }

  async _updateStream ({ audio, video }){
    //Если у нас появляется новая дорожка - обновляем stream
    const isFront = true
    let deviceId = null
    const sourceInfos = await mediaDevices.enumerateDevices()

    for(let device of sourceInfos)
      if(device.kind == "videoinput" && device.facing === (isFront ? "front" : "environment"))
        deviceId = device.deviceId

    if(!deviceId) return console.log("device is not found")

    const stream = await mediaDevices.getUserMedia({
      audio: audio,
      video: video && {
        facingMode: (isFront ? "user" : "environment"),
        deviceId
      }
    })

    for(let stream of this.pc.getLocalStreams())
      this.pc.removeStream(stream)

    this.pc.addStream(stream)
    this.setStream(stream)
  }

  setStream(stream){
    this.stream = stream
  }

  dispose(){
    if(this.stream)
      this.stream.release()
  }

}

export default RoomStore