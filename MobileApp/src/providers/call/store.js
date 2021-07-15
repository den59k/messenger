import { makeAutoObservable, observable } from "mobx"

class CallStore {
  
  call = { 
    type: "incoming"
  }
  callee = {
    name: "Лисица",
    login: "fox",
    avatar: "/avatars/H6AMOnM2lW6_fyGtPbdSM2KjVdrkUX.jpg"
  }
  calls = new observable.array([])
  
  constructor(){
    makeAutoObservable(this)
  }

  init(){
   
  }

  receiveCall(){
    
  }

}

export default CallStore