import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { buscarAssociados, buscarAssociadosPorFaculdade } from '../../servicoAssociados';
import './TelaAssociados.css';

export default function TelaAssociados({ user, onLogout }) {
  const [associados, setAssociados] = useState([]);
  const [faculdadeFiltro, setFaculdadeFiltro] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [faculdades, setFaculdades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    carregarAssociados();
  }, []);

  const carregarAssociados = async () => {
    setLoading(true);
    const resultado = await buscarAssociados();

    if (resultado.sucesso) {
      setAssociados(resultado.associados);
      const facultadesUnicas = [...new Set(resultado.associados.map(a => a.faculdade))];
      setFaculdades(facultadesUnicas.sort());
    } else {
      console.error(resultado.mensagem);
      setAssociados([]);
    }

    setLoading(false);
  };

  const handleFiltro = async (faculdade) => {
    setFaculdadeFiltro(faculdade);

    if (faculdade === 'todas') {
      carregarAssociados();
    } else {
      setLoading(true);
      const resultado = await buscarAssociadosPorFaculdade(faculdade);
      if (resultado.sucesso) {
        setAssociados(resultado.associados);
      }
      setLoading(false);
    }
  };

  const handleVoltar = () => navigate('/portal');

  const associadosFiltrados = faculdadeFiltro === 'todas'
    ? associados
    : associados.filter(a => a.faculdade === faculdadeFiltro);

  // ===== Proteção caso o user ainda não tenha sido carregado =====
  if (!user) {
    return (
      <div className="tela-associados-container">
        <div className="carregando">Carregando informações do usuário...</div>
      </div>
    );
  }

  return (
    <div className="tela-associados-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="associados-content">
        {/* Botão Voltar */}
        <div className="voltar-container">
          <button onClick={handleVoltar} className="botao-voltar-header">
            ← Voltar
          </button>
        </div>

        {/* Informações do Usuário */}
        <div className="info-usuario">
          <p>Bem-vindo, <strong>{user?.name}</strong></p>
          <p><strong>Total de Associados:</strong> {associados.length}</p>
        </div>

        {/* Filtro por Faculdade */}
        <div className="filtro-container">
          <label><strong>Filtrar por Faculdade:</strong></label>
          <div className="filtro-buttons">
            <button
              onClick={() => handleFiltro('todas')}
              className={`botao-filtro ${faculdadeFiltro === 'todas' ? 'ativo' : ''}`}
            >
              Todas ({associados.length})
            </button>
            {faculdades.map(faculdade => {
              const count = associados.filter(a => a.faculdade === faculdade).length;
              return (
                <button
                  key={faculdade}
                  onClick={() => handleFiltro(faculdade)}
                  className={`botao-filtro ${faculdadeFiltro === faculdade ? 'ativo' : ''}`}
                >
                  {faculdade} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Associados */}
        <div className="lista-associados-container">
          <h2 className="lista-titulo">
            Associados {faculdadeFiltro !== 'todas' && `- ${faculdadeFiltro}`} ({associadosFiltrados.length})
          </h2>

          {loading ? (
            <div className="carregando">Carregando associados...</div>
          ) : associadosFiltrados.length === 0 ? (
            <div className="mensagem-vazia">
              <p>Nenhum associado encontrado</p>
            </div>
          ) : (
            <div className="tabela-associados">
              <div className="cabecalho-tabela">
                <div className="col-nome">Nome</div>
                <div className="col-email">Email</div>
                <div className="col-faculdade">Faculdade</div>
                <div className="col-data">Data de Cadastro</div>
              </div>

              {associadosFiltrados.map((associado) => (
                <div key={associado.id} className="linha-tabela">
                  <div className="col-nome">{associado.nome}</div>
                  <div className="col-email">{associado.email}</div>
                  <div className="col-faculdade">
                    <span className="badge-faculdade">{associado.faculdade}</span>
                  </div>
                  <div className="col-data">{associado.criadoEm}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
