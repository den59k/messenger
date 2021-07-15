import { GET, REST } from "src/services";
import { observable, runInAction } from "mobx";

const { makeAutoObservable } = require("mobx");

class MessageStore {

  status = ""
  messages = new observable.array([])

  constructor(){
    makeAutoObservable(this)
  }

  async init(){
    const { error, messages } = await GET("/messages")
    if(error) return
    runInAction(() => {
      this.status = "loaded"
      this.messages.replace(messages)
    })
  }

  refresh(){
    this.status = "refresh"
    this.init()
  }

  addMessage(conf_id, message){
    const conf = this.messages.find(m => m.conf_id === conf_id)
    if(!conf) return
    this.messages.remove(conf)
    conf.message_id = message.id
    conf.message_sender_id = message.sender_id
    conf.message_sender_name = message.sender_name
    conf.message_text = message.text
    conf.message_time = message.time
    this.messages.unshift(conf)
  }

  receiveMessage({ info, senderInfo, message }){

    if(!this.messages.some(m => m.conf_id === message.conf_id))
      if(info)
        this.messages.push({ conf_id: message.conf_id, group_id: info.id, group_name: info.name, group_avatar: info.avatar })
      else
        this.messages.push({ conf_id: message.conf_id, user_id: senderInfo.id, user_name: senderInfo.name, user_avatar: senderInfo.avatar })

    this.addMessage(message.conf_id, { ...message, sender_name: senderInfo.name })
  }
}

export default MessageStore