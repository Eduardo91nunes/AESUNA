import React from 'react';
import './Login.css';
import logoAesuna from '../img/associacao.png';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function Login({ 
  loginEmail, 
  setLoginEmail, 
  loginPassword, 
  setLoginPassword, 
  onLogin, 
  onGoToCadastro,
  onClose
}) {

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      alert("Informe seu email para redefinir a senha.");
      return;
    }

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, loginEmail);
      alert("Email de redefinição de senha enviado!");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("Usuário não encontrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("Email inválido.");
      } else {
        alert("Erro ao enviar email.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        

        <div className="logo-section">
          <div className="logo-frame">
            <img src={logoAesuna} alt="Logo AESUNA" className="logo" />
          </div>
          <h1 className="titulo-principal">AESUNA</h1>
          <p className="subtitulo">Portal de Reclamações e Elogios</p>
        </div>

        <div className="formulario-login">
          <h2>Fazer Login</h2>
          
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="input-campo"
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="input-campo"
          />
          
          <button onClick={onLogin} className="botao-entrar">
            Entrar
          </button>
        </div>

        {/* Cadastro */}
        <div className="link-cadastro">
          <p>Não tem conta?</p>
          <button onClick={onGoToCadastro} className="botao-link">
            Criar nova conta
          </button>
        </div>

        {/* 🔹 Esqueceu senha */}
        <div className="esqueci-senha-container">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="botao-esqueci-senha"
          >
            Esqueceu sua senha?
          </button>
        </div>

      </div>
    </div>
  );
}
