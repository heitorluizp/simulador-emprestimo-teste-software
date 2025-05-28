import React from "react";
import { useState } from "react";
import { simularCalculo } from "../services/calculoService";

export default function Simulador() {
  const [valor1, setValor1] = useState("");
  const [valor2, setValor2] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dados = {
      valor1: Number(valor1),
      valor2: Number(valor2),
    };

    const resposta = simularCalculo(dados);
    setResultado(resposta);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Simulador de Cálculo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Valor 1"
          value={valor1}
          onChange={(e) => setValor1(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Valor 2"
          value={valor2}
          onChange={(e) => setValor2(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Calcular
        </button>
      </form>

      {resultado && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl mb-2">Resultado:</h2>
          <p>{resultado.mensagem}</p>
          <p className="font-bold text-lg">Valor: {resultado.resultado}</p>
        </div>
      )}
    </div>
  );
}
