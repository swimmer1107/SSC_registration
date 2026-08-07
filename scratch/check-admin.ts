import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.adminUser.findUnique({
    where: { email: 'admin@gla.ac.in' }
  })
  
  if (!admin) {
    console.log('Admin user NOT FOUND!')
  } else {
    console.log('Admin user FOUND:')
    console.log('ID:', admin.id)
    console.log('Email:', admin.email)
    console.log('Role:', admin.role)
    console.log('IsActive:', admin.isActive)
    console.log('Hash:', admin.passwordHash)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
