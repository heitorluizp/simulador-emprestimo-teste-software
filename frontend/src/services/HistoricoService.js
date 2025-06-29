class HistoricoService {
  static async getHistorico() {
    const url = 'http://localhost:3001/api/simulations';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de simulações:', error);
      return [];
    }
  }
}

export default HistoricoService;
