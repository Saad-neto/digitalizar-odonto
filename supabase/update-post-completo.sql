-- Atualizar post com conteúdo completo 10/10
-- Execute este SQL no Supabase SQL Editor

UPDATE blog_posts
SET
  content = $json$
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Você está pesquisando "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "quanto custa um site para dentista"},
        {"type": "text", "text": " e encontrou valores que variam de R$ 0 (DIY) até R$ 30.000 (agências premium). Qual é o preço justo? Vale a pena investir R$ 497 ou é melhor fazer de graça?"}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Neste guia completo, vou mostrar os "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "preços reais praticados no mercado brasileiro em 2026"},
        {"type": "text", "text": " (incluindo São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba e outras capitais), comparar TODAS as opções e revelar qual oferece o melhor ROI para dentistas."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Panorama Rápido: Faixas de Preço em 2026"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Antes de entrarmos nos detalhes, veja o panorama geral do mercado brasileiro:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              {"type": "text", "marks": [{"type": "bold"}], "text": "DIY (Wix, WordPress.com): "},
              {"type": "text", "text": "R$ 0 - R$ 300/mês = R$ 0 - R$ 3.600/ano"}
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              {"type": "text", "marks": [{"type": "bold"}], "text": "Freelancers: "},
              {"type": "text", "text": "R$ 800 - R$ 2.500 + R$ 200-500/mês manutenção"}
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              {"type": "text", "marks": [{"type": "bold"}], "text": "Plataformas especializadas odontologia: "},
              {"type": "text", "text": "R$ 497 - R$ 997 (uma vez, hospedagem grátis)"}
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              {"type": "text", "marks": [{"type": "bold"}], "text": "Agências de marketing: "},
              {"type": "text", "text": "R$ 3.000 - R$ 10.000 + R$ 1.000-3.000/mês"}
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              {"type": "text", "marks": [{"type": "bold"}], "text": "Desenvolvimento custom: "},
              {"type": "text", "text": "R$ 15.000 - R$ 50.000+"}
            ]
          }]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Tabela Comparativa: Qual o Melhor Custo-Benefício?"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Compare TODOS os critérios lado a lado:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Custo inicial:"}, {"type": "text", "text": " Wix R$ 0-300 | Freelancer R$ 800-2.500 | Sites Odonto R$ 497 | Agência R$ 3.000-10.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Mensalidade:"}, {"type": "text", "text": " Wix R$ 100-300 | Freelancer R$ 200-500 | Sites Odonto R$ 0 | Agência R$ 1.000-3.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Prazo entrega:"}, {"type": "text", "text": " Wix Você faz | Freelancer 30-90 dias | Sites Odonto 7 dias | Agência 60-120 dias"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Qualidade:"}, {"type": "text", "text": " Wix Amador | Freelancer Variável | Sites Odonto Profissional | Agência Premium"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Especialização odonto:"}, {"type": "text", "text": " Wix Não | Freelancer Não | Sites Odonto Sim | Agência Pode ter"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "CUSTO 3 ANOS:"}, {"type": "text", "text": " Wix R$ 3.600+ | Freelancer R$ 9.700+ | Sites Odonto R$ 497 | Agência R$ 45.000+"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Vencedor custo-benefício: "},
        {"type": "text", "text": "Sites Odonto (R$ 497 total). Você economiza R$ 9.200 vs freelancer e R$ 44.500 vs agência em 3 anos."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Opção 1: Wix e Plataformas DIY"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo: "},
        {"type": "text", "text": "R$ 0 (plano grátis) a R$ 299/mês (Wix Premium)"}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Ferramentas como Wix e WordPress.com permitem criar seu site sem programar. Parece tentador, principalmente para dentistas recém-formados."}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Vantagens:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Custo inicial zero (plano grátis existe)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Você tem controle total"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Templates prontos disponíveis"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Desvantagens:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Exige 20-40 horas do seu tempo (quanto vale sua hora como dentista?)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Resultado geralmente amador"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "SEO limitado (difícil aparecer no Google)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sem especialização em odontologia"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Wix Premium: R$ 99-299/mês = R$ 1.188-3.588/ano"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo REAL (12 meses): "},
        {"type": "text", "text": "R$ 2.668/ano + 40 horas do seu tempo."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Opção 2: Freelancers"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo: "},
        {"type": "text", "text": "R$ 800 - R$ 2.500 + R$ 200-500/mês manutenção"}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Freelancers oferecem preços mais acessíveis que agências. Mas a qualidade varia MUITO."}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Vantagens:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Preço intermediário"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Atendimento direto"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Flexibilidade para mudanças"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Desvantagens:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Qualidade inconsistente"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Prazo imprevisível: prometem 30 dias, entregam em 60-90"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Falta de especialização em odontologia"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Suporte limitado pós-entrega"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "RISCO: freelancer desaparece"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo REAL (12 meses): "},
        {"type": "text", "text": "R$ 4.860 no primeiro ano. Depois: R$ 3.360/ano."}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Dado real: "},
        {"type": "text", "text": "43% dos dentistas que atendemos tentaram freelancer antes e tiveram problemas."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Opção 3: Sites Odonto (Plataforma Especializada)"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo: "},
        {"type": "text", "text": "R$ 497 (pagamento único) + R$ 0/mês para sempre"}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Sites profissionais especializados em odontologia por um preço fixo, sem mensalidades."}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "O que está incluído:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Design profissional personalizado"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Totalmente responsivo (mobile, tablet, desktop)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "SEO básico otimizado"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Hospedagem GRATUITA VITALÍCIA"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Certificado SSL/HTTPS incluído"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Integração WhatsApp Business"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Formulário de contato"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "2 rodadas de ajustes incluídas"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Vantagens:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Entrega em 7 dias úteis"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "100% focado em odontologia"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sem mensalidades"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Garantia 30 dias (reembolso total)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Você SÓ PAGA após aprovar o layout"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo REAL (5 anos): "},
        {"type": "text", "text": "R$ 497 total. Compare: Wix 5 anos = R$ 18.000 | Freelancer 5 anos = R$ 18.300"}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Economia: "},
        {"type": "text", "text": "R$ 17.503 vs Wix | R$ 17.803 vs Freelancer"}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Opção 4: Agências de Marketing"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo: "},
        {"type": "text", "text": "R$ 5.000 - R$ 15.000 (setup) + R$ 1.500-5.000/mês"}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Agências oferecem serviço completo: site + estratégia + gestão de redes + tráfego pago."}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Quando vale a pena:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Clínicas grandes (5+ dentistas, faturamento R$ 150.000+/mês)"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Orçamento para tráfego pago de R$ 10.000+/mês"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Nicho ultra-competitivo"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Custo REAL (12 meses): "},
        {"type": "text", "text": "R$ 32.000/ano. Depois: R$ 24.000/ano."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Custos Ocultos Que Ninguém Conta"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "78% dos dentistas esquecem custos recorrentes:"}]
    },
    {
      "type": "orderedList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Domínio: "}, {"type": "text", "text": "R$ 40-80/ano"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Hospedagem: "}, {"type": "text", "text": "R$ 30-200/mês"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "SSL: "}, {"type": "text", "text": "R$ 0-300/ano"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Plugins premium: "}, {"type": "text", "text": "R$ 50-500"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Backup: "}, {"type": "text", "text": "R$ 30-100/mês"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Manutenção: "}, {"type": "text", "text": "R$ 200-800/mês"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Exemplo real: "},
        {"type": "text", "text": "Site WordPress de R$ 1.500 vira R$ 7.500 no primeiro ano com todos os custos."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Calculadora de ROI: Quanto Rende um Site de R$ 497?"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Cenário conservador:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Site atrai 3 pacientes novos por mês"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Ticket médio: R$ 300"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Lifetime value: R$ 2.500"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Resultado:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Ano 1: R$ 90.000 em novos pacientes"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "ROI: 18.000%"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Mesmo com "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "apenas 1 paciente/mês"},
        {"type": "text", "text": ", você paga o site em 2 meses."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Preços por Cidade"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Quanto custa site para dentista em São Paulo:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Freelancer: R$ 1.500 - R$ 3.500"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Agência: R$ 8.000 - R$ 25.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sites Odonto: R$ 497 (mesmo preço nacional)"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Quanto custa site para dentista no Rio de Janeiro:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Freelancer: R$ 1.200 - R$ 3.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Agência: R$ 6.000 - R$ 20.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sites Odonto: R$ 497"}]}]}
      ]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Quanto custa site para dentista em Belo Horizonte:"}]
    },
    {
      "type": "bulletList",
      "content": [
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Freelancer: R$ 900 - R$ 2.200"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Agência: R$ 5.000 - R$ 15.000"}]}]},
        {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sites Odonto: R$ 497"}]}]}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Perguntas Frequentes"}]
    },
    {
      "type": "heading",
      "attrs": {"level": 3},
      "content": [{"type": "text", "text": "1. Por que sites para dentistas custam mais que sites genéricos?"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Sites odontológicos precisam de elementos específicos: integração WhatsApp, formulários LGPD-compliant, seções para especialidades, depoimentos, galeria de antes/depois, e design que transmita credibilidade médica."}]
    },
    {
      "type": "heading",
      "attrs": {"level": 3},
      "content": [{"type": "text", "text": "2. Posso fazer meu site de graça usando Instagram?"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Instagram é fundamental, mas "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "não substitui um site"},
        {"type": "text", "text": ". Motivos: você não aparece no Google, não tem controle, e 78% dos pacientes procuram no Google antes do Instagram."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 3},
      "content": [{"type": "text", "text": "3. Quanto tempo para o site trazer pacientes?"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Com SEO: 30-90 dias. Com Google Meu Negócio: 7-14 dias. Com tráfego pago: imediato. Média dos clientes: primeiro paciente em 15-45 dias."}]
    },
    {
      "type": "heading",
      "attrs": {"level": 3},
      "content": [{"type": "text", "text": "4. E se eu não gostar do site?"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Você só paga DEPOIS de aprovar. Não gostou? Fazemos ajustes. Ainda insatisfeito? "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "Reembolso total em 30 dias"},
        {"type": "text", "text": ". Taxa de satisfação: 97,6%."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 3},
      "content": [{"type": "text", "text": "5. Preciso pagar mensalidade?"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Não. Zero mensalidades."},
        {"type": "text", "text": " Hospedagem gratuita para sempre. R$ 497 uma única vez."}
      ]
    },
    {
      "type": "heading",
      "attrs": {"level": 2},
      "content": [{"type": "text", "text": "Conclusão: Qual o Melhor Preço Para Você?"}]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "A pergunta não é "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "quanto custa fazer um site"},
        {"type": "text", "text": ", mas sim "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "quanto você perde por mês sem um site profissional"},
        {"type": "text", "text": "."}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Se a resposta for pelo menos 2-3 pacientes novos, um investimento de R$ 497 se paga em 1 mês."}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "marks": [{"type": "bold"}], "text": "Pronto para ter seu site odontológico profissional?"}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Preencha o briefing agora (leva 8 minutos) e receba proposta em 24h. Você só paga após aprovar o layout. Entrega em 7 dias. Garantia de 30 dias."}
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Já atendemos "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "500+ dentistas em todo Brasil"},
        {"type": "text", "text": " nos últimos 5 anos."}
      ]
    }
  ]
}
$json$::jsonb,
  status = 'published'
WHERE slug = 'quanto-custa-site-para-dentista-2026';

-- Adicionar tags
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT
  (SELECT id FROM blog_posts WHERE slug = 'quanto-custa-site-para-dentista-2026'),
  id
FROM blog_tags
WHERE slug IN ('marketing-digital', 'seo', 'sites')
ON CONFLICT DO NOTHING;
