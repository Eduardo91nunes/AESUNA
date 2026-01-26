import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./Navbar.css";
import logo from "../img/associacao.png";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = getAuth();

  const handleLinkClick = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };


  const nomeUsuario =
    user?.displayName ||
    user?.name ||
    user?.email ||
    "Usuário";

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/portal")}>
        <img src={logo} alt="Logo AESUNA" className="navbar-logo" />
        <h1 className="navbar-title">AESUNA</h1>
      </div>

      <ul className="navbar-center">
        <li><Link to="/portal">Início</Link></li>
        <li><Link to="/feedbacks">Feedbacks</Link></li>
        <li><Link to="/associados">Associados</Link></li>
        <li><Link to="/lancamentos">Lançamentos</Link></li>
        <li><Link to="/prestacao">Prestação</Link></li>
      </ul>

      <div className="navbar-right">
        <span className="navbar-usuario">{nomeUsuario}</span>
        <button className="navbar-sair" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-center-mobile ${menuOpen ? "active" : ""}`}>
        <li><Link to="/portal" onClick={handleLinkClick}>Início</Link></li>
        <li><Link to="/feedbacks" onClick={handleLinkClick}>Feedbacks</Link></li>
        <li><Link to="/associados" onClick={handleLinkClick}>Associados</Link></li>
        <li><Link to="/lancamentos" onClick={handleLinkClick}>Lançamentos</Link></li>
        <li><Link to="/prestacao" onClick={handleLinkClick}>Prestação</Link></li>

        <li className="mobile-usuario">
          <span>{nomeUsuario}</span>
          <button onClick={handleLogout}>Sair</button>
        </li>
      </ul>
    </nav>
  );
}
