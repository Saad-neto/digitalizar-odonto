# 📊 Guia - Configurar Google Analytics 4 e Meta Pixel

Este guia ensina como obter e configurar os IDs de rastreamento do **Google Analytics 4** e **Meta Pixel (Facebook Ads)** no projeto.

---

## 🎯 Parte 1: Google Analytics 4 (GA4)

### **O que é o GA4?**
O Google Analytics 4 é a ferramenta gratuita do Google para rastrear:
- 📊 Visitantes do site
- 📈 Páginas mais acessadas
- 🎯 Conversões (leads, pagamentos)
- 📱 Dispositivos usados (desktop, mobile)
- 🌍 Origem do tráfego (Google, redes sociais, direto)

---

### **Passo a Passo: Criar Conta GA4**

#### **1. Acessar Google Analytics**
- Vá para: https://analytics.google.com
- Faça login com conta Google (use a conta da empresa)

#### **2. Criar Propriedade**
Se for primeira vez:
- Clique em **"Começar a medir"**
- Preencha:
  - **Nome da conta**: `Sites Odonto`
  - **Nome da propriedade**: `Sites Odonto - Landing Page`
  - **Fuso horário**: `(GMT-03:00) Brasília`
  - **Moeda**: `Real brasileiro (R$)`

Se já tem conta:
- Clique em **"Administrador"** (engrenagem) no canto inferior esquerdo
- Em **"Propriedade"** → **"Criar propriedade"**
- Preencha as informações acima

#### **3. Configurar Fluxo de Dados**
- Selecione plataforma: **"Web"**
- Preencha:
  - **URL do site**: `https://sites-odonto.digitalizar.space`
  - **Nome do fluxo**: `Sites Odonto Website`
- Clique em **"Criar fluxo"**

#### **4. Obter Measurement ID**
Após criar o fluxo, você verá:
```
ID de medição: G-XXXXXXXXXX
```

**👉 Copie este ID!** Você precisará dele no .env

#### **5. Configurar Eventos (Opcional)**
O código já está preparado para rastrear automaticamente:
- ✅ `briefing_started` - Usuário inicia o formulário
- ✅ `generate_lead` - Briefing enviado com sucesso
- ✅ `begin_checkout` - Clique no botão de pagamento
- ✅ `purchase` - Pagamento confirmado (via webhook)

Para ver eventos em tempo real:
- Acesse: **Relatórios** → **Tempo real**

---

### **Adicionar ID no Projeto**

#### **1. Editar arquivo `.env`**
Abra o arquivo `.env` na raiz do projeto e adicione:
```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Substitua `G-XXXXXXXXXX` pelo seu ID real!**

#### **2. Rebuild do Projeto**
Como o Vite embarca variáveis no build, você precisa rebuildar:
```bash
npm run build
```

#### **3. Deploy**
Após rebuild, faça deploy:
```bash
# Build da imagem Docker
docker build -t digitalizar-odonto:latest .

# Deploy no Swarm
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

#### **4. Verificar Funcionamento**
- Acesse o site: https://sites-odonto.digitalizar.space
- Abra o Console do navegador (F12)
- Você deve ver: `✅ Google Analytics 4 inicializado: G-XXXXXXXXXX`
- No GA4, acesse **Tempo real** → Deve aparecer 1 usuário ativo (você!)

---

## 📱 Parte 2: Meta Pixel (Facebook Ads)

### **O que é o Meta Pixel?**
O Meta Pixel rastreia conversões de anúncios no Facebook/Instagram:
- 📊 Quantas pessoas visitam o site vindas do Instagram
- 🎯 Quantos leads são gerados via anúncios
- 💰 ROI (retorno sobre investimento) das campanhas
- 🔄 Criar públicos personalizados para remarketing

---

### **Passo a Passo: Criar Meta Pixel**

#### **1. Acessar Gerenciador de Eventos**
- Vá para: https://business.facebook.com/events_manager
- Faça login com conta Facebook Business
  - Se não tem conta Business, crie em: https://business.facebook.com

#### **2. Criar Pixel**
- Clique em **"Conectar fontes de dados"**
- Selecione: **"Web"** (sites)
- Escolha: **"Meta Pixel"**
- Clique em **"Conectar"**

#### **3. Nomear o Pixel**
- **Nome**: `Sites Odonto - Landing Page`
- **Website**: `https://sites-odonto.digitalizar.space`
- Clique em **"Criar pixel"**

#### **4. Obter Pixel ID**
Após criar, você verá:
```
Pixel ID: 123456789012345
```

**👉 Copie este ID!** É um número de 15-16 dígitos.

#### **5. Pular Instalação Manual**
- O Facebook vai oferecer instalar manualmente
- **Pode pular!** O código já está implementado no projeto
- Clique em **"Concluir"**

---

### **Adicionar ID no Projeto**

#### **1. Editar arquivo `.env`**
Abra o arquivo `.env` e adicione:
```bash
VITE_META_PIXEL_ID=123456789012345
```

**⚠️ Substitua pelo seu ID real (apenas números)!**

#### **2. Rebuild e Deploy**
Mesmos passos do GA4:
```bash
npm run build
docker build -t digitalizar-odonto:latest .
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

#### **3. Verificar Funcionamento**

**Método 1: Console do Navegador**
- Acesse: https://sites-odonto.digitalizar.space
- F12 → Console
- Você deve ver: `✅ Meta Pixel inicializado: 123456789012345`

**Método 2: Meta Pixel Helper (Extensão)**
- Instale: https://chrome.google.com/webstore (busque "Meta Pixel Helper")
- Acesse seu site
- Ícone do Pixel Helper deve ficar verde
- Clique nele → Deve mostrar eventos disparados

**Método 3: Teste de Eventos**
- No Gerenciador de Eventos → **"Testar eventos"**
- Cole a URL: `https://sites-odonto.digitalizar.space`
- Abra o site
- Deve aparecer evento **PageView** em tempo real!

