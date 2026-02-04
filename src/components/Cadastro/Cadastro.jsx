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
  const [faculdadeOutro, setFaculdadeOutro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoToast, setTipoToast] = useState("sucesso");
  const [mostraToast, setMostraToast] = useState(false);

  const handleCadastro = async () => {
    const faculdadeFinal =
      faculdade === "Outro" ? faculdadeOutro : faculdade;

    if (!nome || !email || !faculdadeFinal || !senha || !confirmarSenha) {
      showToast("Preencha todos os campos!", "erro");
      return;
    }

    if (senha !== confirmarSenha) {
      showToast("As senhas não coincidem!", "erro");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: nome,
      });

      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
        faculdade: faculdadeFinal,
        metodo: "manual",
        criadoEm: new Date(),
      });

      showToast("Conta criada com sucesso!", "sucesso");
      limparCampos();

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
    setFaculdadeOutro("");
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

          {/* FACULDADE */}
          <div className="campo-formulario campo-faculdade">
            <label>Escolha sua Faculdade</label>

            <div className="opcoes-faculdade">
              <input
                type="radio"
                id="uniatenas"
                name="faculdade"
                value="Uniatenas"
                checked={faculdade === "Uniatenas"}
                onChange={(e) => setFaculdade(e.target.value)}
              />
              <label htmlFor="uniatenas">Uniatenas</label>

              <input
                type="radio"
                id="finom"
                name="faculdade"
                value="Finom"
                checked={faculdade === "Finom"}
                onChange={(e) => setFaculdade(e.target.value)}
              />
              <label htmlFor="finom">Finom</label>

              <input
                type="radio"
                id="iftm"
                name="faculdade"
                value="IFTM"
                checked={faculdade === "IFTM"}
                onChange={(e) => setFaculdade(e.target.value)}
              />
              <label htmlFor="iftm">IFTM</label>

              {/* OUTRO */}
              <input
                type="radio"
                id="outro"
                name="faculdade"
                value="Outro"
                checked={faculdade === "Outro"}
                onChange={() => setFaculdade("Outro")}
              />
              <label htmlFor="outro">Outro</label>

              {faculdade === "Outro" && (
                <input
                  type="text"
                  className="input-outro"
                  placeholder="Digite o nome da faculdade"
                  value={faculdadeOutro}
                  onChange={(e) => setFaculdadeOutro(e.target.value)}
                />
              )}
            </div>
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
