import React from "react";
import { useState } from "react";
import { SimulacaoService } from "../services/SimulacaoService";
import {
  Alert,
  Box,
  Button,
  Chip,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

const regrasMock = [
  { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" },
  { atributo: "idade", valor: 25, operador: ">=", taxa: "0.025" },
  { atributo: "idade", valor: 35, operador: ">=", taxa: "0.02" },
  { atributo: "idade", valor: 60, operador: ">=", taxa: "0.018" },
];
const defaultTaxa = 0.05;

export default function Simulador() {
  const service = new SimulacaoService(regrasMock, defaultTaxa);

  const [valorEmprestimo, setValorEmprestimo] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [resultado, setResultado] = useState(null);

  const [snackbar, setSnackbar] = React.useState({
    mensagem: "",
    tipo: "",
    aberto: false,
  });

  const handleValorEmprestimo = (e) => {
    setValorEmprestimo(e.target.value);
  };

  const handlePrazoMeses = (e) => {
    setPrazoMeses(e.target.value);
  };

  const handleDataNascimento = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + "/" + value.slice(5);
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setDataNascimento(value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({ ...snackbar, aberto: false });
  };

  const handleCalcular = (e) => {
    e.preventDefault();

    const [dia, mes, ano] = dataNascimento.split("/");
    const dataNascimentoDate = new Date(`${ano}-${mes}-${dia}`);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimentoDate.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    if (
      mesAtual < dataNascimentoDate.getMonth() ||
      (mesAtual === dataNascimentoDate.getMonth() &&
        diaAtual < dataNascimentoDate.getDate())
    ) {
      idade--;
    }

    if (isNaN(idade) || idade <= 6) {
      setSnackbar({
        mensagem:
          "Data de nascimento inválida. A idade deve ser maior do que 6 anos",
        tipo: "error",
        aberto: true,
      });
      return;
    }

    const resposta = service.calcularSimulacao(
      valorEmprestimo,
      prazoMeses,
      dataNascimento
    );

    if (valorEmprestimo <= 0) {
      setSnackbar({
        mensagem: "O valor do empréstimo deve ser maior do que 0",
        tipo: "error",
        aberto: true,
      });
      return;
    }

    if (prazoMeses <= 0) {
      setSnackbar({
        mensagem: "O prazo em meses deve ser maior do que 0",
        tipo: "error",
        aberto: true,
      });
      return;
    }

    setResultado(resposta);
    setSnackbar({
      mensagem: "Cálculo realizado com sucesso!",
      tipo: "success",
      aberto: true,
    });
  };

  const handleReset = () => {
    setValorEmprestimo("");
    setPrazoMeses("");
    setDataNascimento("");
    setResultado(null);
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      height: "40px",
      borderRadius: "8px",
    },
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 3,
          }}
        >
          <Typography variant="h4" textAlign="center">
            Simulador de Cálculo
          </Typography>
          <Box>
            <Typography variant="body1" color="textSecondary" pb={1}>
              Intrução de uso da calculadora lorem ipsum dot amet
            </Typography>
            <Box
              sx={{
                display: "flex",
                columnGap: 2,
              }}
            >
              <TextField
                id="valor_emprestimo"
                placeholder="Digite o valor do empréstimo"
                label="Valor do empréstimo"
                size="small"
                value={valorEmprestimo}
                onChange={handleValorEmprestimo}
                required
                sx={textFieldStyle}
              />
              <TextField
                id="prazo_meses"
                placeholder="Digite o prazo em meses"
                label="Prazo em meses"
                size="small"
                value={prazoMeses}
                onChange={handlePrazoMeses}
                required
                sx={textFieldStyle}
              />
              <TextField
                id="data_nascimento"
                placeholder="Digite a sua data de nascimento"
                label="Data de nascimento"
                size="small"
                value={dataNascimento}
                onChange={handleDataNascimento}
                required
                sx={textFieldStyle}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              color="info"
              onClick={handleReset}
              sx={{ textTransform: "none" }}
            >
              Resetar
            </Button>

            {resultado && (
              <Box>
                <Chip
                  label={`Resultado: ${resultado.resultado}`}
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </Box>
            )}
            <Button
              disabled={!valorEmprestimo || !prazoMeses || !dataNascimento}
              variant="contained"
              onClick={handleCalcular}
              sx={{ textTransform: "none" }}
            >
              Calcular
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.tipo}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
