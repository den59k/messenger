import { makeAutoObservable, observable, runInAction } from "mobx"
import { REST } from "src/services"

class CallStore {
  
  callStatus = "none"
  callee = {
    name: "Лисица",
    login: "fox",
    avatar: "/avatars/H6AMOnM2lW6_fyGtPbdSM2KjVdrkUX.jpg"
  }
  calls = new observable.array([])
  call_id = null
  room_id = null

  info = null
  roomInfo = null
  
  _ws = null
  
  constructor(){
    makeAutoObservable(this)
  }

  init(ws){
    this._ws = ws
  }

  call(user_id){
    console.log("call to " + user_id)
  }

  async callGroup(group_id){
    const resp = await REST("/calls/groups/"+group_id, { wsId: this._ws.id })
    console.log(resp)
    runInAction(() => {
      this.roomInfo = {
        id: resp.room_id,
        users: resp.users
      }
      this.info = resp.groupInfo
      this.userInfo = resp.callerInfo
      this.info.type = "group"
      this.callStatus = "active"
    })
  }

  onInvite({ caller, callInfo }){
    this.callee = caller
    this.callStatus = "incoming"
    this.call_id = callInfo.id
  }

  onOk({ room_id }){
    this.callStatus = "active"
    this.room_id = room_id
  }
  
  onDecline(){
    this.callStatus = "none"
  }

  onCancel(){
    this.callStatus = "none"
  }

  bye(){
    this.callStatus = "none"
    this._ws.send("call-bye", { room_id: this.roomInfo.id })
  }

  answer(){
    this._ws.send("call-ok", { call_id: this.call_id })
  }

  decline(){
    this.callStatus = "none"
    this._ws.send("call-decline", { call_id: this.call_id })
  }

}

export default CallStore