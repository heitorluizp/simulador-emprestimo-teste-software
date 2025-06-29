class RegistroSimulacaoService {
  static async registrarSimulacao(dadosSimulacao) {
    const url =
      'https://script.google.com/macros/s/AKfycbxrRUBWwctcR6MJgxvM87vkKQvvS71CQJXx7KACQi4h5tDen4SCjehLyvZQ30RHh-O9nA/exec';

    const body = new URLSearchParams({
      valor_emprestimo: dadosSimulacao.valorEmprestimo,
      numero_parcelas: dadosSimulacao.prazoMeses,
      dt_nascimento: dadosSimulacao.dataNascimento,
      idade: dadosSimulacao.idade,
      valor_total: dadosSimulacao.valorTotal,
      valor_parcelas: dadosSimulacao.valorParcelas,
      total_juros: dadosSimulacao.totalJuros,
    }).toString();

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Google Script API response was not ok.');
        }
        return response;
      })
      .catch((error) => {
        console.error('Erro ao registrar simulação:', error);
        throw error;
      });
  }
}

export default RegistroSimulacaoService;
