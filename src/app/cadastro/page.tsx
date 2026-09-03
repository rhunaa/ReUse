"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, inputClass } from "@/components/Button";
import { cadastrar, type EstadoCadastro } from "./actions";

const estadoInicial: EstadoCadastro = {};

export default function CadastroPage() {
  const [estado, formAction, pendente] = useActionState(cadastrar, estadoInicial);

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-4xl font-black text-[#1F2D22]">Criar conta</h1>
      <p className="mt-2 text-[#68736B]">
        Crie sua conta para doar e trocar produtos.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input
          className={inputClass}
          type="text"
          name="nome"
          placeholder="Seu nome"
          required
        />
        <input
          className={inputClass}
          type="email"
          name="email"
          placeholder="Seu e-mail"
          required
        />
        <input
          className={inputClass}
          type="password"
          name="senha"
          placeholder="Crie uma senha (mín. 6 caracteres)"
          minLength={6}
          required
        />

        {estado.erro && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {estado.erro}
          </p>
        )}

        <Button type="submit" disabled={pendente}>
          {pendente ? "Criando..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#68736B]">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-[#1F5D35]">
          Entrar
        </Link>
      </p>
    </div>
  );
}
