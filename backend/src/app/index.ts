import { FastifyInstance } from "fastify"

import fastifyMultipart from "fastify-multipart"
import authPlugin from "../plugins/auth"
import modelPlugin from "../plugins/model"
import errorPlugin from "../plugins/error"
import wsPlugin from '../plugins/ws'
import roomsPlugin from '../plugins/rooms'

import auth from "./auth"
import profile from "./profile"
import groups from './groups'
import users from "./users"
import messages from "./messages"
import calls from "./calls"
import rooms from "./rooms"

export default async function app (fastify: FastifyInstance){

  //В первую очередь подключаем плагины
  fastify.register(authPlugin)  
  fastify.register(modelPlugin)
  fastify.register(errorPlugin)
  fastify.register(wsPlugin)
  fastify.register(roomsPlugin)
  fastify.register(fastifyMultipart)

  //После подключения плагинов подключаем роуты
  fastify.register(auth, { prefix: "auth" })  
  fastify.register(profile, { prefix: "profile" })
  fastify.register(groups, { prefix: "groups" })
  fastify.register(users, { prefix: "users" })
  fastify.register(messages, { prefix: "messages" })
  fastify.register(calls, { prefix: "calls" })
  fastify.register(rooms, { prefix: "calls/rooms/:room_id"})
  fastify.get("/sockets", async () => {
    return JSON.stringify(Array.from(fastify.ws._sockets.values()).map( item => Array.from(item.keys()) ))
  })

  fastify.get("/", async () => {
    return { word: "hello world" }
  })
  
}