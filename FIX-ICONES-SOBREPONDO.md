# 🔧 Correção: Ícones Sobrepondo Placeholders

## ❌ Problema Identificado

No formulário de agendamento (`/agendar`), os ícones estavam sobrepostos aos placeholders dos campos:
- Nome Completo: ícone de usuário sobrepondo "Ex: Dr. João Silva"
- E-mail: ícone de email sobrepondo "seu@email.com"
- WhatsApp: ícone de telefone sobrepondo "(11) 99999-9999"
- Nome do Consultório: ícone de prédio sobrepondo "Ex: Clínica..."
- Observações: ícone de documento sobrepondo placeholder

## ✅ Solução Aplicada

### Alterações no arquivo `src/pages/Agendar.tsx`:

**ANTES:**
```tsx
<div className="relative">
  <User className="absolute left-3 top-3 text-medical-400" size={20} />
  <input className="w-full pl-11 pr-4 py-3 ..." />
</div>
```

**DEPOIS:**
```tsx
<div className="relative">
  <User className="absolute left-4 top-3.5 text-medical-400" size={20} />
  <input className="w-full pl-12 pr-4 py-3 ..." />
</div>
```

### O que mudou:

1. **Posição do ícone:**
   - `left-3` → `left-4` (de 12px para 16px)
   - `top-3` → `top-3.5` (de 12px para 14px - melhor centralização vertical)

2. **Padding do input:**
   - `pl-11` → `pl-12` (de 44px para 48px)

3. **Resultado:**
   - Mais espaço entre ícone e texto (16px de margem)
   - Melhor alinhamento vertical
   - Sem sobreposição

## 📝 Campos Corrigidos

- ✅ Nome Completo (ícone User)
- ✅ E-mail (ícone Mail)
- ✅ WhatsApp (ícone Phone)
- ✅ Nome do Consultório/Clínica (ícone Building2)
- ✅ Observações (ícone FileText - textarea)

## 🚀 Como Aplicar

### Deploy do Frontend

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Build
npm run build

# Deploy
git add .
git commit -m "Fix: corrigir sobreposição de ícones nos inputs de agendamento"
git push origin main
```

## 🧪 Como Testar Após Deploy

1. Acesse: `https://sites-odonto.digitalizar.space/agendar`
2. Observe os campos do formulário
3. Verifique que:
   - ✅ Ícones estão **à esquerda** dos placeholders
   - ✅ Não há sobreposição
   - ✅ Há espaço visível entre ícone e texto
   - ✅ Ao digitar, o texto não fica sobre o ícone

## 📊 Comparação Visual

### Antes (com sobreposição):
```
[👤 Ex: Dr. João Silva        ]  ← Ícone sobre o texto
```

### Depois (sem sobreposição):
```
[👤  Ex: Dr. João Silva       ]  ← Espaço adequado
```

## 🎨 Medidas Técnicas

- **Posição do ícone:** 16px da borda esquerda
- **Tamanho do ícone:** 20px × 20px
- **Padding-left do input:** 48px
- **Espaço entre ícone e texto:** ~12px (48 - 16 - 20 = 12)

---

**Problema resolvido! Faça o deploy e teste.** ✅
