import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Navbar from '../Navbar/Navbar';
import './PrestacaoContas.css';
import { buscarLancamentos } from '../../Sevices/servicoLancamentos';

export default function PrestacaoContas({ user, onLogout }) {
  const [lancamentos, setLancamentos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    carregarLancamentos();
  }, []);

  const carregarLancamentos = async () => {
    setLoading(true);
    try {
      const resultado = await buscarLancamentos();
      setLancamentos(resultado.sucesso ? resultado.lancamentos : []);
    } catch (erro) {
      console.error('Erro ao buscar lançamentos:', erro);
      setLancamentos([]);
    }
    setLoading(false);
  };

  const formatarReal = (valor) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  const lancamentosFiltrados =
    filtroTipo === 'todos'
      ? lancamentos
      : lancamentos.filter((l) => l.tipo === filtroTipo);

  /** ✅ TOTAL CONSIDERANDO ENTRADA / SAÍDA */
  const calcularTotal = () =>
    lancamentosFiltrados.reduce((acc, l) => {
      return l.natureza === 'ENTRADA'
        ? acc + l.valor
        : acc - l.valor;
    }, 0);

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('AESUNA - Prestação de Contas', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Data', 'Natureza', 'Tipo', 'Descrição', 'Valor', 'Responsável']],
      body: lancamentosFiltrados.map((l) => [
        new Date(l.data).toLocaleDateString('pt-BR'),
        l.natureza,
        l.tipo,
        l.descricao,
        formatarReal(l.valor),
        l.usuario,
      ]),
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.text(
      `Total Geral: ${formatarReal(calcularTotal())}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save('prestacao-contas.pdf');
  };

  const tiposLancamento = [
    'Mensalidade de Ônibus',
    'Contabilidade',
    'Devolução Caroneiro',
  ];

  if (!user) {
    return <div className="carregando">Carregando usuário...</div>;
  }

  return (
    <div className="prestacao-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="prestacao-content">
        {/* Botão Voltar */}
        <div className="voltar-container">
          <button
            onClick={() => navigate('/portal')}
            className="botao-voltar-header"
          >
            ← Voltar
          </button>
        </div>

        <div className="info-usuario">
          <p>Visualize todos os lançamentos financeiros</p>
          <p><strong>Total de Lançamentos:</strong> {lancamentos.length}</p>
        </div>

        {/* RESUMO */}
        <div className="resumo-financeiro">
          <h3>💰 Resumo Financeiro</h3>
          <div className="resumo-grid">
            <div className="resumo-item total">
              <span className="resumo-label">Saldo Final</span>
              <span className="resumo-valor">
                {formatarReal(calcularTotal())}
              </span>
            </div>
            <div className="resumo-item">
              <span className="resumo-label">Registros</span>
              <span className="resumo-valor">
                {lancamentosFiltrados.length}
              </span>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="filtros-container">
          <div className="filtros-buttons">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`botao-filtro ${filtroTipo === 'todos' ? 'ativo' : ''}`}
            >
              Todos
            </button>

            {tiposLancamento.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`botao-filtro ${filtroTipo === tipo ? 'ativo' : ''}`}
              >
                {tipo}
              </button>
            ))}
          </div>

          <button onClick={gerarPDF} className="botao-gerar-pdf">
            📄 Gerar PDF
          </button>
        </div>

        {/* LISTA */}
        <div className="lancamentos-lista-container">
          {loading ? (
            <div className="carregando">Carregando...</div>
          ) : (
            <div className="lancamentos-lista">
              {lancamentosFiltrados.map((l) => (
                <div
                  key={l.id}
                  className={`lancamento-card ${
                    l.natureza === 'ENTRADA' ? 'entrada' : 'saida'
                  }`}
                >
                  <div className="lancamento-header">
                    <span>{l.tipo}</span>
                    <strong>
                      {l.natureza === 'ENTRADA' ? '+' : '-'} {formatarReal(l.valor)}
                    </strong>
                  </div>

                  <span className="badge-natureza">
                    {l.natureza}
                  </span>

                  <p>{l.descricao}</p>

                  <small>
                    {new Date(l.data).toLocaleDateString('pt-BR')} — {l.usuario}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
