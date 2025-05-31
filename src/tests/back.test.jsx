import { describe, it, expect } from "vitest";
import { SimulacaoService } from "../services/SimulacaoService";
import dayjs from "dayjs";

const regrasMock = [
  { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" },
  { atributo: "idade", valor: 25, operador: ">=", taxa: "0.025" },
  { atributo: "idade", valor: 35, operador: ">=", taxa: "0.02" },
  { atributo: "idade", valor: 60, operador: ">=", taxa: "0.018" },
];

describe("SimulacaoService", () => {
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
});
