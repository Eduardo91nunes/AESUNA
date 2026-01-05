import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const uploadArquivo = async (arquivo, usuarioId) => {
  const caminho = `comprovantes/${usuarioId}/${Date.now()}_${arquivo.name}`;
  const storageRef = ref(storage, caminho);

  await uploadBytes(storageRef, arquivo);
  const url = await getDownloadURL(storageRef);

  return {
    nome: arquivo.name,
    tipo: arquivo.type,
    url,
  };
};
