// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }

  interface Profile {
    email_verified?: boolean; // 여기에 직접 추가
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
