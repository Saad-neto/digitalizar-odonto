import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Palette, Facebook, Instagram, Youtube, Linkedin, Music, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '../types/form-types';

interface StyleSectionProps {
  form: UseFormReturn<FormData>;
}

const estilosSite = [
  {
    id: 'classico',
    title: '🏛️ Clássico Profissional',
    description: 'Elegante, conservador, transmite tradição'
  },
  {
    id: 'moderno',
    title: '✨ Moderno Minimalista',
    description: 'Clean, espaços brancos, focado no essencial'
  },
  {
    id: 'tecnologico',
    title: '🚀 Tecnológico Inovador',
    description: 'Futurista, destaca tecnologia e inovação'
  },
  {
    id: 'elegante',
    title: '💎 Elegante Sofisticado',
    description: 'Luxuoso, premium, para público seleto'
  },
  {
    id: 'expertise',
    title: '🎯 Confio na expertise de vocês',
    description: 'Deixo por conta dos especialistas'
  }
];

const redesSociais = [
  { id: 'facebook', label: '📘 Facebook', icon: Facebook },
  { id: 'instagram', label: '📸 Instagram', icon: Instagram },
  { id: 'youtube', label: '▶️ YouTube', icon: Youtube },
  { id: 'linkedin', label: '💼 LinkedIn', icon: Linkedin },
  { id: 'tiktok', label: '🎵 TikTok', icon: Music }
];

export const StyleSection: React.FC<StyleSectionProps> = ({ form }) => {
  const { register, setValue, watch } = form;

  const estiloSelecionado = watch('estilo');
  const avaliacoesGoogle = watch('avaliacoesGoogle');
  const redesSelecionadas = watch('redesSociais') || {};

  const handleRedesSociaisChange = (rede: string, checked: boolean) => {
    const currentRedes = redesSelecionadas;
    if (checked) {
      setValue('redesSociais', { ...currentRedes, [rede]: true });
    } else {
      const { [rede]: removed, ...rest } = currentRedes;
      setValue('redesSociais', rest);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-text-primary mb-2">
          📱 Estilo e Redes Sociais
        </h2>
        <p className="text-text-secondary">
          Vamos escolher o estilo do site e conectar todas suas presenças digitais
        </p>
      </div>

      <div className="space-y-6">
        {/* Estilo do Site */}
        <div className="space-y-4">
          <Label className="text-text-primary font-medium">
            Qual estilo de site você prefere? *
          </Label>
          <RadioGroup value={estiloSelecionado} onValueChange={(value) => setValue('estilo', value as 'classico' | 'moderno' | 'tecnologico' | 'elegante' | 'expertise')}>
            {estilosSite.map((estilo) => (
              <div key={estilo.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value={estilo.id} id={`estilo-${estilo.id}`} className="mt-1" />
                <div className="flex-1">
                  <Label 
                    htmlFor={`estilo-${estilo.id}`}
                    className="font-medium text-text-primary cursor-pointer block"
                  >
                    {estilo.title}
                  </Label>
                  <p className="text-sm text-text-secondary mt-1">{estilo.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Redes Sociais */}
        <div className="space-y-4">
          <Label className="text-text-primary font-medium">
            Quais redes sociais você usa? *
          </Label>
          <div className="space-y-3">
            {redesSociais.map((rede) => (
              <div key={rede.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`rede-${rede.id}`}
                    checked={!!redesSelecionadas[rede.id]}
                    onCheckedChange={(checked) => handleRedesSociaisChange(rede.id, checked as boolean)}
                  />
                  <Label htmlFor={`rede-${rede.id}`} className="font-medium cursor-pointer">
                    {rede.label}
                  </Label>
                </div>
                {redesSelecionadas[rede.id] && (
                  <div className="ml-6">
                    <Input
                      {...register(`${rede.id}Url` as keyof FormData)}
                      placeholder={`Link do seu ${rede.label.split(' ')[1]}`}
                      className="form-input"
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox id="sem-redes" />
              <Label htmlFor="sem-redes" className="font-medium">❌ Não uso redes sociais</Label>
            </div>
          </div>
        </div>

        {/* Avaliações do Google */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Você gostaria de utilizar as avaliações do Google no seu site? *
          </Label>
          <RadioGroup value={avaliacoesGoogle} onValueChange={(value) => setValue('avaliacoesGoogle', value as 'sim' | 'nao')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="avaliacoes-sim" />
              <Label htmlFor="avaliacoes-sim">✅ Sim, quero mostrar minhas avaliações do Google</Label>
            </div>
            {avaliacoesGoogle === 'sim' && (
              <div className="ml-6 space-y-2">
                <Input
                  {...register('googleMeuNegocioAvaliacoes')}
                  placeholder="Cole aqui o link da sua página no Google Meu Negócio"
                  className="form-input"
                />
                <p className="text-sm text-text-light">Cole aqui o link da sua página no Google Meu Negócio</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="avaliacoes-nao" />
              <Label htmlFor="avaliacoes-nao">❌ Não, prefiro depoimentos personalizados</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Segunda pergunta sobre avaliações (parece duplicada na spec) */}
        <div className="space-y-3">
          <Label className="text-text-primary font-medium">
            Você gostaria de adicionar as avaliações do Google ao seu site? *
          </Label>
          <RadioGroup value={watch('mostrarAvaliacoesGoogle')} onValueChange={(value) => setValue('mostrarAvaliacoesGoogle', value as 'sim' | 'nao')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="mostrar-avaliacoes-sim" />
              <Label htmlFor="mostrar-avaliacoes-sim">✅ Sim, quero mostrar minhas avaliações do Google</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="mostrar-avaliacoes-nao" />
              <Label htmlFor="mostrar-avaliacoes-nao">❌ Não, prefiro depoimentos personalizados</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Termos e Políticas */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-text-primary">Termos e Condições</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="termos" 
                checked={watch('aceitaTermos') || false}
                onCheckedChange={(checked) => setValue('aceitaTermos', checked as boolean)}
              />
              <Label htmlFor="termos" className="text-sm cursor-pointer">
                Li e aceito os <a href="#" className="text-primary hover:underline">Termos de Serviço</a>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacidade" 
                checked={watch('aceitaPrivacidade') || false}
                onCheckedChange={(checked) => setValue('aceitaPrivacidade', checked as boolean)}
              />
              <Label htmlFor="privacidade" className="text-sm cursor-pointer">
                Concordo com a <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="whatsapp" 
                checked={watch('aceitaWhatsapp') || false}
                onCheckedChange={(checked) => setValue('aceitaWhatsapp', checked as boolean)}
              />
              <Label htmlFor="whatsapp" className="text-sm cursor-pointer">
                Aceito receber atualizações por WhatsApp
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};