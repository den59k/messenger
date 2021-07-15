import { makeAutoObservable } from "mobx"

class RoomStore {

  constructor(){
    makeAutoObservable(this)
  }

}

export default RoomStore