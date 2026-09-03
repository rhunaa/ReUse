"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, inputClass } from "@/components/Button";
import { criarProduto, type EstadoProduto } from "./actions";

const estadoInicial: EstadoProduto = {};

export default function NovoProdutoPage() {
  const [estado, formAction, pendente] = useActionState(
    criarProduto,
    estadoInicial,
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/produtos" className="font-bold text-[#1F5D35]">
        ← Voltar
      </Link>

      <h1 className="mt-5 text-4xl font-black text-[#1F2D22]">Cadastrar produto</h1>
      <p className="mt-2 text-[#68736B]">Adicione um item para doação ou troca.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input
          className={inputClass}
          type="text"
          name="nome"
          placeholder="Nome do produto"
          required
        />
        <input
          className={inputClass}
          type="text"
          name="categoria"
          placeholder="Categoria"
          required
        />
        <textarea
          className={`${inputClass} h-32 resize-none`}
          name="descricao"
          placeholder="Descrição"
          required
        />
        <input
          className={inputClass}
          type="file"
          name="imagem"
          accept="image/*"
          capture="environment"
        />

        {estado.erro && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {estado.erro}
          </p>
        )}

        <Button type="submit" disabled={pendente}>
          {pendente ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>
    </div>
  );
}
