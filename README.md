# Portal do Cliente TRR - Monorepo

Projeto refatorado em arquitetura **Monorepo** com separação clara entre Frontend e Backend.

## 📁 Estrutura do Projeto

```
portal-trr/
├── web/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Componentes organizados por módulo
│   │   │   ├── finance/
│   │   │   ├── crm/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── context/          # Contextos React
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API calls (api.ts)
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── server/                   # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/      # Lógica das rotas
│   │   ├── routes/           # Definição de rotas
│   │   ├── services/         # Lógica de negócio
│   │   ├── lib/              # Utilitários (Prisma)
│   │   ├── types/            # TypeScript types
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env
│
└── package.json              # Workspace root

```

## 🚀 Como Executar

### Pré-requisitos
- Node.js >= 18.0.0
- npm ou yarn

### 1. Instalar Dependências

```bash
# Instalar dependências de todos os workspaces
npm install
```

### 2. Configurar Variáveis de Ambiente

#### Frontend (`/web/.env`)
```env
VITE_API_URL=http://localhost:3333
GEMINI_API_KEY=your_api_key_here
```

#### Backend (`/server/.env`)
```env
DATABASE_URL="file:./dev.db"
PORT=3333
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Executar o Projeto

#### Modo Desenvolvimento (Frontend + Backend simultaneamente)
```bash
npm run dev
```

#### Executar apenas o Frontend
```bash
npm run dev:web
```

#### Executar apenas o Backend
```bash
npm run dev:server
```

### 4. Build para Produção

```bash
# Build completo
npm run build

# Build apenas frontend
npm run build:web

# Build apenas backend
npm run build:server
```

## 📝 Principais Mudanças

### ✅ Organização
- **Monorepo** com workspaces npm
- Frontend em `/web` com estrutura modular
- Backend em `/server` com separação de responsabilidades

### ✅ Configuração
- Variáveis de ambiente centralizadas
- API URL dinâmica (não mais hardcoded)
- Dependências separadas por workspace

### ✅ Código Limpo
- Imports organizados
- Serviço de API centralizado
- Tipos TypeScript sincronizados

## 🔧 Scripts Disponíveis

### Root
- `npm run dev` - Executa frontend e backend simultaneamente
- `npm run dev:web` - Executa apenas o frontend
- `npm run dev:server` - Executa apenas o backend
- `npm run build` - Build de produção (frontend + backend)

### Frontend (`/web`)
- `npm run dev` - Servidor de desenvolvimento Vite
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

### Backend (`/server`)
- `npm run dev` - Servidor de desenvolvimento com hot-reload
- `npm run build` - Compilação TypeScript
- `npm run start` - Executa versão compilada

## 🌐 Portas Padrão

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3333

## 📚 Tecnologias

### Frontend
- React 19
- TypeScript
- Vite
- Recharts
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- Nodemailer

## 🔐 Segurança

- Arquivos `.env` estão no `.gitignore`
- Use `.env.example` como template
- Nunca commite credenciais reais

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e confidencial.
