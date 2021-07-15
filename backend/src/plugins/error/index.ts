import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function errorPlugin (fastify: FastifyInstance){

  fastify.decorateReply("error", async function(payload: any, code: number = 405){
    this.code(code).send({ error: payload })  
  })

  //А также определим подсвечивание ошибки
  fastify.setErrorHandler(function (error, _request, reply) {
		console.log(error)
		reply.error("Ошибка сервера")
	})
}

export default fp(errorPlugin)