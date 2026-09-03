import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const totalProdutos = await prisma.produto.count();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-black text-[#1F2D22]">Olá!</h1>
      <p className="mt-2 max-w-md text-[#68736B]">
        Faça parte do consumo consciente reutilizando produtos.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="min-h-[155px] rounded-3xl bg-[#CFEED8] p-5">
          <span className="text-2xl">♻️</span>
          <p className="mt-4 text-lg font-extrabold text-[#263A2A]">Doar</p>
          <p className="mt-2 text-sm leading-relaxed text-[#526156]">
            Dê uma nova vida para produtos que você não usa mais.
          </p>
        </div>
        <div className="min-h-[155px] rounded-3xl bg-[#FFF1B8] p-5">
          <span className="text-2xl">🔄</span>
          <p className="mt-4 text-lg font-extrabold text-[#263A2A]">Trocar</p>
          <p className="mt-2 text-sm leading-relaxed text-[#526156]">
            Encontre pessoas interessadas em trocar itens de forma consciente.
          </p>
        </div>
      </div>

      <div className="mt-4 min-h-[170px] rounded-3xl bg-[#263A2A] p-5">
        <span className="text-2xl">🌱</span>
        <p className="mt-4 text-xl font-extrabold text-white">Consumo consciente</p>
        <p className="mt-2 leading-relaxed text-[#DDEFE2]">
          O ReUse ajuda a reduzir o desperdício conectando pessoas e produtos que
          ainda podem ser utilizados.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-[#263A2A]">Impacto da comunidade</h2>
        <div className="rounded-3xl bg-white p-6">
          <p className="text-sm text-[#7B857E]">Produtos cadastrados na plataforma</p>
          <p className="text-4xl font-extrabold text-[#263A2A]">
            {totalProdutos.toLocaleString("pt-BR")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#6B756D]">
            Itens que poderiam ser descartados ganharam uma nova utilidade.
          </p>
        </div>
      </div>

      <Link href="/produtos" className={`${buttonClass} mt-8`}>
        Ver produtos
      </Link>
    </div>
  );
}
