export const isValidCnpj = (cnpj: unknown): boolean => {
  if (typeof cnpj !== 'string') return false;

  const cleanCnpj = cnpj.replace(/[^\d]/g, '');

  if (cleanCnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cleanCnpj)) return false;

  let sum = 0;
  let weight = 5;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let result = sum % 11;
  const firstDigit = result < 2 ? 0 : 11 - result;

  if (parseInt(cleanCnpj.charAt(12)) !== firstDigit) return false;

  sum = 0;
  weight = 6;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  result = sum % 11;
  const secondDigit = result < 2 ? 0 : 11 - result;

  return parseInt(cleanCnpj.charAt(13)) === secondDigit;
};

export const formatCnpj = (cpfOrCnpj: string) => {
  let document = cpfOrCnpj.replace(/[^\d]+/g, '');

  if (document.length === 14) {
    document = document.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  return document;
};
