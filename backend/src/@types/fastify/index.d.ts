import AppModel from '../../model';
import Room from '../../plugins/rooms/room';
import WsEmitter from '../../plugins/ws/emitter';

declare module 'fastify' {
  interface FastifyInstance {
    model: AppModel,
    upload: any,
    ws: WsEmitter,
    rooms: Map<string, Room>,
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