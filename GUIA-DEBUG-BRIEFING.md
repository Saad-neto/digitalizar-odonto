# Guia de Debug - Problema de Salvamento no Briefing

## Problema Reportado
Os dados da primeira parte do briefing não estão sendo salvos na tabela `leads`.

## Testes Realizados

### ✅ Teste 1: Conexão com Supabase
**Status:** PASSOU ✅

Executei o script `test-supabase-connection.cjs` e confirmei que:
- Conexão com Supabase está funcionando
- Variáveis de ambiente estão configuradas corretamente
- É possível ler leads existentes
- É possível inserir novos leads na tabela
- As políticas RLS permitem INSERT público

**Conclusão:** O backend (Supabase) está funcionando corretamente.

---

## Próximos Passos para Debug

### Passo 1: Verificar Console do Navegador

Adicionei logs detalhados no código. Agora você precisa:

1. **Abrir o Console do Navegador**
   - Chrome/Edge: `F12` ou `Ctrl+Shift+J` (Windows/Linux) / `Cmd+Option+J` (Mac)
   - Firefox: `F12` ou `Ctrl+Shift+K` (Windows/Linux) / `Cmd+Option+K` (Mac)

2. **Iniciar o servidor de desenvolvimento**
   ```bash
   cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
   npm run dev
   ```

3. **Acessar a página do briefing**
   - Abra `http://localhost:8080/briefing`

4. **Preencher a primeira parte do formulário**
   - Nome do consultório (obrigatório)
   - Seu nome (obrigatório)
   - WhatsApp (obrigatório)
   - E-mail (obrigatório)

5. **Clicar em "Próximo"**

6. **Verificar os logs no console**

   Você deve ver logs como estes:

   ```
   🔄 [handleNext] Iniciando navegação para próxima seção...
   📍 [handleNext] Seção atual: 0
   📝 [handleNext] isFromHotmart: false
   ✅ [handleNext] Validação passou
   📊 [handleNext] Tentando capturar lead parcial...
   🔍 [handleNext] Lead ID existente no localStorage: null
   📝 [handleNext] Criando novo lead parcial...
   📝 [handleNext] Dados do formulário: {...}
   🔄 [createPartialLead] Iniciando criação de lead parcial...
   📝 [createPartialLead] Dados recebidos: {...}
   📤 [createPartialLead] Enviando para Supabase: {...}
   ✅ [createPartialLead] Lead parcial criado com sucesso!
   ✅ [createPartialLead] ID do lead: <uuid>
   ✅ [handleNext] Lead parcial capturado e salvo no localStorage: <uuid>
   ```

### Passo 2: Identificar o Problema

Verifique qual mensagem está aparecendo:

#### Cenário A: Validação falhou
```
❌ [handleNext] Validação falhou, não avançando
```
**Solução:** Verifique se todos os campos obrigatórios estão preenchidos corretamente:
- Nome do consultório (mín. 3 caracteres)
- Seu nome (mín. 3 caracteres)
- WhatsApp (11 dígitos)
- E-mail (formato válido)

#### Cenário B: Erro ao criar lead no Supabase
```
❌ [createPartialLead] Erro ao criar lead parcial:
❌ [createPartialLead] Detalhes do erro: {...}
```
**Solução:** Copie o erro completo e me envie para análise.

#### Cenário C: Lead parcial já existe
```
ℹ️ [handleNext] Lead parcial já existe, não criando novo
```
**Explicação:** Isso é normal se você já testou antes. O lead parcial é criado apenas uma vez por sessão.

Para testar novamente:
1. Abra o Console do navegador
2. Digite: `localStorage.removeItem('partial_lead_id')`
3. Pressione Enter
4. Recarregue a página e teste novamente

#### Cenário D: Veio do Hotmart
```
ℹ️ [handleNext] Na seção 0, mas veio do Hotmart - não capturando lead parcial
```
**Explicação:** Se você acessou a página com `?source=hotmart` na URL, o sistema não cria lead parcial (pois o pagamento já foi feito via Hotmart).

Para testar sem Hotmart, acesse: `http://localhost:8080/briefing`

### Passo 3: Verificar no Supabase

Se os logs mostrarem sucesso (✅), verifique se o lead foi salvo:

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Entre no projeto
3. Vá em "Table Editor"
4. Abra a tabela `leads`
5. Filtre por `status = 'lead_parcial'`
6. Verifique se há um novo registro com seus dados

### Passo 4: Teste com Script

Alternativamente, você pode verificar os leads parciais diretamente:

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
node test-supabase-connection.cjs
```

Isso mostrará os últimos 5 leads cadastrados, incluindo os parciais.

---

## Possíveis Causas do Problema

### 1. Validação Bloqueando o Avanço
O código valida os campos antes de permitir avançar. Se algum campo não passar na validação, o lead não é criado.

### 2. JavaScript Desabilitado
Se o JavaScript estiver desabilitado no navegador, nenhuma função será executada.

### 3. Erro de Rede
Se houver problema de conexão com o Supabase, o lead não será criado.

### 4. CORS / Firewall
Se o firewall ou proxy estiver bloqueando requisições para o Supabase.

---

## O que fazer se o problema persistir

1. **Copie TODOS os logs do console** (Ctrl+A no console, Ctrl+C)
2. **Tire um print da tela** mostrando:
   - O formulário preenchido
   - O console com os logs
3. **Verifique o Network** (aba Network no DevTools):
   - Filtre por "supabase"
   - Veja se há requisições para a API
   - Verifique o status das requisições (200, 400, 500, etc.)

4. **Me envie as informações** para análise detalhada

---

## Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Testar conexão com Supabase
node test-supabase-connection.cjs

# Limpar localStorage (no console do navegador)
localStorage.clear()

# Ver lead parcial salvo (no console do navegador)
console.log(localStorage.getItem('partial_lead_id'))
```

---

## Observações Importantes

- O lead parcial é criado **APENAS** quando você clica em "Próximo" na primeira página
- O lead parcial **NÃO é criado** se você veio do Hotmart
- O lead parcial é criado **UMA VEZ** por sessão (salvo no localStorage)
- Para testar várias vezes, limpe o localStorage entre os testes

---

**Última atualização:** 06/02/2026
