# ReUse! — Plataforma Web

Versão web da plataforma **ReUse!**, desenvolvida com **Next.js** e integrada a um banco de dados **PostgreSQL** através do **Prisma ORM**. O objetivo desta fase não foi recriar todo o aplicativo mobile na web, e sim disponibilizar as áreas mais importantes da plataforma (catálogo de produtos, cadastro de itens e perfil do usuário) como uma via de acesso adicional para o usuário final.

## Tecnologias utilizadas

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM 7**
- **PostgreSQL** (hospedado no [Neon](https://neon.com))
- **bcryptjs** para criptografia de senha

## Como rodar o projeto localmente

1. Instalar as dependências:
   ```bash
   npm install
   ```
2. Criar um arquivo `.env` na raiz do projeto (use o `.env.example` como modelo) com as variáveis:
   ```
   DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
   AUTH_SECRET="uma-chave-secreta-qualquer"
   ```
   Esse arquivo não é enviado ao GitHub (está no `.gitignore`), pois contém a senha do banco de dados. Cada pessoa que for rodar o projeto cria o seu próprio.
3. Criar as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev
   ```
4. Rodar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acessar [http://localhost:3000](http://localhost:3000)

---

## 1. Desenvolvimento Next.js — Telas e objetivos

Todas as rotas foram construídas com o **App Router** do Next.js, combinando Server Components (para leitura de dados) e Server Actions (para escrita de dados), sem necessidade de uma API separada.

| Tela | Rota | Objetivo |
|---|---|---|
| **Entrar** | `/login` | Autenticar um usuário já cadastrado (e-mail + senha) e iniciar a sessão. |
| **Criar conta** | `/cadastro` | Cadastrar um novo usuário na plataforma. |
| **Início** | `/` | Página inicial com a proposta da plataforma (doar/trocar) e o total de produtos cadastrados. |
| **Produtos disponíveis** | `/produtos` | Lista todos os produtos cadastrados por qualquer usuário, disponíveis para doação ou troca. |
| **Detalhe do produto** | `/produtos/[id]` | Exibe as informações completas de um produto específico e quem o publicou. |
| **Cadastrar produto** | `/produtos/novo` | Formulário para o usuário logado publicar um novo item, incluindo upload de imagem. |
| **Perfil do usuário** | `/perfil/[id]` | Exibe os dados de um usuário e a lista de produtos publicados por ele. |

Toda a plataforma é protegida por autenticação: apenas as telas de **Entrar** e **Criar conta** são públicas — as demais só podem ser acessadas por um usuário logado (verificação feita em `src/proxy.ts`, o arquivo de middleware do Next.js).

## 2. Prisma ORM — Aplicação nas telas

O Prisma Client é utilizado diretamente dentro dos Server Components e Server Actions, sem passar por uma API REST intermediária. Ele aparece em praticamente todas as telas:

| Tela | Uso do Prisma |
|---|---|
| **Início** | `prisma.produto.count()` — conta o total de produtos cadastrados para exibir o número real na plataforma. |
| **Produtos disponíveis** | `prisma.produto.findMany()` — busca todos os produtos, ordenados pelos mais recentes. |
| **Detalhe do produto** | `prisma.produto.findUnique()` com `include` — busca um produto pelo id, já trazendo os dados do usuário dono junto (relação). |
| **Cadastrar produto** | `prisma.produto.create()` — grava o novo produto no banco, associado ao usuário logado. |
| **Perfil do usuário** | `prisma.usuario.findUnique()` com `include` — busca o usuário e, na mesma consulta, todos os produtos publicados por ele. |
| **Criar conta** | `prisma.usuario.findUnique()` (verifica se o e-mail já existe) e `prisma.usuario.create()` (cria o usuário com a senha já criptografada). |
| **Entrar** | `prisma.usuario.findUnique()` — busca o usuário pelo e-mail para conferir a senha. |

## 3. Banco de dados — Tabelas e objetivos

O banco de dados é PostgreSQL, com as tabelas geradas automaticamente pelas migrations do Prisma (`prisma/migrations`), a partir do modelo definido em `prisma/schema.prisma`.

### Tabela `Usuario`

Armazena as pessoas cadastradas na plataforma.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (chave primária) | Identificador único do usuário. |
| `nome` | String | Nome do usuário. |
| `email` | String (único) | E-mail usado para login. |
| `senha` | String | Senha criptografada (bcrypt). |
| `criadoEm` | DateTime | Data de criação da conta. |

### Tabela `Produto`

Armazena os itens disponibilizados para doação ou troca.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (chave primária) | Identificador único do produto. |
| `nome` | String | Nome do produto. |
| `categoria` | String | Categoria do produto (ex: Móveis, Roupas). |
| `descricao` | String | Descrição do produto. |
| `imagemUrl` | String (opcional) | Caminho da imagem enviada pelo usuário. |
| `criadoEm` | DateTime | Data de publicação do produto. |
| `usuarioId` | String (chave estrangeira) | Referência ao usuário que publicou o produto. |

A relação entre as duas tabelas é **1:N** — um usuário pode publicar vários produtos, e cada produto pertence a exatamente um usuário.
