import { z } from "zod/v4";
import bcrypt from 'bcrypt';
import { FastifyZod } from "../../app.js";
import { signJWT } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";

const RegisterSchema = z.object({
  name: z.string().max(32).min(3),
  password: z.string().max(6).min(6)
})

const AuthRegister = (fastify: FastifyZod): void => {
  fastify.post('/register', { schema: { body: RegisterSchema } }, async function (request, reply) {
    const { name, password } = request.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({ data: { name, password: passwordHash } })

    const device = await prisma.userDevice.create({ data: { last_synced_at: new Date(2000, 1, 1), name: 'Ouai', user_id: user.id } })

    //SIGNING
    const jwt = signJWT({ userId: user.id, deviceId: device.id });

    return {
      id: user.id,
      name: user.name,
      user_token: jwt,
      user_device_id: device.id,
      synced_at: device.last_synced_at,
      created_at: user.created_at
    }
  })
}

const LoginSchema = z.object({
  name: z.string().max(32).min(3),
  password: z.string().max(6).min(6)
})

const AuthLogin = (fastify: FastifyZod): void => {
  fastify.post('/login', { schema: { body: LoginSchema } }, async (request, reply) => {
    const { name, password } = request.body;

    const user = await prisma.user.findUnique({ where: { name: name } });

    if (!user) {
      throw Error('no user for name');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw Error('bad password');
    }

    const device = await prisma.userDevice.create({ data: { last_synced_at: new Date(2000, 1, 1), name: 'Ouai', user_id: user.id } })

    //SIGNING
    const jwt = signJWT({ userId: user.id, deviceId: device.id });

    return {
      id: user.id,
      name: user.name,
      user_token: jwt,
      user_device_id: device.id,
      synced_at: device.last_synced_at,
      created_at: user.created_at
    }
  })
}

export function AuthRoutes(fastify: FastifyZod): void {
  fastify.register((instance, opts, next) => {
    AuthRegister(instance)
    AuthLogin(instance)

    next()
  }, { prefix: 'auth' })
}