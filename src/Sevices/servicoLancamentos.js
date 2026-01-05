import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Salvar novo lançamento
export const salvarLancamento = async (lancamento) => {
  try {
    await addDoc(collection(db, "lancamentos"), lancamento);
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao salvar lançamento:", error);
    return { sucesso: false, mensagem: error.message };
  }
};

// Buscar todos os lançamentos
export const buscarLancamentos = async () => {
  try {
    const snapshot = await getDocs(collection(db, "lancamentos"));
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
    return [];
  }
};

// Deletar lançamento pelo ID
export const deletarLancamento = async (id) => {
  try {
    await deleteDoc(doc(db, "lancamentos", id));
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao deletar lançamento:", error);
    return { sucesso: false, mensagem: error.message };
  }
};

// Atualizar lançamento pelo ID
export const atualizarLancamento = async (id, dadosAtualizados) => {
  try {
    await updateDoc(doc(db, "lancamentos", id), dadosAtualizados);
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao atualizar lançamento:", error);
    return { sucesso: false, mensagem: error.message };
  }
};
