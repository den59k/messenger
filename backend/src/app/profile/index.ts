import { FastifyInstance } from "fastify";
import getRawBody from "raw-body";
import { userInfoSchema } from "./schema";

import fs from 'fs'
import { pipeline } from "stream";
import { promisify } from "util";
import { saveFile, saveFileAndCrop } from "../../libs/save-file";
const pump = promisify(pipeline)


export default async function profile (fastify: FastifyInstance){
  fastify.addHook("onRequest", async (request, reply) => {
    if(!request.userData) return reply.error({ accessToken: "wrong accessToken" }, 401)
  })
  
  fastify.get("/", async (request) => {
    const { id } = request.userData
    const userInfo = await fastify.model.account.getUserInfo(id)
    return userInfo
  })

  fastify.put("/", { schema: userInfoSchema }, async (request) => {
    const { id } = request.userData
    const { name, status } = request.body as any
    const count = await fastify.model.account.updateUserInfo(id, { name, status })
    return { count }
  })

  fastify.post("/avatar", async (request, reply) => {

    const file = await request.file();
    if(!file) return reply.error({ file: "wrong file" })

    const src = await saveFileAndCrop(file, { folder: 'avatars', size: 150 })

    await fastify.model.account.updateAvatar(request.userData.id, { src });

    return { src }
  })
}