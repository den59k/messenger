class Room {

  room_id: string
  users: Map<string, any>

  constructor(room_id: string){
    this.room_id = room_id
    this.users = new Map()
  }


  hasUser(ws_id: string){
    return this.users.has(ws_id)
  }

  addUser(ws_id: string, userInfo: any){
    this.users.set(ws_id, userInfo)
  }

  get(ws_id: string){
    return this.users.get(ws_id)
  }

}

export default Room