import AppModel from '../../model';
import WsEmitter from '../../plugins/ws/emitter';

declare module 'fastify' {
  interface FastifyInstance {
    model: AppModel,
    upload: any,
    ws: WsEmitter,
    generateJWT: (userData: any, exp?: number) => Promise<string>,
    decodeJWT: (token: string) => Promise<any>
  }

  interface FastifyRequest {

    userData: {
      id: number
    }
  }

  interface FastifyReply {
    error (payload: any, code?: number): FastifyReply
  }
}