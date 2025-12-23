/**
 * Funções de validação para campos do formulário
 */

const VALID_DDDS = [
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
];

export const validateWhatsApp = (whatsapp: string): boolean => {
  const numbers = whatsapp.replace(/\D/g, '');

  if (numbers.length !== 11) return false;

  const ddd = numbers.substring(0, 2);
  if (!VALID_DDDS.includes(ddd)) return false;

  if (numbers.charAt(2) !== '9') return false;

  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;

  return true;
};

export const validateURL = (url: string): boolean => {
  if (!url || url.trim() === '') return true;

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};
