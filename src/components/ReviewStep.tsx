import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle2, MapPin, Briefcase, Star, Mail, Phone, Globe, Instagram, AlertCircle, Users, Image, Palette, Monitor } from 'lucide-react';

interface FormData {
  [key: string]: any;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

interface HotmartVenda {
  id: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string | null;
  plano: string;
}

interface ReviewStepProps {
  formData: FormData;
  uploadedFiles: { [key: string]: UploadedFile[] };
  onEdit: (sectionIndex: number) => void;
  hotmartVenda?: HotmartVenda | null;
  isFromHotmart?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, uploadedFiles, onEdit, hotmartVenda, isFromHotmart }) => {
  const [observacoes, setObservacoes] = useState(formData.observacoes_revisao || '');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-gray-400 italic">Não informado</span>;
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : <span className="text-gray-400 italic">Não informado</span>;
    }
    return value;
  };

  // Mapa de serviços para labels legíveis
  const servicosMap: { [key: string]: string } = {
    'limpeza': 'Limpeza e profilaxia',
    'clareamento': 'Clareamento dental',
    'restauracoes': 'Restaurações em resina',
    'canal': 'Tratamento de canal (endodontia)',
    'implantes': 'Implantes dentários',
    'proteses': 'Próteses dentárias',
    'ortodontia_fixa': 'Ortodontia (aparelho fixo)',
    'ortodontia_invisivel': 'Ortodontia invisível (alinhadores)',
    'extracao': 'Extração de dentes/sisos',
    'periodontia': 'Periodontia (tratamento de gengiva)',
    'odontopediatria': 'Odontopediatria (dentista infantil)',
    'harmonizacao': 'Harmonização facial',
    'bichectomia': 'Bichectomia',
    'lentes': 'Lentes de contato dental',
    'facetas': 'Facetas de porcelana',
    'cirurgia': 'Cirurgia bucomaxilofacial',
    'dtm': 'DTM e bruxismo',
    'emergencia': 'Emergências 24h',
    'outro': 'Outro'
  };

  const renderServicos = () => {
    if (!formData.servicos || formData.servicos.length === 0) {
      return <span className="text-gray-400 italic">Não informado</span>;
    }
    const labels = formData.servicos.map((s: string) => servicosMap[s] || s);
    return labels.join(', ');
  };

  const renderHorarios = () => {
    // Novo formato de array dinâmico
    if (formData.horarios_atendimento_array && formData.horarios_atendimento_array.length > 0) {
      const diasMap: { [key: string]: string } = {
        'segunda': 'Segunda-feira',
        'terca': 'Terça-feira',
        'quarta': 'Quarta-feira',
        'quinta': 'Quinta-feira',
        'sexta': 'Sexta-feira',
        'sabado': 'Sábado',
        'domingo': 'Domingo'
      };
      return (
        <div className="space-y-2 mt-2">
          {formData.horarios_atendimento_array.map((horario: any, index: number) => (
            <div key={index} className="bg-purple-50 p-3 rounded-lg">
              <span className="font-medium text-gray-900">{diasMap[horario.dia] || horario.dia}</span>
              <span className="text-gray-600 ml-2">
                {horario.inicio || '00:00'} às {horario.fim || '00:00'}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-400 italic">Não informado</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Revise suas informações
        </h2>
        <p className="text-gray-600">
          Confira todos os dados antes de finalizar. Você pode editar qualquer seção clicando no botão de editar.
        </p>
      </div>

      {/* SEÇÃO 1: Informações Essenciais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                1. Informações Essenciais
              </h3>
              <p className="text-sm text-gray-500">Dados básicos do consultório</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(0)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Nome do Consultório/Clínica</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.nome_consultorio)}</p>
            </div>

            {/* Dados de contato - Hotmart ou Formulário */}
            {isFromHotmart && hotmartVenda ? (
              <>
                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-blue-700 font-medium mb-2">📋 Dados de contato (Hotmart)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-blue-600">Nome</label>
                      <p className="text-gray-900 text-sm">{hotmartVenda.cliente_nome}</p>
                    </div>
                    <div>
                      <label className="text-xs text-blue-600">E-mail</label>
                      <p className="text-gray-900 text-sm truncate">{hotmartVenda.cliente_email}</p>
                    </div>
                    {hotmartVenda.cliente_telefone && (
                      <div>
                        <label className="text-xs text-blue-600">Telefone</label>
                        <p className="text-gray-900 text-sm">{hotmartVenda.cliente_telefone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500">Seu Nome</label>
                  <p className="text-gray-900 mt-1">{renderValue(formData.nome)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </label>
                  <p className="text-gray-900 mt-1">{renderValue(formData.whatsapp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    E-mail
                  </label>
                  <p className="text-gray-900 mt-1">{renderValue(formData.email)}</p>
                </div>
              </>
            )}
            {formData.especialidade_principal && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Especialidade Principal</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.especialidade_principal)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: Hero / Banner Principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-600" />
                2. Hero / Banner Principal
              </h3>
              <p className="text-sm text-gray-500">Banner de destaque do site</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            {formData.hero_titulo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Título do Banner</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.hero_titulo)}</p>
              </div>
            )}
            {formData.hero_subtitulo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Subtítulo do Banner</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.hero_subtitulo)}</p>
              </div>
            )}
            {formData.hero_cta_texto && (
              <div>
                <label className="text-sm font-medium text-gray-500">Texto do Botão Principal</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.hero_cta_texto)}</p>
              </div>
            )}
            {(formData.widget1_numero || formData.widget2_numero || formData.widget3_numero || formData.widget4_numero) && !formData.ocultar_widgets && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Widgets de Estatísticas</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.widget1_numero && (
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.widget1_numero}</p>
                      <p className="text-xs text-gray-600 mt-1">{formData.widget1_label}</p>
                    </div>
                  )}
                  {formData.widget2_numero && (
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.widget2_numero}</p>
                      <p className="text-xs text-gray-600 mt-1">{formData.widget2_label}</p>
                    </div>
                  )}
                  {formData.widget3_numero && (
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.widget3_numero}</p>
                      <p className="text-xs text-gray-600 mt-1">{formData.widget3_label}</p>
                    </div>
                  )}
                  {formData.widget4_numero && (
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.widget4_numero}</p>
                      <p className="text-xs text-gray-600 mt-1">{formData.widget4_label}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Imagem do Banner */}
            {uploadedFiles.hero_imagem && uploadedFiles.hero_imagem.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Imagem do Banner</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.hero_imagem.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        {file.name} ({formatFileSize(file.size)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 3: Sobre a Clínica */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                3. Sobre a Clínica
              </h3>
              <p className="text-sm text-gray-500">Apresentação da clínica</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            {formData.sobre_titulo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Título da Seção Sobre</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.sobre_titulo)}</p>
              </div>
            )}
            {formData.sobre_texto && (
              <div>
                <label className="text-sm font-medium text-gray-500">Texto Sobre a Clínica</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words overflow-wrap-anywhere">{renderValue(formData.sobre_texto)}</p>
              </div>
            )}
            {formData.redes_sociais && formData.redes_sociais.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Redes Sociais</label>
                <div className="space-y-2">
                  {formData.redes_sociais.map((rede: any, index: number) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">{rede.tipo}</p>
                        <p className="text-sm text-gray-600">{rede.usuario || rede.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formData.missao && (
              <div>
                <label className="text-sm font-medium text-gray-500">Missão</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.missao)}</p>
              </div>
            )}
            {formData.visao && (
              <div>
                <label className="text-sm font-medium text-gray-500">Visão</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.visao)}</p>
              </div>
            )}
            {formData.valores && (
              <div>
                <label className="text-sm font-medium text-gray-500">Valores</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.valores)}</p>
              </div>
            )}
            {formData.anos_experiencia && (
              <div>
                <label className="text-sm font-medium text-gray-500">Anos de Experiência</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.anos_experiencia)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: Equipe / Profissionais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                4. Equipe
              </h3>
              <p className="text-sm text-gray-500">Profissionais da clínica</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-6">
            {formData.profissionais && formData.profissionais.length > 0 ? (
              formData.profissionais.map((prof: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-300 pl-4 bg-purple-50/30 p-3 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Profissional {index + 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome</label>
                      <p className="text-gray-900 mt-1">{renderValue(prof.nome)}</p>
                    </div>
                    {prof.registro && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">CRO</label>
                        <p className="text-gray-900 mt-1">{renderValue(prof.registro)}</p>
                      </div>
                    )}
                    {(prof.especialidades && prof.especialidades.length > 0) ? (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Especialidades</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {prof.especialidades.map((esp: string, espIdx: number) => {
                            const isCustom = esp.startsWith('outro:');
                            const displayName = isCustom ? esp.replace('outro:', '') : esp;
                            return (
                              <span key={espIdx} className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                {displayName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ) : prof.especialidade && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Especialidade</label>
                        <p className="text-gray-900 mt-1">{renderValue(prof.especialidade)}</p>
                      </div>
                    )}
                    {prof.descricao && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Descrição</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words overflow-wrap-anywhere">{renderValue(prof.descricao)}</p>
                      </div>
                    )}
                    {prof.foto && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 block mb-2">Foto do Profissional</label>
                        <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-purple-200 bg-gray-100 flex items-center justify-center">
                          <img
                            src={typeof prof.foto === 'string' ? prof.foto : prof.foto?.data}
                            alt={prof.nome || 'Profissional'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="text-gray-400 text-sm text-center p-4">Imagem não disponível</div>';
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {prof.foto?.name || 'Foto'} ({prof.foto?.size ? formatFileSize(prof.foto.size) : 'N/A'})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">Nenhum profissional cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 5: Serviços e Diferenciais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                5. Serviços e Diferenciais
              </h3>
              <p className="text-sm text-gray-500">O que você oferece</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Serviços Oferecidos</label>
              <p className="text-gray-900 mt-1">{renderServicos()}</p>
              {formData.servico_outro && (
                <p className="text-gray-600 mt-1 text-sm">Personalizado: {formData.servico_outro}</p>
              )}
            </div>

            {formData.aceita_convenios && (
              <div>
                <label className="text-sm font-medium text-gray-500">Aceita Convênios?</label>
                <p className="text-gray-900 mt-1">{formData.aceita_convenios === 'sim' ? 'Sim' : 'Não'}</p>
                {formData.lista_convenios && formData.aceita_convenios === 'sim' && (
                  <p className="text-gray-600 mt-1 text-sm">Convênios: {formData.lista_convenios}</p>
                )}
              </div>
            )}

            {formData.diferenciais && formData.diferenciais.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Diferenciais</label>
                <p className="text-gray-900 mt-1">{Array.isArray(formData.diferenciais) ? formData.diferenciais.join(', ') : formData.diferenciais}</p>
                {formData.diferencial_outro && (
                  <p className="text-gray-600 mt-1 text-sm">Personalizado: {formData.diferencial_outro}</p>
                )}
              </div>
            )}

            {/* Fotos de Antes/Depois */}
            {uploadedFiles.fotos_antes_depois && uploadedFiles.fotos_antes_depois.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  📸 Fotos de Antes/Depois ({uploadedFiles.fotos_antes_depois.length} foto{uploadedFiles.fotos_antes_depois.length > 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {uploadedFiles.fotos_antes_depois.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all"
                      />
                      <div className="mt-1 text-xs text-gray-500 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-green-600 mt-2">
                  ✓ {uploadedFiles.fotos_antes_depois.length} foto{uploadedFiles.fotos_antes_depois.length > 1 ? 's' : ''} será{uploadedFiles.fotos_antes_depois.length > 1 ? 'ão' : ''} incluída{uploadedFiles.fotos_antes_depois.length > 1 ? 's' : ''} no site
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 6: Identidade Visual */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                6. Identidade Visual
              </h3>
              <p className="text-sm text-gray-500">Logo, cores e referências</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(5)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            {uploadedFiles.logo && uploadedFiles.logo.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Logo da Clínica</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.logo.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-32 h-32 object-contain rounded-lg border-2 border-gray-200 bg-white p-2"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        {file.name} ({formatFileSize(file.size)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.cores_personalizadas && formData.cores_personalizadas.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-3">Paleta de Cores</label>
                <div className="space-y-2">
                  {formData.cores_personalizadas.map((cor: any, index: number) => {
                    const tipoLabels: { [key: string]: string } = {
                      'primaria': 'Cor Primária',
                      'secundaria': 'Cor Secundária',
                      'texto': 'Cor de Texto',
                      'fundo': 'Cor de Fundo',
                      'destaque': 'Cor de Destaque/Accent'
                    };
                    return (
                      <div key={index} className="bg-purple-50 p-3 rounded-lg flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: cor.valor || '#8B5CF6' }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">{tipoLabels[cor.tipo] || cor.tipo || 'Tipo não definido'}</p>
                          <p className="text-sm text-gray-600">{cor.valor || '#8B5CF6'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.sites_referencia_array && formData.sites_referencia_array.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Sites de Referência</label>
                <div className="space-y-2">
                  {formData.sites_referencia_array.map((site: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                        {site.url}
                      </a>
                      {site.motivo && (
                        <p className="text-sm text-gray-600 mt-1">{site.motivo}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedFiles.fotos_espaco && uploadedFiles.fotos_espaco.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Fotos do Espaço</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.fotos_espaco.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 7: Depoimentos, Localização e Contato */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                7. Localização e Contato
              </h3>
              <p className="text-sm text-gray-500">Endereço e horários</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(6)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            {/* Contatos do Site */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium mb-3">📞 Contatos para o Site</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-green-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    WhatsApp do Site
                  </label>
                  <p className="text-gray-900 text-sm mt-1">{renderValue(formData.whatsapp_site)}</p>
                </div>
                {formData.telefone_site && (
                  <div>
                    <label className="text-xs text-green-600">Telefone Fixo</label>
                    <p className="text-gray-900 text-sm mt-1">{formData.telefone_site}</p>
                  </div>
                )}
                {formData.email_site && (
                  <div>
                    <label className="text-xs text-green-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      E-mail da Clínica
                    </label>
                    <p className="text-gray-900 text-sm mt-1 truncate">{formData.email_site}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Google Meu Negócio */}
            {formData.link_google_maps && (
              <div>
                <label className="text-sm font-medium text-gray-500">Google Meu Negócio</label>
                <p className="text-gray-900 mt-1">✓ Link configurado</p>
                <p className="text-gray-600 mt-1 text-sm break-all">{formData.link_google_maps}</p>
              </div>
            )}

            {/* Método de Endereço */}
            {formData.metodo_endereco && (
              <div>
                <label className="text-sm font-medium text-gray-500">Método de Informação do Endereço</label>
                <p className="text-gray-900 mt-1">
                  {formData.metodo_endereco === 'google' && '⚡ Usando Google Meu Negócio (automático)'}
                  {formData.metodo_endereco === 'manual' && '✍️ Endereço preenchido manualmente'}
                </p>
                {formData.metodo_endereco === 'google' && formData.exibir_mapa === 'sim' && (
                  <p className="text-green-600 mt-1 text-sm">🗺️ Mapa interativo será exibido no site</p>
                )}
              </div>
            )}

            {/* Endereço */}
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço Completo</label>
              <p className="text-gray-900 mt-1">
                {formData.rua && `${formData.rua}, `}
                {formData.numero}
                {formData.complemento && `, ${formData.complemento}`}
                {formData.bairro && ` - ${formData.bairro}`}
                {formData.cidade && ` - ${formData.cidade}`}
                {formData.estado && `/${formData.estado}`}
                {formData.cep && ` - CEP: ${formData.cep}`}
              </p>
            </div>

            {/* Horários de Atendimento */}
            <div>
              <label className="text-sm font-medium text-gray-500">Horários de Atendimento</label>
              {renderHorarios()}
            </div>

            {/* Facilidades */}
            {formData.tem_acessibilidade && (
              <div>
                <label className="text-sm font-medium text-gray-500">Facilidades</label>
                <div className="mt-2 space-y-1">
                  {formData.tem_acessibilidade === 'sim' && (
                    <p className="text-gray-900">✓ Acessibilidade para cadeirantes</p>
                  )}
                </div>
              </div>
            )}

            {/* Mapa */}
            {formData.exibir_mapa && (
              <div>
                <label className="text-sm font-medium text-gray-500">Exibir Mapa no Site</label>
                <p className="text-gray-900 mt-1">{formData.exibir_mapa === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 8: Rastreamento e Integrações */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                8. Rastreamento e Integrações
              </h3>
              <p className="text-sm text-gray-500">Tags de análise e remarketing (Opcional)</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(7)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          {!formData.ga4_id && !formData.meta_pixel_id && !formData.gtm_id && !formData.google_ads_conversion && !formData.outras_tags ? (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-sm">
                Nenhuma tag de rastreamento configurada. Você pode adicionar mais tarde se precisar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.ga4_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Google Analytics 4 (GA4)</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">{formData.ga4_id}</p>
                </div>
              )}
              {formData.meta_pixel_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Meta Pixel (Facebook/Instagram)</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">{formData.meta_pixel_id}</p>
                </div>
              )}
              {formData.gtm_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Google Tag Manager (GTM)</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">{formData.gtm_id}</p>
                </div>
              )}
              {formData.google_ads_conversion && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Google Ads - Rastreamento de Conversão</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">{formData.google_ads_conversion}</p>
                </div>
              )}
              {formData.outras_tags && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Outras Tags/Scripts</label>
                  <pre className="text-gray-900 mt-1 text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
                    {formData.outras_tags}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CAMPO DE OBSERVAÇÕES FINAIS */}
      <Card className="border-2 border-purple-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              Observações Finais (Opcional)
            </h3>
            <p className="text-sm text-gray-500">
              Se houver alguma informação adicional, pedido especial ou observação que você gostaria de nos passar, escreva aqui.
            </p>
          </div>

          <textarea
            value={observacoes}
            onChange={(e) => {
              setObservacoes(e.target.value);
              // Atualizar formData diretamente
              formData.observacoes_revisao = e.target.value;
            }}
            placeholder="Ex: Gostaria de enfatizar nosso diferencial em implantes... / Preciso do site com urgência para uma campanha... / etc."
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            {observacoes.length} caracteres
          </p>
        </CardContent>
      </Card>

      {/* AVISO FINAL */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">Atenção</h4>
            <p className="text-sm text-yellow-800">
              Revise cuidadosamente todas as informações. Após finalizar, você receberá um e-mail de confirmação
              e poderá prosseguir para o pagamento para iniciar a criação do seu site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
