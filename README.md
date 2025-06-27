# Questões ENEM

Aplicação web para praticar questões do ENEM e acompanhar o histórico de respostas do usuário.

## Funcionalidades

- Responder questões do ENEM por ano e disciplina
- Histórico de respostas com filtros
- Autenticação via Google ou email com One-Time Password (OTP)
- Progresso salvo por usuário

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Better Auth (autenticação)
- Resend (envio de emails)

## Pré-requisitos

- Node.js >= 18.x
- Docker (opcional)

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

## Configuração

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=https://api.enem.dev/v1
DATABASE_URL="postgresql://postgres:postgres@db:5432/questoes_enem_dev"
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
RESEND_DOMAIN=
```

Consulte a documentação dos serviços para obter as credenciais:

- Better Auth: https://www.better-auth.com/docs/installation#set-environment-variables
- Google: https://www.better-auth.com/docs/authentication/google#get-your-google-credentials
- Resend: https://resend.com/docs/dashboard/api-keys/introduction

## Banco de Dados

Sincronize o banco de dados localmente:

```bash
npx prisma db push
```

Para produção, use:

```bash
npx prisma migrate deploy
```

## Uso

### Desenvolvimento

```bash
npm run dev
```

### Docker

```bash
docker compose up -d
```

Acesse em `http://localhost:3000`

## API de Questões

A aplicação consome a API do repositório `https://github.com/RianNegreiros/enem-api.git` para buscar provas e questões do ENEM. [Documentação Original](https://docs.enem.dev/introduction) (Sem filtro de questões por disciplina)

## Agradecimento

Esta aplicação utiliza uma API baseada em um fork do repositório [yunger7/enem-api](https://github.com/yunger7/enem-api), com a adição de um endpoint para buscar questões por disciplina.
