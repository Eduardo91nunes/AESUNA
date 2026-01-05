import React from 'react';
import './Login.css';
import logoAesuna from '../img/associacao.png'; // Ajuste o caminho conforme sua pasta

export default function Login({ 
  loginEmail, 
  setLoginEmail, 
  loginPassword, 
  setLoginPassword, 
  onLogin, 
  onGoToCadastro,
  onClose // 🔹 Função passada para o botão de fechar
}) {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Botão de fechar */}
        <button className="botao-fechar" onClick={onClose}>×</button>

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-frame">
            <img src={logoAesuna} alt="Logo AESUNA" className="logo" />
          </div>
          <h1 className="titulo-principal">AESUNA</h1>
          <p className="subtitulo">Portal de Reclamações e Elogios</p>
        </div>

        {/* Formulário de Login */}
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

        {/* Link para Cadastro */}
        <div className="link-cadastro">
          <p>Não tem conta?</p>
          <button onClick={onGoToCadastro} className="botao-link">
            Criar nova conta
          </button>
        </div>
      </div>
    </div>
  );
}
