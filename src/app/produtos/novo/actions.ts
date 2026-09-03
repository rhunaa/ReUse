"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { redirect } from "next/navigation";
import path from "path";
import { usuarioAtual } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export type EstadoProduto = { erro?: string };

export async function criarProduto(
  _estadoAnterior: EstadoProduto,
  formData: FormData,
): Promise<EstadoProduto> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/login");

  const nome = formData.get("nome")?.toString().trim();
  const categoria = formData.get("categoria")?.toString().trim();
  const descricao = formData.get("descricao")?.toString().trim();
  const imagem = formData.get("imagem") as File | null;

  if (!nome || !categoria || !descricao) {
    return { erro: "Preencha todos os campos obrigatórios." };
  }

  let imagemUrl: string | null = null;
  if (imagem && imagem.size > 0) {
    const bytes = Buffer.from(await imagem.arrayBuffer());
    const extensao = path.extname(imagem.name) || ".jpg";
    const nomeArquivo = `${randomUUID()}${extensao}`;
    const pastaUploads = path.join(process.cwd(), "public", "uploads");
    await mkdir(pastaUploads, { recursive: true });
    await writeFile(path.join(pastaUploads, nomeArquivo), bytes);
    imagemUrl = `/uploads/${nomeArquivo}`;
  }

  const produto = await prisma.produto.create({
    data: { nome, categoria, descricao, imagemUrl, usuarioId: usuario.id },
  });

  redirect(`/produtos/${produto.id}`);
}
