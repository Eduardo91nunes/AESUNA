import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import './Lancamentos.css';
import { salvarLancamento } from '../../Sevices/servicoLancamentos';

export default function Lancamentos({ user, onLogout }) {
  const [naturezaLancamento, setNaturezaLancamento] = useState(''); // ENTRADA | SAIDA
  const [tipoLancamento, setTipoLancamento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  const tiposLancamento = [
    'Mensalidade de Ônibus',
    'Contabilidade',
    'Devolução Caroneiro',
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validos = files.filter(
      (f) => f.type.includes('pdf') || f.type.includes('image')
    );

    if (validos.length !== files.length) {
      alert('Apenas PDFs e imagens são permitidos!');
    }

    setArquivos([...arquivos, ...validos]);
  };

  const removerArquivo = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!naturezaLancamento || !tipoLancamento || !descricao || !valor || !data) {
      return alert('Preencha todos os campos obrigatórios!');
    }

    if (arquivos.length === 0) {
      return alert('Anexe ao menos um arquivo!');
    }

    setEnviando(true);

    const lancamento = {
      natureza: naturezaLancamento, // ENTRADA ou SAIDA
      tipo: tipoLancamento,
      descricao,
      valor: parseFloat(valor),
      data,
      arquivos: arquivos.map((f) => ({
        nome: f.name,
        tipo: f.type,
      })),
      usuario: user.name,
      usuarioId: user.uid,
    };

    const resultado = await salvarLancamento(lancamento);

    if (resultado.sucesso) {
      alert('Lançamento registrado com sucesso!');
      setNaturezaLancamento('');
      setTipoLancamento('');
      setDescricao('');
      setValor('');
      setData('');
      setArquivos([]);
    } else {
      alert(resultado.mensagem || 'Erro ao salvar lançamento');
    }

    setEnviando(false);
  };

  if (!user) {
    return <div className="carregando">Carregando usuário...</div>;
  }

  return (
    <div className="lancamentos-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="lancamentos-content">
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
          <p>Registre seus lançamentos financeiros</p>
          <p><strong>Usuário:</strong> {user.name}</p>
        </div>

        <div className="formulario-container">
          <h2 className="formulario-titulo">📊 Novo Lançamento</h2>

          <div className="formulario-form">

            {/* RADIO ENTRADA / SAÍDA */}
            <div className="form-grupo">
              <label>Tipo de Lançamento *</label>

              <div className="radio-grupo">
                <label className="radio-opcao entrada">
                  <input
                    type="radio"
                    name="natureza"
                    value="ENTRADA"
                    checked={naturezaLancamento === 'ENTRADA'}
                    onChange={(e) => setNaturezaLancamento(e.target.value)}
                  />
                  Entrada
                </label>

                <label className="radio-opcao saida">
                  <input
                    type="radio"
                    name="natureza"
                    value="SAIDA"
                    checked={naturezaLancamento === 'SAIDA'}
                    onChange={(e) => setNaturezaLancamento(e.target.value)}
                  />
                  Saída
                </label>
              </div>
            </div>

            <div className="form-grupo">
              <label>Categoria *</label>
              <select
                value={tipoLancamento}
                onChange={(e) => setTipoLancamento(e.target.value)}
                className="input-campo"
              >
                <option value="">Selecione</option>
                {tiposLancamento.map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="form-grupo">
              <label>Descrição *</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="textarea-campo"
              />
            </div>

            <div className="form-grupo-duplo">
              <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="input-campo"
              />
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="input-campo"
              />
            </div>

            <input type="file" multiple onChange={handleFileChange} />

            <button
              onClick={handleSubmit}
              disabled={enviando}
              className="botao-enviar"
            >
              {enviando ? 'Enviando...' : '💾 Registrar Lançamento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
