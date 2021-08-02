import { REST } from "services";

const { makeObservable, observable, runInAction, action } = require("mobx");

class MainStore {

  users = new observable.array([], { deep: false })

  status = ""
  wsId = null
  callee = null
  _ws = null
  room_id = null

  constructor(ws){
    makeObservable(this, {
      status: observable,
      callee: observable,
      room_id: observable,
      users: observable,
      
      "call-decline": action,
      "call-ok": action,
      cancel: action
    })
    this._ws = ws
  }

  handshake({id}){
    this.wsId = id
  }

  "call-decline" () {
    this.status = ""
  }

  "call-ok" ({ room_id }){
    this.status = "active"
    this.room_id = room_id
  }

  cancel(){
    this.status = ""
    this._ws.send("call-cancel", { call_id: this.call_id })
  }

  async call(user_id){
    const { callee, callInfo } = await REST("/calls/users/"+user_id, { wsId: this.wsId })

    runInAction(() => {
      this.status = "outcoming"
      this.callee = callee
      this.call_id = callInfo.id
    })
  }

  async callGroup (group_id){
    const data = await REST("/calls/groups/"+group_id, { wsId: this.wsId })
    runInAction(() => {
      this.status = "active"
      this.room_id = data.room_id
      this.users.replace(data.users)
    })
  }

}

export default MainStore