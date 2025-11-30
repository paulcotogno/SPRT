import { prisma } from '../src/lib/prisma';

const sportTypes = ['REP', 'TIME'];

const sports = [
  {
    name: 'pompes',
    type: sportTypes[0]
  },
  {
    name: 'crunchs',
    type: sportTypes[0]
  },
  {
    name: 'squats',
    type: sportTypes[0]
  },
  {
    name: 'plank',
    type: sportTypes[1]
  }
]

async function main() {
  console.log('seeding');

  // Create SportTypes
  const sportTypesDb = await prisma.sportType.createManyAndReturn({
    data: sportTypes.map((st) => ({
      name: st
    }))
  })

  // Create Base Sport
  await prisma.sport.createMany({
    data: sports.map((sport) => ({
      name: sport.name,
      type_id: sportTypesDb.find(st => st.name === sport.type)!.id
    }))
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
