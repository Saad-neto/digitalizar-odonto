import React from 'react';
import { Upload, X } from 'lucide-react';

interface ProfessionalFormProps {
  index: number;
  data: {
    nome?: string;
    apresentacao?: string;
    cro?: string;
    uf?: string;
    especialidade?: string;
    formacao?: string;
    biografia?: string;
  };
  foto?: any;
  errors: {[key: string]: string};
  onChange: (field: string, value: string) => void;
  onFileUpload: (file: FileList | null) => void;
  onRemoveFile: () => void;
  isDiretor?: boolean;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  index,
  data,
  foto,
  errors,
  onChange,
  onFileUpload,
  onRemoveFile,
  isDiretor
}) => {
  const prefix = `profissional${index}`;

  const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="space-y-6 p-6 border-2 border-purple-200 rounded-xl bg-purple-50/30">
      <div className="border-b-2 border-purple-300 pb-4">
        <h3 className="text-xl font-bold text-purple-800">
          Profissional {index}
          {isDiretor && <span className="ml-2 text-sm font-normal text-blue-600">(Diretor Técnico)</span>}
        </h3>
      </div>

      {isDiretor && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            ℹ️ <strong>Dados pré-preenchidos do diretor técnico.</strong> Complete apenas os campos faltantes (apresentação, especialidade, formação, biografia e foto).
          </p>
        </div>
      )}

      {/* Nome Completo */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Nome completo *
        </label>
        <input
          type="text"
          placeholder="Dr. Carlos Eduardo Silva"
          value={data.nome || ''}
          onChange={(e) => onChange(`${prefix}_nome`, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
            errors[`${prefix}_nome`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
          }`}
        />
        {errors[`${prefix}_nome`] && (
          <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_nome`]}</p>
        )}
      </div>

      {/* Como quer ser apresentado */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Como quer ser apresentado no site? *
        </label>
        <input
          type="text"
          placeholder="Dr. Carlos Eduardo"
          value={data.apresentacao || ''}
          onChange={(e) => onChange(`${prefix}_apresentacao`, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
            errors[`${prefix}_apresentacao`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
          }`}
        />
        {errors[`${prefix}_apresentacao`] && (
          <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_apresentacao`]}</p>
        )}
        <p className="text-purple-600/60 text-xs mt-2">
          Ex: Dr. Carlos, Dra. Ana Paula, Dr. Eduardo Silva
        </p>
      </div>

      {/* CRO e UF */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-3">
            CRO *
          </label>
          <input
            type="text"
            placeholder="12345"
            value={data.cro || ''}
            onChange={(e) => onChange(`${prefix}_cro`, e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
              errors[`${prefix}_cro`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
            }`}
          />
          {errors[`${prefix}_cro`] && (
            <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_cro`]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-3">
            UF *
          </label>
          <select
            value={data.uf || ''}
            onChange={(e) => onChange(`${prefix}_uf`, e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
              errors[`${prefix}_uf`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
            }`}
          >
            <option value="">Selecione</option>
            {estadosBrasileiros.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          {errors[`${prefix}_uf`] && (
            <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_uf`]}</p>
          )}
        </div>
      </div>

      {/* Especialidade */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Especialidade(s) *
        </label>
        <input
          type="text"
          placeholder="Implantodontia, Ortodontia"
          value={data.especialidade || ''}
          onChange={(e) => onChange(`${prefix}_especialidade`, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
            errors[`${prefix}_especialidade`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
          }`}
        />
        {errors[`${prefix}_especialidade`] && (
          <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_especialidade`]}</p>
        )}
        <p className="text-purple-600/60 text-xs mt-2">
          Se tiver mais de uma, separe por vírgula
        </p>
      </div>

      {/* Formação */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Formação acadêmica *
        </label>
        <input
          type="text"
          placeholder="USP - Odontologia (2010)"
          value={data.formacao || ''}
          onChange={(e) => onChange(`${prefix}_formacao`, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
            errors[`${prefix}_formacao`] ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
          }`}
        />
        {errors[`${prefix}_formacao`] && (
          <p className="text-red-500 text-sm mt-2">{errors[`${prefix}_formacao`]}</p>
        )}
      </div>

      {/* Mini Biografia */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Mini biografia (opcional)
        </label>
        <textarea
          rows={4}
          placeholder="Conte um pouco sobre sua trajetória, experiências e paixão pela odontologia..."
          value={data.biografia || ''}
          onChange={(e) => onChange(`${prefix}_biografia`, e.target.value)}
          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all"
        />
        <p className="text-purple-600/60 text-xs mt-2">
          Uma breve apresentação ajuda pacientes a se conectarem com você
        </p>
      </div>

      {/* Upload de Foto */}
      <div>
        <label className="block text-sm font-semibold text-purple-800 mb-3">
          Foto profissional (opcional)
        </label>

        {!foto || foto.length === 0 ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all">
            <Upload className="w-12 h-12 text-purple-400 mb-3" />
            <p className="text-sm text-purple-600 font-medium mb-1">
              Clique para fazer upload
            </p>
            <p className="text-xs text-purple-500/70">
              JPG, PNG ou WEBP (máx. 5MB)
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => onFileUpload(e.target.files)}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={foto[0].data}
              alt="Preview"
              className="w-full h-64 object-cover rounded-xl border-2 border-purple-200"
            />
            <button
              type="button"
              onClick={onRemoveFile}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-xs text-purple-600 mt-2">{foto[0].name}</p>
          </div>
        )}

        <p className="text-purple-600/60 text-xs mt-2">
          Foto profissional aumenta a confiança dos pacientes
        </p>
      </div>
    </div>
  );
};

export default ProfessionalForm;
