# Sites Odonto 24H

Site profissional para dentistas em 24 horas. Plataforma completa com formulário de briefing, integração de pagamentos e painel administrativo.

## 🚀 Sobre o Projeto

**Sites Odonto 24H** é uma plataforma SaaS para criação de sites odontológicos profissionais. Dentistas preenchem um briefing detalhado, realizam o pagamento via Stripe/Mercado Pago e recebem seu site personalizado em até 24 horas.

### 🌐 URLs

- **Produção**: https://sites-odonto.digitalizar.space
- **IP Direto**: https://95.217.158.112

## 🛠️ Tecnologias

- **Frontend**: Vite + React 18 + TypeScript
- **UI**: Tailwind CSS + shadcn-ui
- **Banco de Dados**: Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos**: Stripe / Mercado Pago
- **Deploy**: Docker Swarm + Traefik (reverse proxy)
- **Servidor**: VPS (95.217.158.112)

## 📋 Funcionalidades

### Públicas
- **Landing Page** - Apresentação do serviço
- **Formulário de Briefing** - 8 seções para coleta de informações
- **Página de Pagamento** - Integração com Stripe/Mercado Pago
- **Blog** - Sistema de artigos com SEO otimizado
- **Agendamento** - Sistema de marcação de consultas

### Administrativas
- **Dashboard** - Visão geral de leads e métricas
- **Gestão de Leads** - Kanban board com drag-and-drop
- **Detalhes do Lead** - Visualização completa do briefing
- **Notas e Timeline** - Histórico de alterações
- **Blog CMS** - Gerenciamento de posts, categorias e tags
- **Exportação** - PDF, CSV e ZIP de arquivos

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js 20+ (recomendado usar [nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Saad-neto/digitalizar-odonto.git
cd digitalizar-odonto

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em **http://localhost:8080** (porta customizada, não a padrão 5173).

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 8080)
npm run build        # Build de produção (dist/)
npm run build:dev    # Build com source maps para debug
npm run preview      # Preview do build de produção
npm run lint         # Linter (ESLint)
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica

# Stripe (opcional)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago (opcional)
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# Preços (em centavos)
VITE_PRICE_TOTAL=49700      # R$ 497,00
VITE_PRICE_ENTRADA=24850    # R$ 248,50 (50%)
VITE_PRICE_SALDO=24850      # R$ 248,50 (50%)

# App
VITE_APP_URL=https://sites-odonto.digitalizar.space
```

## 📦 Deploy

O projeto está configurado para deploy via **Docker Swarm** com **Traefik** como reverse proxy.

Para instruções detalhadas de deploy, consulte [DEPLOY.md](./DEPLOY.md).

### Deploy Rápido

```bash
# Build da imagem Docker
docker build -t digitalizar-odonto:latest .

# Atualizar serviço no Swarm
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto

# Verificar status
docker service ls | grep digitalizar
```

## 📂 Estrutura do Projeto

```
swift-dent-studio-16/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Landing page
│   │   ├── Briefing.tsx    # Formulário de briefing (8 seções)
│   │   ├── Payment.tsx     # Página de pagamento
│   │   ├── Blog.tsx        # Listagem de posts
│   │   └── admin/          # Páginas administrativas
│   ├── components/
│   │   ├── ui/             # Componentes shadcn-ui
│   │   ├── admin/          # Componentes do admin
│   │   ├── blog/           # Componentes do blog
│   │   └── sections/       # Seções da landing page
│   ├── lib/
│   │   ├── supabase.ts     # Client e funções Supabase
│   │   └── utils.ts        # Utilitários gerais
│   └── hooks/              # Custom React hooks
├── netlify/functions/      # Serverless functions (webhooks)
├── supabase/               # Scripts SQL do banco
├── public/                 # Assets estáticos
├── dist/                   # Build de produção
├── Dockerfile              # Configuração Docker
├── docker-compose.yml      # Orquestração Docker Swarm
└── nginx.conf              # Configuração Nginx
```

## 🗄️ Banco de Dados

O projeto usa **Supabase** com as seguintes tabelas principais:

- `leads` - Informações dos leads e briefing (JSONB)
- `payments` - Histórico de pagamentos
- `lead_status_history` - Auditoria de mudanças de status
- `lead_notes` - Notas administrativas
- `blog_posts` - Posts do blog
- `blog_categories` - Categorias do blog
- `blog_tags` - Tags do blog

Para configurar o banco, execute os scripts SQL em:
- `supabase/setup.sql`
- `supabase/blog-setup-fixed.sql`
- `supabase/agendamentos-setup.sql`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Documentação Adicional

- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy
- [README_IMPLEMENTACAO.md](./README_IMPLEMENTACAO.md) - Notas de implementação
- [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) - Configuração do Supabase
- [ADMIN-SETUP.md](./ADMIN-SETUP.md) - Configuração do painel admin
- [CLAUDE.md](./CLAUDE.md) - Instruções para Claude Code

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Equipe

Desenvolvido por **Digitalizar** para dentistas em todo o Brasil.

---

**Última atualização**: Dezembro 2024
