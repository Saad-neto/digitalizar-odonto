import React from 'react';
import { BriefingSectionProps } from '../types';
import { formatWhatsApp } from '../utils/formatters';

const InformacoesEssenciais: React.FC<BriefingSectionProps> = ({
  formData,
  errors,
  onUpdate
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
          Informações Essenciais
        </h2>
        <p className="text-medical-600/70 text-lg">Vamos começar! Informações Básicas</p>
      </div>

      <div className="space-y-6">
        {/* Nome do Consultório */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Qual o nome do seu consultório ou clínica? *
          </label>
          <input
            type="text"
            placeholder="Ex: Clínica Odontológica Dr. Carlos Silva"
            value={formData.nome_consultorio || ''}
            onChange={(e) => onUpdate('nome_consultorio', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
              errors.nome_consultorio ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
            }`}
          />
          {errors.nome_consultorio && <p className="text-red-500 text-sm mt-2">{errors.nome_consultorio}</p>}
        </div>

        {/* Seu Nome */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Como você se chama? *
          </label>
          <input
            type="text"
            placeholder="Ex: Dr. Carlos Eduardo Silva"
            value={formData.nome || ''}
            onChange={(e) => onUpdate('nome', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
              errors.nome ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
            }`}
          />
          {errors.nome && <p className="text-red-500 text-sm mt-2">{errors.nome}</p>}
          <p className="text-medical-600/60 text-xs mt-2">Nome completo para nossa comunicação durante o projeto</p>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Qual seu WhatsApp para agendamentos? *
          </label>
          <input
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.whatsapp || ''}
            onChange={(e) => {
              const formatted = formatWhatsApp(e.target.value);
              onUpdate('whatsapp', formatted);
            }}
            maxLength={15}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
              errors.whatsapp ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
            }`}
          />
          {errors.whatsapp && <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>}
          <p className="text-medical-600/60 text-xs mt-2">Este número aparecerá no site para os pacientes agendarem consultas</p>
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Seu melhor e-mail *
          </label>
          <input
            type="email"
            placeholder="contato@clinica.com.br"
            value={formData.email || ''}
            onChange={(e) => onUpdate('email', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
              errors.email ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          <p className="text-medical-600/60 text-xs mt-2">Enviaremos o site pronto neste e-mail em até 24 horas</p>
        </div>

        {/* Slogan */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Escolha a frase principal do seu site: *
          </label>
          <div className="space-y-2">
            {[
              { value: 'anos_experiencia', label: 'Cuidando do seu sorriso há [X] anos', desc: 'Personalização: mostrará seus anos de experiência' },
              { value: 'sorriso_perfeito', label: 'Seu sorriso perfeito começa aqui', desc: '' },
              { value: 'confianca', label: 'Sorria com confiança e segurança', desc: '' },
              { value: 'humanizado', label: 'Odontologia de qualidade com atendimento humanizado', desc: '' },
              { value: 'tecnologia', label: 'Tecnologia avançada para cuidar do seu sorriso', desc: '' },
              { value: 'sem_dor', label: 'Tratamento odontológico sem dor', desc: '' },
            ].map((opcao) => (
              <label key={opcao.value} className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                <input
                  type="radio"
                  name="slogan_opcao"
                  value={opcao.value}
                  checked={formData.slogan_opcao === opcao.value}
                  onChange={(e) => onUpdate('slogan_opcao', e.target.value)}
                  className="w-4 h-4 text-medical-600 mt-1"
                />
                <div className="ml-3">
                  <div className="text-gray-700">{opcao.label}</div>
                  {opcao.desc && <div className="text-xs text-medical-600/60 mt-1">{opcao.desc}</div>}
                </div>
              </label>
            ))}
            <label className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
              <input
                type="radio"
                name="slogan_opcao"
                value="custom"
                checked={formData.slogan_opcao === 'custom'}
                onChange={(e) => onUpdate('slogan_opcao', e.target.value)}
                className="w-4 h-4 text-medical-600 mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-700">Tenho meu próprio slogan:</div>
                {formData.slogan_opcao === 'custom' && (
                  <input
                    type="text"
                    placeholder="Digite seu slogan personalizado"
                    value={formData.slogan_custom || ''}
                    onChange={(e) => onUpdate('slogan_custom', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                  />
                )}
              </div>
            </label>
            <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
              <input
                type="radio"
                name="slogan_opcao"
                value="confiamos"
                checked={formData.slogan_opcao === 'confiamos'}
                onChange={(e) => onUpdate('slogan_opcao', e.target.value)}
                className="w-4 h-4 text-medical-600"
              />
              <span className="ml-3 text-gray-700">Escolham vocês com base no meu perfil</span>
            </label>
          </div>
          {errors.slogan_opcao && <p className="text-red-500 text-sm mt-2">{errors.slogan_opcao}</p>}
          {errors.slogan_custom && <p className="text-red-500 text-sm mt-2">{errors.slogan_custom}</p>}
        </div>

        {/* Ano de Início */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Desde que ano você atua na odontologia? *
          </label>
          <input
            type="number"
            placeholder="Ex: 2010"
            min="1970"
            max="2025"
            value={formData.ano_inicio || ''}
            onChange={(e) => onUpdate('ano_inicio', parseInt(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
              errors.ano_inicio ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
            }`}
          />
          {errors.ano_inicio && <p className="text-red-500 text-sm mt-2">{errors.ano_inicio}</p>}
          <p className="text-medical-600/60 text-xs mt-2">Usaremos para calcular os anos de experiência e mostrar no site</p>
        </div>

        {/* Número de Pacientes (Opcional) */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Aproximadamente quantos pacientes você já atendeu?
          </label>
          <div className="space-y-2">
            {[
              { value: 'menos_500', label: 'Menos de 500' },
              { value: '500_2000', label: 'Entre 500 e 2.000' },
              { value: '2000_5000', label: 'Entre 2.000 e 5.000' },
              { value: 'mais_5000', label: 'Mais de 5.000' },
              { value: 'nao_informar', label: 'Não sei / Prefiro não informar' },
            ].map((opcao) => (
              <label key={opcao.value} className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                <input
                  type="radio"
                  name="num_pacientes"
                  value={opcao.value}
                  checked={formData.num_pacientes === opcao.value}
                  onChange={(e) => onUpdate('num_pacientes', e.target.value)}
                  className="w-4 h-4 text-medical-600"
                />
                <span className="ml-3 text-gray-700">{opcao.label}</span>
              </label>
            ))}
          </div>
          <p className="text-medical-600/60 text-xs mt-2">Não precisa ser exato. Usaremos para mostrar sua experiência no site (ex: '+5.000 pacientes atendidos')</p>
        </div>

        {/* Google Meu Negócio */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Tem Google Meu Negócio?
          </label>
          <div className="space-y-3">
            <label className="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
              <input
                type="radio"
                name="tem_google_negocio"
                value="sim"
                checked={formData.tem_google_negocio === 'sim'}
                onChange={(e) => onUpdate('tem_google_negocio', e.target.value)}
                className="w-4 h-4 text-medical-600 mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-700">Sim, tenho</div>
                {formData.tem_google_negocio === 'sim' && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Cole o link do Google Meu Negócio"
                      value={formData.link_google_negocio || ''}
                      onChange={(e) => onUpdate('link_google_negocio', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                    />
                    <p className="text-xs text-medical-600/60">💡 Como encontrar? Busque sua clínica no Google Maps, clique em "Compartilhar" e copie o link</p>
                  </div>
                )}
              </div>
            </label>
            <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
              <input
                type="radio"
                name="tem_google_negocio"
                value="nao"
                checked={formData.tem_google_negocio === 'nao'}
                onChange={(e) => onUpdate('tem_google_negocio', e.target.value)}
                className="w-4 h-4 text-medical-600"
              />
              <span className="ml-3 text-gray-700">Não tenho</span>
            </label>
          </div>
          <p className="text-medical-600/60 text-xs mt-2">Se tiver Google Meu Negócio com avaliações, mostraremos no seu site para aumentar a credibilidade</p>
        </div>
      </div>
    </div>
  );
};

export default InformacoesEssenciais;
