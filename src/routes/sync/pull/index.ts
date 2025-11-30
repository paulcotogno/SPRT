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
        { updated_at: device.last_synced_at },
        { cycle: { session: { user_id: userId } } }
      ]
    }
  })

  return {
    sportTypes,
    sports,
    sessions,
    cycles,
    exercises
  };
}