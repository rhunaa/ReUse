import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/session";
import { pausarProduto, reativarProduto } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function PerfilPage({ params }: Props) {
  const { id } = await params;

  const [usuario, usuarioLogado] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id },
      include: { produtos: { orderBy: { criadoEm: "desc" } } },
    }),
    usuarioAtual(),
  ]);

  if (!usuario) notFound();

  const ehDono = usuarioLogado?.id === usuario.id;
  const produtos = ehDono
    ? usuario.produtos
    : usuario.produtos.filter((p) => p.ativo);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/produtos" className="font-bold text-[#1F5D35]">
        ← Voltar
      </Link>

      <div className="mt-5 rounded-3xl bg-white p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CFEED8] text-2xl font-black text-[#1F5D35]">
          {usuario.nome.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-black text-[#1F2D22]">{usuario.nome}</h1>
        <p className="text-[#68736B]">{usuario.email}</p>
        <p className="mt-1 text-sm text-[#68736B]">
          Membro desde {usuario.criadoEm.toLocaleDateString("pt-BR")}
        </p>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-black text-[#1F2D22]">
        Produtos publicados ({produtos.length})
      </h2>

      <div className="flex flex-col gap-3">
        {produtos.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-center text-[#68736B]">
            {ehDono
              ? "Você ainda não publicou produtos."
              : "Este usuário ainda não publicou produtos."}
          </p>
        ) : (
          produtos.map((produto) => (
            <div key={produto.id} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <ProductCard
                  id={produto.id}
                  nome={produto.nome}
                  categoria={produto.categoria}
                  imagemUrl={produto.imagemUrl}
                  pausado={!produto.ativo}
                />
              </div>
              {ehDono && (
                <form
                  action={
                    produto.ativo
                      ? pausarProduto.bind(null, produto.id)
                      : reativarProduto.bind(null, produto.id)
                  }
                >
                  <button
                    type="submit"
                    className="shrink-0 rounded-full border border-[#1F5D35] px-4 py-2 text-xs font-bold text-[#1F5D35] hover:bg-[#1F5D35] hover:text-white"
                  >
                    {produto.ativo ? "Pausar" : "Reativar"}
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
