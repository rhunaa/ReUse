import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { usuarioAtual } from "@/lib/session";
import { sair } from "@/app/login/actions";
import { ChatWidget } from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReUse! — Consumo consciente",
  description: "Doe e troque produtos que você não usa mais.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const usuario = await usuarioAtual();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#F3FAF4] text-[#1F2D22]"
        suppressHydrationWarning
      >
        <header className="border-b border-[#DDEFE2] bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href={usuario ? "/" : "/login"} className="text-xl font-black text-[#1F5D35]">
              ReUse!
            </Link>
            <nav className="flex items-center gap-6 text-sm font-semibold text-[#1F5D35]">
              {usuario ? (
                <>
                  <Link href="/">Início</Link>
                  <Link href="/produtos">Produtos</Link>
                  <Link href="/produtos/novo">Cadastrar</Link>
                  <Link href={`/perfil/${usuario.id}`}>Meu perfil</Link>
                  <form action={sair}>
                    <button type="submit" className="text-[#68736B]">
                      Sair
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">Entrar</Link>
                  <Link
                    href="/cadastro"
                    className="rounded-full bg-[#1F5D35] px-4 py-2 text-white"
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#DDEFE2] bg-white py-6 text-center text-sm text-[#68736B]">
          ReUse! — plataforma de consumo consciente
        </footer>
        {usuario && <ChatWidget />}
      </body>
    </html>
  );
}
