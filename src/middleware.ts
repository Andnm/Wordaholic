import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import {
  isExpiredTimeToken,
  isExpiredTimeTokenSecondHandle,
} from "../utils/helpers";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any;

  switch (pathname) {
    case "/login":
      if (
        token
        //XEM LẠI BUG CHỖ NÀY SAU
        // &&
        // (isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        //   isExpiredTimeTokenSecondHandle(token.iat, token.exp))
      )
        return NextResponse.redirect(`${origin}`);
      break;
    case "/register":
      if (
        token
        //XEM LẠI BUG CHỖ NÀY SAU
        // &&
        // (isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        //   isExpiredTimeTokenSecondHandle(token.iat, token.exp))
      )
        return NextResponse.redirect(`${origin}`);
      break;
    case "/":
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
    case "/play":
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
    case "/play/multiplayer":
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
    case `/play/multiplayer/[id]`:
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
    case "/play/playwithbot":
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
    case "/shop":
      if (
        !token ||
        isExpiredTimeToken(token.loginDate, token.expiresIn) ||
        isExpiredTimeTokenSecondHandle(token.iat, token.exp)
      ) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
  }
}
