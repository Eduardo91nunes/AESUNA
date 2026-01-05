import React from 'react';
import './Formulario.css';

export default function Formulario({
  category,
  setCategory,
  anonymous,
  setAnonymous,
  message,
  setMessage,
  onSubmit = () => {}
}) {
  const handleSubmit = (e) => {
    e.preventDefault(); // evita refresh da página
    onSubmit();
  };

  return (
    <div className="formulario-container">
      <h2 className="formulario-titulo">Compartilhe seu feedback</h2>

      <form className="formulario-form" onSubmit={handleSubmit}>
        {/* Tipo de Feedback */}
        <div className="form-grupo">
          <label>
            Tipo de feedback <span className="obrigatorio">*</span>
          </label>
          <div className="radio-grupo">
            <label className="radio-label">
              <input
                type="radio"
                name="category"
                value="reclamacao"
                checked={category === 'reclamacao'}
                onChange={(e) => setCategory(e.target.value)}
              />
              <span>📢 Reclamação</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="category"
                value="elogio"
                checked={category === 'elogio'}
                onChange={(e) => setCategory(e.target.value)}
              />
              <span>👍 Elogio</span>
            </label>
          </div>
        </div>

        {/* Anonimato */}
        <div className="anonimato-box">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span>
              <strong>Enviar como anônimo</strong> - Seu feedback será analisado sem identificação
            </span>
          </label>
        </div>

        {/* Mensagem */}
        <div className="form-grupo">
          <label>
            Sua mensagem <span className="obrigatorio">*</span>
          </label>
          <textarea
            placeholder="Compartilhe seus comentários, sugestões ou reclamações aqui..."
            value={message || ''}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className="textarea-campo"
          />
          <p className="contador-caracteres">{message?.length || 0} caracteres</p>
        </div>

        {/* Botão Enviar */}
        <button type="submit" className="botao-enviar">
          Enviar Feedback
        </button>
      </form>
    </div>
  );
}
