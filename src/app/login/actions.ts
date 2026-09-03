"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { criarSessao, encerrarSessao } from "@/lib/session";

export type EstadoLogin = { erro?: string };

export async function entrar(
  _estadoAnterior: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const senha = formData.get("senha")?.toString();

  if (!email || !senha) {
    return { erro: "Preencha e-mail e senha." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaValida = usuario
    ? await bcrypt.compare(senha, usuario.senha)
    : false;

  if (!usuario || !senhaValida) {
    return { erro: "E-mail ou senha inválidos." };
  }

  await criarSessao(usuario.id);
  redirect("/");
}

export async function sair() {
  await encerrarSessao();
  redirect("/login");
}
