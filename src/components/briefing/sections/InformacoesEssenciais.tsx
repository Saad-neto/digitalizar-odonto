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
      </div>
    </div>
  );
};

export default InformacoesEssenciais;
