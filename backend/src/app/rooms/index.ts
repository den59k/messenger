import { FastifyInstance } from "fastify";
import { produceSchema, consumeSchema, roomParamsSchema, userIdSchema } from "./schema";
import * as MediaServer from '../../libs/mediaserver'

export default async function rooms (fastify: FastifyInstance){

  fastify.post("/produce", { schema: { ...roomParamsSchema, ...produceSchema } }, async (request, reply) => {
    const { room_id } = request.params as any
    const { offer, userId, constraints } = request.body as any

    const { answer, outbound, userInfo } = await MediaServer.produce(room_id, userId, offer, constraints)

    for(let obj of outbound)
      fastify.ws.wsSend(obj.userInfo.id, obj.userId, "call-consume", { userId, offer: obj.offer, userInfo, constraints })

    return { answer }
  })

  fastify.post("/consume", { schema: {...roomParamsSchema, ...consumeSchema } }, async (request) => {
    const { room_id } = request.params as any
    const { answer, ws_id, userId } = request.body as any
    
    await MediaServer.consume(room_id, ws_id, userId, answer)
    return { status: "ok" }
  })
}