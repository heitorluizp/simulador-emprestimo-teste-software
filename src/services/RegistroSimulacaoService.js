class RegistroSimulacaoService {
  static async registrarSimulacao(
    valorEmprestimo,
    numeroParcela,
    dtNascimento
  ) {
    const url =
      "https://script.google.com/macros/s/AKfycbzaq4MteEfDpOq87PjCr3hbLFLzrNavJruRTslYfI8ZOY7_HBXRwd5Og2lDCQZSOoI6ww/exec";

    const body = `valor_emprestimo=${encodeURIComponent(valorEmprestimo)}
    &numero_parcela=${encodeURIComponent(numeroParcela)}
    &dt_nascimento=${encodeURIComponent(dtNascimento)}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    })
      .then()
      .catch((error) => {
        console.error("Erro ao registrar simulação:", error);
        throw error;
      });
  }
}

export default RegistroSimulacaoService;
