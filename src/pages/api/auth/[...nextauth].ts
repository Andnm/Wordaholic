import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import moment from "moment";
import customer from "@services/customer";
import { jwtDecode } from "jwt-decode";
import { ROLE_ADMIN, ROLE_CUSTOMER } from "@utils/constants";

interface DecodedToken {
  fullname: string;
  email: string;
  role_name: string;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "cus_credentials",
      name: "CusCredentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, role }: any = credentials;
        var result;

        result = await customer.loginWithCustomerEmail(email, password);

        if (result) {
          const decodedToken = jwtDecode<DecodedToken>(result.accessToken);
          const user = {
            id: result.userId,
            name: decodedToken.fullname,
            access_token: result.accessToken,
            expiresIn: result.expiresIn,
            loginDate: moment().format(),
            userId: result.userId,
            userName: result.userName,
            tokenType: result.tokenType,
            email: decodedToken.email,
            roles: decodedToken.role_name,
          } as User;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user, account }) {
      if (user) {
        token.access_token = user.access_token;
        token.expiresIn = user.expiresIn;
        token.loginDate = user.loginDate;
        token.email = user.email;
        token.userId = user.userId;
        token.userName = user.userName;
        token.roles = user.roles;
        token.name = user.name;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }

      // if (account && account.provider === "google") {
      //   const googleAccessToken = account.id_token!;
      //   token.access_token = googleAccessToken;
      // }

      if (account?.provider === "google") {
        const googleAccessToken = account.id_token!;

        try {
          const result = await customer.loginWithGoogle(googleAccessToken);

          token.access_token = result.accessToken;
        } catch (err) {
          console.log("err: ", err);
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      // console.log("token in session: ", token);
      if (session) {
        session.expires = moment(token.loginDate)
          .add(token.expiresIn, "seconds")
          .toDate();
        session.user.access_token = token.access_token;
        session.user.fullname = token.name!;
        // session.user.email = token.email;
        session.user.userName = token.userName;
        session.user.userId = token.userId;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
