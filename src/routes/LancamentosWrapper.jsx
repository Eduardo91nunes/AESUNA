import React from 'react';
import { Navigate } from 'react-router-dom';
import Lancamentos from '../components/Lancamentos/Lancamentos';

export default function LancamentosWrapper({ user, onLogout }) {
  // 🔒 Proteção: usuário não logado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Regra de negócio: somente este email pode acessar
  const emailAutorizado = 'aesuna.educacaounai@gmail.com';

  if (user.email !== emailAutorizado) {
    return <Navigate to="/prestacao" replace />;
  }

  return (
    <Lancamentos
      user={user}
      onLogout={onLogout}
      onVoltar={() => window.location.href = '/portal'}
    />
  );
}
