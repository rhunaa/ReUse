import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verificar } from "@/lib/sessionToken";

const ROTAS_PUBLICAS = ["/login", "/cadastro"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ROTAS_PUBLICAS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const usuarioId = token ? verificar(token) : null;

  if (!usuarioId) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};
