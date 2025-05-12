import { authOptions } from './authOptions';
import { getServerSession } from 'next-auth';
import { getAnonymousId } from './auth';
import { db } from './prisma';

export async function getSummaries() {
  const session = await getServerSession(authOptions);

  if (session?.user.id) {
    return db.summary.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });
  }

  const anonymousId = await getAnonymousId();

  if (anonymousId) {
    return db.summary.findMany({
      where: { anonymousId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  return [];
}
