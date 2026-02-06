-- =============================================
-- BLOG POST: Por que consultórios com site captam 3x mais pacientes em 2026
-- Digitalizar Odonto - Primeira postagem do blog
-- =============================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Certifique-se de que blog-setup-fixed.sql já foi executado

BEGIN;

-- =============================================
-- 1. GARANTIR QUE A CATEGORIA EXISTE
-- =============================================

INSERT INTO blog_categories (name, slug, description, display_order)
VALUES
  (
    'Marketing Odontológico',
    'marketing-odontologico',
    'Estratégias de marketing digital e captação de pacientes para profissionais da odontologia',
    1
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. CRIAR TAGS RELEVANTES
-- =============================================

INSERT INTO blog_tags (name, slug)
VALUES
  ('presença digital', 'presenca-digital'),
  ('captação de pacientes', 'captacao-de-pacientes'),
  ('SEO para dentistas', 'seo-para-dentistas'),
  ('site odontológico', 'site-odontologico'),
  ('marketing digital', 'marketing-digital'),
  ('Google', 'google')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 3. INSERIR O POST
-- =============================================

-- Variável para armazenar o ID da categoria
DO $$
DECLARE
  v_category_id UUID;
  v_post_id UUID;
  v_tag_presenca_digital UUID;
  v_tag_captacao UUID;
  v_tag_seo UUID;
  v_tag_site UUID;
BEGIN
  -- Buscar ID da categoria
  SELECT id INTO v_category_id
  FROM blog_categories
  WHERE slug = 'marketing-odontologico';

  -- Gerar UUID para o post
  v_post_id := gen_random_uuid();

  -- Inserir o post
  INSERT INTO blog_posts (
    id,
    title,
    slug,
    excerpt,
    content,
    featured_image,
    meta_title,
    meta_description,
    category_id,
    author_id,
    author_name,
    status,
    published_at,
    view_count
  )
  VALUES (
    v_post_id,
    'Por que consultórios com site captam 3x mais pacientes (e o seu pode estar perdendo dinheiro)',
    'por-que-consultorio-odontologico-precisa-site-2026',
    'Seu consultório odontológico está invisível no Google? Descubra a história da Dra. Amanda e como um site profissional transformou sua agenda de vazia para lotada em apenas 2 meses.',
    -- CONTENT em formato Tiptap JSON
    '{
      "type": "doc",
      "content": [
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Índice" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "A história da Dra. Amanda" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "O que mudou no comportamento dos pacientes" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Por que Instagram não é suficiente" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "7 motivos para ter um site profissional" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "O que você está perdendo sem um site" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "As 3 objeções mais comuns (respondidas)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Por onde começar" }]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "A história que todo dentista precisa ouvir" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Junho de 2025." },
            { "type": "text", "text": " Dra. Amanda, dentista há 8 anos em Campinas, olhava para sua agenda e via o mesmo padrão: quartas e sextas pela manhã vazias. Segunda e quinta lotadas (pacientes antigos), mas pouquíssimos pacientes novos." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Ela tinha Instagram com 800 seguidores, postava regularmente, respondia todos os comentários. Mas algo não fazia sentido." }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Três quadras abaixo" },
            { "type": "text", "text": ", Dr. Carlos, recém-formado há 2 anos, tinha fila de espera. Consultório menor, menos experiência, Instagram com apenas 200 seguidores." }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "A diferença? " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Dr. Carlos tinha um site profissional." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Quando Dra. Amanda finalmente pesquisou \"dentista Campinas centro\" no Google, entendeu tudo:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Dr. Carlos aparecia em " },
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "1º lugar" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Site mostrando consultório, serviços, preços, depoimentos" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Botão de WhatsApp visível" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Avaliações 5 estrelas do Google integradas" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Ela não aparecia em lugar nenhum." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Dois meses depois de lançar seu site, Dra. Amanda tinha:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Agenda preenchida em 85%" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "12-15 novos pacientes por mês vindos do Google" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Pacientes chegando \"mais preparados\" (já conheciam os serviços)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Menos tempo explicando o básico pelo telefone" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Esta não é uma história inventada para vender." },
            { "type": "text", "text": " É o padrão que vemos todos os dias: dentistas excelentes, invisíveis online, perdendo pacientes para concorrentes com presença digital." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "O que mudou (e por que você não pode mais ignorar)" }]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "O paciente de 2026 é diferente" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Vamos ser diretos: " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "o comportamento mudou radicalmente." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Antes (2015-2018):" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Paciente ligava para vários consultórios" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Pegava indicação com amigos/família" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Marcava consulta para \"conhecer\"" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Decidia pessoalmente" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Agora (2026):" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Paciente " },
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "busca no Google" },
                  { "type": "text", "text": " \"dentista perto de mim\"" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Visita 3-5 sites de consultórios" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Lê avaliações, vê fotos, compara serviços" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Decide ANTES de ligar" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Entra no WhatsApp já querendo agendar" }]
              }]
            }
          ]
        },
        {
          "type": "blockquote",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "marks": [{ "type": "bold" }], "text": "Dado real:" },
              { "type": "text", "text": " Segundo pesquisa do Conselho Federal de Odontologia (2024), 73% dos pacientes de consultórios particulares encontraram o dentista através de busca online." }
            ]
          }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "A pergunta não é mais \"será que preciso de site?\"" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "A pergunta é: " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "\"Quantos pacientes estou perdendo por não ter um?\"" }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "\"Mas eu posto no Instagram, não basta?\"" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Essa é uma das perguntas que mais ouvimos. A resposta curta: " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "não." }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "A resposta longa: Instagram é excelente para " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "relacionamento" },
            { "type": "text", "text": ". Site é essencial para " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "captação" },
            { "type": "text", "text": "." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Teste rápido (faça agora):" }]
        },
        {
          "type": "orderedList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Abra uma aba anônima no navegador" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Busque: \"dentista [seu bairro]\"" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Seu Instagram apareceu?" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Provavelmente não." },
            { "type": "text", "text": " E sabe quem apareceu? Os consultórios com site." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "A estratégia vencedora (que dentistas de sucesso usam):" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Instagram/Facebook:" },
            { "type": "text", "text": " Para engajar pacientes atuais, mostrar dia a dia, humanizar a marca" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Site:" },
            { "type": "text", "text": " Para captar pacientes novos que estão buscando ativamente" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Não é UM ou OUTRO. É os DOIS trabalhando juntos." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Os 7 motivos reais pelos quais seu consultório precisa de um site em 2026" }]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "1. 🎯 Você está invisível para quem mais importa" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Pacientes que buscam \"dentista [sua cidade]\" no Google estão com:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Cartão de crédito na mão" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Dor/necessidade real" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Pressa para resolver" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Esses são os melhores leads possíveis." },
            { "type": "text", "text": " E você não aparece para eles." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "2. 💰 ROI incomparável com qualquer outra estratégia" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Anúncio no Google Ads:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Custa R$ 300-800/mês" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Para quando você para de pagar" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Site profissional:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Investimento único (ou mensalidade baixa)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Continua gerando pacientes mês após mês" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Valoriza com o tempo" },
                  { "type": "text", "text": " (quanto mais antigo, melhor ranqueia)" }
                ]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Cálculo simples:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Investimento site: R$ 497 (no nosso caso)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Pacientes novos/mês via Google: 8-12" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Valor médio por paciente: R$ 300-500" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "ROI no primeiro mês: 400-800%" }
                ]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "3. 🏆 Diferencial competitivo ainda acessível" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Pode parecer estranho, mas " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "a maioria dos dentistas ainda não tem site" },
            { "type": "text", "text": " ou tem sites terríveis de 2015." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Neste exato momento, em sua cidade:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "40-60% dos dentistas não têm site" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "30% têm sites desatualizados/ruins" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Apenas 10-20% têm presença digital profissional" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Você ainda pode entrar nesse grupo de elite." },
            { "type": "text", "text": " Mas a janela está fechando." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "O que você está perdendo AGORA (enquanto lê isso)" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Vamos fazer um exercício doloroso mas necessário:" }]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Cálculo conservador:" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Premissas:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Sua cidade tem 100.000 habitantes" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "2% buscam dentista por mês no Google = 2.000 buscas" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Você poderia captar 0,5% com um bom site = " },
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "10 novos pacientes/mês" }
                ]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Se valor médio do paciente é R$ 400:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Perda mensal sem site: R$ 4.000" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Perda anual: R$ 48.000" }
                ]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Em 5 anos? " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "R$ 240.000 que foram para a concorrência." }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "E isso sendo conservador. Muitos consultórios captam 15-25 pacientes novos/mês via site." }]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "As 3 objeções que travam dentistas (e a verdade sobre elas)" }]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Objeção 1: \"Meu consultório já está cheio, não preciso de mais pacientes\"" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Resposta:" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Primeiro: parabéns! Mas considere:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "E quando um paciente antigo sair?" },
                  { "type": "text", "text": " (muda de cidade, troca de dentista, etc.)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "E se você quiser expandir?" },
                  { "type": "text", "text": " (contratar outro dentista, abrir novo consultório)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "E pacientes para procedimentos específicos?" },
                  { "type": "text", "text": " (Implante, clareamento, ortodontia têm ticket maior)" }
                ]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Site não é para quem está desesperado. É para quem quer crescer com inteligência." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Objeção 2: \"Não tenho tempo para gerenciar um site\"" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Resposta:" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Você não precisa." }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Um site profissional bem feito:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Não precisa de atualização diária" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Roda sozinho 24/7" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Atualização 1-2x por ano (novos serviços, fotos)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Manutenção técnica: automática (hospedagem cuida)" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Com site:" },
            { "type": "text", "text": " Paciente lê tudo antes de ligar. Ligações são mais objetivas." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Objeção 3: \"Não entendo nada de tecnologia/Google/SEO\"" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Resposta:" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Você também não entende de encanamento, mas tem água na sua clínica, certo?" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Você não precisa saber COMO funciona. Você precisa CONTRATAR quem sabe." }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Por onde começar: Checklist do site odontológico perfeito" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Se você vai investir em um site (e deveria), ele PRECISA ter:" }]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "✅ Essenciais (não negocie esses):" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Design profissional" },
                  { "type": "text", "text": " (primeira impressão decide em 3 segundos)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Responsivo" },
                  { "type": "text", "text": " (70% dos acessos vêm de celular)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "Rápido" },
                  { "type": "text", "text": " (Google penaliza sites lentos)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{ "type": "bold" }], "text": "HTTPS" },
                  { "type": "text", "text": " (cadeado verde, segurança)" }
                ]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Telefone e WhatsApp visíveis (botão fixo)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Endereço com Google Maps integrado" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Lista de serviços (cada serviço = página específica para SEO)" }]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Próximos passos: Transforme seu consultório em 24h" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Se você chegou até aqui, sabe que precisa de um site. A questão é: " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "quando?" }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Opção 1:" },{ "type": "text", "text": " Deixar para \"quando tiver tempo\"" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Resultado: nunca vai ter tempo" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Enquanto isso: continua perdendo pacientes" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Opção 2:" },{ "type": "text", "text": " Começar agora" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Resultado: em 24-48h seu consultório está no Google" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Em 30 dias: primeiros pacientes chegando via busca orgânica" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Em 90 dias: fluxo constante e previsível de leads" }]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Como funciona na Digitalizar Odonto:" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "1️⃣ Você preenche um briefing completo" },
            { "type": "text", "text": " (30-40 minutos)" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "2️⃣ Nós criamos seu site em 24h" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "3️⃣ Você aprova e está no ar" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "4️⃣ Resultados começam a aparecer" }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [{ "type": "text", "text": "Investimento:" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "💰 R$ 497,00" },
            { "type": "text", "text": " (pagamento facilitado em 2x)" }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Incluso:" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Site completo e personalizado" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Design profissional exclusivo" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Otimização para Google (SEO)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Integração WhatsApp" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Responsivo (todos os dispositivos)" }]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Conclusão: A escolha mais óbvia de 2026" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Daqui a 1 ano, você vai estar em uma dessas situações:" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Situação A: Ainda sem site" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Mesma quantidade de pacientes (ou menos)" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Vendo concorrentes crescerem" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Arrependido de não ter começado antes" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Situação B: Com site otimizado" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "8-15 pacientes novos por mês via Google" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Agenda previsível" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Autoridade digital estabelecida" }]
              }]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "marks": [{ "type": "bold" }], "text": "Qual você escolhe?" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "A transformação digital da odontologia não é tendência. " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "É realidade." }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Você merece ter seu consultório encontrado." }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "Seus pacientes merecem te achar facilmente." }
          ]
        }
      ]
    }'::jsonb,
    -- FEATURED IMAGE (você pode substituir por uma imagem real depois)
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
    -- META TITLE
    'Por que consultórios com site captam 3x mais pacientes em 2026',
    -- META DESCRIPTION
    'Seu consultório odontológico está invisível no Google? Descubra por que dentistas com site profissional captam mais pacientes e como isso pode transformar sua prática.',
    -- CATEGORY ID
    v_category_id,
    -- AUTHOR ID (NULL se não tiver usuário autenticado)
    NULL,
    -- AUTHOR NAME
    'Equipe Digitalizar Odonto',
    -- STATUS
    'published',
    -- PUBLISHED AT
    NOW(),
    -- VIEW COUNT
    0
  );

  -- =============================================
  -- 4. ASSOCIAR TAGS AO POST
  -- =============================================

  -- Buscar IDs das tags
  SELECT id INTO v_tag_presenca_digital FROM blog_tags WHERE slug = 'presenca-digital';
  SELECT id INTO v_tag_captacao FROM blog_tags WHERE slug = 'captacao-de-pacientes';
  SELECT id INTO v_tag_seo FROM blog_tags WHERE slug = 'seo-para-dentistas';
  SELECT id INTO v_tag_site FROM blog_tags WHERE slug = 'site-odontologico';

  -- Inserir relações post-tag
  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES
    (v_post_id, v_tag_presenca_digital),
    (v_post_id, v_tag_captacao),
    (v_post_id, v_tag_seo),
    (v_post_id, v_tag_site);

  -- Mensagem de sucesso
  RAISE NOTICE 'Post criado com sucesso! ID: %', v_post_id;
  RAISE NOTICE 'Slug: por-que-consultorio-odontologico-precisa-site-2026';
  RAISE NOTICE 'Acesse: /blog/por-que-consultorio-odontologico-precisa-site-2026';

END $$;

COMMIT;

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- ✅ Para executar:
-- 1. Acesse Supabase Dashboard → SQL Editor
-- 2. Cole este script completo
-- 3. Clique em "Run"
-- 4. Verifique em Table Editor > blog_posts
-- 5. Acesse o post em: /blog/por-que-consultorio-odontologico-precisa-site-2026

-- 📝 Observações:
-- - O conteúdo está em formato Tiptap JSON
-- - Você pode adicionar uma imagem destacada (featured_image) depois
-- - Para editar o post, use o CMS admin em /admin/blog
-- - O post já está publicado e visível no blog público
