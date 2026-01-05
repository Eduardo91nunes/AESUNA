import React from 'react';
import './ListaFeedback.css';

export default function ListaFeedbacks({ submissions }) {
  return (
    <div className="lista-container">
      <h3 className="lista-titulo">
        Feedbacks Recebidos ({submissions.length})
      </h3>

      {submissions.length === 0 ? (
        <div className="mensagem-vazia">
          <p>Nenhum feedback enviado ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="lista-feedbacks">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`feedback-item ${sub.category}`}
            >
              <div className="feedback-header">
                <div className="feedback-info">
                  <p className="feedback-author">{sub.author}</p>
                  <span className="feedback-university">{sub.university}</span>
                  <p className="feedback-timestamp">{sub.timestamp}</p>
                </div>
                <span className={`feedback-badge ${sub.category}`}>
                  {sub.category === 'reclamacao' ? '📢 Reclamação' : '👍 Elogio'}
                </span>
              </div>
              <p className="feedback-message">{sub.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}