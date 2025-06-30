import React, { useState, useEffect } from 'react';
import HistoricoService from '../services/HistoricoService';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (value) => {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const StatCard = ({ title, value, color }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center', color: color }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

export default function AdminDashboard({ onLogout }) {
  const [historico, setHistorico] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await HistoricoService.getHistorico();
      setHistorico(data);
      calculateStats(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ totalSimulations: 0, totalValue: 0, avgLoan: 0, ageData: [] });
      return;
    }

    const totalSimulations = data.length;
    const totalValue = data.reduce(
      (sum, item) => sum + item.valorEmprestimo,
      0,
    );
    const avgLoan = totalValue / totalSimulations;

    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51-60': 0,
      '61+': 0,
    };
    data.forEach((sim) => {
      if (sim.idade <= 25) ageGroups['18-25']++;
      else if (sim.idade <= 35) ageGroups['26-35']++;
      else if (sim.idade <= 50) ageGroups['36-50']++;
      else if (sim.idade <= 60) ageGroups['51-60']++;
      else ageGroups['61+']++;
    });

    const ageData = Object.keys(ageGroups).map((key) => ({
      name: key,
      quantidade: ageGroups[key],
    }));

    setStats({ totalSimulations, totalValue, avgLoan, ageData });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f2f5' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Dashboard Administrativo</Typography>
        <Button variant="contained" color="error" onClick={onLogout}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total de Simulações"
            value={stats.totalSimulations}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Valor Total Emprestado"
            value={formatCurrency(stats.totalValue)}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Empréstimo Médio"
            value={formatCurrency(stats.avgLoan)}
            color="#f57c00"
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Distribuição por Idade
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} simulações`} />
            <Legend />
            <Bar dataKey="quantidade" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Histórico Completo
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Valor Empréstimo</TableCell>
                <TableCell>Prazo</TableCell>
                <TableCell>Valor Parcela</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Idade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historico.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {new Date(row.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{formatCurrency(row.valorEmprestimo)}</TableCell>
                  <TableCell>{row.prazoMeses} meses</TableCell>
                  <TableCell>{formatCurrency(row.valorParcelas)}</TableCell>
                  <TableCell>{formatCurrency(row.valorTotal)}</TableCell>
                  <TableCell>{row.idade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
