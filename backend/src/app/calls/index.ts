import { FastifyInstance } from "fastify";
import { userParamsSchema, callParamsSchema, inviteCallSchema, groupParamsSchema } from "./schema";
import * as MediaServer from '../../libs/mediaserver'
import Room from "../../plugins/rooms/room";

interface Call {
  caller_id: number,
  caller_ws_id: string,
  callee_id: number
}

export default async function calls (fastify: FastifyInstance){

  const userOnRooms = new Map<string, string>()

  fastify.addHook("onRequest", async (request, reply) => {
    if(!request.userData) return reply.error({ accessToken: "wrong accessToken" }, 401)
  })

  const activeCalls = new Map<number, Call>()
  fastify.post("/users/:user_id", { schema: { ...userParamsSchema, ...inviteCallSchema } }, async (request, reply) => {
    const { user_id } = request.params as any
    const { id: caller_id } = request.userData
    const { wsId } = request.body as any

    const exists = fastify.ws._sockets.get(caller_id)?.has(wsId)
    if(!exists) return reply.error({ wsId: `WebSocket is not exists` }, 403)

    const callee = await fastify.model.users.get({ user_id })
    if(!callee) return reply.error({ user_id: "user is not found" }, 404)

    const caller = await fastify.model.users.get({ user_id: caller_id })

    const confInfo = await fastify.model.messages.getConf([ user_id, caller_id ], true)
    const callInfo = await fastify.model.calls.add({ conf_id: confInfo.id, caller_id, room_id: null })
    activeCalls.set(callInfo.id, {
      caller_id: caller_id,
      caller_ws_id: wsId,
      callee_id: user_id
    })

    fastify.ws.send(user_id, "call-invite", { caller, callInfo })
    return { callee, callInfo }
  })

  fastify.post("/groups/:group_id", { schema: { ...groupParamsSchema, ...inviteCallSchema } }, async (request, reply) => {
    const { group_id } = request.params as any
    const { id: user_id } = request.userData
    const { wsId } = request.body as any

    const userInfo = await fastify.model.users.get({ user_id })

    const exists = fastify.ws._sockets.get(user_id)?.has(wsId)
    if(!exists) return reply.error({ wsId: `WebSocket is not exists` }, 403)

    const groupInfo = await fastify.model.groups.get({ group_id, user_id })
    if(!groupInfo) return reply.error({ user_id: "user is not found" }, 404)

    const confInfo = await fastify.model.messages.getGroupConf({ group_id }, true)
    let lastCall = await fastify.model.calls.getLastCall({ conf_id: confInfo.id })
    
    if(lastCall){
      const roomInfo = await MediaServer.get(lastCall.room_id)
      if(roomInfo.error){
        await fastify.model.calls.update({ call_id: lastCall.id, status: "answered" })
        lastCall = null
      }
    }
      
    if(lastCall && lastCall.status === "active"){
      const room_id = lastCall.room_id
      const resp = await MediaServer.addUser(room_id, wsId, { id: user_id })

      for(let obj of resp.users){
        if(!obj.userInfo || !obj.userInfo.id) continue
        fastify.ws.wsSend(obj.userInfo.id, obj.userId, "call-newUser", { userId: resp.userId, userInfo })
      }
      
      // fastify.ws._sockets.get(user_id).get(wsId).on("close", () => {
      //   MediaServer.deleteUser(room_id, wsId)
      // })

      //Таким образом мы достаем всех пользователей комнаты
      const ids = resp.users.map((item: any) => item.userInfo.id)
      const _users = await fastify.model.users.getMultiple(ids)
      //Также нам нужно добавить offer, если они имеются
      
      const users = resp.users.map((user: any) => ({ ...(_users.find(i => i.id === user.userInfo.id) || {}), ...user }))
      
      //А вот этой строкой мы добавляем пользователей в механизм авто-удаления
      userOnRooms.set(wsId, room_id)
      
      return { callerInfo: userInfo, groupInfo, room_id: lastCall.room_id, users }
    }else{
      const { room_id } = await MediaServer.createRoom()
      const lastCall = await fastify.model.calls.add({ conf_id: confInfo.id, caller_id: user_id, room_id })
      const resp = await MediaServer.addUser(room_id, wsId, { id: user_id })

      userOnRooms.set(wsId, room_id)

      return { callerInfo: userInfo, groupInfo, room_id, users: [] }
    }
  })

  fastify.ws.on("call-ok", async ({ call_id }, { user_id, ws_id }) => {
    const activeCall = activeCalls.get(call_id)
    if(!activeCall || activeCall.callee_id !== user_id)
      return fastify.ws.wsSend(user_id, ws_id, "error", { call_id: `call ${call_id} is not found` })

    activeCalls.delete(call_id)
    await fastify.model.calls.update({ call_id, status: "active" })
    
    const { room_id } = await MediaServer.createRoom()
    await MediaServer.addUser(room_id, ws_id, { user_id })
    await MediaServer.addUser(room_id, activeCall.caller_ws_id, { user_id: activeCall.caller_id })

    fastify.ws.wsSend(user_id, ws_id, "call-ok", { call_id, room_id })
    fastify.ws.wsSend(activeCall.caller_id, activeCall.caller_ws_id, "call-ok", { call_id, room_id })
  })

  fastify.ws.on("call-decline", async ({ call_id }, { user_id, ws_id }) => {
    const activeCall = activeCalls.get(call_id)
    if(!activeCall || activeCall.callee_id !== user_id)
      return fastify.ws.wsSend(user_id, ws_id, "error", { call_id: `call ${call_id} is not found` })

    activeCalls.delete(call_id)
    await fastify.model.calls.update({ call_id, status: "decline" })

    fastify.ws.wsSend(activeCall.caller_id, activeCall.caller_ws_id, "call-decline", { call_id })
  })

  fastify.ws.on("call-cancel", async ({ call_id }, { user_id, ws_id }) => {
    const activeCall = activeCalls.get(call_id)
    if(!activeCall || activeCall.caller_id !== user_id)
      return fastify.ws.wsSend(user_id, ws_id, "error", { call_id: `call ${call_id} is not found` })
  
    activeCalls.delete(call_id)
    await fastify.model.calls.update({ call_id, status: "unanswered" })
    
    fastify.ws.send(activeCall.callee_id, "call-cancel", { call_id })
  })


  fastify.ws.on("call-bye", async ({ room_id }, { user_id, ws_id }) => {
    userOnRooms.delete(ws_id)
    const { userId, userInfo, outbound } = await MediaServer.deleteUser(room_id, ws_id)
    for(let obj of outbound)
      fastify.ws.wsSend(obj.userInfo.id, obj.userId, "call-deleteUser", { userId, userInfo })
  })

  //При отключении пользователя от сокета, мы должны удалить его акк
  fastify.ws.on("socket-close", async (ws_id: string) => {
    if(userOnRooms.has(ws_id)){
      const { userId, userInfo, outbound } = await MediaServer.deleteUser(userOnRooms.get(ws_id), ws_id)
      for(let obj of outbound)
        fastify.ws.wsSend(obj.userInfo.id, obj.userId, "call-deleteUser", { userId, userInfo })
      userOnRooms.delete(ws_id)
    }
  })
}