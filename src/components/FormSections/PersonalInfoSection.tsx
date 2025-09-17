import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, User, Phone, Mail, Building, FileText, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUpload } from '@/components/ui/file-upload';
import { FormData } from '../types/form-types';

interface PersonalInfoSectionProps {
  form: UseFormReturn<FormData>;
}

interface Professional {
  nome: string;
  cro: string;
  descricao: string;
  experiencia: string;
  foto?: File[];
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [showAddProfessional, setShowAddProfessional] = useState(false);

  const { register, formState: { errors }, setValue, watch } = form;

  const conveniosValue = watch('convenios');
  const logoValue = watch('logoOpcao');
  const fotosValue = watch('fotos');
  const enderecoValue = watch('enderecoOpcao');

  const addProfessional = () => {
    if (professionals.length < 5) {
      setProfessionals([...professionals, { nome: '', cro: '', descricao: '', experiencia: '', foto: [] }]);
      setShowAddProfessional(true);
    }
  };

  const removeProfessional = (index: number) => {
    const newProfessionals = professionals.filter((_, i) => i !== index);
    setProfessionals(newProfessionals);
  };

  const updateProfessional = (index: number, field: keyof Professional, value: any) => {
    const newProfessionals = [...professionals];
    newProfessionals[index] = { ...newProfessionals[index], [field]: value };
    setProfessionals(newProfessionals);
  };

