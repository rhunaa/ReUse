import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-black text-[#1F2D22]">Produtos disponíveis</h1>
      <p className="mt-2 text-[#68736B]">Itens cadastrados para doação ou troca.</p>

      <Link href="/produtos/novo" className={`${buttonClass} mt-6`}>
        Cadastrar produto
      </Link>

      <div className="mt-8 flex flex-col gap-3">
        {produtos.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-center text-[#68736B]">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          produtos.map((produto) => (
            <ProductCard
              key={produto.id}
              id={produto.id}
              nome={produto.nome}
              categoria={produto.categoria}
              imagemUrl={produto.imagemUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
