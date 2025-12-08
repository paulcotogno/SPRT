import { prisma } from "../../../lib/prisma.js";


export const SyncPullData = async (userId: string, deviceId: string) => {
  const device = await prisma.userDevice.findUnique({ where: { id: deviceId } });

  if (!device) throw Error("Le device n'existe pas");

  const sportTypes = await prisma.sportType.findMany({
    where: {
      updated_at: { gt: device.last_synced_at }
    }
  })

  const sports = await prisma.sport.findMany({
    where: {
      updated_at: { gt: device.last_synced_at }
    }
  })

  const sessions = await prisma.session.findMany({
    where: {
      AND: [
        { updated_at: { gt: device.last_synced_at } },
        { user_id: userId }
      ]
    }
  })

  const cycles = await prisma.cycle.findMany({
    where: {
      AND: [
        { updated_at: { gt: device.last_synced_at } },
        { session: { user_id: userId } }
      ]
    }
  })

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        { updated_at: { gt: device.last_synced_at } },
        { cycle: { session: { user_id: userId } } }
      ]
    }
  })

  const sportsUserRes = await prisma.sportUser.findMany({
    where: {
      AND: [
        { updated_at: { gt: device.last_synced_at } },
        { device_id: deviceId }
      ]
    }
  })

  const sportsUser = sportsUserRes.map((sportUser) => ({
    id: sportUser.id,
    user_id: userId,
    sport_id: sportUser.sport_id,
    order_index: sportUser.order_index,
    updated_at: sportUser.updated_at,
    is_deleted: sportUser.is_deleted
  }))

  return {
    sportTypes,
    sports,
    sessions,
    cycles,
    exercises,
    sportsUser
  };
}