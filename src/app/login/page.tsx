"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, inputClass } from "@/components/Button";
import { entrar, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = {};

export default function LoginPage() {
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-4xl font-black text-[#1F2D22]">Entrar</h1>
      <p className="mt-2 text-[#68736B]">Acesse sua conta ReUse!.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
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
          placeholder="Sua senha"
          required
        />

        {estado.erro && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {estado.erro}
          </p>
        )}

        <Button type="submit" disabled={pendente}>
          {pendente ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#68736B]">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-[#1F5D35]">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
