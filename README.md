# Sistema de Gestão Financeira

Sistema completo de gestão financeira desenvolvido para portfólio, com funcionalidades para controle de entradas e saídas financeiras.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** 18.2.0
- **Zustand** (gerenciamento de estado)
- **React Router** (rotas)
- **Recharts** (gráficos interativos)
- **Axios** (requisições HTTP)
- **date-fns** (manipulação de datas)
- **jsPDF** (exportação PDF)
- **jsPDF-AutoTable** (tabelas em PDF)

### Backend
- **Node.js** + **Express**
- **PostgreSQL** (banco de dados)
- **JWT** (autenticação)
- **bcryptjs** (criptografia de senhas)
- **RBAC** (controle de acesso baseado em roles)

### DevOps
- **Docker** + **Docker Compose**

## 📋 Funcionalidades

### ✅ Entradas e Saídas
- Cadastro de transações (receitas e despesas)
- Edição e exclusão de transações
- Filtros avançados por período, tipo e categoria

### ✅ Categorias Financeiras
- Criação de categorias personalizadas
- Categorias separadas por tipo (receita/despesa)
- Cores personalizadas para identificação visual

### ✅ Relatórios Mensais
- Visualização de resumo financeiro
- Gráficos interativos (pizza, barras, linhas)
- Análise por categoria e por período

### ✅ Gráficos Interativos
- Gráfico de linha: Receitas vs Despesas ao longo do mês
- Gráfico de pizza: Distribuição de despesas por categoria
- Gráfico de barras: Receitas por categoria

### ✅ Exportação
- Exportação para CSV
- Exportação para PDF

### ✅ Funcionalidades Extras
- Cálculo automático de saldo
- Filtros avançados por período
- Interface responsiva (mobile-friendly)
- Autenticação JWT
- Boas práticas de UX

## 🛠️ Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (se executar sem Docker)

### Executar com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd webProject
```

2. Execute o docker-compose:
```bash
docker-compose up --build
```

3. Execute as migrations do banco de dados:
```bash
# Em outro terminal, execute:
docker exec -it finance_backend npm run migrate
```

4. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Executar sem Docker

#### Backend

1. Entre na pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` (copie de `.env.example`):
```bash
cp .env.example .env
```

4. Certifique-se que o PostgreSQL está rodando e execute as migrations:
```bash
npm run migrate
```

5. Inicie o servidor:
```bash
npm run dev
```

#### Frontend

1. Entre na pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm start
```

## 📁 Estrutura do Projeto

```
webProject/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # Configuração do banco
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── categoryController.js
│   │   │   └── reportController.js
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT e RBAC
│   │   │   └── validate.js       # Validações
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── database/
│   │   │   └── migrate.js        # Migrations
│   │   └── server.js             # Servidor principal
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TransactionModal.js
│   │   │   └── CategoryModal.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Transactions.js
│   │   │   ├── Categories.js
│   │   │   └── Reports.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── transactionStore.js
│   │   │   └── categoryStore.js
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Todas as rotas protegidas exigem um token válido no header `Authorization: Bearer <token>`.

### Criar conta
1. Acesse `/register`
2. Preencha nome, email e senha
3. Faça login automaticamente após o registro

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Transações
- `GET /api/transactions` - Listar transações (com filtros)
- `GET /api/transactions/summary` - Obter resumo financeiro
- `POST /api/transactions` - Criar transação
- `GET /api/transactions/:id` - Obter transação específica
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Relatórios
- `GET /api/reports/monthly` - Relatório mensal
- `GET /api/reports/export/csv` - Exportar CSV

## 🎨 Características do Código

- ✅ Código limpo e organizado
- ✅ Separação de responsabilidades
- ✅ Componentização adequada
- ✅ Comentários explicativos
- ✅ Sem variáveis desnecessárias
- ✅ Algoritmos simples e eficientes
- ✅ Validações no frontend e backend
- ✅ Tratamento de erros

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🚀 Próximos Passos (Melhorias Futuras)

- [ ] Testes unitários e de integração
- [ ] Dashboard com mais métricas
- [ ] Notificações e alertas
- [ ] Metas financeiras
- [ ] Categorias pré-definidas
- [ ] Backup automático de dados
- [ ] Multi-idioma

## 📝 Licença

Este projeto foi desenvolvido para fins de portfólio.

# click_financa
# click_financa
