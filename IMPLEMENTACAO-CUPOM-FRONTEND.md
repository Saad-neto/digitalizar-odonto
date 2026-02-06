# 🎟️ IMPLEMENTAÇÃO: Campo de Cupom no Frontend

## 📋 RESUMO

Este guia mostra como adicionar um **campo de cupom de desconto** na página de pagamento (`Payment.tsx`).

---

## 🎯 FUNCIONALIDADE

O cliente poderá:
1. Digitar um código de cupom
2. Clicar em "Aplicar"
3. Ver o desconto aplicado em tempo real
4. Finalizar pagamento com valor descontado
5. Sistema registra automaticamente o uso do cupom

---

## 📝 PASSO A PASSO

### **1. Adicionar Estado para Cupom**

Em `src/pages/Payment.tsx`, adicione após os estados existentes:

```typescript
// Adicionar estas importações
import { validarCupom, calcularDesconto, registrarUsoCupom, type Cupom } from '@/lib/supabase';
import { Input } from '@/components/ui/input';

// Adicionar estes estados
const [cupomCodigo, setCupomCodigo] = useState('');
const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(null);
const [cupomErro, setCupomErro] = useState<string | null>(null);
const [cupomCarregando, setCupomCarregando] = useState(false);
const [valorComDesconto, setValorComDesconto] = useState(valorTotal);
const [descontoAplicado, setDescontoAplicado] = useState(0);
```

---

### **2. Criar Função para Aplicar Cupom**

Adicione esta função no componente:

```typescript
const handleAplicarCupom = async () => {
  if (!cupomCodigo.trim()) {
    setCupomErro('Digite um código de cupom');
    return;
  }

  setCupomCarregando(true);
  setCupomErro(null);

  try {
    const resultado = await validarCupom(cupomCodigo.trim());

    if (!resultado.valido || !resultado.cupom) {
      setCupomErro(resultado.mensagem || 'Cupom inválido');
      setCupomCarregando(false);
      return;
    }

    // Calcular desconto
    const { desconto, valorFinal } = calcularDesconto(valorTotal, resultado.cupom);

    // Atualizar estados
    setCupomAplicado(resultado.cupom);
    setDescontoAplicado(desconto);
    setValorComDesconto(valorFinal);
    setCupomErro(null);

    console.log('✅ Cupom aplicado:', resultado.cupom.codigo);
    console.log('💰 Desconto:', desconto);
    console.log('💵 Valor final:', valorFinal);

  } catch (err) {
    console.error('Erro ao aplicar cupom:', err);
    setCupomErro('Erro ao validar cupom');
  } finally {
    setCupomCarregando(false);
  }
};

const handleRemoverCupom = () => {
  setCupomAplicado(null);
  setCupomCodigo('');
  setDescontoAplicado(0);
  setValorComDesconto(valorTotal);
  setCupomErro(null);
};
```

---

### **3. Atualizar Função de Criar Pagamento**

Modifique a função `handleCreatePayment` para usar o valor com desconto:

```typescript
const handleCreatePayment = async () => {
  if (!leadId || !leadData) {
    alert('Erro: Dados do lead não encontrados.');
    return;
  }

  if (!isAsaasConfigured()) {
    alert('Erro: Asaas não está configurado. Verifique VITE_ASAAS_API_KEY.');
    return;
  }

  trackBeginCheckout(leadId, valorComDesconto); // <-- Usar valor com desconto

  setLoading(true);

  try {
    console.log('🔄 Criando pagamento no Asaas...');

    const result = await createAsaasPaymentForLead({
      leadId,
      nome: leadData.nome || 'Cliente',
      email: leadData.email || '',
      whatsapp: leadData.whatsapp || '',
      valor: valorComDesconto, // <-- Usar valor com desconto
      billingType: paymentMethod,
    });

    if (!result.success) {
      throw new Error(result.error || 'Não foi possível criar o pagamento');
    }

    console.log('✅ Pagamento criado:', result);

    // Se cupom foi aplicado, registrar uso
    if (cupomAplicado) {
      await registrarUsoCupom({
        cupomId: cupomAplicado.id,
        leadId: leadId,
        codigoUsado: cupomAplicado.codigo,
        descontoAplicado: descontoAplicado,
        valorOriginal: valorTotal,
        valorFinal: valorComDesconto,
      });

      console.log('✅ Uso do cupom registrado');
    }

    // Restante do código...
    if (paymentMethod === 'PIX' && result.pixQrCode) {
      setPixQrCode(result.pixQrCode);
      setPaymentCreated(true);
    }

    if (paymentMethod === 'CREDIT_CARD' && result.invoiceUrl) {
      setInvoiceUrl(result.invoiceUrl);
      setPaymentCreated(true);
    }

    setLoading(false);
  } catch (err: any) {
    console.error('❌ Erro ao processar pagamento:', err);
    alert(`Erro: ${err.message || 'Não foi possível processar o pagamento. Tente novamente.'}`);
    setLoading(false);
  }
};
```

