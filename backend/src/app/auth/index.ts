import { FastifyInstance, FastifyReply } from "fastify"
import { tokenSchema, loginSchema, registerSchema } from "./schema"

interface TokenFastifyReply extends FastifyReply{
	auth: (userData: any) => Promise<FastifyReply>
}

export default async function auth (fastify: FastifyInstance){

  fastify.decorateReply('auth', async function(userData: any){
    const refreshToken = await fastify.generateJWT(userData)
    const accessToken = await fastify.generateJWT(userData, 3600)

    await fastify.model.tokens.add({ user_id: userData.id, token: refreshToken })

		this.send({refreshToken, accessToken, userData})
		return this
	})

  //Аутентификация по refreshToken
  fastify.post("/", { schema: tokenSchema }, async (request, reply: TokenFastifyReply) => {
    const { refreshToken } = request.body as any

    const userData = await fastify.model.tokens.get({ token: refreshToken })
    if(!userData) return reply.error({ token: "Unknown token" }, 406) 
    
    await fastify.model.tokens.delete({ token: refreshToken })
    return reply.auth({ id: userData.user_id })
  })

  //Делогинизация
  fastify.delete("/", { schema: tokenSchema }, async (request) => {
    const { refreshToken } = request.body as any
    const count = await fastify.model.tokens.delete ({ token: refreshToken })
    return { count }
  })

  //Аутентификация по логину и паролю
  fastify.post("/login", { schema: loginSchema }, async (request, reply: TokenFastifyReply) => {
    const { login, password } = request.body as any
    const check = await fastify.model.account.checkPassword({ login, password })
    if(!check) return reply.error({ login: "Неверный логин" }, 406)

    if(!check.true_password) return reply.code(406).send({ error: { password: "Неверный пароль" } })

    return reply.auth({ id: check.id })
  })

  //Регистрация
  fastify.post("/register", { schema: registerSchema }, async (request, reply: TokenFastifyReply) => {
    const { login, password, name } = request.body as any
    
    const checkExist = await fastify.model.account.existUser(login)
    if(checkExist) return reply.error({ login: "Логин уже занят" }, 406)

    const userData = await fastify.model.account.addUser({ name, login, password })

    return reply.auth({ id: userData.id })
  })
}