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
  await prisma.sportType.createMany({
    data: sportTypes.map((st) => ({
      name: st
    })),
    skipDuplicates: true
  });

  const allSportTypes = await prisma.sportType.findMany({
    select: {
      id: true,
      name: true
    },
    where: {
      name: {
        in: sportTypes
      }
    }
  });

  const sportToCreates = sports.map((sport) => {
    const typeRecord = allSportTypes.find(st => st.name === sport.type);

    if (!typeRecord) {
      console.error(`Erreur de seeding: Type de sport '${sport.type}' non trouvé.`);
      return undefined;
    }

    return {
      name: sport.name,
      type_id: typeRecord.id
    };
  }).filter((sport) => sport !== undefined)

  await prisma.sport.createMany({
    data: sportToCreates,
    skipDuplicates: true
  });
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
