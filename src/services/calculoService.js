export function simularCalculo({ valor1, valor2 }) {
  const resultado = valor1 * valor2 + 100;
  return {
    sucesso: true,
    resultado,
    mensagem: 'Cálculo realizado com sucesso!',
  };
}
