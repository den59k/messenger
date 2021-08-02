import { FastifyInstance } from "fastify";
import { userMessagesParamsSchema, groupMessagesParamsSchema, messageSchema } from "./schema"; 

export default async function messages (fastify: FastifyInstance){

  fastify.addHook("onRequest", async (request, reply) => {
    if(!request.userData) return reply.error({ accessToken: "wrong accessToken" }, 401)
  })

  fastify.get("/", async (request) => {
    const { id: user_id } = request.userData
    const messages = await fastify.model.messages.getConfList({ user_id })
    return { messages }
  })

  fastify.get("/users/:user_id", { schema: userMessagesParamsSchema }, async (request, reply) => {
    const { id: user_one } = request.userData
    const { user_id } = request.params as any
    const info = await fastify.model.users.get({ user_id })
    if(!info) return reply.error({ user_id: "user not found"}, 404)

    let messages = []
    const confInfo = await fastify.model.messages.getConf([ user_one, user_id ])
    if(confInfo) messages = await fastify.model.messages.getList({ conf_id: confInfo.id })

    const userInfo = await fastify.model.users.get({ user_id: user_one })

    return { info, userInfo, messages, confInfo }
  })

  fastify.post("/users/:user_id", { schema: {...userMessagesParamsSchema, ...messageSchema} }, async (request) => {
    const { id: from_id } = request.userData
    const { user_id: to_id } = request.params as any
    const { text, _id } = request.body as any

    const confInfo = await fastify.model.messages.getConf([ from_id, to_id ], true)
    const message = await fastify.model.messages.add({ conf_id: confInfo.id, from_id, text })

    const senderInfo = await fastify.model.users.get({ user_id: from_id })
    _sendMessage([ from_id, to_id ], { senderInfo, message, _id })

    return { message }
  } )

  fastify.get("/groups/:group_id", { schema: groupMessagesParamsSchema }, async (request, reply) => {
    const { id: user_id } = request.userData
    const { group_id } = request.params as any
    const info = await fastify.model.groups.get({ group_id, user_id })
    if(!info) return reply.error({ group_id: "group not found"}, 404)

    let messages = []
    let activeCall = null
    const confInfo = await fastify.model.messages.getGroupConf({ group_id })
    if(confInfo){ 
      activeCall = await fastify.model.calls.getLastCall({ conf_id: confInfo.id })
      if(activeCall && activeCall.status !== "active") activeCall = null

      messages = await fastify.model.messages.getList({ conf_id: confInfo.id })
    }

    const userInfo = await fastify.model.users.get({ user_id })
    return { info, userInfo, messages, confInfo, activeCall }
  })

  fastify.post("/groups/:group_id", { schema: { ...groupMessagesParamsSchema, ...messageSchema }}, async (request, reply) => {
    const { id: from_id } = request.userData
    const { group_id } = request.params as any
    const { text, _id } = request.body as any

    const info = await fastify.model.groups.get({ group_id, user_id: from_id })
    if(!info) return reply.error({ group_id: "group not found" }, 404)
    if(!info.consists) return reply.error({ group_id: "user is not consists to group" }, 403)

    const confInfo = await fastify.model.messages.getGroupConf({ group_id }, true)
    const message = await fastify.model.messages.add({ conf_id: confInfo.id, from_id, text })
    
    const users = await fastify.model.groups.getUserList({ group_id })
    const senderInfo = await fastify.model.users.get({ user_id: from_id })
    _sendMessage(users, { senderInfo, info, message, _id })
    
    return { message }
  })


    
  const _sendMessage = (users: Array<number>, payload: any) => {
    for(let user_id of users)
      fastify.ws.send(user_id, "message", payload)
  }

}