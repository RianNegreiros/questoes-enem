# Questões ENEM

Aplicação web para praticar questões do ENEM com histórico de respostas.

## Funcionalidades

- Questões do ENEM organizadas por ano e disciplina
- Histórico de respostas com filtros
- Autenticação via Google ou email (OTP)
- Progresso salvo por usuário

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Autenticação**: Better Auth
- **Email**: Resend

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

3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env.local
   ```

4. Configure o banco de dados:

   ```bash
   npx prisma db push
   ```

5. Execute o projeto:
   ```bash
   npm run dev
   ```

## Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/questoes_enem_dev"
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
RESEND_DOMAIN=your_domain.com
```

## Docker

Para executar com Docker:

```bash
docker compose up -d
```

Acesse em `http://localhost:3000`

## API

A aplicação consome a API do repositório [enem-api](https://github.com/RianNegreiros/enem-api.git) para buscar provas e questões do ENEM.
