import { cookies } from 'next/headers';

export async function getAnonymousId() {
  const cookieStore = await cookies();
  return cookieStore.get('anonymousId')?.value ?? null;
}
