import { 
  collection, 
  addDoc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ========== ENVIAR FEEDBACK ==========
export const enviarFeedback = async (feedback) => {
  try {
    
    const docRef = await addDoc(collection(db, 'feedbacks'), {
      author: feedback.author,
      university: feedback.university,
      category: feedback.category,
      message: feedback.message,
      anonymous: feedback.anonymous,
      userId: feedback.userId,
      criadoEm: serverTimestamp()
    });

    
    return {
      sucesso: true,
      id: docRef.id,
      mensagem: 'Feedback enviado com sucesso!'
    };
  } catch (erro) {
    console.error('Erro ao enviar feedback:', erro);
    return {
      sucesso: false,
      mensagem: 'Erro ao enviar feedback: ' + erro.message,
      erro: erro.message
    };
  }
};

// ========== BUSCAR TODOS OS FEEDBACKS ==========
export const buscarFeedbacks = async () => {
  try {
    
    
    const querySnapshot = await getDocs(collection(db, 'feedbacks'));
    
    
    const feedbacks = [];

    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      
      
      let timestamp = 'Data desconhecida';
      if (dados.criadoEm) {
        timestamp = formatarData(dados.criadoEm);
      }
      
      feedbacks.push({
        id: doc.id,
        author: dados.author || 'Desconhecido',
        university: dados.university || 'Não informada',
        category: dados.category || 'reclamacao',
        message: dados.message || '',
        timestamp: timestamp
      });
    });

    
    return {
      sucesso: true,
      feedbacks: feedbacks
    };
  } catch (erro) {
    console.error('Erro ao buscar feedbacks:', erro);
    return {
      sucesso: false,
      feedbacks: [],
      mensagem: 'Erro ao buscar feedbacks: ' + erro.message,
      erro: erro.message
    };
  }
};

// ========== FORMATAR DATA ==========
const formatarData = (data) => {
  try {
    
    
    let dataObj = data;
    
    // Se for um Timestamp do Firebase
    if (data && typeof data.toDate === 'function') {
      dataObj = data.toDate();
    }
    // Se for uma string
    else if (typeof data === 'string') {
      dataObj = new Date(data);
    }
    // Se não for uma instância de Date
    else if (!(data instanceof Date)) {
      dataObj = new Date(data);
    }
    
    // Garantir que é uma data válida
    if (isNaN(dataObj)) {
      throw new Error('Data inválida');
    }

    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');

    // CORREÇÃO PRINCIPAL: adicionar BACKTICKS (` `)
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } catch (erro) {
    console.error('Erro ao formatar data:', erro);
    return 'Data desconhecida';
  }
};
