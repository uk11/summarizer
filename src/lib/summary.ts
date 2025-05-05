import { authOptions } from './authOptions';
import type { Summary } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { getAnonymousId } from './auth';
import { db } from './prisma';

export async function getSummaries(): Promise<Summary[]> {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    return db.summary.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  const anonymousId = await getAnonymousId();

  if (anonymousId) {
    return db.summary.findMany({
      where: { anonymousId },
      orderBy: { createdAt: 'desc' },
    });
  }

  return [];
}
