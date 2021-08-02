import { action, makeObservable, observable, runInAction } from "mobx"
import { REST } from "services"

class RoomStore {
  
  users = observable.map([], { deep: false })
  streams = observable.map([], { deep: false })

  pc = null

  constructor(room_id, ws){
    makeObservable(this, {
      streams: observable,
      addUser: action,
      deleteUser: action,
      setStream: action
    })
    this.room_id = room_id
    this._ws = ws
  }

  init(users = []){
    for(let user of users){
      if(user.offer)
        this.onConsume(user)
      this.users.set(user.userId, user)
    }
  }

  ontrack(e, id) {
    console.log(e)
    for(let stream of e.streams){
      this.streams.set(id, {
        ...this.streams.get(id),
        stream
      })
    }
  }

  async onConsume({ offer, userId, constraints }){
    console.log({offer, userId, constraints})
    let pc = this.streams.get(userId)?.pc
    if(!pc){
      pc = new RTCPeerConnection()
      this.streams.set(userId, {
        pc,
        constraints,
        stream: null
      })
      pc.ontrack = (e) => this.ontrack(e, userId)
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
      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      await REST(`/calls/rooms/${this.room_id}/consume`, { answer, userId, ws_id: this._ws.id })
    }
  }

  addUser({ userId, userInfo }){
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

    console.log(answer)

    if(answer)
      await this.pc.setRemoteDescription(answer)
  }

  async _updateStream ({ audio, video }){

    const stream = await navigator.mediaDevices.getUserMedia({ audio, video })

    for(let stream of this.pc.getLocalStreams())
      this.pc.removeStream(stream)

    this.pc.addStream(stream)
    this.setStream(stream)
  }

  setStream(stream){
    this.stream = stream
  }


}

export default RoomStore