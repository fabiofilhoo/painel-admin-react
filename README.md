# Verde Admin — Painel Administrativo React

Painel administrativo educacional com tema dark premium em preto e verde. Projeto desenvolvido para praticar autenticação, rotas protegidas, consumo de API e CRUD no frontend.

## Tecnologias

- React + Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Formik + Yup
- Lucide React
- DummyJSON

## Funcionalidades

- Login de demonstração com validação de campos
- Estado de autenticação em contexto React
- Rotas protegidas no frontend
- Dashboard com indicadores derivados dos produtos
- Listagem, pesquisa, criação, edição e exclusão de produtos
- Estados de carregamento, mensagens de erro e confirmação
- Layout responsivo com menu lateral para desktop e mobile

## Executar localmente

Requer Node.js compatível com a versão atual do Vite.

```bash
npm install
npm run dev
```

Para validar a compilação de produção:

```bash
npm run build
npm run preview
```

## Credenciais de demonstração

- Usuário: `emilys`
- Senha: `emilyspass`

As credenciais são públicas para aprendizado e podem mudar conforme a API.

## Importante sobre persistência e segurança

DummyJSON é uma API de demonstração. As operações de adicionar, editar e excluir produtos simulam respostas, não persistem permanentemente no servidor. O estado local é perdido ao recarregar a página.

O token de login é mantido apenas em memória neste exemplo; ao atualizar a página, a sessão é encerrada. As rotas protegidas no React melhoram a navegação, mas não substituem validação de token e autorização no backend. Para produção, implemente backend próprio, persistência em banco de dados, validação de permissões, expiração e renovação de sessão e estratégia segura de armazenamento de credenciais.
