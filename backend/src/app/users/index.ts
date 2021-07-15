import { FastifyInstance } from "fastify";

export default async function users (fastify: FastifyInstance){

  fastify.addHook("onRequest", async (request, reply) => {
    if(!request.userData) return reply.error({ accessToken: "wrong accessToken" }, 401)
  })

  fastify.get("/", async () => {
    const resp = await fastify.model.users.getList()
    return resp
  })

}