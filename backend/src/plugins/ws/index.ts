import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import WsEmitter from "./emitter"


async function wsPlugin (fastify: FastifyInstance){

  const onHandshake = async ({ accessToken }) => {
    if(!accessToken) return null
    const user_data = await fastify.decodeJWT(accessToken)
    if(!user_data) return null
    return user_data.id
  }

  const ws = new WsEmitter({ server: fastify.server, onHandshake})
  fastify.decorate("ws", ws)

}

export default fp(wsPlugin)