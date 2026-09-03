import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { assinar, COOKIE_NAME, verificar } from "@/lib/sessionToken";

export async function criarSessao(usuarioId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, assinar(usuarioId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function encerrarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function usuarioIdLogado(): Promise<string | null> {
  const cookieStore = await cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  if (!valor) return null;
  return verificar(valor);
}

export async function usuarioAtual() {
  const id = await usuarioIdLogado();
  if (!id) return null;
  return prisma.usuario.findUnique({ where: { id } });
}
