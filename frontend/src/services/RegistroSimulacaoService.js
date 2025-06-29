class RegistroSimulacaoService {
  static async registrarSimulacao(simulationData) {
    const url = 'http://localhost:3001/api/simulations';

    const payload = simulationData;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Erro ao registrar simulação:', error);
        throw error;
      });
  }
}

export default RegistroSimulacaoService;
