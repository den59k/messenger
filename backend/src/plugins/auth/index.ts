import getKeys from './get-keys'
import jwt from 'jsonwebtoken'
import fp from 'fastify-plugin'
import { FastifyInstance, FastifyRequest } from 'fastify'

const sign = (info: any, key: Buffer, options: any): Promise<string> => new Promise((res, rej) => {
	jwt.sign( info, key, options, (err: any, token: string) => {
		if(err) return rej(err)
		res(token) 
	})
})

const verify = (token: string, key: Buffer): Promise<any> => new Promise((res, rej) => {
	jwt.verify( token, key, (err: any, decoded: any) => {
		if(err)
			return res(null)
		
		res(decoded) 
	})
})


async function authPlugin (fastify: FastifyInstance){
  
  const keys = getKeys()

  fastify.decorate("generateJWT", async (userInfo: any, exp?: number) => {
    if(exp) 
      return await sign(userInfo , keys.privateKey, { algorithm: 'ES256' })
    else
      return await sign({
        ...userInfo, 
        exp: Math.floor(Date.now() / 1000) + exp,
      }, keys.privateKey, { algorithm: 'ES256'})
  })

  fastify.decorate("decodeJWT", async (token: string) => {

    if(!token) return null
		const decoded = await verify(token, keys.publicKey)
		return decoded
  })

  fastify.decorateRequest('userData', null)

	fastify.addHook('onRequest', async (request: FastifyRequest, reply) => {
    
		const access_token = request.headers['access-token']
		request.userData = await fastify.decodeJWT(access_token as string)
		return
	})
  
}

export default fp(authPlugin)