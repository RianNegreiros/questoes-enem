# Questões ENEM

Aplicação web para responder questões do ENEM, acompanhar histórico. 

## Tecnologias

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Better Auth](https://www.better-auth.com/)
- [Resend](https://resend.com/)

## Pré-requisitos

- Node.js >= 18.x
- Docker (opcional, para ambiente containerizado)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/riannegreiros/questoes-enem.git
   cd questoes-enem
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=https://enem-api-woad.vercel.app/v1 # URL da API de questões
DATABASE_URL="postgresql://postgres:postgres@db:5432/questoes_enem_dev" # String de conexão do banco
BETTER_AUTH_SECRET= # Chave secreta do Better Auth
BETTER_AUTH_URL=http://localhost:3000 # URL do Better Auth
GOOGLE_CLIENT_ID= # ID do cliente Google
GOOGLE_CLIENT_SECRET= # Segredo do cliente Google
RESEND_API_KEY= # Chave da API Resend
RESEND_DOMAIN= # Domínio Resend
```

> Consulte a documentação dos serviços para obter as credenciais:
> - [Better Auth: Variáveis de ambiente](https://www.better-auth.com/docs/installation#set-environment-variables)
> - [Credenciais Google](https://www.better-auth.com/docs/authentication/google#get-your-google-credentials)
> - [Resend API key](https://resend.com/docs/dashboard/api-keys/introduction)

## Banco de Dados

Sincronize o banco de dados localmente:

```bash
npx prisma db push
```

> Para produção, utilize migrations:
> ```bash
> npx prisma migrate deploy
> ```

## Uso

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Usando Docker

```bash
docker compose up -d
```

Acesse em [http://localhost:3000](http://localhost:3000).

## Agradecimento

Esta aplicação utiliza uma API baseada em um fork do repositório [yunger7/enem-api](https://github.com/yunger7/enem-api), com a adição de um endpoint para buscar questões por disciplina. Agradecimento ao autor original pelo excelente trabalho!
