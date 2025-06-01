import dayjs from "dayjs";

export class SimulacaoService {
  constructor(taxaRegrasJson, taxaPadraoJuros) {
    // ordena regras da mais específica pra mais genérica
    const regrasOrdenadas = [...taxaRegrasJson].sort(
      (a, b) => b.valor - a.valor
    );
    this.taxaRegrasJson = regrasOrdenadas;
    this.taxaPadraoJuros = taxaPadraoJuros;
  }

  calcularSimulacao(valorEmprestimo, prazoMeses, dataNascimento) {
    const idade = this.calcularIdade(dataNascimento);
    const taxaJuros = this.determinarTaxaJuros(idade);
    const taxaMensal = taxaJuros / 12;

    const valorParcelas = this.calcularPMT(
      valorEmprestimo,
      taxaMensal,
      prazoMeses
    );

    const valorTotal = +(valorParcelas * prazoMeses).toFixed(4);
    const totalJuros = +(valorTotal - valorEmprestimo).toFixed(4);
    const amortizacaoDetalhada = this.gerarTabelaAmortizacao(
      valorEmprestimo,
      taxaMensal,
      prazoMeses,
      valorParcelas
    );

    return {
      valorEmprestimo,
      valorTotal,
      valorParcelas: +valorParcelas.toFixed(4),
      totalJuros,
      prazoMeses,
      idade,
      amortizacaoDetalhada,
    };
  }
  /**
   * Calcula o valor da parcela fixa (PMT) usando a fórmula:
   * PMT = PV * r / [1 - (1 + r)^-n]
   * Onde:
   *  - PV é o valor presente (empréstimo)
   *  - r é a taxa de juros por período (mensal)
   *  - n é o número de parcelas (prazo em meses)
   */
  calcularPMT(pv, taxa, n) {
    const umMaisTaxa = 1 + taxa;
    const potenciaNegativa = 1 / Math.pow(umMaisTaxa, n);
    const denominador = 1 - potenciaNegativa;
    const numerador = pv * taxa;
    return numerador / denominador;
  }

  determinarTaxaJuros(idade) {
    try {
      return this.findTaxa("idade", idade);
    } catch (e) {
      return this.taxaPadraoJuros;
    }
  }

  calcularIdade(dataNascimento) {
    const birthDate = dayjs(this.converterDataNascimento(dataNascimento));
    const now = dayjs();
    return now.diff(birthDate, "year");
  }

  converterDataNascimento(dataNascimento) {
  // Converte "DD/MM/YYYY" para "YYYY-MM-DD"
  const [dia, mes, ano] = dataNascimento.split("/");
  return `${ano}-${mes}-${dia}`;
}


  findTaxa(atributo, valor) {
    const node = this.taxaRegrasJson;
    const taxa = this.findTaxaRecursively(node, atributo, valor);
    if (taxa == null) throw new Error("Taxa não encontrada");
    return parseFloat(taxa);
  }

  findTaxaRecursively(node, atributo, valor) {
    if (Array.isArray(node)) {
      for (const subNode of node) {
        const taxa = this.findTaxaRecursively(subNode, atributo, valor);
        if (taxa != null) return taxa;
      }
    } else if (typeof node === "object") {
      if (node.atributo === atributo) {
        const jsonValue = node.valor;
        const operador = node.operador;

        const match =
          (operador === "=" && valor === jsonValue) ||
          (operador === ">" && valor > jsonValue) ||
          (operador === "<" && valor < jsonValue) ||
          (operador === ">=" && valor >= jsonValue) ||
          (operador === "<=" && valor <= jsonValue);

        if (match) return node.taxa;
      }

      if (node.node) {
        return this.findTaxaRecursively(node.node, atributo, valor);
      }
    }
    return null;
  }

  gerarTabelaAmortizacao(valorEmprestimo, taxaMensal, prazoMeses, parcelaFixa) {
    let saldo = valorEmprestimo;
    const tabela = [];

    for (let i = 1; i <= prazoMeses; i++) {
      const juros = +(saldo * taxaMensal).toFixed(4);
      const amortizacao = +(parcelaFixa - juros).toFixed(4);
      saldo = +(saldo - amortizacao).toFixed(4);

      tabela.push({
        parcela: i,
        juros,
        amortizacao,
        saldoDevedor: saldo > 0 ? saldo : 0,
      });
    }

    return tabela;
  }
}
