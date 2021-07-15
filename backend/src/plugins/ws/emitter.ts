import { EventEmitter } from "events";
import { Server } from "http";
import { nanoid } from "nanoid";
import WebSocket from 'ws'

interface Socket extends WebSocket {
  id: string,
  user_id: number,
  isAlive: boolean
}

interface WsParams {
  server: Server,
  onHandshake: (payload: any) => Promise<number>
}

function heartbeat() {
  this.isAlive = true;
}

class WsEmitter extends EventEmitter {

  _server: WebSocket.Server
  _onHandshake: (payload: any) => Promise<number>
  _sockets: Map<number, Map<string, Socket>>

  constructor({ server, onHandshake }: WsParams){
    super()
    this._sockets = new Map()

    this._onHandshake = onHandshake
    this._server = new WebSocket.Server({ server })
    this._server.on("listening", () => console.log("WebSocket server listening on "+(server.address() as any).port+" port"))
    this._server.on("connection", this._newConnection.bind(this))

    const interval = setInterval(this._doPing.bind(this), 30000)
    this._server.on("close", () => clearInterval(interval))
  }

  send(user_id: number, type: string, payload: any){
    if(!this._sockets.has(user_id)) return
    for(let ws of this._sockets.get(user_id).values())
      this._wsSend(ws, type, payload)
  }

  _newConnection(ws: Socket){
    ws.isAlive = true
    ws.on("pong", heartbeat)
    ws.on("message", (message) => {
      try{
        const { type, payload } = JSON.parse(message.toString())
        if(type === "handshake")
          return this._doHandshake(ws, payload)
        
        if(!ws.id) return
        this.emit(type, payload, { user_id: ws.user_id, ws_id: ws.id })
      }catch(e){
        console.log(e)
        this._wsSend(ws, "error", "Wrong websocket packet structure")
      }
    })
  }

  _doHandshake(ws: Socket, payload: any){
    this._onHandshake(payload).then(user_id => {
      if(!user_id) return this._wsSend(ws, "handshake", { error: { token: "Unknown accessToken" } })

      const ws_id = nanoid()
      ws.user_id = user_id
      ws.id = ws_id

      ws.on("close", () => {
        this._sockets.get(user_id).delete(ws_id)
        if(this._sockets.get(user_id).size === 0)
          this._sockets.delete(user_id)
      })

      if(!this._sockets.has(user_id))
        this._sockets.set(user_id, new Map())

      this._sockets.get(user_id).set(ws_id, ws)
      this._wsSend(ws, "handshake", { id: ws_id })
    })
  }

  _wsSend(ws: Socket, type: string, payload: any){
    ws.send(JSON.stringify({ type, payload }))
  }

  _doPing(){
    this._server.clients.forEach((ws: Socket) => {
      if(!ws.isAlive) return ws.terminate()
      ws.isAlive = false
      ws.ping()
    })
  }

}

export default WsEmitter