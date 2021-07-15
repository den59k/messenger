import { FastifyInstance } from "fastify"

import fastifyMultipart from "fastify-multipart"
import authPlugin from "../plugins/auth"
import modelPlugin from "../plugins/model"
import errorPlugin from "../plugins/error"
import wsPlugin from '../plugins/ws'

import auth from "./auth"
import profile from "./profile"
import groups from './groups'
import users from "./users"
import messages from "./messages"

export default async function app (fastify: FastifyInstance){

  //В первую очередь подключаем плагины
  fastify.register(authPlugin)  
  fastify.register(modelPlugin)
  fastify.register(errorPlugin)
  fastify.register(wsPlugin)
  fastify.register(fastifyMultipart)

  //После подключения плагинов подключаем роуты
  fastify.register(auth, { prefix: "auth" })  
  fastify.register(profile, { prefix: "profile" })
  fastify.register(groups, { prefix: "groups" })
  fastify.register(users, { prefix: "users" })
  fastify.register(messages, { prefix: "messages" })

  fastify.get("/", async () => {
    return { word: "hello world" }
  })
  
}