---

### **Eventos Configurados**

O código já rastreia automaticamente:

| Evento | Quando dispara |
|--------|----------------|
| `PageView` | Ao carregar qualquer página |
| `Lead` | Quando briefing é enviado (conversão!) |
| `InitiateCheckout` | Quando clica em "Pagar com Cartão" |
| `Purchase` | Quando pagamento é confirmado |

---

## 🎯 Parte 3: Eventos Customizados no Briefing

O formulário de briefing já captura os IDs de rastreamento do cliente!

### **Seção 8: Rastreamento e Integrações**
Quando o cliente preenche o briefing, pode informar:
- 📊 **Google Analytics ID** (GA-XXXXXXXX ou G-XXXXXXXXXX)
- 📱 **Meta Pixel ID** (123456789012345)

Esses IDs ficam salvos em `briefing_data.google_analytics_id` e `briefing_data.meta_pixel_id`.

**Uso:** Quando for criar o site do cliente, use esses IDs para configurar o rastreamento no site dele!

---

## 📋 Checklist de Configuração

### **Google Analytics 4**
- [ ] Conta criada em analytics.google.com
- [ ] Propriedade criada para o site
- [ ] Fluxo de dados web configurado
- [ ] Measurement ID copiado (G-XXXXXXXXXX)
- [ ] ID adicionado no arquivo `.env`
- [ ] Projeto rebuildo (`npm run build`)
- [ ] Deploy realizado
- [ ] Teste: Console mostra "GA4 inicializado"
- [ ] Teste: Relatório "Tempo real" mostra usuário ativo

### **Meta Pixel**
- [ ] Conta Business do Facebook criada
- [ ] Pixel criado no Gerenciador de Eventos
- [ ] Pixel ID copiado (15 dígitos)
- [ ] ID adicionado no arquivo `.env`
- [ ] Projeto rebuildo (`npm run build`)
- [ ] Deploy realizado
- [ ] Teste: Console mostra "Meta Pixel inicializado"
- [ ] Teste: Pixel Helper mostra ícone verde
- [ ] Teste: "Testar eventos" mostra PageView

---

## 🔍 Monitoramento e Relatórios

### **Google Analytics 4**

**Relatórios Essenciais:**
1. **Tempo Real** → Ver usuários ativos agora
2. **Aquisição** → De onde vem o tráfego
3. **Engajamento** → Páginas mais visitadas
4. **Conversões** → Eventos importantes (leads, pagamentos)

**Configurar Conversão "Lead":**
- Acesse: **Administrador** → **Eventos**
- Encontre evento `generate_lead`
- Clique em **"Marcar como conversão"**
- Agora você pode ver quantos leads gera por dia!

### **Meta Pixel**

**Relatórios Essenciais:**
1. **Painel** → Eventos das últimas 24h
2. **Teste de Eventos** → Debug em tempo real
3. **Públicos** → Criar públicos para remarketing

**Criar Público Personalizado:**
- Acesse: **Públicos** → **Criar público**
- Selecione: **"Site"**
- Regra: `URL contém /obrigado` (pessoas que enviaram briefing)
- Use esse público para remarketing!

---

## 🆘 Problemas Comuns

### **"Não vejo eventos no GA4"**
**Soluções:**
1. Verifique se `VITE_GA4_MEASUREMENT_ID` está correto no .env
2. Rebuilde o projeto (`npm run build`)
3. Limpe cache do navegador (Ctrl+Shift+Del)
4. Aguarde até 24h (às vezes demora para aparecer)
5. Use modo anônimo para testar (sem bloqueadores de anúncios)

### **"Meta Pixel não dispara eventos"**
**Soluções:**
1. Verifique se `VITE_META_PIXEL_ID` está correto no .env
2. Rebuilde o projeto
3. Desabilite bloqueadores de anúncios (AdBlock, uBlock)
4. Teste em modo anônimo
5. Verifique Console → Não deve ter erros de `fbq is not defined`

### **"Variáveis de ambiente não estão funcionando"**
**Lembre-se:**
- Vite **embarca** variáveis no JavaScript durante o build
- Sempre rode `npm run build` após alterar .env
- Nunca altere apenas o .env em produção, sempre rebuilde!

---

## 📚 Recursos Adicionais

### **Google Analytics 4**
- 📖 Documentação oficial: https://support.google.com/analytics
- 🎥 Curso gratuito: https://analytics.google.com/analytics/academy/
- 🏆 Certificação gratuita: https://skillshop.withgoogle.com

### **Meta Pixel**
- 📖 Guia oficial: https://www.facebook.com/business/help/952192354843755
- 🎥 Tutoriais: https://www.facebook.com/business/learn/facebook-ads-pixel
- 🧪 Testar eventos: https://www.facebook.com/business/help/1686199411616919

---

## ✅ Próximos Passos

Após configurar Analytics e Pixel:

1. 📍 Cadastrar no Google Meu Negócio (ver `GUIA_GOOGLE_MEU_NEGOCIO.md`)
2. 🔍 Cadastrar no Google Search Console
3. 📊 Configurar Google Tag Manager (rastreamento avançado)
4. 🎯 Criar primeira campanha no Google Ads
5. 📱 Criar primeira campanha no Facebook/Instagram Ads

---

**Dúvidas?** Consulte a documentação ou entre em contato com suporte técnico! 🚀