---

### **4. Adicionar UI do Campo de Cupom**

Adicione este bloco ANTES do card de valor (procure por `<div className="bg-gradient-to-br from-medical-500"`):

```tsx
{/* Campo de Cupom */}
<div className="mb-6">
  <label className="text-sm font-medium text-neutral-700 mb-2 block">
    Tem um cupom de desconto?
  </label>

  {!cupomAplicado ? (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Digite o código do cupom"
        value={cupomCodigo}
        onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
        onKeyPress={(e) => e.key === 'Enter' && handleAplicarCupom()}
        disabled={cupomCarregando}
        className="flex-1 uppercase"
      />
      <Button
        onClick={handleAplicarCupom}
        disabled={cupomCarregando || !cupomCodigo.trim()}
        variant="outline"
        className="px-6"
      >
        {cupomCarregando ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Aplicar'
        )}
      </Button>
    </div>
  ) : (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-green-700">
            ✓ Cupom "{cupomAplicado.codigo}" aplicado
          </p>
          <p className="text-xs text-green-600 mt-1">
            {cupomAplicado.descricao}
          </p>
        </div>
        <button
          onClick={handleRemoverCupom}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Remover
        </button>
      </div>
      <p className="text-sm font-bold text-green-700 mt-2">
        Desconto: -{formatCurrency(descontoAplicado)}
      </p>
    </div>
  )}

  {cupomErro && (
    <p className="text-sm text-red-600 mt-2">
      {cupomErro}
    </p>
  )}
</div>
```

---

### **5. Atualizar Card de Valor**

Modifique o card de valor para mostrar o desconto:

```tsx
{/* Card de Valor */}
<div className="bg-gradient-to-br from-medical-500 to-medical-700 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
  <p className="text-sm uppercase tracking-wider opacity-90 mb-2">
    Investimento
  </p>

  {descontoAplicado > 0 && (
    <div className="mb-2">
      <p className="text-lg line-through opacity-75">
        {formatCurrency(valorTotal)}
      </p>
      <p className="text-sm opacity-90">
        Desconto: -{formatCurrency(descontoAplicado)}
      </p>
    </div>
  )}

  <div className="text-5xl md:text-6xl font-bold mb-2">
    {formatCurrency(valorComDesconto)}
  </div>

  <p className="text-sm opacity-90">
    ou até{' '}
    <span className="font-semibold">
      12x de {formatCurrency(valorComDesconto / 12)}
    </span>{' '}
    no cartão
  </p>
</div>
```

---

## 🎨 VERSÃO ALTERNATIVA: Cupom Automático via URL

Se você quiser detectar cupom automaticamente via URL (ex: `?cupom=AFILIADO_JOAO`):

### **1. Detectar Parâmetro na URL**

No `useEffect` que carrega o lead, adicione:

