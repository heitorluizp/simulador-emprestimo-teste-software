import { describe, it, expect, vi, beforeEach } from "vitest";
import RegistroSimulacaoService from "../services/RegistroSimulacaoService";

describe("RegistroSimulacaoService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve registrar simulação com sucesso", async () => {
    const mockResponse = { data: { id: 1, valorEmprestimo: 1000 } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const payload = { valorEmprestimo: 1000, prazoMeses: 12 };
    const result = await RegistroSimulacaoService.registrarSimulacao(payload);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/simulations",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
  });

  it("deve lançar erro se a resposta não for ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    const payload = { valorEmprestimo: 1000, prazoMeses: 12 };
    await expect(
      RegistroSimulacaoService.registrarSimulacao(payload)
    ).rejects.toThrow("HTTP error! status: 400");
  });

  it("deve lançar erro em caso de falha na requisição", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const payload = { valorEmprestimo: 1000, prazoMeses: 12 };
    await expect(
      RegistroSimulacaoService.registrarSimulacao(payload)
    ).rejects.toThrow("Network error");
  });
});