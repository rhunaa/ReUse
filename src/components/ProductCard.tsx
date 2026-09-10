import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  nome: string;
  categoria: string;
  imagemUrl: string | null;
  pausado?: boolean;
};

export function ProductCard({ id, nome, categoria, imagemUrl, pausado }: ProductCardProps) {
  return (
    <Link
      href={`/produtos/${id}`}
      className={`flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${pausado ? "opacity-60" : ""}`}
    >
      {imagemUrl ? (
        <Image
          src={imagemUrl}
          alt={nome}
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[#D8F2DD] text-center text-xs font-bold text-[#1F5D35]">
          Sem imagem
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-lg font-extrabold text-[#1F2D22]">{nome}</p>
        <span className="mt-1 inline-block rounded-full bg-[#CFEED8] px-3 py-1 text-xs font-bold text-[#1F5D35]">
          {categoria}
        </span>
        {pausado && (
          <span className="mt-1 ml-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            Pausado
          </span>
        )}
      </div>
    </Link>
  );
}