```typescript
useEffect(() => {
  const loadLead = async () => {
    if (!leadId) {
      setError('ID do lead não encontrado. Você foi redirecionado do briefing?');
      setLoadingLead(false);
      return;
    }

    try {
      const lead = await getLeadById(leadId);
      setLeadData(lead);
      setLoadingLead(false);

      // Detectar cupom na URL
      const cupomUrl = searchParams.get('cupom');
      if (cupomUrl) {
        setCupomCodigo(cupomUrl.toUpperCase());
        // Auto-aplicar cupom
        setTimeout(() => {
          handleAplicarCupom();
        }, 500);
      }

      if (lead) {
        trackPageView('/pagamento', 'Página de Pagamento');
      }
    } catch (err) {
      console.error('Erro ao carregar lead:', err);
      setError('Erro ao carregar informações. Por favor, tente novamente.');
      setLoadingLead(false);
    }
  };

  loadLead();
}, [leadId]);
```

### **2. Gerar Links para Afiliados**

Cada afiliado terá seu link personalizado:

```
https://odonto.digitalizarmkt.com.br/briefing?cupom=AFILIADO_JOAO
```

Ao finalizar o briefing, o cupom é passado automaticamente para a página de pagamento:

```
https://odonto.digitalizarmkt.com.br/pagamento?leadId=xxx&cupom=AFILIADO_JOAO
```

---

## 🧪 TESTANDO

### **Teste 1: Cupom Válido**

1. Execute o SQL para criar cupons de teste (já está em `cupons-afiliados-setup.sql`)
2. Acesse a página de pagamento
3. Digite: `BEMVINDO10`
4. Clique em "Aplicar"
5. Deve mostrar: "✓ Cupom aplicado" + desconto de 10%

### **Teste 2: Cupom Inválido**

1. Digite: `CUPOMINVALIDO`
2. Clique em "Aplicar"
3. Deve mostrar: "Cupom não encontrado"

### **Teste 3: Cupom Expirado**

1. Criar cupom com `data_fim` no passado
2. Tentar aplicar
3. Deve mostrar: "Este cupom expirou"

### **Teste 4: Cupom com Uso Máximo**

1. Criar cupom com `usos_maximos = 1`
2. Usar o cupom
3. Tentar usar novamente
4. Deve mostrar: "Este cupom atingiu o limite de usos"

---

## 📊 MONITORAMENTO DE CUPONS

### **Query: Cupons Mais Usados**

```sql
SELECT
  c.codigo,
  c.descricao,
  c.usos_atuais,
  c.usos_maximos,
  COUNT(cu.id) as total_vendas,
  SUM(cu.valor_final) as receita_total,
  SUM(cu.desconto_aplicado) as desconto_total
FROM cupons c
LEFT JOIN cupons_uso cu ON c.id = cu.cupom_id
GROUP BY c.id
ORDER BY total_vendas DESC;
```

### **Query: Performance de Afiliados**

```sql
SELECT
  c.afiliado_nome,
  c.afiliado_email,
  COUNT(cu.id) as vendas,
  SUM(cu.valor_final) as receita,
  SUM(cu.desconto_aplicado) as descontos,
  AVG(cu.valor_final) as ticket_medio
FROM cupons c
JOIN cupons_uso cu ON c.id = cu.cupom_id
WHERE c.afiliado_nome IS NOT NULL
GROUP BY c.afiliado_nome, c.afiliado_email
ORDER BY vendas DESC;
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Implementar campo de cupom na UI
2. ✅ Testar em ambiente sandbox
3. ✅ Criar cupons de lançamento
4. ✅ Gerar links para afiliados
5. ✅ Monitorar conversões
6. ✅ Ajustar descontos com base na performance

---

## ❓ FAQ

### **P: Posso combinar cupom com parcelamento?**
R: Sim! O desconto é aplicado no valor total, e o parcelamento é feito sobre o valor já descontado.

### **P: Posso usar mais de um cupom?**
R: Não. Apenas um cupom por compra (regra pode ser alterada se necessário).

### **P: O cupom expira automaticamente?**
R: Sim, se você configurar `data_fim` na criação do cupom.

### **P: Como criar cupom que vale apenas para primeiros 100 clientes?**
R: Defina `usos_maximos = 100` ao criar o cupom.

### **P: Como dar cupom exclusivo para um afiliado?**
R: Preencha `afiliado_nome` e `afiliado_email` ao criar o cupom.

---

✅ **PRONTO!** Agora você tem um sistema completo de cupons de desconto integrado com o Asaas!
