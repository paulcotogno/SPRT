import { FastifyZod } from "../app.js";
import { validateJWT } from "../lib/jwt.js";

export const MiddleWareJwt = (fastify: FastifyZod): void => {
  fastify.addHook('preParsing', async (request, reply, payload) => {
    const token = request.headers.authorization?.split(' ');

    if (!token || token[0] !== 'sprt_token' || !token[1]) {
      throw (Error(`pas le bon token ${token}`))
    }

    const { userId, deviceId } = await validateJWT({ token: token![1] })

    request.userId = userId;
    request.deviceId = deviceId;
  })
}