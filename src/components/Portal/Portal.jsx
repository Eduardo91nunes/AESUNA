import React, { useState } from 'react';
import Formulario from '../Formulario/Formulario';
import Navbar from '../Navbar/Navbar';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebaseConfig';
import './Portal.css';

export default function Portal({ user, onLogout, onVerFeedbacks }) {
  const [category, setCategory] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: anonymous ? null : user?.id || "Desconhecido",
        userName: anonymous ? "Anônimo" : user?.name || "Desconhecido",
        userUniversity: anonymous ? null : user?.university || "Desconhecida",
        category,
        message,
        timestamp: serverTimestamp()
      });

      alert('Feedback enviado com sucesso!');
      setCategory('');
      setAnonymous(false);
      setMessage('');
    } catch (error) {
      console.error("Erro ao enviar feedback: ", error);
      alert('Ocorreu um erro ao enviar o feedback. Tente novamente.');
    }
  };

  if (!user) {
    return (
      <div className="portal-container">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <Navbar user={user} onLogout={onLogout} onVerFeedbacks={onVerFeedbacks} />

      <div className="portal-content">
        <div className="info-usuario">
          <p>Bem-vindo, <strong>{user.name || "Desconhecido"}</strong></p>
          <p><strong>Faculdade:</strong> {user.university || "Desconhecida"}</p>
          <p className="metodo-autenticacao">
            Autenticado via {user.metodo === 'google' ? '🔵 Google' : '📧 Email'}
          </p>
        </div>

        <Formulario
          category={category}
          setCategory={setCategory}
          anonymous={anonymous}
          setAnonymous={setAnonymous}
          message={message}
          setMessage={setMessage}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
