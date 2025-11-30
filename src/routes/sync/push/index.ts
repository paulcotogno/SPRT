import { uuidv4 } from "zod/v4";
import { Cycle, Exercise, Session } from "../../../generated/prisma/client.js"
import { prisma } from "../../../lib/prisma.js"
import { randomUUID } from "crypto";


interface SessionData {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  notes?: string;
  updated_at: string;
  is_deleted: boolean;
}

interface CycleData {
  id: string;
  session_id: string;
  cycle_number: number;
  updated_at: string;
  is_deleted: boolean;
}

interface ExerciseData {
  id: string;
  cycle_id: string;
  sport_id: string;
  value: number;
  order_in_cycle: number;
  updated_at: string;
  is_deleted: boolean;
}

interface UpdateData {
  sessions: SessionData[],
  cycles: CycleData[],
  exercises: ExerciseData[]
}

const updateSessions = async (sessions: SessionData[]) => {
  await prisma.$transaction(
    sessions.map((session) => prisma.session.upsert({
      where: { id: session.id },
      update: session,
      create: session,
    }))
  )
}

const updateCycles = async (cycles: CycleData[]) => {
  await prisma.$transaction(
    cycles.map((cycle) => prisma.cycle.upsert({
      where: { id: cycle.id },
      update: cycle,
      create: cycle
    }))
  )
}

const updateExercises = async (exercises: ExerciseData[]) => {
  await prisma.$transaction(
    exercises.map((exercise) => prisma.exercise.upsert({
      where: { id: exercise.id },
      update: exercise,
      create: exercise
    }))
  )
}


export const updateAllPushData = async ({ sessions, cycles, exercises }: UpdateData) => {
  try {
    await updateSessions(sessions);
    await updateCycles(cycles);
    await updateExercises(exercises);
  } catch (err) {
    throw Error(JSON.stringify(err))
  }
}