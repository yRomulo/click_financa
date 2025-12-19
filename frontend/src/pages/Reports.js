// Página de Relatórios
import { useState, useEffect } from 'react';
import api from '../config/api';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReport();
  }, [currentDate]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await api.get(`/reports/monthly?year=${year}&month=${month}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const response = await api.get(`/reports/export/csv?startDate=${start}&endDate=${end}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transacoes-${format(currentDate, 'yyyy-MM')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      
      // Buscar transações para o PDF
      const transactionsResponse = await api.get(`/transactions?startDate=${start}&endDate=${end}&limit=1000`);
      const transactions = transactionsResponse.data;

      // Criar PDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('Relatório Financeiro Mensal', 14, 22);
      doc.setFontSize(12);
      doc.text(`Período: ${reportData?.period.month || ''}`, 14, 30);

      // Calcular resumo das transações
      const summary = transactions.reduce((acc, t) => {
        const amount = parseFloat(t.amount);
        if (t.type === 'income') {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        return acc;
      }, { income: 0, expense: 0 });

      const balance = summary.income - summary.expense;

      doc.setFontSize(14);
      doc.text('Resumo', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Receitas: R$ ${summary.income.toFixed(2)}`, 14, 52);
      doc.text(`Total Despesas: R$ ${summary.expense.toFixed(2)}`, 14, 58);
      doc.text(`Saldo: R$ ${balance.toFixed(2)}`, 14, 64);

      // Tabela de transações
      const tableData = transactions.map((t) => [
        format(new Date(t.date), 'dd/MM/yyyy'),
        t.description,
        t.type === 'income' ? 'Receita' : 'Despesa',
        `R$ ${parseFloat(t.amount).toFixed(2)}`,
        t.category_name || '-',
      ]);

      doc.autoTable({
        startY: 70,
        head: [['Data', 'Descrição', 'Tipo', 'Valor', 'Categoria']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [99, 102, 241] },
      });

      doc.save(`relatorio-${format(currentDate, 'yyyy-MM')}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  // Preparar dados para gráficos
  const incomeByCategory = reportData?.byCategory.filter(item => item.type === 'income') || [];
  const expenseByCategory = reportData?.byCategory.filter(item => item.type === 'expense') || [];

  const pieData = expenseByCategory.map(item => ({
    name: item.category_name || 'Sem categoria',
    value: parseFloat(item.total),
    color: item.category_color || '#6366f1',
  }));

  if (loading) {
    return <div className="loading">Carregando relatório...</div>;
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Relatórios</h1>
        <div className="report-actions">
          <button
            onClick={handleExportCSV}
            className="btn btn-success"
            disabled={exporting}
          >
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            className="btn btn-success"
            disabled={exporting}
          >
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Navegação de mês */}
      <div className="card">
        <div className="month-navigation">
          <button onClick={handlePreviousMonth} className="btn btn-secondary">
            ← Mês Anterior
          </button>
          <h2>{reportData?.period.month || ''}</h2>
          <button onClick={handleNextMonth} className="btn btn-secondary">
            Próximo Mês →
          </button>
        </div>
      </div>

      {/* Gráficos */}
      {expenseByCategory.length > 0 && (
        <div className="card">
          <h2>Despesas por Categoria</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {incomeByCategory.length > 0 && (
        <div className="card">
          <h2>Receitas por Categoria</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={incomeByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category_name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportData?.byCategory.length === 0 && (
        <div className="card">
          <div className="no-data">Nenhum dado disponível para o período selecionado</div>
        </div>
      )}
    </div>
  );
};

export default Reports;

