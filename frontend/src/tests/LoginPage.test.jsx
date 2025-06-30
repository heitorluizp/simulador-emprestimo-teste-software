import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  test('deve chamar onLoginSuccess com credenciais corretas', () => {
    const handleLoginSuccess = vi.fn();
    render(<LoginPage onLoginSuccess={handleLoginSuccess} />);

    const usernameInput = screen.getByLabelText(/Usuário/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const loginButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Usuário ou senha inválidos/i)).toBeNull();
  });

  test('deve exibir mensagem de erro com credenciais incorretas', () => {
    const handleLoginSuccess = vi.fn();
    render(<LoginPage onLoginSuccess={handleLoginSuccess} />);

    const usernameInput = screen.getByLabelText(/Usuário/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const loginButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });

    fireEvent.click(loginButton);

    expect(screen.getByText(/Usuário ou senha inválidos/i)).toBeInTheDocument();
    expect(handleLoginSuccess).not.toHaveBeenCalled();
  });
});
