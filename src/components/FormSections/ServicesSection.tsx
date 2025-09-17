import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FileText, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { FormData } from '../types/form-types';

interface ServicesSectionProps {
  form: UseFormReturn<FormData>;
}

const especialidades = [
  '🦷 Clínica Geral',
  '📐 Ortodontia',
  '🦴 Implantodontia',
  '✨ Odontologia Estética',
  '💉 Harmonização Facial (botox, preenchimento)',
  '🔧 Endodontia',
  '👶 Odontopediatria',
  '🦷 Periodontia',
  '⚕️ Cirurgia Bucomaxilofacial',
  '🏥 Múltiplas especialidades'
];

const servicos = [
  'Limpeza e prevenção',
  'Restaurações (obturações)',
  'Tratamento de canal',
  'Próteses dentárias',
  'Implantes dentários',
  'Aparelhos ortodônticos',
  'Clareamento dental',
  'Facetas de porcelana',
  'Cirurgias orais',
  'Tratamento gengival',
  'Odontologia infantil',
  'Harmonização facial/orofacial',
  'Tratamento de ATM/DTM',
  'Placas de bruxismo',
  'Emergências 24h'
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ form }) => {
  const { register, setValue, watch } = form;

  const especialidadesSelecionadas = watch('especialidades') || [];
  const servicosSelecionados = watch('servicos') || [];

  const handleEspecialidadeChange = (especialidade: string, checked: boolean) => {
    const currentEspecialidades = especialidadesSelecionadas;
    if (checked) {
      setValue('especialidades', [...currentEspecialidades, especialidade]);
    } else {
      setValue('especialidades', currentEspecialidades.filter(e => e !== especialidade));
    }
  };

  const handleServicoChange = (servico: string, checked: boolean) => {
    const currentServicos = servicosSelecionados;
    if (checked) {
      setValue('servicos', [...currentServicos, servico]);
    } else {
      setValue('servicos', currentServicos.filter(s => s !== servico));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-text-primary mb-2">
          🦷 Sua Especialidade e Serviços
        </h2>
        <p className="text-text-secondary">
          Conte-nos sobre sua área de atuação para criarmos um site direcionado
        </p>
      </div>

      <div className="space-y-6">
        {/* Trajetória Profissional */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <FileText className="w-4 h-4" />
            Conte-nos brevemente sobre sua trajetória profissional (Opcional)
          </Label>
          <Textarea
            {...register('trajetoria')}
            placeholder="Ex: Formado pela USP, especialista em implantodontia..."
            className="form-input min-h-[100px]"
          />
          <p className="text-sm text-primary font-medium">Destacaremos isso no seu site</p>
        </div>

        {/* Especialidades */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Qual é sua principal especialidade? *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {especialidades.map((especialidade) => (
              <div key={especialidade} className="flex items-center space-x-2">
                <Checkbox
                  id={`especialidade-${especialidade}`}
                  checked={especialidadesSelecionadas.includes(especialidade)}
                  onCheckedChange={(checked) => handleEspecialidadeChange(especialidade, checked as boolean)}
                />
                <Label 
                  htmlFor={`especialidade-${especialidade}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {especialidade}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="especialidade-outra"
                checked={!!watch('especialidadeOutra')}
                onCheckedChange={(checked) => {
                  if (!checked) setValue('especialidadeOutra', '');
                }}
              />
              <Label htmlFor="especialidade-outra" className="text-sm font-normal">
                📝 Outra (especificar):
              </Label>
            </div>
            {watch('especialidadeOutra') !== undefined && (
              <div className="col-span-full ml-6">
                <input
                  {...register('especialidadeOutra')}
                  placeholder="Especifique sua especialidade"
                  className="form-input w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Serviços */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Quais serviços você oferece? *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {servicos.map((servico) => (
              <div key={servico} className="flex items-center space-x-2">
                <Checkbox
                  id={`servico-${servico}`}
                  checked={servicosSelecionados.includes(servico)}
                  onCheckedChange={(checked) => handleServicoChange(servico, checked as boolean)}
                />
                <Label 
                  htmlFor={`servico-${servico}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {servico}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="servico-outro"
                checked={!!watch('servicoOutro')}
                onCheckedChange={(checked) => {
                  if (!checked) setValue('servicoOutro', '');
                }}
              />
              <Label htmlFor="servico-outro" className="text-sm font-normal">
                📝 Outros (campo livre):
              </Label>
            </div>
            {watch('servicoOutro') !== undefined && (
              <div className="col-span-full ml-6">
                <input
                  {...register('servicoOutro')}
                  placeholder="Descreva outros serviços"
                  className="form-input w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Específico */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Tem algum texto/conteúdo específico?
          </Label>
          <Textarea
            {...register('conteudoEspecifico')}
            placeholder="Cole aqui textos que já tem prontos (apresentação, sobre a clínica, etc.)"
            className="form-input min-h-[120px]"
          />
          
          <div className="mt-4">
            <Label className="text-sm font-medium mb-2 block">
              Ou faça upload de documentos:
            </Label>
            <FileUpload
              accept=".doc,.docx,.pdf,.txt"
              multiple
              maxFiles={5}
              value={watch('documentos') || []}
              onFilesChange={(files) => setValue('documentos', files)}
              placeholder="Documentos com textos da clínica"
            />
          </div>
        </div>
      </div>
    </div>
  );
};