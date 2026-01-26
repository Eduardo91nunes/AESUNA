import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro';
import Portal from './components/Portal/Portal';
import TelaFeedbacks from './components/TelaFeedbacks/TelaFeedbacks';
import Associados from './components/Associados/TelaAssociados';
import Prestacao from './components/Prestacao/PrestacaoContas';
import Lancamentos from './components/Lancamentos/Lancamentos';

import { loginUsuario, logoutUsuario } from './servicoAutenticacao';
import { enviarFeedback, buscarFeedbacks } from './servicoFeedbacks';

import './App.css';

/* ================== REGRA DE NEGÓCIO ================== */
const ADMIN_EMAIL = 'aesuna.educacaounai@gmail.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [recentlySignedUp, setRecentlySignedUp] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  /* ================== LOGIN ================== */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  /* ================== FEEDBACK ================== */
  const [category, setCategory] = useState('reclamacao');
  const [anonymous] = useState(true);
  const [message, setMessage] = useState('');

  /* ================== FUNÇÃO CENTRAL ================== */
  const montarUsuarioCompleto = async (usuarioAuth) => {
    const ref = doc(db, 'usuarios', usuarioAuth.uid);
    const snap = await getDoc(ref);
    const dados = snap.exists() ? snap.data() : {};

    return {
      uid: usuarioAuth.uid,
      name: usuarioAuth.displayName || dados.nome || 'Usuário',
      email: usuarioAuth.email,
      university: dados.faculdade || '',
      metodo: dados.metodo || 'manual',
    };
  };

  /* ================== AUTENTICAÇÃO ================== */
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
          if (recentlySignedUp) {
            setUser(null);
            setLoading(false);
            setRecentlySignedUp(false);
            return;
          }

          if (usuario) {
            const usuarioCompleto = await montarUsuarioCompleto(usuario);
            setUser(usuarioCompleto);
            await carregarFeedbacks();
          } else {
            setUser(null);
          }

          setLoading(false);
        });

        return () => unsubscribe();
      })
      .catch(console.error);
  }, [recentlySignedUp]);

  /* ================== FEEDBACKS ================== */
  const carregarFeedbacks = async () => {
    try {
      const resultado = await buscarFeedbacks();
      setSubmissions(resultado.sucesso ? resultado.feedbacks : []);
    } catch (erro) {
      console.error('Erro ao carregar feedbacks:', erro);
      setSubmissions([]);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!message.trim()) return alert('Preencha a mensagem!');

    const novoFeedback = {
      author: anonymous ? 'Anônimo' : user?.name,
      category,
      message: message.trim(),
      anonymous,
      userId: user?.uid,
    };

    const resultado = await enviarFeedback(novoFeedback);

    if (resultado.sucesso) {
      setMessage('');
      setCategory('reclamacao');
      await carregarFeedbacks();
      alert(resultado.mensagem);
    } else {
      alert(resultado.mensagem);
    }
  };

  /* ================== LOGIN MANUAL ================== */
  const handleManualLogin = async () => {
    if (!loginEmail || !loginPassword) {
      return alert('Preencha email e senha!');
    }

    const resultado = await loginUsuario(loginEmail, loginPassword);
    if (!resultado.sucesso) return alert(resultado.mensagem);

    const usuarioCompleto = await montarUsuarioCompleto({
      uid: resultado.uid,
      email: resultado.email,
      displayName: resultado.nome,
    });

    setUser(usuarioCompleto);
    setLoginEmail('');
    setLoginPassword('');
    await carregarFeedbacks();
  };

  /* ================== LOGOUT ================== */
  const handleLogout = async (navigate) => {
    const resultado = await logoutUsuario();
    if (resultado.sucesso) {
      setUser(null);
      setSubmissions([]);
      navigate('/Login');
    }
  };

  /* ================== LOADING ================== */
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <strong>Carregando...</strong>
        <small>Verificando autenticação</small>
      </div>
    );
  }

  /* ================== ROTAS ================== */
  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            !user ? (
              <Login
                loginEmail={loginEmail}
                setLoginEmail={setLoginEmail}
                loginPassword={loginPassword}
                setLoginPassword={setLoginPassword}
                onLogin={handleManualLogin}
                onGoToCadastro={() => window.location.href = '/cadastro'}
              />
            ) : <Navigate to="/portal" replace />
          }
        />

        <Route
          path="/cadastro"
          element={!user ? (
            <Cadastro
              onVoltar={() => window.location.href = '/Login'}
              onCadastro={() => setRecentlySignedUp(true)}
            />
          ) : <Navigate to="/Login" replace />}
        />

        <Route path="/portal" element={<PortalWrapper />} />
        <Route path="/feedbacks" element={<FeedbacksWrapper />} />
        <Route path="/associados" element={<AssociadosWrapper />} />

        <Route path="/lancamentos" element={<LancamentosWrapper />} />
        <Route path="/prestacao" element={<PrestacaoWrapper />} />

        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="*" element={<Navigate to="/Login" replace />} />

      </Routes>
    </Router>
  );

  /* ================== WRAPPERS ================== */
  function PortalWrapper() {
    if (!user) return <Navigate to="/Login" replace />;
    return <Portal user={user} />;
  }

  function FeedbacksWrapper() {
    const navigate = useNavigate();
    if (!user) return <Navigate to="/Login" replace />;

    return (
      <TelaFeedbacks
        user={user}
        submissions={submissions}
        onLogout={() => handleLogout(navigate)}
        onSubmit={handleSubmitFeedback}
      />
    );
  }

  function AssociadosWrapper() {
    const navigate = useNavigate();
    if (!user) return <Navigate to="/Login" replace />;

    return (
      <Associados
        user={user}
        onLogout={() => handleLogout(navigate)}
      />
    );
  }

  function LancamentosWrapper() {
    const navigate = useNavigate();
    if (!user || !isAdmin) return <Navigate to="/prestacao" replace />;

    return (
      <Lancamentos
        user={user}
        onLogout={() => handleLogout(navigate)}
      />
    );
  }

  function PrestacaoWrapper() {
    const navigate = useNavigate();
    if (!user) return <Navigate to="/Login" replace />;

    return (
      <Prestacao
        user={user}
        onLogout={() => handleLogout(navigate)}
      />
    );
  }
}
