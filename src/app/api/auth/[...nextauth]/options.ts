import { AuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import apiAuthSignIn from '@/utils/auth';
import { JWT } from 'next-auth/jwt';
import { redirect } from 'next/dist/server/api-utils';
const options: AuthOptions = {
  //SIGN IN CHAY TRUOC JWT, TRONG SIGNIN SE RETURN 1 THANG USER, JWT CHAY TRUOC SESSION
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials in credentials: ', credentials);
        if (!credentials) {
          return { error: 'Invalid credentials' };
        }
        const user = await apiAuthSignIn(credentials);
        if (!user) return { redirect: '/' };
        return user;
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ username: username }),
        // })
        //   .then((response) => response.json()) // Parse JSON response

        //   .then((userData) => {
        //     console.log('userData in google: ', userData);

        //     // Check if userData exists and construct user object accordingly
        //     const user = userData
        //       ? {
        //           id: userData.id,
        //           display_name: userData.display_name,
        //           username: userData.name,
        //           role: userData.role,
        //           access_token: userData.access_token,
        //         }
        //       : {
        //           id: 1,
        //           display_name: 'userData.display_name',
        //           username: 'userData.name',
        //           role: 'userData.role',
        //           access_token: 'userData.access_token',
        //         };
        //     if (!user)
        //       return new Response(
        //         JSON.stringify({ message: 'Email or password is incorrect' }),
        //         { status: 500 }
        //       );
        //     console.log('user in discord: ', user);
        //     return user; // Return user object
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //     // Handle error if needed
        //     // Return default user object or throw an error
        //   });
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET, // Replace with your JWT secret
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
        token.access_token = user.access_token;
        token.display_name = user.display_name;
      }
      return token;
    },

    async session({ token, session }) {
      console.log('token in sessionnnnnnnnnnnnnnnnn: ', token);
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { username: string }).username =
          token.username as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { display_name: string }).display_name =
          token.display_name as string;
        (session.user as { access_token: string }).access_token =
          token.access_token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
export default options;
