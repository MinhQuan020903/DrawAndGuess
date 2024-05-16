import { AuthOptions, getServerSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
// import { access } from 'fs';
import apiAuthSignIn from '@/utils/auth';
import { JWT } from 'next-auth/jwt';
const options: AuthOptions = {
  //SIGN IN CHAY TRUOC JWT, TRONG SIGNIN SE RETURN 1 THANG USER, JWT CHAY TRUOC SESSION
  // Configure one or more authentication providers

  providers: [
    // DiscordProvider({
    //   clientId: String(process.env.DISCORD_CLIENT_ID),
    //   clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
    //   async profile(profile) {
    //     console.log('profile in discord: ', profile);
    //     //cai profile nay se truyen xuong jwt function
    //     // const user = await prisma.user.findUnique({
    //     //   where: {
    //     //     username: profile.email,
    //     //   },
    //     // });
    //     // Define user object structure
    //     fetch('/api/user_info', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ username: profile.email }),
    //     })
    //       .then((response) => response.json()) // Parse JSON response
    //       .then((userData) => {
    //         // Check if userData exists and construct user object accordingly
    //         const user = userData
    //           ? {
    //               id: userData.id,
    //               display_name: userData.name,
    //               username: userData.email,
    //               role: userData.role,
    //             }
    //           : {
    //               display_name: profile.username,
    //               username: profile.email,
    //               id: -1,
    //             };
    //         console.log('user in discord: ', user);
    //         return user; // Return user object
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error);
    //         // Handle error if needed
    //         // Return default user object or throw an error
    //       });
    //   },
    // }),

    // GithubProvider({
    //   clientId: String(process.env.GITHUB_CLIENT_ID),
    //   clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    //   async profile(profile) {
    //     console.log('inside prfileeeeeeeeeeeeeee');
    //     //cai profile nay se truyen xuong jwt function
    //     // const user = await prisma.user.findUnique({
    //     //   where: {
    //     //     username: profile.email,
    //     //   },
    //     // });
    //     fetch('/api/user_info', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ username: profile.email }),
    //     })
    //       .then((response) => response.json()) // Parse JSON response
    //       .then((userData) => {
    //         // Check if userData exists and construct user object accordingly
    //         const user = userData
    //           ? {
    //               id: userData.id,
    //               display_name: userData.name,
    //               username: userData.email,
    //               role: userData.role,
    //             }
    //           : {
    //               display_name: profile.username,
    //               username: profile.email,
    //               id: -1,
    //             };
    //         console.log('user in discord: ', user);
    //         return user; // Return user object
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error);
    //         // Handle error if needed
    //         // Return default user object or throw an error
    //       });
    //   },
    // }),
    // GoogleProvider({
    //   clientId: String(process.env.GOOGLE_CLIENT_ID),
    //   clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    //   authorization: {
    //     params: {
    //       prompt: 'consent',
    //       access_type: 'offline',
    //       response_type: 'code',
    //     },
    //   },
    //   async profile(profile) {
    //     console.log('inside prfileeeeeeeeeeeeeee');
    //     //cai profile nay se truyen xuong jwt function
    //     fetch('/api/user_info', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ username: profile.email }),
    //     })
    //       .then((response) => response.json()) // Parse JSON response
    //       .then((userData) => {
    //         // Check if userData exists and construct user object accordingly
    //         const user = userData
    //           ? {
    //               id: userData.id,
    //               display_name: userData.name,
    //               username: userData.email,
    //               role: userData.role,
    //             }
    //           : {
    //               display_name: profile.username,
    //               username: profile.email,
    //               id: -1,
    //             };
    //         console.log('user in discord: ', user);
    //         return user; // Return user object
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error);
    //         // Handle error if needed
    //         // Return default user object or throw an error
    //       });
    //   },
    // }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // const { username, password } = credentials as {
        //   username: string;
        //   password: string;
        // };
        console.log('credentials in credentials: ', credentials);
        if (!credentials) {
          throw new Error('Invalid credentials');
        }
        const user = await apiAuthSignIn(credentials);
        return user;
        // const user = {
        //   access_token:
        //     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaW5oMTIzIiwiaWF0IjoxNzE1NzM1OTgyLCJleHAiOjE3MTU4MjIzODJ9.kCwFFpHAVJ4plt833aRbGEav2tZsmlHQL8jLyRSA3N8',
        //   // "refresh_token": null,
        //   id: 3,
        //   username: 'ninh123',
        //   role: 'USER',
        //   display_name: 'ninhne',
        // };
        // return {
        //   access_token:
        //     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaW5oMTIzIiwiaWF0IjoxNzE1NzM1OTgyLCJleHAiOjE3MTU4MjIzODJ9.kCwFFpHAVJ4plt833aRbGEav2tZsmlHQL8jLyRSA3N8',
        //   // "refresh_token": null,
        //   id: '3',
        //   username: 'ninh123',
        //   role: 'USER',
        //   display_name: 'ninhne',
        // };
        // fetch('/api/user_info', {
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
      // credentials: undefined,
    }),

    // ...add more providers here
    // CredentialsProvider({
    //   name: 'Credentials',
    //   credentials: {
    //     username: { label: 'Username', type: 'text' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   authorize: async (credentials) => {
    //     // Implement your authentication logic here
    //     // For example, you can verify the username and password against your database
    //     // and return the user object if the credentials are valid
    //     const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    //     return user;
    //   },
    // }),
  ],

  // callbacks: {
  //   async signIn(params) {
  //     console.log('paramssssssssssssssssssssssssssssssssssssssssssssss: ');
  //     console.log(params);
  //     if (!params?.user?.id || parseInt(params?.user?.id) === -1) {
  //       const payload = jwt.sign(
  //         { username: params?.user?.email, display_name: params?.user?.name },
  //         process.env.NEXT_PUBLIC_JWT_SECRET,
  //         { expiresIn: '1h' }
  //       );
  //       return `/auth/register/?payload=${payload}`;
  //     }

  //     return true;
  //   },
  //   //first it run the jwt function, the jwt function will return the token , then in the session function we can access the token
  //   async jwt({ token, user, trigger, session }) {
  //     console.log('🚀 ~ file: options.ts:154 ~ jwt ~ user:', user);
  //     console.log('🚀 ~ file: options.ts:154 ~ jwt ~ token:', token);
  //     if (trigger === 'update') {
  //       return { ...token, ...session.user };
  //     }
  //     if (user) {
  //       token.role = user.role;
  //       token.id = user.id;
  //       token.name = user.name;
  //       token.email = user.email;
  //       token.access_token = user.access_token;
  //     }
  //     //user is from the oauth config or in the credentials setting options

  //     //return final token
  //     return token;
  //   },
  //   async session({ token, session }) {
  //     // if (!userFind) {
  //     //   return {
  //     //     redirectTo: `/auth/login?email=${session?.user.email}&name=${session?.user.name}`,
  //     //   };
  //     // }
  //     console.log('token in sessionnnnnnnnnnnnnnnnn: ', token);
  //     if (session.user) {
  //       (session.user as { access_token: string }).access_token =
  //         token.access_token as string;
  //       (session.user as { id: string }).id = token.id as string;
  //       (session.user as { display_name: string }).name = token.name as string;
  //       (session.user as { role: string }).role = token.role as string;
  //       (session.user as { username: string }).email = token.email as string;
  //     }
  //     return session;
  //   },
  // },

  //Checkk callback
  // callbacks: {
  //   async signIn(params) {
  //     console.log('🚀 ~ signIn ~ params:', params);
  //     // if (!params?.user?.id || parseInt(params?.user?.id) === -1) {
  //     //   // const payload = jwt.sign(
  //     //   //   { email: params?.user?.email, name: params?.user?.name },
  //     //   //   process.env.NEXT_PUBLIC_JWT_SECRET,
  //     //   //   { expiresIn: '1h' }
  //     //   // );
  //     //   // return `/auth/register/?payload=${payload}`;
  //     //   return `/game/1`;
  //     // }

  //     return true;
  //   },
  //   async jwt({ token, user, trigger, session }) {
  //     console.log('🚀 ~ file: options.ts:154 ~ jwt ~ user:', user);
  //     console.log('🚀 ~ file: options.ts:154 ~ jwt ~ token:', token);
  //     if (trigger === 'update') {
  //       return { ...token, ...session.user };
  //     }
  //     if (user) {
  //       token.role = user.role;
  //       token.id = user.id;
  //       token.username = user.username;
  //       token.access_token = user.access_token;
  //       token.display_name = user.display_name;
  //     }
  //     //user is from the oauth config or in the credentials setting options

  //     //return final token
  //     return token;
  //   },
  //   // async session({ session, token, user }) {
  //   //   // Send properties to the client, like an access_token from a provider.
  //   //   return session;
  //   // },
  //   async session({ token, session }) {
  //     // if (!userFind) {
  //     //   return {
  //     //     redirectTo: `/auth/login?email=${session?.user.email}&name=${session?.user.name}`,
  //     //   };
  //     // }
  //     console.log('token in sessionnnnnnnnnnnnnnnnn: ', token);
  //     if (session.user) {
  //       (session.user as { id: string }).id = token.id as string;
  //       (session.user as { username: string }).username = token.name as string;
  //       (session.user as { role: string }).role = token.role as string;
  //       (session.user as { display_name: string }).display_name =
  //         token.display_name as string;
  //       (session.user as { access_token: string }).access_token =
  //         token.access_token as string;
  //     }
  //     return session;
  //   },
  // },
  // session: {
  //   strategy: 'jwt',
  // },
  // pages: {
  //   // signIn: '/',
  // },

  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET, // Replace with your JWT secret
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('🚀 ~ file: options.ts:154 ~ jwt ~ user:', user);
      // console.log('🚀 ~ file: options.ts:154 ~ jwt ~ token:', token);
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
        token.access_token = user.access_token;
        token.display_name = user.display_name;
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
};
export default options;
// export const getServerAuthSession = () => getServerSession(options);
