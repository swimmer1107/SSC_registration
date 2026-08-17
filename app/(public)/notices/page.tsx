import { prisma } from '@/lib/prisma'
import NoticesPageClient from './NoticesPageClient'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  let notices: any[] = []
  try {
    notices = await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.error('[NoticesPage] DB error:', e)
  }
  return <NoticesPageClient notices={notices} />
}
