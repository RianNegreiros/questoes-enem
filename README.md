# Questões ENEM

Aplicação para responder questões do ENEM.

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/riannegreiros/questoes-enem.git
   cd questoes-enem
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=https://api.enem.dev/v1

DATABASE_URL=

BETTER_AUTH_SECRET= # Sua chave secreta do Better Auth
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID= # ID do cliente Google
GOOGLE_CLIENT_SECRET= # Segredo do cliente Google
FACEBOOK_CLIENT_ID= # ID do cliente Facebook
FACEBOOK_CLIENT_SECRET= # Segredo do cliente Facebook
```

Para obter as credenciais necessárias, consulte:
- [Better Auth: Variáveis de ambiente](https://www.better-auth.com/docs/installation#set-environment-variables)
- [Credenciais Facebook](https://www.better-auth.com/docs/authentication/facebook#get-your-facebook-credentials)
- [Credenciais Google](https://www.better-auth.com/docs/authentication/google#get-your-google-credentials)

## Uso
Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```
Acesse em [http://localhost:3000](http://localhost:3000).

## Tecnologias
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- Better Auth
