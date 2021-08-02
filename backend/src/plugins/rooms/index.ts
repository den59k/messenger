import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import Room from "./room"


async function roomsPlugin (fastify: FastifyInstance){
  const rooms = new Map<string, Room>()
  fastify.decorate("rooms", rooms)
}

export default fp(roomsPlugin)