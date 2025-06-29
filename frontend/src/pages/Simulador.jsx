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
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
} from "@mui/material";

const regrasTaxa = [
  { atributo: "idade", valor: 18, operador: ">=", taxa: "0.03" },
  { atributo: "idade", valor: 25, operador: ">=", taxa: "0.025" },
  { atributo: "idade", valor: 35, operador: ">=", taxa: "0.02" },
  { atributo: "idade", valor: 60, operador: ">=", taxa: "0.018" },
];
const defaultTaxa = 0.05;

export default function Simulador() {
  const service = new SimulacaoService(regrasTaxa, defaultTaxa);
  const [openDialog, setOpenDialog] = useState(false);

  const [valorEmprestimo, setValorEmprestimo] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCalcular = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    const resposta = await service.calcularSimulacao(
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
    setLoading(false);
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
              Preencha os campos abaixo
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
              alignItems: "start",
              height: "262px",
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
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
              >
                <Chip
                  label={`Valor do Empréstimo: R$ ${Number(
                    resultado.valorEmprestimo
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  sx={{ fontSize: "16px" }}
                />
                <Chip
                  label={`Valor Total: R$ ${Number(
                    resultado.valorTotal
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  sx={{ fontSize: "16px" }}
                />
                <Chip
                  label={`Valor das Parcelas: R$ ${Number(
                    resultado.valorParcelas
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  sx={{ fontSize: "16px" }}
                />
                <Chip
                  label={`Total de Juros: R$ ${Number(
                    resultado.totalJuros
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  sx={{ fontSize: "16px" }}
                />
                <Chip
                  label={`Prazo (meses): ${resultado.prazoMeses}`}
                  sx={{ fontSize: "16px" }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(true)}
                  sx={{ mt: 1 }}
                >
                  Ver tabela de amortização
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Tabela de Amortização</DialogTitle>
                  <DialogContent>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Parcela</TableCell>
                          <TableCell>Juros (R$)</TableCell>
                          <TableCell>Amortização (R$)</TableCell>
                          <TableCell>Saldo Devedor (R$)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resultado.amortizacaoDetalhada.map((item) => (
                          <TableRow key={item.parcela}>
                            <TableCell>{item.parcela}</TableCell>
                            <TableCell>
                              {item.juros.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              {item.amortizacao.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              {item.saldoDevedor.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}
            <Button
              disabled={!valorEmprestimo || !prazoMeses || !dataNascimento}
              variant="contained"
              onClick={handleCalcular}
              sx={{ textTransform: "none" }}
              loading={loading}
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
