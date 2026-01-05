import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import "./Cadastro.css";

export default function Cadastro({ onVoltar, onCadastro }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [faculdade, setFaculdade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoToast, setTipoToast] = useState("sucesso");
  const [mostraToast, setMostraToast] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !faculdade || !senha || !confirmarSenha) {
      showToast("Preencha todos os campos!", "erro");
      return;
    }

    if (senha !== confirmarSenha) {
      showToast("As senhas não coincidem!", "erro");
      return;
    }

    try {
      // 1️⃣ Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2️⃣ Salvar nome no Auth (displayName)
      await updateProfile(user, {
        displayName: nome,
      });

      // 3️⃣ Criar documento no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
        faculdade,
        metodo: "manual",
        criadoEm: new Date(),
      });

      // Mostra toast de sucesso
      showToast("Conta criada com sucesso!", "sucesso");
      limparCampos();

      // Chama função para redirecionar para tela inicial
      if (onCadastro) onCadastro();

    } catch (error) {
      console.error("Erro ao criar conta:", error);
      showToast("Erro ao criar conta: " + error.message, "erro");
    }
  };

  const showToast = (msg, tipo) => {
    setMensagem(msg);
    setTipoToast(tipo);
    setMostraToast(true);
    setTimeout(() => setMostraToast(false), 3000);
  };

  const limparCampos = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setFaculdade("");
  };

  return (
    <div className="container-cadastro">
      <div className="cadastro-box">
        <div className="formulario-cadastro">
          <h2>Criar Conta</h2>

          {mostraToast && (
            <div className={`toast ${tipoToast === "erro" ? "erro" : "sucesso"}`}>
              {mensagem}
            </div>
          )}

          <div className="campo-formulario">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="campo-formulario">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="campo-formulario campo-faculdade">
            <label>Faculdade</label>
            <input
              type="text"
              placeholder="Ex: Universidade Federal"
              value={faculdade}
              onChange={(e) => setFaculdade(e.target.value)}
            />
          </div>

          <div className="campo-formulario">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="campo-formulario">
            <label>Confirmar Senha</label>
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          <div className="botoes-cadastro">
            <button className="botao-confirmar" onClick={handleCadastro}>
              Criar Conta
            </button>
            <button className="botao-voltar" onClick={onVoltar}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
