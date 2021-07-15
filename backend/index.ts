import dotenv from 'dotenv'
dotenv.config()

import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import { uploadPath } from './src/libs/save-file'

import app from './src/app'

const server = fastify()
server.register(app, { prefix: '/api' })
server.register(fastifyStatic, {
  root: uploadPath
})

const port = process.env.PORT || 3001
server.listen(port, '0.0.0.0', function (err, address) {
  if (err) return console.log(err)
  console.log(`server listening on ${address}`)
})
