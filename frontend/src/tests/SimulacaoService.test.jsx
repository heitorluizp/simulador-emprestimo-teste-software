import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimulacaoService } from '../services/SimulacaoService';
import RegistroSimulacaoService from '../services/RegistroSimulacaoService';
import dayjs from 'dayjs';

vi.mock('../services/RegistroSimulacaoService', () => ({
  default: {
    registrarSimulacao: vi.fn().mockResolvedValue({ success: true }),
  },
}));

const regrasMock = [
  { atributo: 'idade', valor: 18, operador: '>=', taxa: '0.03' },
  { atributo: 'idade', valor: 25, operador: '>=', taxa: '0.025' },
  { atributo: 'idade', valor: 35, operador: '>=', taxa: '0.02' },
  { atributo: 'idade', valor: 60, operador: '>=', taxa: '0.018' },
];

describe('SimulacaoService - Simulação de empréstimo', () => {
  const defaultTaxa = 0.05;
  const service = new SimulacaoService(regrasMock, defaultTaxa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calcula idade corretamente', () => {
    const nascimento = dayjs().subtract(30, 'years').format('DD/MM/YYYY');
    expect(service.calcularIdade(nascimento)).toBe(30);
  });

  it('retorna taxa correta com base na idade', () => {
    expect(service.determinarTaxaJuros(65)).toBe(0.018);
    expect(service.determinarTaxaJuros(40)).toBe(0.02);
    expect(service.determinarTaxaJuros(27)).toBe(0.025);
    expect(service.determinarTaxaJuros(18)).toBe(0.03);
  });

  it('calcula simulacao corretamente', async () => {
    const nascimento = dayjs().subtract(30, 'years').format('DD/MM/YYYY');
    const result = await service.calcularSimulacao(1500, 24, nascimento);

    expect(result.valorEmprestimo).toBe(1500);
    expect(result.prazoMeses).toBe(24);
    expect(result.idade).toBe(30);
    expect(result.valorParcelas).toBeGreaterThan(0);
    expect(result.valorTotal).toBeGreaterThan(1500);
    expect(result.totalJuros).toBeCloseTo(result.valorTotal - 1500, 4);

    expect(RegistroSimulacaoService.registrarSimulacao).toHaveBeenCalledOnce();
  });
});

describe('SimulacaoService - Tabela de Amortizacao', () => {
  const service = new SimulacaoService(regrasMock, 0.05);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar tabela com mesmo número de parcelas que o prazo', async () => {
    const resultado = await service.calcularSimulacao(1000, 6, '01/01/1990');
    expect(resultado.amortizacaoDetalhada.length).toBe(6);
  });

  it('saldo devedor deve decrescer até zero', async () => {
    const resultado = await service.calcularSimulacao(1000, 6, '01/01/1990');
    const saldos = resultado.amortizacaoDetalhada.map((p) => p.saldoDevedor);
    for (let i = 1; i < saldos.length; i++) {
      expect(saldos[i]).toBeLessThanOrEqual(saldos[i - 1]);
    }
    expect(saldos.at(-1)).toBeCloseTo(0, 1);
  });
});


