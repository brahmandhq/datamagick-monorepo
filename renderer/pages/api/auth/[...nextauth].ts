import { getCreateUserQuery } from "@/utils/db";
import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

const getUserId = async ({ email, name, picture }) => {
  let userId;
  let subId;
  let subName;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      customers: {
        include: {
          subscription: true,
        },
      },
    },
  });
  if (!user) {
    const user = await getCreateUserQuery(prisma, { email, name, picture });
    userId = Number(user.id);

    return { userId, subId, subName };
  }

  const firstCustomerWithActiveSubscription = user.customers.find(
    (customer) => customer?.subscription?.status == "active"
  );
  if (firstCustomerWithActiveSubscription) {
    subId = firstCustomerWithActiveSubscription.subscription.stripeId;
    subName =
      firstCustomerWithActiveSubscription.subscription.stripeProductName;
  }

  userId = Number(user.id);
  return { userId, subId, subName };
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  jwt: {
    //@ts-ignore
    encryption: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    redirect() {
      return "/dashboard";
    },
    async jwt({ token, account }) {
      const { email, name, picture } = token;

      try {
        const { userId, subId, subName } = await getUserId({
          email,
          name,
          picture,
        });

        token = { ...token, ...{ userId, subId, subName } };

        if (account) {
          token.accessToken = account.access_token;
        }

        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        throw error;
      }
    },
    async session({ session, token }) {
      if (token) {
        const { subId, subName } = token;

        try {
          return {
            ...session,
            user: { ...session.user, subId, subName },
          };
        } catch (error) {
          console.error("Error in Session callback:", error);
          throw error;
        }
      } else {
        console.error("Token is undefined in Session callback");
        return session;
      }
    },
  },
  debug: true,
});