  const phoneMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePhoneChange = (field: 'telefone' | 'telefoneClinica') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = phoneMask(e.target.value);
    setValue(field, masked);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-text-primary mb-2">
          👨‍⚕️ Informações Pessoais
        </h2>
        <p className="text-text-secondary">
          Vamos conhecer você e sua clínica para criar um site personalizado
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome Completo */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <User className="w-4 h-4" />
            Qual é o seu nome completo? *
          </Label>
          <Input
            {...register('nomeCompleto')}
            placeholder="Dr. Carlos Eduardo"
            className="form-input"
          />
          {errors.nomeCompleto && (
            <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <Phone className="w-4 h-4" />
            Qual o seu WhatsApp? *
          </Label>
          <Input
            {...register('telefone')}
            placeholder="(11) 99999-9999"
            onChange={handlePhoneChange('telefone')}
            className="form-input"
          />
          <p className="text-sm text-primary font-medium">
            Forneça um número válido, é por ele que iremos lhe contactar
          </p>
          {errors.telefone && (
            <p className="text-sm text-destructive">{errors.telefone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <Mail className="w-4 h-4" />
            Qual é o seu melhor email? *
          </Label>
          <Input
            {...register('email')}
            type="email"
            placeholder="dr.joao@clinica.com.br"
            className="form-input"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Nome da Clínica */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <Building className="w-4 h-4" />
            Qual é o nome da sua clínica/consultório? *
          </Label>
          <Input
            {...register('nomeClinica')}
            placeholder="Clínica Odontológica Dr. Carlos Eduardo"
            className="form-input"
          />
          <p className="text-sm text-text-light">título do site</p>
          {errors.nomeClinica && (
            <p className="text-sm text-destructive">{errors.nomeClinica.message}</p>
          )}
        </div>

        {/* CRO */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <FileText className="w-4 h-4" />
            Qual o seu CRO? *
          </Label>
          <Input
            {...register('cro')}
            placeholder="CRO SP - 19999"
            className="form-input"
          />
          {errors.cro && (
            <p className="text-sm text-destructive">{errors.cro.message}</p>
          )}
        </div>

        {/* Tempo de Atuação */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <FileText className="w-4 h-4" />
            Há quanto tempo você atua como dentista?
          </Label>
          <Input
            {...register('tempoAtuacao')}
            placeholder="Ex: 15 anos, 5 anos, 2 anos e 6 meses..."
            className="form-input"
          />
        </div>

        {/* Adicionar Profissionais */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-text-primary font-medium">
              Adicionar profissional (Até 5 profissionais)
            </Label>
            {professionals.length < 5 && (
              <Button
                type="button"
                variant="outline"
                onClick={addProfessional}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Profissional
              </Button>
            )}
          </div>

          {professionals.map((professional, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-text-primary">Profissional {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProfessional(index)}
                  className="text-destructive hover:text-destructive"
                >
                  Remover
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome completo do profissional *</Label>
                  <Input
                    value={professional.nome}
                    onChange={(e) => updateProfessional(index, 'nome', e.target.value)}
                    placeholder="Dr. João Carlos"
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Número do CRO *</Label>
                  <Input
                    value={professional.cro}
                    onChange={(e) => updateProfessional(index, 'cro', e.target.value)}
                    placeholder="CRO-SP 54321"
                    className="form-input mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Breve descrição e especialidades *</Label>
                <Textarea
                  value={professional.descricao}
                  onChange={(e) => updateProfessional(index, 'descricao', e.target.value)}
                  placeholder="Especialista em ortodontia, mestrado pela USP..."
                  className="form-input mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Experiência</Label>
                <Input
                  value={professional.experiencia}
                  onChange={(e) => updateProfessional(index, 'experiencia', e.target.value)}
                  placeholder="10 anos"
                  className="form-input mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Foto do profissional</Label>
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  value={professional.foto || []}
                  onFilesChange={(files) => updateProfessional(index, 'foto', files)}
                  placeholder="Adicionar foto do profissional"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Convênios */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">Atende convênios? *</Label>
          <RadioGroup value={conveniosValue} onValueChange={(value) => setValue('convenios', value as 'sim' | 'nao')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="convenios-sim" />
              <Label htmlFor="convenios-sim">✅ Sim (especificar quais):</Label>
            </div>
            {conveniosValue === 'sim' && (
              <Input
                {...register('conveniosEspecificar')}
                placeholder="Liste os convênios que atende"
                className="form-input ml-6"
              />
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="convenios-nao" />
              <Label htmlFor="convenios-nao">❌ Não, apenas particular</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Logo */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">Você tem logotipo da clínica? *</Label>
          <RadioGroup value={logoValue} onValueChange={(value) => setValue('logoOpcao', value as 'tenho' | 'criar-pago' | 'criar-bonus')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tenho" id="logo-tenho" />
              <Label htmlFor="logo-tenho">✅ Sim, tenho logo (fazer upload)</Label>
            </div>
            {logoValue === 'tenho' && (
              <div className="ml-6">
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  value={watch('logoArquivo') || []}
                  onFilesChange={(files) => setValue('logoArquivo', files)}
                  placeholder="Fazer upload do logo"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="criar-pago" id="logo-criar-pago" />
              <Label htmlFor="logo-criar-pago">❌ Ainda não tenho (criação de logo + R$ 100)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="criar-bonus" id="logo-criar-bonus" />
              <Label htmlFor="logo-criar-bonus">❌ Ainda não tenho (criação de logo simples - Bônus)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Fotos */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Você possui fotos profissionais e imagens da clínica e fotos de antes e depois? *
          </Label>
          <RadioGroup value={watch('temFotos')} onValueChange={(value) => setValue('temFotos', value as 'sim' | 'nao')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="fotos-sim" />
              <Label htmlFor="fotos-sim">✅ Sim, tenho fotos</Label>
            </div>
            {watch('temFotos') === 'sim' && (
              <div className="ml-6">
                <FileUpload
                  accept="image/*"
                  multiple
                  maxFiles={10}
                  value={fotosValue || []}
                  onFilesChange={(files) => setValue('fotos', files)}
                  placeholder="Adicionar fotos da clínica (até 10 fotos)"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="fotos-nao" />
              <Label htmlFor="fotos-nao">❌ Não tenho</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Endereço */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">Endereço da clínica</Label>
          <RadioGroup value={enderecoValue} onValueChange={(value) => setValue('enderecoOpcao', value as 'google' | 'digitar')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="endereco-google" />
              <Label htmlFor="endereco-google">Quero usar a localização do Google Meu Negócio:</Label>
            </div>
            {enderecoValue === 'google' && (
              <div className="ml-6 space-y-2">
                <Input
                  {...register('googleMeuNegocio')}
                  placeholder="Cole aqui o link da sua página no Google Meu Negócio"
                  className="form-input"
                />
                <p className="text-sm text-text-light">Cole aqui o link da sua página no Google Meu Negócio</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="digitar" id="endereco-digitar" />
              <Label htmlFor="endereco-digitar">Vou digitar meu endereço:</Label>
            </div>
            {enderecoValue === 'digitar' && (
              <div className="ml-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">CEP</Label>
                    <Input
                      {...register('cep')}
                      placeholder="00000-000"
                      className="form-input mt-1"
                    />
                  </div>
                  <Button type="button" variant="outline" className="mt-6">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Número</Label>
                    <Input
                      {...register('numero')}
                      placeholder="123"
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Complemento</Label>
                    <Input
                      {...register('complemento')}
                      placeholder="Sala 45"
                      className="form-input mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Telefone da Clínica */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <Phone className="w-4 h-4" />
            Qual o telefone da clínica? *
          </Label>
          <Input
            {...register('telefoneClinica')}
            placeholder="(11) 99999-9999"
            onChange={handlePhoneChange('telefoneClinica')}
            className="form-input"
          />
          {errors.telefoneClinica && (
            <p className="text-sm text-destructive">{errors.telefoneClinica.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};