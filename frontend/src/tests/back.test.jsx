import { describe, it, expect } from "vitest";
import { SimulacaoService } from "../services/SimulacaoService";
import dayjs from "dayjs";

const regrasMock = [
  { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" },
  { atributo: "idade", valor: 25, operador: ">=", taxa: "0.025" },
  { atributo: "idade", valor: 35, operador: ">=", taxa: "0.02" },
  { atributo: "idade", valor: 60, operador: ">=", taxa: "0.018" },
];

describe("SimulacaoService - Simulação de empréstimo", () => {
  const defaultTaxa = 0.05;
  const service = new SimulacaoService(regrasMock, defaultTaxa);

  it("calcula idade corretamente", () => {
    const nascimento = dayjs().subtract(30, "years").format("YYYY-MM-DD");
    expect(service.calcularIdade(nascimento)).toBe(30);
  });

  it("retorna taxa correta com base na idade", () => {
    expect(service.determinarTaxaJuros(65)).toBe(0.018);
    expect(service.determinarTaxaJuros(40)).toBe(0.02);
    expect(service.determinarTaxaJuros(27)).toBe(0.025);
    expect(service.determinarTaxaJuros(18)).toBe(0.03);
  });

  it("retorna taxa padrão se idade não estiver mapeada", () => {
    const serviceSemTaxas = new SimulacaoService([], defaultTaxa);
    expect(serviceSemTaxas.determinarTaxaJuros(45)).toBe(defaultTaxa);
  });

  it("lança erro se nenhuma taxa for encontrada e não houver padrão", () => {
    const semTaxa = new SimulacaoService([], null);
    expect(() => semTaxa.findTaxa(30)).toThrow("Taxa não encontrada");
  });

  it("calcula simulacao corretamente", () => {
    const nascimento = dayjs().subtract(30, "years").format("YYYY-MM-DD");
    const result = service.calcularSimulacao(1500, 24, nascimento);

    expect(result.valorEmprestimo).toBe(1500);
    expect(result.prazoMeses).toBe(24);
    expect(result.idade).toBe(30);
    expect(result.valorParcelas).toBeGreaterThan(0);
    expect(result.valorTotal).toBeGreaterThan(1500);
    expect(result.totalJuros).toBeCloseTo(result.valorTotal - 1500, 4);
  });

  it("calcula simulação com taxa padrão se regra não for encontrada", () => {
    const serviceFallback = new SimulacaoService([], 0.05);
    const nascimento = dayjs().subtract(17, "years").format("YYYY-MM-DD");
    const simulacao = serviceFallback.calcularSimulacao(1000, 12, nascimento);
    expect(simulacao.valorParcelas).toBeGreaterThan(0);
    expect(simulacao.totalJuros).toBeGreaterThan(0);
    expect(simulacao.idade).toBe(17);
  });

  it("retorna taxa correta com múltiplas regras que se aplicam (prioridade por ordem)", () => {
    const regrasSobrepostas = [
      { atributo: "idade", valor: 18, operador: ">=", taxa: "0.04" },
      { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" }, // será ignorada
    ];
    const serviceSobreposto = new SimulacaoService(regrasSobrepostas, 0.05);
    expect(serviceSobreposto.determinarTaxaJuros(20)).toBe(0.04);
  });
});

describe("SimulacaoService - Tabela de Amortizacao", () => {
  const regras = [
    { atributo: "idade", valor: 60, operador: ">=", taxa: "0.018" },
    { atributo: "idade", valor: 35, operador: ">=", taxa: "0.02" },
    { atributo: "idade", valor: 25, operador: ">=", taxa: "0.025" },
    { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" },
  ];

  const service = new SimulacaoService(regras, 0.05);

  it("deve gerar tabela com mesmo número de parcelas que o prazo", () => {
    const resultado = service.calcularSimulacao(1000, 6, "1990-01-01");
    expect(resultado.amortizacaoDetalhada.length).toBe(6);
  });

  it("saldo devedor deve decrescer até zero", () => {
    const resultado = service.calcularSimulacao(1000, 6, "1990-01-01");
    const saldos = resultado.amortizacaoDetalhada.map((p) => p.saldoDevedor);
    for (let i = 1; i < saldos.length; i++) {
      expect(saldos[i]).toBeLessThanOrEqual(saldos[i - 1]);
    }
    expect(saldos.at(-1)).toBeCloseTo(0, 1);
  });

  it("juros devem ser maiores nas primeiras parcelas", () => {
    const resultado = service.calcularSimulacao(1000, 6, "1990-01-01");
    const juros = resultado.amortizacaoDetalhada.map((p) => p.juros);
    expect(juros[0]).toBeGreaterThan(juros.at(-1));
  });

  it("amortização deve crescer ao longo do tempo (Price)", () => {
    const resultado = service.calcularSimulacao(1000, 6, "1990-01-01");
    const amort = resultado.amortizacaoDetalhada.map((p) => p.amortizacao);
    expect(amort[0]).toBeLessThan(amort.at(-1));
  });
});
