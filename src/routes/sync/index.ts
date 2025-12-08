import z from "zod/v4";
import { FastifyZod } from "../../app.js";
import { prisma } from "../../lib/prisma.js";
import { MiddleWareJwt } from "../../middleware/jwt.js";
import { SyncPullData } from "./pull/index.js";
import { updateAllPushData } from "./push/index.js";

const SyncDoneBodySchema = z.object({
  synced_date: z.string()
});

const sessionZod = z.object({
  id: z.string(),
  user_id: z.string(),
  start_time: z.string(),
  end_time: z.string().optional(),
  notes: z.string().optional(),
  updated_at: z.string(),
  is_deleted: z.boolean()
});

const cycleZod = z.object({
  id: z.string(),
  session_id: z.string(),
  cycle_number: z.number(),
  updated_at: z.string(),
  is_deleted: z.boolean()
})

const exerciseZod = z.object({
  id: z.string(),
  cycle_id: z.string(),
  sport_id: z.string(),
  order_in_cycle: z.number(),
  value: z.number(),
  updated_at: z.string(),
  is_deleted: z.boolean()
})

const sportsUserZod = z.object({
  id: z.string(),
  sport_id: z.string(),
  order_index: z.number(),
  updated_at: z.string(),
  is_deleted: z.boolean()
})

const SyncBodySchema = z.object({
  sessions: z.array(sessionZod),
  cycles: z.array(cycleZod),
  exercises: z.array(exerciseZod),
  sportsUser: z.array(sportsUserZod)
})

const Sync = (fastify: FastifyZod) => {
  fastify.post('/', { schema: { body: SyncBodySchema } }, async (request, reply) => {
    const { userId, deviceId } = request;

    if (!userId || !deviceId) throw Error('Invalid TOKEN');

    const { sessions, cycles, exercises, sportsUser } = request.body;

    console.log('[SYNCED]', sportsUser)

    const data = await SyncPullData(userId, deviceId);

    await updateAllPushData({ sessions, cycles, exercises, sportsUser }, deviceId);

    return data;
  })

  fastify.post('/done', { schema: { body: SyncDoneBodySchema } }, async (request, reply) => {
    const { userId, deviceId } = request;

    if (!userId || !deviceId) throw Error('token invalid')

    const { synced_date } = request.body;

    try {
      await prisma.userDevice.update({ where: { id: deviceId }, data: { last_synced_at: synced_date } })
    } catch (err) {
      throw Error(`error when updating userDevice ${err}`);
    }

    return { ok: true };
  })
}

export function SyncRoutes(fastify: FastifyZod): void {
  fastify.register((instance, opts, next) => {
    MiddleWareJwt(instance)
    Sync(instance)

    next()
  }, { prefix: 'sync' })
}