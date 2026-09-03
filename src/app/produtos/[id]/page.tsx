import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function ProdutoDetalhePage({ params }: Props) {
  const { id } = await params;

  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { usuario: true },
  });

  if (!produto) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/produtos" className="font-bold text-[#1F5D35]">
        ← Voltar
      </Link>

      {produto.imagemUrl ? (
        <Image
          src={produto.imagemUrl}
          alt={produto.nome}
          width={600}
          height={320}
          className="mt-5 h-[260px] w-full rounded-3xl object-cover"
          unoptimized
        />
      ) : (
        <div className="mt-5 flex h-[260px] w-full items-center justify-center rounded-3xl bg-[#D8F2DD] font-extrabold text-[#1F5D35]">
          Sem imagem
        </div>
      )}

      <h1 className="mt-6 text-3xl font-black text-[#1F2D22]">{produto.nome}</h1>

      <span className="mt-3 inline-block rounded-full bg-[#CFEED8] px-4 py-2 text-sm font-extrabold text-[#1F5D35]">
        {produto.categoria}
      </span>

      <h2 className="mt-6 text-lg font-black text-[#1F2D22]">Descrição</h2>
      <p className="mt-2 leading-relaxed text-[#68736B]">{produto.descricao}</p>

      <p className="mt-6 text-sm text-[#68736B]">
        Publicado por{" "}
        <Link href={`/perfil/${produto.usuario.id}`} className="font-bold text-[#1F5D35]">
          {produto.usuario.nome}
        </Link>
      </p>
    </div>
  );
}
