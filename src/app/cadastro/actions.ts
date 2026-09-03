"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { criarSessao } from "@/lib/session";

export type EstadoCadastro = { erro?: string };

export async function cadastrar(
  _estadoAnterior: EstadoCadastro,
  formData: FormData,
): Promise<EstadoCadastro> {
  const nome = formData.get("nome")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const senha = formData.get("senha")?.toString();

  if (!nome || !email || !senha) {
    return { erro: "Preencha nome, e-mail e senha." };
  }
  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return { erro: "Já existe uma conta com esse e-mail. Faça login." };
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaCriptografada },
  });

  await criarSessao(usuario.id);
  redirect("/");
}
