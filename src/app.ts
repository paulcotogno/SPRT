import Fastify, { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import { AuthRoutes } from './routes/auth/index.js';
import { SyncRoutes } from './routes/sync/index.js';

export const fastify = Fastify({
  logger: true
})

await fastify.register(cors, {
  origin: '*'
})

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string,
    deviceId?: string
  }
}

export type FastifyZod = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>

AuthRoutes(fastify);
SyncRoutes(fastify);

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})