import { vi, describe, it, expect, beforeEach } from "vitest";
import HistoricoService from "../services/HistoricoService";

describe("HistoricoService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve retornar dados do histórico quando a resposta for ok", async () => {
    const mockData = [{ id: 1, valorEmprestimo: 1000 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    });

    const result = await HistoricoService.getHistorico();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/api/simulations");
  });

  it("deve retornar array vazio se a resposta não for ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await HistoricoService.getHistorico();
    expect(result).toEqual([]);
  });

  it("deve retornar array vazio em caso de erro na requisição", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await HistoricoService.getHistorico();
    expect(result).toEqual([]);
  });
});