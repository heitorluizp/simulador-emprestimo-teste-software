import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../pages/AdminDashboard';
import HistoricoService from '../services/HistoricoService';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.mock('../services/HistoricoService');

const mockSimulations = [
  {
    id: '1',
    valorEmprestimo: 10000,
    prazoMeses: 24,
    valorParcelas: 500,
    valorTotal: 12000,
    idade: 30,
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    valorEmprestimo: 5000,
    prazoMeses: 12,
    valorParcelas: 450,
    valorTotal: 5400,
    idade: 45,
    timestamp: new Date().toISOString(),
  },
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve exibir o estado de carregamento e depois as estatísticas e o histórico', async () => {
    HistoricoService.getHistorico.mockResolvedValue(mockSimulations);
    render(<AdminDashboard onLogout={() => {}} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      const totalSimulationsCard = screen
        .getByText('Total de Simulações')
        .closest('div');
      expect(within(totalSimulationsCard).getByText('2')).toBeInTheDocument();

      const totalValueCard = screen
        .getByText('Valor Total Emprestado')
        .closest('div');
      expect(
        within(totalValueCard).getByText('R$ 15.000,00'),
      ).toBeInTheDocument();

      const avgLoanCard = screen.getByText('Empréstimo Médio').closest('div');
      expect(within(avgLoanCard).getByText('R$ 7.500,00')).toBeInTheDocument();

      const row = screen.getByText(/10\.000,00/).closest('tr');
      expect(within(row).getByText(/12\.000,00/)).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem quando não há simulações no histórico', async () => {
    HistoricoService.getHistorico.mockResolvedValue([]);
    render(<AdminDashboard onLogout={() => {}} />);

    await waitFor(() => {
      const totalSimulationsCard = screen
        .getByText('Total de Simulações')
        .closest('div');
      expect(within(totalSimulationsCard).getByText('0')).toBeInTheDocument();

      const totalValueCard = screen
        .getByText('Valor Total Emprestado')
        .closest('div');
      expect(within(totalValueCard).getByText('R$ 0,00')).toBeInTheDocument();

      const avgLoanCard = screen.getByText('Empréstimo Médio').closest('div');
      expect(within(avgLoanCard).getByText('R$ 0,00')).toBeInTheDocument();
    });
  });
});
