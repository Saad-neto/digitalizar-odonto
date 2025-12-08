import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle2, MapPin, Briefcase, Star, Mail, Phone, Globe, Instagram, AlertCircle, Users } from 'lucide-react';

interface FormData {
  [key: string]: any;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

interface ReviewStepProps {
  formData: FormData;
  uploadedFiles: { [key: string]: UploadedFile[] };
  onEdit: (sectionIndex: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, uploadedFiles, onEdit }) => {
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

  // Mapa de slogans para labels legíveis
  const sloganMap: { [key: string]: string } = {
    'sorriso_perfeito': 'Seu sorriso perfeito começa aqui',
    'sorriso_confiante': 'Sorrisos com confiança e segurança',
    'qualidade_atendimento': 'Odontologia de qualidade com atendimento humanizado',
    'tecnologia_avancada': 'Tecnologia avançada para cuidar do seu sorriso',
    'tratamento_odontologico': 'Tratamento odontológico com cuidado',
    'tenho_slogan': 'Tenho meu próprio slogan',
    'anos_experiencia': 'Cuidando do seu sorriso há [X] anos'
  };

  const renderServicos = () => {
    if (!formData.servicos || formData.servicos.length === 0) {
      return <span className="text-gray-400 italic">Não informado</span>;
    }
    const labels = formData.servicos.map((s: string) => servicosMap[s] || s);
    return labels.join(', ');
  };

  const renderHorarios = () => {
    if (!formData.horarios_atendimento || formData.horarios_atendimento.length === 0) {
      return <span className="text-gray-400 italic">Não informado</span>;
    }
    const horariosMap: { [key: string]: string } = {
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite',
      'sabado': 'Sábado',
      'domingo_feriados': 'Domingos e feriados'
    };
    const labels = formData.horarios_atendimento.map((h: string) => horariosMap[h] || h);
    return labels.join(', ');
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

      {/* Seção 1: Informações Essenciais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Informações Essenciais
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
            <div>
              <label className="text-sm font-medium text-gray-500">Nome do Consultório/Clínica</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.nome_consultorio)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Negócio</label>
              <p className="text-gray-900 mt-1">
                {formData.tipo_negocio === 'solo' && 'Profissional solo (atuo sozinho)'}
                {formData.tipo_negocio === 'pequena_equipe' && 'Pequena equipe (2-5 profissionais)'}
                {formData.tipo_negocio === 'clinica' && 'Clínica odontológica'}
                {!formData.tipo_negocio && renderValue(formData.tipo_negocio)}
              </p>
            </div>
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
            {formData.slogan_opcao && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Slogan</label>
                <p className="text-gray-900 mt-1">
                  {formData.slogan_opcao === 'custom' ? formData.slogan_custom : (sloganMap[formData.slogan_opcao] || formData.slogan_opcao)}
                </p>
              </div>
            )}
            {formData.ano_inicio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Ano de Início</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.ano_inicio)}</p>
              </div>
            )}
            {formData.num_pacientes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Pacientes Atendidos</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.num_pacientes)}</p>
              </div>
            )}
            {formData.tem_google_negocio && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Tem Perfil no Google Meu Negócio?</label>
                <p className="text-gray-900 mt-1">{formData.tem_google_negocio === 'sim' ? 'Sim' : 'Não'}</p>
                {formData.link_google_negocio && (
                  <p className="text-gray-600 mt-1 text-sm">Link: {formData.link_google_negocio}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Profissionais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Sobre o(s) Profissional(is)
              </h3>
              <p className="text-sm text-gray-500">Informações da equipe</p>
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

          <div className="space-y-6">
            {/* Profissional 1 */}
            {formData.profissional1_nome && (
              <div className="border-l-4 border-purple-300 pl-4">
                <h4 className="font-semibold text-gray-900 mb-3">Profissional 1</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_nome)}</p>
                  </div>
                  {formData.profissional1_apresentacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Apresentação</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_apresentacao)}</p>
                    </div>
                  )}
                  {formData.profissional1_cro && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">CRO</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_cro)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">UF</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_uf)}</p>
                      </div>
                    </div>
                  )}
                  {formData.profissional1_especialidade && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Especialidade</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_especialidade)}</p>
                    </div>
                  )}
                  {formData.profissional1_formacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Formação</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional1_formacao)}</p>
                    </div>
                  )}
                  {formData.profissional1_bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mini Biografia</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.profissional1_bio)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profissional 2 */}
            {formData.profissional2_nome && (
              <div className="border-l-4 border-purple-300 pl-4">
                <h4 className="font-semibold text-gray-900 mb-3">Profissional 2</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_nome)}</p>
                  </div>
                  {formData.profissional2_apresentacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Apresentação</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_apresentacao)}</p>
                    </div>
                  )}
                  {formData.profissional2_cro && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">CRO</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_cro)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">UF</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_uf)}</p>
                      </div>
                    </div>
                  )}
                  {formData.profissional2_especialidade && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Especialidade</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_especialidade)}</p>
                    </div>
                  )}
                  {formData.profissional2_formacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Formação</label>
                      <p className="text-gray-900 mt-1">{renderValue(formData.profissional2_formacao)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diretor Técnico */}
            {formData.diretor_nome && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Diretor Técnico
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-gray-900 mt-1">{renderValue(formData.diretor_nome)}</p>
                  </div>
                  {formData.diretor_cro && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">CRO</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.diretor_cro)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">UF</label>
                        <p className="text-gray-900 mt-1">{renderValue(formData.diretor_uf)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Número de profissionais */}
            {formData.num_profissionais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Profissionais na Equipe</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.num_profissionais)}</p>
              </div>
            )}

            {/* Fotos dos profissionais */}
            {uploadedFiles.fotos_profissionais && uploadedFiles.fotos_profissionais.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Fotos dos Profissionais</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.fotos_profissionais.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Serviços e Diferenciais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Serviços e Diferenciais
              </h3>
              <p className="text-sm text-gray-500">O que você oferece</p>
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
            <div>
              <label className="text-sm font-medium text-gray-500">Serviços Oferecidos</label>
              <p className="text-gray-900 mt-1">{renderServicos()}</p>
              {formData.servico_outro && (
                <p className="text-gray-600 mt-1 text-sm">Outro: {formData.servico_outro}</p>
              )}
            </div>

            {formData.aceita_convenios && (
              <div>
                <label className="text-sm font-medium text-gray-500">Aceita Convênios?</label>
                <p className="text-gray-900 mt-1">{formData.aceita_convenios === 'sim' ? 'Sim' : 'Não'}</p>
                {formData.lista_convenios_array && formData.lista_convenios_array.length > 0 && formData.aceita_convenios === 'sim' && (
                  <p className="text-gray-600 mt-1 text-sm">
                    Convênios: {formData.lista_convenios_array.filter((c: string) => c !== 'outro_convenio').join(', ')}
                    {formData.outro_convenio && `, ${formData.outro_convenio}`}
                  </p>
                )}
              </div>
            )}

            {formData.atende_emergencia && (
              <div>
                <label className="text-sm font-medium text-gray-500">Atendimento de Emergência</label>
                <p className="text-gray-900 mt-1">
                  {formData.atende_emergencia === 'sim_24h' ? 'Sim, 24 horas' : 'Não, apenas horário comercial'}
                </p>
              </div>
            )}

            {formData.tecnologias && formData.tecnologias.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tecnologias e Equipamentos</label>
                <p className="text-gray-900 mt-1">{Array.isArray(formData.tecnologias) ? formData.tecnologias.join(', ') : formData.tecnologias}</p>
                {formData.tecnologia_outro && (
                  <p className="text-gray-600 mt-1 text-sm">Outro: {formData.tecnologia_outro}</p>
                )}
              </div>
            )}

            {formData.diferenciais && formData.diferenciais.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Diferenciais</label>
                <p className="text-gray-900 mt-1">{Array.isArray(formData.diferenciais) ? formData.diferenciais.join(', ') : formData.diferenciais}</p>
                {formData.diferencial_outro && (
                  <p className="text-gray-600 mt-1 text-sm">Outro: {formData.diferencial_outro}</p>
                )}
              </div>
            )}

            {formData.publico_alvo && formData.publico_alvo.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Público-Alvo</label>
                <p className="text-gray-900 mt-1">{Array.isArray(formData.publico_alvo) ? formData.publico_alvo.join(', ') : formData.publico_alvo}</p>
                {formData.publico_outro && (
                  <p className="text-gray-600 mt-1 text-sm">Outro: {formData.publico_outro}</p>
                )}
              </div>
            )}

            {formData.tem_depoimentos && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tem Depoimentos?</label>
                <p className="text-gray-900 mt-1">{formData.tem_depoimentos === 'sim' ? 'Sim' : 'Não'}</p>
                {formData.depoimentos_texto && formData.tem_depoimentos === 'sim' && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{formData.depoimentos_texto}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 4: Localização e Contato */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Localização e Contato
              </h3>
              <p className="text-sm text-gray-500">Como encontrar você</p>
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

          <div className="space-y-4">
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

            {formData.tem_redes_sociais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Redes Sociais</label>
                <div className="mt-2 space-y-2">
                  {formData.instagram && (
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-900">Instagram: {formData.instagram}</span>
                    </div>
                  )}
                  {formData.facebook && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-900">Facebook: {formData.facebook}</span>
                    </div>
                  )}
                  {formData.tiktok && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-900">TikTok: {formData.tiktok}</span>
                    </div>
                  )}
                  {formData.linkedin && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-900">LinkedIn: {formData.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.horarios_atendimento && formData.horarios_atendimento.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Horários de Atendimento</label>
                <p className="text-gray-900 mt-1">{renderHorarios()}</p>
              </div>
            )}

            {formData.estacionamento && (
              <div>
                <label className="text-sm font-medium text-gray-500">Estacionamento</label>
                <p className="text-gray-900 mt-1">{formData.estacionamento === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            )}

            {formData.acessibilidade && (
              <div>
                <label className="text-sm font-medium text-gray-500">Acessibilidade</label>
                <p className="text-gray-900 mt-1">{formData.acessibilidade === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            )}

            {formData.exibir_mapa && (
              <div>
                <label className="text-sm font-medium text-gray-500">Exibir Mapa do Google no Site</label>
                <p className="text-gray-900 mt-1">{formData.exibir_mapa === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            )}

            {formData.outras_redes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Outras Redes Sociais</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.outras_redes)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 5: Materiais Visuais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Materiais Visuais
              </h3>
              <p className="text-sm text-gray-500">Imagens e identidade visual</p>
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

            {uploadedFiles.hero_desktop && uploadedFiles.hero_desktop.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Imagem Hero (Desktop)</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.hero_desktop.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-48 h-28 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Primeira imagem vista no computador</p>
              </div>
            )}

            {uploadedFiles.hero_mobile && uploadedFiles.hero_mobile.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Imagem Hero (Mobile)</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.hero_mobile.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={file.data}
                        alt={file.name}
                        className="w-24 h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Versão para celular (vertical)</p>
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
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.cor_preferida && (
              <div>
                <label className="text-sm font-medium text-gray-500">Cor Preferida</label>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.cor_preferida }}
                  ></div>
                  <span className="text-gray-900">{formData.cor_preferida}</span>
                </div>
              </div>
            )}

            {formData.estilo_site && (
              <div>
                <label className="text-sm font-medium text-gray-500">Estilo do Site</label>
                <p className="text-gray-900 mt-1">
                  {formData.estilo_site === 'moderno' && 'Moderno e Minimalista'}
                  {formData.estilo_site === 'profissional' && 'Profissional e Corporativo'}
                  {formData.estilo_site === 'acolhedor' && 'Acolhedor e Humano'}
                  {formData.estilo_site === 'inovador' && 'Inovador e Tecnológico'}
                  {!['moderno', 'profissional', 'acolhedor', 'inovador'].includes(formData.estilo_site) && renderValue(formData.estilo_site)}
                </p>
              </div>
            )}

            {formData.sites_referencia && (
              <div>
                <label className="text-sm font-medium text-gray-500">Sites de Referência</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.sites_referencia)}</p>
              </div>
            )}

            {formData.prazo_desejado && (
              <div>
                <label className="text-sm font-medium text-gray-500">Prazo Desejado</label>
                <p className="text-gray-900 mt-1">
                  {formData.prazo_desejado === 'urgente' && '⚡ 24 horas (Urgente) - Taxa adicional'}
                  {formData.prazo_desejado === 'rapido' && '🚀 3-5 dias'}
                  {formData.prazo_desejado === 'normal' && '📅 1-2 semanas'}
                  {formData.prazo_desejado === 'flexivel' && '🕐 Flexível (mais de 2 semanas)'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 6: Depoimentos e Observações */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Depoimentos e Observações
              </h3>
              <p className="text-sm text-gray-500">Avaliações e informações extras</p>
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
            {formData.estrategia_depoimentos && (
              <div>
                <label className="text-sm font-medium text-gray-500">Estratégia de Depoimentos</label>
                <p className="text-gray-900 mt-1">
                  {formData.estrategia_depoimentos === 'google' && '⭐ Usar avaliações do Google (automático)'}
                  {formData.estrategia_depoimentos === 'texto' && '💬 Vou enviar depoimentos que já tenho'}
                  {formData.estrategia_depoimentos === 'nao' && '⏭️ Não quero seção de depoimentos por enquanto'}
                </p>
                {formData.estrategia_depoimentos === 'google' && formData.link_google_maps && (
                  <p className="text-gray-600 mt-1 text-sm">Link: {formData.link_google_maps}</p>
                )}
                {formData.estrategia_depoimentos === 'texto' && formData.depoimentos_texto && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 mb-1">Depoimentos:</p>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{formData.depoimentos_texto}</p>
                  </div>
                )}
              </div>
            )}

            {formData.observacoes_finais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Observações Finais</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.observacoes_finais)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
