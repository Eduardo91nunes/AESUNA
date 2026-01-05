import { 
  collection, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ========== BUSCAR TODOS OS ASSOCIADOS ==========
export const buscarAssociados = async () => {
  try {
    console.log('Buscando associados...');

    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    console.log('Snapshot recebido, total de associados:', querySnapshot.size);

    const associados = [];

    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      console.log('Processando associado:', doc.id, dados);

      associados.push({
        id: doc.id,
        nome: dados.nome || 'Desconhecido',
        email: dados.email || 'Não informado',
        faculdade: dados.faculdade || 'Não informada',
        metodo: dados.metodo || 'manual',
        criadoEm: formatarData(dados.criadoEm?.toDate?.() || dados.criadoEm)
      });
    });

    // ✅ Ordenar por nome manualmente (evita erro de índice no Firestore)
    associados.sort((a, b) => a.nome.localeCompare(b.nome));

    console.log('Associados processados:', associados);

    return {
      sucesso: true,
      associados,
      total: associados.length
    };
  } catch (erro) {
    console.error('Erro ao buscar associados:', erro);
    return {
      sucesso: false,
      associados: [],
      total: 0,
      mensagem: 'Erro ao buscar associados: ' + erro.message
    };
  }
};

// ========== BUSCAR ASSOCIADOS POR FACULDADE ==========
export const buscarAssociadosPorFaculdade = async (faculdade) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const associados = [];

    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      if (dados.faculdade === faculdade) {
        associados.push({
          id: doc.id,
          nome: dados.nome,
          email: dados.email,
          faculdade: dados.faculdade,
          criadoEm: formatarData(dados.criadoEm?.toDate?.() || dados.criadoEm)
        });
      }
    });

    return { sucesso: true, associados };
  } catch (erro) {
    console.error('Erro ao buscar associados por faculdade:', erro);
    return { sucesso: false, associados: [] };
  }
};

// ========== FORMATAR DATA ==========
const formatarData = (data) => {
  try {
    const d = new Date(data);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return 'Data desconhecida';
  }
};
