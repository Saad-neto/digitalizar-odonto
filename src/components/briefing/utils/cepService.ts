/**
 * Serviço para buscar endereço por CEP usando a API ViaCEP
 */

export interface CepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const buscarEnderecoPorCEP = async (cep: string): Promise<CepData | null> => {
  const cepNumbers = cep.replace(/\D/g, '');

  if (cepNumbers.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);

    if (!response.ok) {
      throw new Error('API indisponível');
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};
