"use server";

import { revalidatePath } from "next/cache";
import { usuarioAtual } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function alterarStatusProduto(produtoId: string, ativo: boolean) {
  const usuario = await usuarioAtual();
  if (!usuario) throw new Error("Você precisa estar logado.");

  const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
  if (!produto || produto.usuarioId !== usuario.id) {
    throw new Error("Produto não encontrado ou não pertence a você.");
  }

  await prisma.produto.update({ where: { id: produtoId }, data: { ativo } });
  revalidatePath(`/perfil/${usuario.id}`);
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${produtoId}`);
}

export async function pausarProduto(produtoId: string) {
  await alterarStatusProduto(produtoId, false);
}

export async function reativarProduto(produtoId: string) {
  await alterarStatusProduto(produtoId, true);
}
