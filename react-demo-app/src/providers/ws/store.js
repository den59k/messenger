import { action, makeObservable, observable } from "mobx";
import { getAccessToken } from 'services'
import EventEmitter from 'events'

class RouterStore {

	status = 'not-connected'
	id = ''

	constructor(){
		makeObservable(this, {
			status: observable,
			setId: action
		})
		this.emitter = new EventEmitter()
		this.on('handshake', ({error, id}) => {
			if(error) return console.log(error)
			console.log('WebSocket connected! Id: '+id)
			this.setId(id)
		})
	}

	setId(id){
		this.id = id
		this.status = 'connected'
	}

	send(type, payload){
		if(!this.status) return console.log("Socket is not connected")
		this.socket.send(JSON.stringify({ type, payload }))
	}

	onOpen(){
		const accessToken = getAccessToken()
		this.send('handshake', { accessToken })
		if(this.reconectInterval) clearInterval(this.reconectInterval)

		this.socket.addEventListener('message', (e) => {
			const { type, payload } = JSON.parse(e.data)
			if(this.emitter.listenerCount(type) === 0)
				console.log(`0 listeners on "${type}"`, payload)
			console.log(type, payload)
			this.emitter.emit(type, payload)
		})
	}

	on(type, callback){
		this.emitter.on(type, callback)
		return callback
	}

	off(type, callback){
		this.emitter.off(type, callback)
	}

	onClose(){
		if(this.status === 'closed') return
		this.status = 'lost-connection'
		if(!this.reconectInterval)
			this.reconectInterval = setInterval(() => this.init(), 5000)
	}

	init(){
		const wsURL = "ws://localhost:3001"
		this.socket = new WebSocket(wsURL);

		this.socket.addEventListener('open', () => this.onOpen())
		this.socket.addEventListener('close', () => this.onClose())
	}

	dispose(){
		this.status = 'closed'
		this.socket.close(1000)
	}

}

export default RouterStore