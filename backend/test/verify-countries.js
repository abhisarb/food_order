const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const countries = await prisma.country.findMany();
    console.log('Countries found:', countries.map(c => c.name).join(', '));

    const names = countries.map(c => c.name);
    const required = ['India', 'USA', 'Japan', 'United Kingdom', 'Canada', 'Australia'];
    const missing = required.filter(c => !names.includes(c));

    if (missing.length === 0) {
        console.log('SUCCESS: All required countries found: ' + required.join(', '));
    } else {
        console.error('FAILURE: Missing countries: ' + missing.join(', '));
    }
}

main()
    .finally(() => prisma.$disconnect());
