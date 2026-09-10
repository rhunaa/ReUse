import { NextResponse } from "next/server";
import { usuarioAtual } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { criarSessaoWatson, enviarMensagemWatson } from "@/lib/watson";
import { extrairNomeCandidato } from "./produtoPorNome";

async function tratarPausarOuReativar(
  usuarioId: string,
  mensagem: string,
  ativar: boolean,
): Promise<string> {
  const candidato = extrairNomeCandidato(mensagem);

  const produtos = await prisma.produto.findMany({
    where: { usuarioId, ativo: !ativar },
  });

  const correspondentes = candidato
    ? produtos.filter((p) => p.nome.toLowerCase().includes(candidato))
    : produtos;

  if (correspondentes.length === 0) {
    return ativar
      ? "Não encontrei nenhum produto pausado seu com esse nome. Diga 'quais produtos eu publiquei' para ver a lista."
      : "Não encontrei nenhum produto seu com esse nome para pausar. Diga 'quais produtos eu publiquei' para ver a lista.";
  }

  if (correspondentes.length > 1) {
    const nomes = correspondentes.map((p) => `"${p.nome}"`).join(", ");
    return `Encontrei mais de um produto parecido: ${nomes}. Pode dizer o nome completo?`;
  }

  const produto = correspondentes[0];
  await prisma.produto.update({
    where: { id: produto.id },
    data: { ativo: ativar },
  });

  return ativar
    ? `Pronto! O produto "${produto.nome}" foi reativado e já aparece de novo no catálogo.`
    : `Pronto! O produto "${produto.nome}" foi pausado e não aparece mais no catálogo público.`;
}

async function tratarListarProdutos(usuarioId: string): Promise<string> {
  const produtos = await prisma.produto.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
  });

  if (produtos.length === 0) {
    return "Você ainda não publicou nenhum produto. Diga 'como cadastrar um produto' se quiser saber como.";
  }

  const lista = produtos
    .map((p) => `- ${p.nome} (${p.ativo ? "ativo" : "pausado"})`)
    .join("\n");

  return `Você publicou ${produtos.length} produto(s):\n${lista}`;
}

export async function POST(request: Request) {
  const usuario = await usuarioAtual();
  if (!usuario) {
    return NextResponse.json(
      { erro: "Você precisa estar logado para conversar com o assistente." },
      { status: 401 },
    );
  }

  const { mensagem, sessionId } = await request.json();
  if (!mensagem || typeof mensagem !== "string") {
    return NextResponse.json({ erro: "Mensagem inválida." }, { status: 400 });
  }

  try {
    const sessaoAtual = sessionId ?? (await criarSessaoWatson());
    const resposta = await enviarMensagemWatson(sessaoAtual, mensagem);

    let texto = resposta.texto;

    if (resposta.intent === "pausar_produto") {
      texto = await tratarPausarOuReativar(usuario.id, mensagem, false);
    } else if (resposta.intent === "reativar_produto") {
      texto = await tratarPausarOuReativar(usuario.id, mensagem, true);
    } else if (resposta.intent === "listar_produtos") {
      texto = await tratarListarProdutos(usuario.id);
    }

    return NextResponse.json({ texto, sessionId: sessaoAtual });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json(
      { erro: "Não consegui falar com o assistente agora. Tente novamente em instantes." },
      { status: 502 },
    );
  }
}
