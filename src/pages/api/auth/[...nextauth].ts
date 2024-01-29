import prisma from "@/server/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    // Add other providers if needed
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Save user information to your database
      try {
        await prisma.user.upsert({
          where: { email: user.email as string },
          update: { name: user.name,
            image : user.image,
            email : user.email
            
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image
            // Add other fields as needed
          },
        });
      } catch (error) {
        console.error("Error updating database:", error);
      }
      return true; // Continue with sign-in
    },
  },
};

export default NextAuth(authOptions);
