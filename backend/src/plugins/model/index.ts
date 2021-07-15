import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import AppModel from "../../model"

async function modelPlugin (fastify: FastifyInstance){
  const model = new AppModel()
  await model.init()
  fastify.decorate("model", model)
}

export default fp(modelPlugin)