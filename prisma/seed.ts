import { prisma } from '../src/lib/prisma';
import fs from 'fs';

const categoryName = {
  "UB": "Force et Résistance du Haut du Corps (Bras, Épaules, Dos, Poitrine)",
  "LB": "Force et Résistance du Bas du Corps (Jambes, Fessiers, Mollets)",
  "CR": "Abdominaux et Sangle Abdominale",
  "CD": "Exercices Cardiovasculaires et Plyométrie",
  "MB": "Étirements, Yoga et Mobilité",
  "CP": "Exercices Complexes ou avec Équipement"
}

async function main() {
  const sports: { name: string, type: string, category: string }[] = JSON.parse(fs.readFileSync('./prisma/seeding_data.json', 'utf8'))

  const types: { name: string }[] = [];

  sports.forEach((sport) => {
    if(types.find((type) => type.name === sport.type)) return;

    types.push({ name: sport.type })
  })

  await prisma.sportType.createMany({
    data: types.map((st) => ({
      name: st.name
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
        in: types.map((type) => type.name)
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
