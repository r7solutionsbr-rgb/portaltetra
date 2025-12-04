# Frontend API Integration - Guia de Uso

## ✅ Arquivos Criados/Modificados

### Novos Arquivos:
1. **`web/src/hooks/useAppData.ts`** - Hook principal com chamadas à API real
2. **`web/src/components/shared/LoadingComponents.tsx`** - Componentes de loading e erro

### Arquivos Modificados:
1. **`web/src/services/api.ts`** - Expandido com todos os endpoints
2. **`web/src/hooks/useMockData.ts`** - Agora redireciona para `useAppData`

---

## 🚀 Como Usar

### Opção 1: Sem Mudanças (Backward Compatible)

Os componentes que já usam `useMockData` continuarão funcionando automaticamente:

```typescript
import { useMockData } from '../hooks/useMockData';

const MyComponent = () => {
  const { customers, loading, error } = useMockData();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <div>{/* usar customers */}</div>;
};
```

### Opção 2: Usar o Novo Hook (Recomendado)

```typescript
import { useAppData } from '../hooks/useAppData';

const MyComponent = () => {
  const { customers, loading, error, refetch } = useAppData();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <div>{/* usar customers */}</div>;
};
```

### Opção 3: Loading Global no App.tsx

Adicione loading/error handling no nível do App:

```typescript
import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { useAppData } from './hooks/useAppData';
import { LoadingSpinner, ErrorMessage } from './components/shared/LoadingComponents';
// ... outros imports

const AppContent: React.FC = () => {
  const { user } = useUser();
  const { loading, error, refetch } = useAppData();
  const [view, setView] = useState<View>('dashboard');

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if fetch failed
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  // Rest of your App component...
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col">
        <Header />
        {/* ... render views */}
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
```

---

## 📊 Dados Disponíveis

O hook `useAppData` retorna:

```typescript
{
  // Entidades do banco
  invoices: Invoice[],
  deliveries: Delivery[],
  paymentRequests: PaymentRequest[],
  vehicles: Vehicle[],
  people: Person[],
  botMessages: BotMessage[],
  customers: Customer[],
  contracts: Contract[],
  
  // Dados calculados
  consumptionData: ConsumptionData[],  // Gerado a partir dos contratos
  creditData: { used: number, total: number },
  priceVariation: number,
  
  // Estados
  loading: boolean,
  error: string | null,
  refetch: () => Promise<void>,
}
```

---

## 🔄 Refetch de Dados

Para recarregar os dados (ex: após criar um novo registro):

```typescript
const { customers, refetch } = useAppData();

const handleCreateCustomer = async (data) => {
  await api.customers.create(data);
  await refetch(); // Recarrega todos os dados
};
```

---

## ⚠️ Importante

### 1. Backend Deve Estar Rodando

Certifique-se de que o backend está rodando em `http://localhost:3333`:

```bash
cd server
npm run dev
```

### 2. Variável de Ambiente

Verifique se `web/.env` tem a URL correta:

```env
VITE_API_URL=http://localhost:3333
```

### 3. CORS

Se houver erros de CORS, verifique se o backend tem CORS habilitado (já está configurado).

---

## 🧪 Testando

### 1. Verificar se os dados estão carregando

Abra o console do navegador e veja se há erros de rede.

### 2. Verificar Network Tab

No DevTools → Network, veja se as chamadas para `/api/*` estão retornando 200.

### 3. Testar Loading State

Adicione um delay artificial para ver o loading:

```typescript
// Em useAppData.ts, adicione antes do fetchData:
await new Promise(resolve => setTimeout(resolve, 2000));
```

---

## 🎨 Customizando Loading UI

### Substituir o LoadingSpinner

Crie seu próprio componente:

```typescript
const MyCustomLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500" />
  </div>
);
```

### Usar no App.tsx

```typescript
if (loading) return <MyCustomLoader />;
```

---

## 📝 Próximos Passos

1. ✅ Backend rodando
2. ✅ Frontend conectado à API
3. ⏳ Adicionar loading no App.tsx (opcional)
4. ⏳ Testar todas as views
5. ⏳ Adicionar tratamento de erro específico por componente
6. ⏳ Implementar cache/otimização (React Query, SWR, etc.)

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
```bash
cd server
npm run dev
```

### Erro: "CORS policy"

**Causa:** Backend não permite requisições do frontend

**Solução:** Já está configurado no backend, mas verifique se o CORS está habilitado em `server/src/server.ts`

### Loading infinito

**Causa:** Erro na API que não está sendo capturado

**Solução:** Abra o console e veja o erro. Verifique se o backend está retornando os dados corretos.

### Dados vazios

**Causa:** Banco de dados não foi populado

**Solução:**
```bash
cd server
npm run db:seed
```
