import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ========== CADASTRO ==========
export const cadastroUsuario = async (email, senha, nome, faculdade) => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salvar dados do usuário no Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      nome: nome,
      email: email,
      faculdade: faculdade,
      criadoEm: new Date(),
      metodo: 'manual'
    });

    return {
      sucesso: true,
      uid: user.uid,
      mensagem: 'Usuário cadastrado com sucesso!'
    };
  } catch (erro) {
    let mensagem = 'Erro ao cadastrar usuário';
    
    if (erro.code === 'auth/email-already-in-use') {
      mensagem = 'Este email já está cadastrado!';
    } else if (erro.code === 'auth/weak-password') {
      mensagem = 'A senha deve ter no mínimo 6 caracteres!';
    } else if (erro.code === 'auth/invalid-email') {
      mensagem = 'Email inválido!';
    }

    return {
      sucesso: false,
      mensagem: mensagem,
      erro: erro.message
    };
  }
};

// ========== LOGIN ==========
export const loginUsuario = async (email, senha) => {
  try {
    // Fazer login no Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Buscar dados do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

    if (userDoc.exists()) {
      const dados = userDoc.data();
      return {
        sucesso: true,
        uid: user.uid,
        nome: dados.nome,
        email: dados.email,
        faculdade: dados.faculdade,
        metodo: dados.metodo,
        mensagem: 'Login realizado com sucesso!'
      };
    } else {
      return {
        sucesso: false,
        mensagem: 'Dados do usuário não encontrados'
      };
    }
  } catch (erro) {
    let mensagem = 'Erro ao fazer login';
    
    if (erro.code === 'auth/user-not-found') {
      mensagem = 'Usuário não encontrado!';
    } else if (erro.code === 'auth/wrong-password') {
      mensagem = 'Senha incorreta!';
    } else if (erro.code === 'auth/invalid-email') {
      mensagem = 'Email inválido!';
    } else if (erro.code === 'auth/too-many-requests') {
      mensagem = 'Muitas tentativas de login. Tente novamente mais tarde!';
    }

    return {
      sucesso: false,
      mensagem: mensagem,
      erro: erro.message
    };
  }
};

// ========== LOGOUT ==========
export const logoutUsuario = async () => {
  try {
    await signOut(auth);
    return {
      sucesso: true,
      mensagem: 'Logout realizado com sucesso!'
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao fazer logout',
      erro: erro.message
    };
  }
};

// ========== VERIFICAR AUTENTICAÇÃO ==========
export const verificarAutenticacao = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Usuário está autenticado
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const dados = userDoc.data();
        callback({
          autenticado: true,
          uid: user.uid,
          nome: dados.nome,
          email: dados.email,
          faculdade: dados.faculdade,
          metodo: dados.metodo
        });
      }
    } else {
      // Usuário não está autenticado
      callback({ autenticado: false });
    }
  });

  return unsubscribe;
};