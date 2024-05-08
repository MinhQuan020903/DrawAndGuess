import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
const options: AuthOptions = {
  //SIGN IN CHAY TRUOC JWT, TRONG SIGNIN SE RETURN 1 THANG USER, JWT CHAY TRUOC SESSION
  // Configure one or more authentication providers
  session: {
    strategy: 'jwt',
  },
  providers: [
    DiscordProvider({
      clientId: String(process.env.DISCORD_CLIENT_ID),
      clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
      async profile(profile) {
        console.log('profile in discord: ', profile);
        //cai profile nay se truyen xuong jwt function
        // const user = await prisma.user.findUnique({
        //   where: {
        //     username: profile.email,
        //   },
        // });
        // Define user object structure
        fetch('/api/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: profile.email }),
        })
          .then((response) => response.json()) // Parse JSON response
          .then((userData) => {
            // Check if userData exists and construct user object accordingly
            const user = userData
              ? {
                  id: userData.id,
                  display_name: userData.name,
                  username: userData.email,
                  role: userData.role,
                }
              : {
                  display_name: profile.username,
                  username: profile.email,
                  id: -1,
                };
            console.log('user in discord: ', user);
            return user; // Return user object
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle error if needed
            // Return default user object or throw an error
          });
      },
    }),

    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
      async profile(profile) {
        console.log('inside prfileeeeeeeeeeeeeee');
        //cai profile nay se truyen xuong jwt function
        // const user = await prisma.user.findUnique({
        //   where: {
        //     username: profile.email,
        //   },
        // });
        fetch('/api/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: profile.email }),
        })
          .then((response) => response.json()) // Parse JSON response
          .then((userData) => {
            // Check if userData exists and construct user object accordingly
            const user = userData
              ? {
                  id: userData.id,
                  display_name: userData.name,
                  username: userData.email,
                  role: userData.role,
                }
              : {
                  display_name: profile.username,
                  username: profile.email,
                  id: -1,
                };
            console.log('user in discord: ', user);
            return user; // Return user object
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle error if needed
            // Return default user object or throw an error
          });
      },
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      async profile(profile) {
        console.log('inside prfileeeeeeeeeeeeeee');
        //cai profile nay se truyen xuong jwt function
        fetch('/api/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: profile.email }),
        })
          .then((response) => response.json()) // Parse JSON response
          .then((userData) => {
            // Check if userData exists and construct user object accordingly
            const user = userData
              ? {
                  id: userData.id,
                  display_name: userData.name,
                  username: userData.email,
                  role: userData.role,
                }
              : {
                  display_name: profile.username,
                  username: profile.email,
                  id: -1,
                };
            console.log('user in discord: ', user);
            return user; // Return user object
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle error if needed
            // Return default user object or throw an error
          });
      },
    }),

    CredentialsProvider({
      display_name: 'Credentials',
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        fetch('/api/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username }),
        })
          .then((response) => response.json()) // Parse JSON response
          .then((userData) => {
            // Check if userData exists and construct user object accordingly
            const user = userData
              ? {
                  id: userData.id,
                  display_name: userData.name,
                  username: userData.email,
                  role: userData.role,
                }
              : null;
            if (!user) throw new Error('Email or password is incorrect');
            console.log('user in discord: ', user);
            return user; // Return user object
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle error if needed
            // Return default user object or throw an error
          });
      },
      credentials: undefined,
    }),

    // ...add more providers here
  ],

  callbacks: {
    async signIn(params) {
      console.log('paramssssssssssssssssssssssssssssssssssssssssssssss: ');
      console.log(params);
      if (!params?.user?.id || parseInt(params?.user?.id) === -1) {
        const payload = jwt.sign(
          { username: params?.user?.email, display_name: params?.user?.name },
          process.env.NEXT_PUBLIC_JWT_SECRET,
          { expiresIn: '1h' }
        );
        return `/auth/register/?payload=${payload}`;
      }

      return true;
    },
    //first it run the jwt function, the jwt function will return the token , then in the session function we can access the token
    async jwt({ token, user, trigger, session }) {
      console.log('🚀 ~ file: options.ts:154 ~ jwt ~ user:', user);
      console.log('🚀 ~ file: options.ts:154 ~ jwt ~ token:', token);
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      //user is from the oauth config or in the credentials setting options

      //return final token
      return token;
    },
    async session({ token, session }) {
      // if (!userFind) {
      //   return {
      //     redirectTo: `/auth/login?email=${session?.user.email}&name=${session?.user.name}`,
      //   };
      // }
      console.log('token in sessionnnnnnnnnnnnnnnnn: ', token);
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { display_name: string }).name = token.name as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { username: string }).email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
export default options;
