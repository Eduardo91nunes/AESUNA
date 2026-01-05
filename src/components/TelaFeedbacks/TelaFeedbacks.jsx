import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // ajuste o caminho
import Navbar from '../Navbar/Navbar';
import './TelaFeedbacks.css';

export default function TelaFeedbacks({ user, onLogout }) {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        author: doc.data().userName,
        university: doc.data().userUniversity || 'Desconhecida',
        category: doc.data().category,
        message: doc.data().message,
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || ''
      }));
      setFeedbacks(lista);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="tela-feedbacks-container">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  const handleVoltar = () => navigate('/portal');

  return (
    <div className="tela-feedbacks-container">
      <Navbar user={user} onLogout={() => onLogout(navigate)} />

      <div className="feedbacks-content">
        <div className="voltar-container">
          <button onClick={handleVoltar} className="botao-voltar-header">
            ← Voltar
          </button>
        </div>

        <div className="info-usuario">
          <p>Bem-vindo, <strong>{user.name}</strong></p>
          <p><strong>Faculdade:</strong> {user.university}</p>
        </div>

        <div className="lista-container">
          <h2 className="lista-titulo">Todos os Feedbacks ({feedbacks.length})</h2>

          {feedbacks.length === 0 ? (
            <div className="mensagem-vazia">
              <p>Nenhum feedback enviado ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="lista-feedbacks">
              {feedbacks.map((sub) => (
                <div key={sub.id} className={`feedback-item ${sub.category}`}>
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
      </div>
    </div>
  );
}
