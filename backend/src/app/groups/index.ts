import { FastifyInstance, FastifyReply } from "fastify"
import { addGroupSchema, groupParamsSchema } from "./schema"

export default async function groups (fastify: FastifyInstance){

  fastify.addHook("onRequest", async (request, reply) => {
    if(!request.userData) return reply.error({ accessToken: "wrong accessToken" }, 401)
  })

  fastify.get("/", async (request) => {
    const { id: user_id } = request.userData
    const own = await fastify.model.groups.getList({ user_id })
    const other = await fastify.model.groups.getOtherList({ user_id })
    return { own, other }
  })

  fastify.post("/", { schema: addGroupSchema }, async (request) => {

    const { id: creator_id } = request.userData
    const { access, name } = request.body as any

    const groupData = await fastify.model.groups.add({ name, access, creator_id })
    return groupData
  })

  fastify.post("/:group_id", { schema: groupParamsSchema }, async (request, reply) => {
    const { group_id } = request.params as any
    const { id: user_id } = request.userData
    
    const count = await fastify.model.groups.addUserToGroup({ user_id, group_id })
    const confInfo = await fastify.model.messages.getGroupConf({ group_id })
    if(confInfo)
      await fastify.model.messages.addUserToConf({ user_id, conf_id: confInfo.id })

    return { count }
  })

  fastify.delete("/:group_id", { schema: groupParamsSchema }, async (request, reply) => {
    const { group_id } = request.params as any
    const { id: user_id } = request.userData

    const group = await fastify.model.groups.get({ group_id, user_id })
    if(!group) return reply.error({ group_id: `group ${group_id} not found` }, 404)
    if(group.creator_id !== user_id) return reply.error({ group_id: `user ${user_id} is not admin`}, 403)

    const count = await fastify.model.groups.delete({ group_id })
    return { count }
  })
}