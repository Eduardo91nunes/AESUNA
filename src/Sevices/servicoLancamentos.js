import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

/* ================== SALVAR LANÇAMENTO ================== */
export const salvarLancamento = async (dados) => {
  try {
    await addDoc(collection(db, 'lancamentos'), {
      ...dados,
      criadoEm: Timestamp.now(),
    });

    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao salvar lançamento:', erro);
    return { sucesso: false, mensagem: 'Erro ao salvar lançamento' };
  }
};

/* ================== BUSCAR LANÇAMENTOS ================== */
export const buscarLancamentos = async () => {
  try {
    const q = query(
      collection(db, 'lancamentos'),
      orderBy('data', 'desc')
    );

    const snapshot = await getDocs(q);

    const lancamentos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { sucesso: true, lancamentos };
  } catch (erro) {
    console.error('Erro ao buscar lançamentos:', erro);
    return { sucesso: false, lancamentos: [] };
  }
};
