import React from "react";
import { useState } from "react";
import { simularCalculo } from "../services/calculoService";
import {
  Alert,
  Box,
  Button,
  Chip,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

export default function Simulador() {
  const [valor1, setValor1] = useState("");
  const [valor2, setValor2] = useState("");
  const [resultado, setResultado] = useState(null);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dados = {
      valor1: Number(valor1),
      valor2: Number(valor2),
    };

    const resposta = simularCalculo(dados);
    setResultado(resposta);
    setOpenSnackbar(true);
  };

  const handleReset = () => {
    setValor1("");
    setValor2("");
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
                placeholder="Valor 1"
                label="Valor 1"
                size="small"
                value={valor1}
                onChange={(e) => setValor1(e.target.value)}
                required
                sx={textFieldStyle}
              />
              <TextField
                placeholder="Valor 2"
                label="Valor 2"
                size="small"
                value={valor2}
                onChange={(e) => setValor2(e.target.value)}
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
                <Chip label={`Resultado: ${resultado.resultado}`} />
              </Box>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ textTransform: "none" }}
            >
              Calcular
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Cálculo realizado com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}
