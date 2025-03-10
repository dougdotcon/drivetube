# Guia de Início Rápido - mulakintola

Este guia irá ajudá-lo a configurar e executar o mulakintola em seu ambiente local.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. [Node.js](https://nodejs.org/) versão 18.17 ou superior
2. [Git](https://git-scm.com/) para clonar o repositório
3. Uma conta Google com acesso ao Google Drive
4. Um editor de código (recomendamos [Visual Studio Code](https://code.visualstudio.com/))

## Configuração do Google Cloud Platform

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. No menu lateral, vá para "APIs e Serviços" > "Biblioteca"
4. Procure e ative as seguintes APIs:
   - Google Drive API
   - Google OAuth 2.0

5. Configure as credenciais OAuth 2.0:
   - Vá para "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "ID do Cliente OAuth"
   - Selecione "Aplicativo Web"
   - Dê um nome ao seu aplicativo
   - Em "URIs de redirecionamento autorizados", adicione:
     - `http://localhost:3000/api/auth/callback/google`
   - Clique em "Criar"
   - Salve o `Client ID` e o `Client Secret` gerados

## Instalação e Configuração Local

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd mulakintola
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo de variáveis de ambiente:
   - Crie um arquivo chamado `.env.local` na raiz do projeto
   - Adicione as seguintes variáveis:
   ```env
   GOOGLE_CLIENT_ID=seu_client_id_aqui
   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
   NEXTAUTH_SECRET=uma_string_aleatoria_segura
   NEXTAUTH_URL=http://localhost:3000
   ```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse o aplicativo:
   - Abra seu navegador
   - Vá para `http://localhost:3000`
   - Faça login com sua conta Google

## Estrutura de Pastas no Google Drive

Para melhor organização dos vídeos, recomendamos:

1. Crie uma pasta principal para seus vídeos no Google Drive
2. Organize os vídeos em subpastas (ex: "Dia 1", "Dia 2", etc.)
3. Use uma nomenclatura consistente para os arquivos:
   - Exemplo: "1-introducao.mp4", "2-conceitos-basicos.mp4"

## Solução de Problemas Comuns

### Erro de Autenticação
- Verifique se as credenciais no `.env.local` estão corretas
- Confirme se as URIs de redirecionamento estão configuradas corretamente no Google Cloud Console

### Vídeos Não Aparecem
- Verifique se sua conta Google tem acesso aos vídeos
- Confirme se os vídeos estão em formatos suportados (mp4, webm, etc.)
- Tente usar o botão de atualização na interface

### Problemas de Performance
- O sistema usa cache local para melhorar o desempenho
- Se necessário, use o botão de atualização para buscar novos vídeos
- Evite pastas com muitos vídeos em um único nível

## Atualizações e Manutenção

Para manter o sistema atualizado:

1. Verifique regularmente por atualizações:
   ```bash
   git pull origin main
   ```

2. Atualize as dependências:
   ```bash
   npm install
   ```

3. Reinicie o servidor após atualizações

## Suporte

Se encontrar problemas ou precisar de ajuda:

1. Verifique a seção de issues no repositório
2. Consulte a documentação completa em `/docs`
3. Entre em contato com a equipe de suporte

## Próximos Passos

Após a configuração inicial:

1. Personalize a interface conforme necessário
2. Configure suas pastas de vídeos no Google Drive
3. Explore as funcionalidades disponíveis
4. Mantenha o sistema atualizado

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [API do Google Drive](https://developers.google.com/drive/api/guides/about-sdk)
- [NextAuth.js](https://next-auth.js.org/) 