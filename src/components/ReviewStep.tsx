import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle2, MapPin, Briefcase, Star, Mail, Phone, Globe, Instagram, AlertCircle } from 'lucide-react';

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
  const formatWhatsApp = (value?: string) => {
    if (!value) return 'Não informado';
    return value;
  };

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
              <p className="text-gray-900 mt-1">{renderValue(formData.nomeConsultorio)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Prática</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.tipoPratica)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Especialidade Principal</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.especialidadePrincipal)}</p>
            </div>
            {formData.outrasEspecialidades && (
              <div>
                <label className="text-sm font-medium text-gray-500">Outras Especialidades</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.outrasEspecialidades)}</p>
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

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome do Dentista Principal</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.nomeDentistaPrincipal)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CRO</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.cro)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Anos de Experiência</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.anosExperiencia)}</p>
            </div>
            {formData.bioBreve && (
              <div>
                <label className="text-sm font-medium text-gray-500">Mini Biografia</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.bioBreve)}</p>
              </div>
            )}
            {formData.quantidadeProfissionais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Quantidade de Profissionais</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.quantidadeProfissionais)}</p>
              </div>
            )}
            {uploadedFiles.fotoProfissional && uploadedFiles.fotoProfissional.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Fotos do Profissional</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.fotoProfissional.map((file, idx) => (
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
              <label className="text-sm font-medium text-gray-500">Serviços Principais</label>
              <p className="text-gray-900 mt-1">{renderValue(formData.servicosPrincipais)}</p>
            </div>
            {formData.tecnologiasEquipamentos && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tecnologias/Equipamentos</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.tecnologiasEquipamentos)}</p>
              </div>
            )}
            {formData.diferenciais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Diferenciais</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.diferenciais)}</p>
              </div>
            )}
            {formData.publicoAlvo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Público-Alvo</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.publicoAlvo)}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Endereço Completo</label>
              <p className="text-gray-900 mt-1">
                {formData.endereco && `${formData.endereco}, `}
                {formData.numero && `${formData.numero}, `}
                {formData.complemento && `${formData.complemento}, `}
                {formData.bairro && `${formData.bairro} - `}
                {formData.cidade && `${formData.cidade}/`}
                {formData.estado && formData.estado}
                {formData.cep && ` - CEP: ${formData.cep}`}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                WhatsApp
              </label>
              <p className="text-gray-900 mt-1">{formatWhatsApp(formData.whatsapp)}</p>
            </div>
            {formData.telefoneFixo && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Telefone Fixo
                </label>
                <p className="text-gray-900 mt-1">{renderValue(formData.telefoneFixo)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                E-mail
              </label>
              <p className="text-gray-900 mt-1">{renderValue(formData.email)}</p>
            </div>
            {formData.horarioFuncionamento && (
              <div>
                <label className="text-sm font-medium text-gray-500">Horário de Funcionamento</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.horarioFuncionamento)}</p>
              </div>
            )}
            {formData.instagram && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </label>
                <p className="text-gray-900 mt-1">{renderValue(formData.instagram)}</p>
              </div>
            )}
            {formData.facebook && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Facebook
                </label>
                <p className="text-gray-900 mt-1">{renderValue(formData.facebook)}</p>
              </div>
            )}
            {formData.linkedin && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  LinkedIn
                </label>
                <p className="text-gray-900 mt-1">{renderValue(formData.linkedin)}</p>
              </div>
            )}
            {formData.siteAtual && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Site Atual
                </label>
                <p className="text-gray-900 mt-1">{renderValue(formData.siteAtual)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 5: Materiais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Materiais e Preferências
              </h3>
              <p className="text-sm text-gray-500">Arquivos e observações</p>
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
            {uploadedFiles.logoClinica && uploadedFiles.logoClinica.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Logo da Clínica</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.logoClinica.map((file, idx) => (
                    <div key={idx} className="relative group">
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

            {uploadedFiles.fotosClinica && uploadedFiles.fotosClinica.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Fotos da Clínica</label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.fotosClinica.map((file, idx) => (
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

            {formData.coresPreferidas && (
              <div>
                <label className="text-sm font-medium text-gray-500">Cores Preferidas</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.coresPreferidas)}</p>
              </div>
            )}

            {formData.estiloDesejado && (
              <div>
                <label className="text-sm font-medium text-gray-500">Estilo Desejado</label>
                <p className="text-gray-900 mt-1">{renderValue(formData.estiloDesejado)}</p>
              </div>
            )}

            {formData.sitesReferencia && (
              <div>
                <label className="text-sm font-medium text-gray-500">Sites de Referência</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.sitesReferencia)}</p>
              </div>
            )}

            {formData.observacoesAdicionais && (
              <div>
                <label className="text-sm font-medium text-gray-500">Observações Adicionais</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{renderValue(formData.observacoesAdicionais)}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Prazo de Entrega</label>
              <p className="text-gray-900 mt-1">
                {formData.prazoDesejado === 'urgente' && '24 horas (Urgente) - Taxa adicional'}
                {formData.prazoDesejado === 'padrao' && '3-5 dias (Padrão)'}
                {formData.prazoDesejado === 'flexivel' && 'Até 7 dias (Flexível)'}
                {!formData.prazoDesejado && renderValue(formData.prazoDesejado)}
              </p>
            </div>
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
