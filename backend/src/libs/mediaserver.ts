import axios from 'axios'

const url = 'http://localhost:5000'

export const createRoom = () => axios.post(url+'/rooms', {}).then(resp => resp.data)

export const addUser = (room_id: string, userId: string, userInfo: any) => 
  axios.post(`${url}/rooms/${room_id}/users/${userId}`, { userInfo }).then(resp => resp.data)

export const produce = (room_id: string, userId: string, offer: any, constraints?: any) => 
  axios.post(`${url}/rooms/${room_id}/users/${userId}/produce`, { offer, constraints }).then(resp => resp.data)

export const consume = (room_id: string, userId: string, producerUserId: string, answer: any) => 
  axios.post(`${url}/rooms/${room_id}/users/${userId}/consume`, { answer, producerUserId }).then(resp => resp.data)

export const deleteUser = (room_id: string, userId: string) => 
  axios.delete(`${url}/rooms/${room_id}/users/${userId}`, {}).then(resp => resp.data)

export const get = (room_id: string) => 
  axios.get(`${url}/rooms/${room_id}`, { validateStatus: (_status) => true }).then(resp => resp.data)
