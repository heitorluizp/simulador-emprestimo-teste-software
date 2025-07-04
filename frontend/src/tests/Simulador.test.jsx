import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Simulador from '../pages/Simulador';
import { SimulacaoService } from '../services/SimulacaoService';

vi.mock('../services/SimulacaoService');

describe('Simulador de Cálculo', () => {
  beforeEach(() => {
    const mockResultado = {
      valorEmprestimo: 1000,
      valorTotal: 1100,
      valorParcelas: 91.67,
      totalJuros: 100,
      prazoMeses: 12,
      amortizacaoDetalhada: Array(12)
        .fill({})
        .map((_, i) => ({
          parcela: i + 1,
          juros: 1,
          amortizacao: 1,
          saldoDevedor: 1,
        })),
    };
    SimulacaoService.prototype.calcularSimulacao = vi
      .fn()
      .mockResolvedValue(mockResultado);
    render(<Simulador />);
  });
  afterEach(() => {
    cleanup();
  });

  test('renderiza o título corretamente', () => {
    expect(screen.getByText('Simulador de Cálculo')).toBeInTheDocument();
  });

  test('renderiza os campos de entrada corretamente', () => {
    expect(screen.getByLabelText(/Valor do empréstimo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prazo em meses/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de nascimento/i)).toBeInTheDocument();
  });

  test('renderiza os botões corretamente', () => {
    expect(screen.getByText(/Resetar/i)).toBeInTheDocument();
    expect(screen.getByText(/Calcular/i)).toBeInTheDocument();
  });

  test('permite digitar no campo de valor do empréstimo', () => {
    const input = screen.getByLabelText(/Valor do empréstimo/i);
    fireEvent.change(input, { target: { value: '1000' } });
    expect(input.value).toBe('1000');
  });

  test('permite digitar no campo de prazo em meses', () => {
    const input = screen.getByLabelText(/Prazo em meses/i);
    fireEvent.change(input, { target: { value: '12' } });
    expect(input.value).toBe('12');
  });

  test('permite digitar no campo de data de nascimento', () => {
    const input = screen.getByLabelText(/Data de nascimento/i);
    fireEvent.change(input, { target: { value: '01/01/2000' } });
    expect(input.value).toBe('01/01/2000');
  });

  test('exibe erro para idade menor que 6 anos', async () => {
    const input = screen.getByLabelText(/Data de nascimento/i);
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });

    fireEvent.change(input, { target: { value: '01/01/2020' } });
    fireEvent.click(screen.getByText('Calcular'));
    expect(
      await screen.findByText(
        'Data de nascimento inválida. A idade deve ser maior do que 6 anos',
      ),
    ).toBeInTheDocument();
  });

  test('exibe erro para valor do empréstimo menor ou igual a 0', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '0' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }));

    expect(
      await screen.findByText('O valor do empréstimo deve ser maior do que 0'),
    ).toBeInTheDocument();
  });
  test('exibe erro para prazo em meses menor ou igual a 0', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '0' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }));

    expect(
      await screen.findByText('O prazo em meses deve ser maior do que 0'),
    ).toBeInTheDocument();
  });
  test('exibe sucesso e resultados ao calcular com valores válidos', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });

    fireEvent.click(screen.getByText('Calcular'));

    await waitFor(() => {
      expect(
        screen.getByText('Cálculo realizado com sucesso!'),
      ).toBeInTheDocument();
      expect(screen.getByText(/Valor do Empréstimo: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Valor Total: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Valor das Parcelas: R\$/i)).toBeInTheDocument();
    });
  });
  test('reseta os campos ao clicar no botão Resetar', () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });

    fireEvent.click(screen.getByText('Resetar'));

    expect(screen.getByLabelText(/Valor do empréstimo/i).value).toBe('');
    expect(screen.getByLabelText(/Prazo em meses/i).value).toBe('');
    expect(screen.getByLabelText(/Data de nascimento/i).value).toBe('');
  });

  test('não exibe resultado antes de calcular', () => {
    expect(screen.queryByText(/Resultado:/)).not.toBeInTheDocument();
  });

  test('exibe todos os campos do resultado após calcular com valores válidos', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }));

    await waitFor(() => {
      expect(screen.getByText(/Valor do Empréstimo: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Valor Total: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Valor das Parcelas: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Total de Juros: R\$/i)).toBeInTheDocument();
      expect(screen.getByText(/Prazo \(meses\): 12/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Ver tabela de amortização/i }),
      ).toBeInTheDocument();
    });
  });
  test('abre o pop-up da tabela de amortização ao clicar no botão', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });

    fireEvent.click(screen.getByText('Calcular'));

    const botaoTabela = await screen.findByText(/Ver tabela de amortização/i);
    fireEvent.click(botaoTabela);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Tabela de Amortização')).toBeInTheDocument();
    });
  });

  test('exibe erro para data de nascimento inválida', async () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '99/99/9999' },
    });
    fireEvent.click(screen.getByText('Calcular'));

    expect(
      await screen.getByText(
        /Data de nascimento inválida. A idade deve ser maior do que 6 anos/i,
      ),
    ).toBeInTheDocument();
  });

  test("botão 'Calcular' está desabilitado inicialmente", () => {
    const button = screen.getByText(/Calcular/i);
    expect(button).toBeDisabled();
  });

  test("botão 'Calcular' continua desabilitado se apenas o campo 'Valor do empréstimo' for preenchido", () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    const button = screen.getByText(/Calcular/i);
    expect(button).toBeDisabled();
  });

  test("botão 'Calcular' continua desabilitado se apenas o campo 'Prazo em meses' for preenchido", () => {
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    const button = screen.getByText(/Calcular/i);
    expect(button).toBeDisabled();
  });

  test("botão 'Calcular' continua desabilitado se apenas o campo 'Data de nascimento' for preenchido", () => {
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });
    const button = screen.getByText(/Calcular/i);
    expect(button).toBeDisabled();
  });

  test("botão 'Calcular' está habilitado quando todos os campos são preenchidos corretamente", () => {
    fireEvent.change(screen.getByLabelText(/Valor do empréstimo/i), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(/Prazo em meses/i), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '01/01/2000' },
    });
    const button = screen.getByText(/Calcular/i);
    expect(button).not.toBeDisabled();
  });

  test("botão 'Calcular' volta a ficar desabilitado se um dos campos for apagado", () => {
    const valorEmprestimoInput = screen.getByLabelText(/Valor do empréstimo/i);
    const prazoMesesInput = screen.getByLabelText(/Prazo em meses/i);
    const dataNascimentoInput = screen.getByLabelText(/Data de nascimento/i);

    fireEvent.change(valorEmprestimoInput, { target: { value: '1000' } });
    fireEvent.change(prazoMesesInput, { target: { value: '12' } });
    fireEvent.change(dataNascimentoInput, { target: { value: '01/01/2000' } });

    const button = screen.getByText(/Calcular/i);
    expect(button).not.toBeDisabled();

    fireEvent.change(valorEmprestimoInput, { target: { value: '' } });
    expect(button).toBeDisabled();
  });

  test("botão 'Calcular' volta a ficar desabilitado se todos os campos forem apagados", () => {
    const valorEmprestimoInput = screen.getByLabelText(/Valor do empréstimo/i);
    const prazoMesesInput = screen.getByLabelText(/Prazo em meses/i);
    const dataNascimentoInput = screen.getByLabelText(/Data de nascimento/i);

    fireEvent.change(valorEmprestimoInput, { target: { value: '1000' } });
    fireEvent.change(prazoMesesInput, { target: { value: '12' } });
    fireEvent.change(dataNascimentoInput, { target: { value: '01/01/2000' } });

    const button = screen.getByText(/Calcular/i);
    expect(button).not.toBeDisabled();

    fireEvent.change(valorEmprestimoInput, { target: { value: '' } });
    fireEvent.change(prazoMesesInput, { target: { value: '' } });
    fireEvent.change(dataNascimentoInput, { target: { value: '' } });

    expect(button).toBeDisabled();
  });

  test("exibe o botão 'Área Administrativa' e altera o hash ao clicar", () => {
  window.location.hash = ""; 
  const btn = screen.getByRole('button', { name: /área administrativa/i });
  expect(btn).toBeInTheDocument();

  fireEvent.click(btn);
  expect(window.location.hash).toBe("#admin");
});


});
