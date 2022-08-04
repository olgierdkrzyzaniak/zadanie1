import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { name: 'Olgierd' },
    update: {},
    create: {
      id: '1',
      name: 'Olgierd',
      money: 3000,
    },
  })

  await prisma.product.upsert({
    where: { name: 'iPhone' },
    update: {},
    create: {
      id: '1',
      name: 'iPhone',
      price: 900,
      amount: 5
    },
  })

  await prisma.order.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      userId: '1',
      productId: '1'
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })