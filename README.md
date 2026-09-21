# 📢 AESUNA — Portal de Reclamações e Elogios

Sistema web desenvolvido para a **AESUNA**, com o objetivo de disponibilizar um canal digital para registro e gerenciamento de **reclamações, elogios e feedbacks**.

O projeto foi desenvolvido utilizando **React.js**, proporcionando uma interface simples, intuitiva e responsiva para que usuários possam registrar suas manifestações de forma organizada.

## 📌 Sobre o Projeto

O **Portal AESUNA** foi desenvolvido como uma solução para facilitar a comunicação entre estudantes e a instituição.

Através do sistema, os usuários podem realizar seu cadastro, acessar a plataforma e registrar manifestações relacionadas à instituição, podendo escolher diferentes categorias e optar pelo envio de forma identificada ou anônima.

## ✨ Funcionalidades

* 🔐 Sistema de autenticação
* 📝 Cadastro de usuários
* 👤 Identificação do usuário
* 📢 Cadastro de reclamações
* 👍 Cadastro de elogios
* 🏷️ Classificação por categoria
* 🕵️ Possibilidade de envio anônimo
* 📋 Registro das manifestações
* 📱 Interface responsiva
* 🔒 Controle de acesso aos dados

## 🖥️ Funcionamento

O fluxo principal da aplicação consiste em:

```text
Usuário
   ↓
Cadastro / Login
   ↓
Acesso ao Portal
   ↓
Preenchimento da manifestação
   ↓
Escolha da categoria
   ↓
Identificado ou Anônimo
   ↓
Envio do Feedback
```

## 🛠️ Tecnologias Utilizadas

### Front-end

* **React.js**
* **JavaScript**
* **HTML5**
* **CSS3**
* **React Router**

### Backend / Serviços

* **Firebase Authentication**
* **Firebase Firestore**

O Firebase é utilizado para autenticação dos usuários e armazenamento dos dados das manifestações.

## 📂 Estrutura do Projeto

```text
AESUNA-BACKUP/
│
├── public/
│   └── ...
│
├── src/
│   ├── Components/
│   ├── Pages/
│   ├── ...
│   ├── App.js
│   └── index.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> A estrutura pode ser atualizada conforme novas funcionalidades forem adicionadas ao projeto.

## 🚀 Como Executar o Projeto

### Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

* [Node.js](https://nodejs.org/)
* npm

### 1. Clone o repositório

```bash
git clone https://github.com/Eduardo91nunes/AESUNA-BACKUP.git
```

### 2. Acesse a pasta

```bash
cd AESUNA-BACKUP
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute a aplicação

```bash
npm start
```

A aplicação será executada localmente em:

```text
http://localhost:3000
```

## 🔥 Configuração do Firebase

Para executar o projeto corretamente, é necessário configurar um projeto no **Firebase** e fornecer as credenciais da aplicação.

A configuração deve ser mantida em variáveis de ambiente ou em um arquivo de configuração que **não seja versionado no GitHub**.

Exemplo:

```env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

⚠️ **Importante:** nunca publique chaves, senhas ou credenciais privadas diretamente no repositório.

## 🗃️ Estrutura dos Dados

O sistema utiliza o Firebase Firestore para armazenar informações dos usuários e manifestações.

### Usuários

Exemplo de informações:

```text
usuarios
├── nome
├── email
├── faculdade
└── ...
```

### Feedbacks

As manifestações podem armazenar informações como:

```text
feedbacks
├── autor
├── universidade
├── categoria
├── mensagem
├── anonimo
├── userId
└── criadoEm
```

## 🎯 Objetivos

O projeto tem como principais objetivos:

* Criar um canal digital de comunicação;
* Facilitar o registro de reclamações e elogios;
* Permitir manifestações identificadas ou anônimas;
* Organizar os feedbacks recebidos;
* Melhorar a comunicação entre usuários e instituição;
* Desenvolver uma solução web moderna e acessível.

## 📱 Responsividade

A aplicação foi desenvolvida pensando em diferentes dispositivos:

* 💻 Computadores
* 💻 Notebooks
* 📱 Smartphones
* 📲 Tablets

## 🔮 Melhorias Futuras

Possíveis melhorias para o projeto:

* [ ] Painel administrativo
* [ ] Dashboard de manifestações
* [ ] Filtros por categoria
* [ ] Filtros por período
* [ ] Status das reclamações
* [ ] Resposta às manifestações
* [ ] Notificações por e-mail
* [ ] Relatórios
* [ ] Gráficos estatísticos
* [ ] Melhorias de acessibilidade
* [ ] Melhorias de segurança e regras do Firestore

## 👨‍💻 Desenvolvedor

Desenvolvido por **Eduardo Nunes**.

### 🔗 Links

* **GitHub:** https://github.com/Eduardo91nunes
* **Repositório:** https://github.com/Eduardo91nunes/AESUNA-BACKUP

---

<p align="center">
  📢 <strong>AESUNA — Portal de Reclamações e Elogios</strong><br>
  Tecnologia aproximando usuários e instituição.
</p>
