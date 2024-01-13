import prisma from "@/server/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const adapter = PrismaAdapter(prisma);

export const authOptions: AuthOptions = {

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    CredentialsProvider({
      id: "signup",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "passsword",
        },
        name: {
          label: "Name",
          type: "text",
        },
      },

      async authorize(credentials, req) {
        // check if the user exists
        const user = await adapter.getUserByEmail!(credentials?.email!);
        if (user) throw new Error("User with email already exists!");

        // hash password, create user
        const hashedPassword = await bcrypt.hash(credentials?.password!, 10);
        const newUser = await adapter.createUser!({
          email: credentials?.email!,
          emailVerified: null,
          name: credentials?.name,
          id: ""
        });

        try {
          // create new account
          await prisma.account.create({
            data: {
              userId: newUser.id,
              providerAccountId: newUser.id,
              type: "credentials",
              provider: "credentials",
              password: hashedPassword,
            },
          });
        } catch (error) {
          console.error(error);
          throw new Error("Unable to create new user at this time!");
        }

        return newUser;
      },
    }),

    CredentialsProvider({
      id: "signin",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, req) {
        const user = await adapter.getUserByEmail!(credentials?.email!);

        if (!user) throw new Error("Incorrect credentials provided.");

        // compare the password with the password saved
        const savedHashedPassword = await prisma.account.findFirst({
          where: { userId: user.id },
        });

        if (!savedHashedPassword || !savedHashedPassword.password)
          throw new Error("Incorrect credentials provided.");

        const compared = await bcrypt.compare(
          credentials?.password!,
          savedHashedPassword?.password!
        );

        // if true, auth success, else fail
        if (compared) {
          return user;
        } else throw new Error("Incorrect credentials provided.");
      },
    }),
  ],
};

export default NextAuth(authOptions);