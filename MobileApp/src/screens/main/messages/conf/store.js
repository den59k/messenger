import { action, makeObservable, observable, runInAction } from "mobx";
import { GET, REST } from "src/services";

let counter = -1
class ConfStore {

  info = null
  userInfo = null
  status = ""
  messages = new observable.array([], { deep: true })
  messageStore = null
  type = ""

  constructor(){
    makeObservable(this, {
      info: observable,
      status: observable,
      type: observable,
      messages: observable,
      addMessage: action,
      init: action,
      receiveMessage: action
    })
  }

  init(params){
    const { user_id, group_id } = params
    //this.messageStore = messageStore
    if(user_id){
      this.url = "/messages/users/"+user_id
      this.type = "user"
      this._init()
    }else{
      this.url = "/messages/groups/"+group_id
      this.type = "group"
      this._init()
    }
  }

  async _init(){
    const { info, userInfo, messages, error } = await GET(this.url)
    if(error) return
    runInAction(() => {
      this.info = info
      this.messages.replace(messages)
      this.userInfo = userInfo
      this.status = "loaded"
    })
  }

  async subscribe () {
    if(!this.type === "group") return "it is not group"
    const { error } = await REST("/groups/"+this.info.id, {})
    if(error) return error
    await this._init()
  }

  async send(text){
    const id = counter--
    this.addMessage({ 
      id,
      sender_id: this.userInfo.id, 
      sender_name: this.userInfo.name, 
      sender_avatar: this.userInfo.avatar, 
      text,
      time: Date.now(),
      sending: true 
    })
    const { message, error } = await REST(this.url, { text, _id: id }, "POST")
    if(error) return error
    runInAction(() => {
      const m = this.messages.find(m => m.id === id)
      m.id = message.id
      m.sending = false
    })
  }

  addMessage({ id, sender_id, sender_name, sender_avatar, text, time, sending }){
    this.messages.unshift({ id, sender_id, sender_name, sender_avatar, text, time, sending })
    //this.messageStore.addMessage(conf_id, { id, sender_id, sender_name, text, time })
  }

  receiveMessage({ info, senderInfo, message, _id }){
    if(this.info.id !== senderInfo.id && this.info.id !== info?.id) return
    if(this.messages.some( m => m.id === message.id || m.id === _id )) return

    this.addMessage({ ...message, sender_name: senderInfo.name, sender_avatar: senderInfo.avatar })
  }
}

export default ConfStore