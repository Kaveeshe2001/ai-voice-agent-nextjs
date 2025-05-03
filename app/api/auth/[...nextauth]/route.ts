import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      console.log("User: ", user);
      console.log("Account: ", account);

      if (account?.provider === "google") {
        const { name, email, image } = user;
        try {
          const res = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              image,
            }),
          });

          if (res.ok) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
