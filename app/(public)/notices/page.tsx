import { prisma } from '@/lib/prisma'
import NoticesPageClient from './NoticesPageClient'

export const revalidate = 30

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return <NoticesPageClient notices={notices} />
}
