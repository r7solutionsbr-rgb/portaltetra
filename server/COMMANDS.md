# Comandos para Executar a Migração PostgreSQL

## 📋 Pré-requisitos

Certifique-se de que o arquivo `/server/.env` contém a `DATABASE_URL` do Neon:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
PORT=3333
```

---

## 🚀 Passo a Passo de Execução

### 1. Navegar para o diretório do servidor

```bash
cd server
```

### 2. Instalar dependências (se necessário)

```bash
npm install
```

### 3. Fazer push do schema para o banco Neon

Este comando cria todas as tabelas no PostgreSQL baseado no `schema.prisma`:

```bash
npm run db:push
```

**Ou diretamente:**
```bash
npx prisma db push
```

**Saída esperada:**
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema.
```

---

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

**Saída esperada:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

---

### 5. Popular o banco com dados iniciais (Seed)

```bash
npm run db:seed
```

**Ou diretamente:**
```bash
npx prisma db seed
```

**Saída esperada:**
```
🧹 Limpando banco de dados...
✅ Banco limpo!

🌱 Populando banco de dados...
📝 Criando usuários...
   ✓ 2 usuários criados
📝 Criando clientes...
   ✓ 6 clientes criados
📝 Criando contratos...
   ✓ 6 contratos criados
📝 Criando veículos...
   ✓ 15 veículos criados
📝 Criando faturas...
   ✓ 25 faturas criadas
📝 Criando entregas...
   ✓ 20 entregas criadas
📝 Criando solicitações de pagamento...
   ✓ 10 solicitações de pagamento criadas
📝 Criando pessoas...
   ✓ 12 pessoas criadas
📝 Criando mensagens do bot...
   ✓ 6 mensagens do bot criadas

============================================================
🚀 Banco de dados Neon conectado e populado com sucesso!
============================================================
```

---

### 6. Testar a conexão com o banco

```bash
npm run db:test
```

**Ou diretamente:**
```bash
npx ts-node src/test-db.ts
```

**Saída esperada:**
```
🔍 Testando conexão com o banco de dados Neon...

✅ Conexão estabelecida com sucesso!

📊 Estatísticas do banco:
   • Usuários: 2
   • Clientes: 6
   • Contratos: 6
   • Veículos: 15
   • Faturas: 25
   • Entregas: 20
   • Solicitações de Pagamento: 10
   • Pessoas: 12
   • Mensagens do Bot: 6

📋 Exemplo de cliente com contratos:
   Nome: Transportadora Ágil Ltda
   CNPJ: 12.345.678/0001-90
   Contratos: 1

🎉 Todos os testes passaram!
```

---

### 7. Iniciar o servidor backend

```bash
npm run dev
```

**Saída esperada:**
```
🚀 Server is running on http://localhost:3333
```

---

## 🧪 Testar os Endpoints da API

Com o servidor rodando, você pode testar os endpoints:

### Usando curl:

```bash
# Listar clientes
curl http://localhost:3333/api/customers

# Listar contratos
curl http://localhost:3333/api/contracts

# Listar veículos
curl http://localhost:3333/api/vehicles

# Listar faturas
curl http://localhost:3333/api/invoices

# Listar entregas
curl http://localhost:3333/api/deliveries

# Listar solicitações de pagamento
curl http://localhost:3333/api/payment-requests

# Listar pessoas
curl http://localhost:3333/api/people

# Listar mensagens do bot
curl http://localhost:3333/api/bot-messages

# Estatísticas do dashboard
curl http://localhost:3333/api/dashboard-stats
```

### Usando o navegador:

Abra: `http://localhost:3333/api/customers`

---

## 🔄 Comandos Úteis

### Ver o banco de dados no Prisma Studio

```bash
npx prisma studio
```

Abre uma interface visual em `http://localhost:5555`

### Resetar o banco (cuidado!)

```bash
npx prisma db push --force-reset
npm run db:seed
```

### Ver logs do Prisma

```bash
npx prisma db push --help
```

---

## ✅ Checklist de Verificação

- [ ] `DATABASE_URL` configurada no `.env`
- [ ] `npx prisma db push` executado com sucesso
- [ ] `npx prisma generate` executado
- [ ] `npm run db:seed` populou o banco
- [ ] `npm run db:test` passou todos os testes
- [ ] Servidor backend rodando em `http://localhost:3333`
- [ ] Endpoints retornando dados (teste com curl ou navegador)
- [ ] Frontend conectando e exibindo dados reais

---

## 🐛 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"

**Solução:** Verifique se o arquivo `/server/.env` existe e contém a `DATABASE_URL`

### Erro: "Can't reach database server"

**Solução:** 
1. Verifique se a URL do Neon está correta
2. Verifique sua conexão com a internet
3. Teste a conexão no dashboard do Neon

### Erro: "Unique constraint failed"

**Solução:** Execute o reset do banco:
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Erro de TypeScript no seed

**Solução:** Certifique-se de que o Prisma Client foi gerado:
```bash
npx prisma generate
```

---

## 📚 Próximos Passos

1. **Integrar o frontend** para consumir os novos endpoints
2. **Remover `useMockData`** do frontend
3. **Implementar autenticação** (JWT)
4. **Adicionar validações** nos endpoints
5. **Implementar paginação** para listas grandes
