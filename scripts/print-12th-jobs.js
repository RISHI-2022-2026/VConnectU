const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany({ where: { minQualification: 'TWELFTH' } });
  console.log('Found', jobs.length, 'TWELFTH jobs:');
  for (const j of jobs) {
    console.log(`${j.title} | ${j.company} | ${j.link || 'NO_LINK'}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
