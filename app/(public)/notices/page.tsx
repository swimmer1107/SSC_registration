import { prisma } from '@/lib/prisma'
import NoticesPageClient from './NoticesPageClient'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return <NoticesPageClient notices={notices} />
}
