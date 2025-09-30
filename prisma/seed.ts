import dayjs from "dayjs";
import { readdirSync } from "fs";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

function getSeedFiles() {
  const currentDir = __dirname;
  const fileList = readdirSync(`${currentDir}/seed`);

  return fileList.sort((a, b) => {
    return parseInt(a.substring(0, 3), 10) - parseInt(b.substring(0, 3), 10);
  });
}

async function main() {
  console.info(`Start Migration Seeding...`);
  const allSeedFiles = getSeedFiles();

  const latestSeed = await prisma.seedingHistory.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const seedFiles =
    latestSeed.length > 0
      ? allSeedFiles.filter((file) => {
          if (file.substring(0, 3) <= latestSeed[0].fileName.substring(0, 3)) {
            console.warn(`Skipped ${file}`);
            return false;
          }
          return true;
        })
      : allSeedFiles;

  await prisma.$transaction(
    async (tx) => {
      for (let i = 0; i < seedFiles.length; i++) {
        try {
          const file = seedFiles[i];
          // eslint-disable-next-line
          const { change } = require(`./seed/${file}`);

          await change(tx);

          await tx.seedingHistory.create({
            data: {
              fileName: file,
              createdAt: dayjs().add(i, "second").toDate(),
            },
          });
        } catch (error) {
          throw new Error(`exec error: ${error}`);
        }
      }
    },
    {
      maxWait: 150000,
      timeout: 150000,
    }
  );
}

main()
  // Add MUST seed
  .then(async () => {
    console.info(`Start pre-seeding ...`);
    // await seedPlans(prisma);

    console.info(`Seeding finished.`);
  })
  .then(async () => {
    console.info(`Migration Seeding finished.`);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
