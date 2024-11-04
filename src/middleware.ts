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

  const checkToken = () => {
    return (
      !token ||
      isExpiredTimeToken(token.loginDate, token.expiresIn) ||
      isExpiredTimeTokenSecondHandle(token.iat, token.exp)
    );
  };

  switch (pathname) {
    case "/login":
    case "/register":
      if (token) {
        return NextResponse.redirect(`${origin}`);
      }
      break;
    case "/":
    case "/play":
    case "/shop":
      if (checkToken()) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
      break;
    case `/play/multiplayer`:
    case `/play/playwithbot`:
      if (checkToken()) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
      }
      break;
    default:
      if (pathname.startsWith("/play/multiplayer/")) {
        if (checkToken()) {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
        }
      }
      break;
  }
}
