# Extensão Mulakintola para Chrome

Esta é a extensão oficial do Mulakintola para o Google Chrome, que permite acessar e gerenciar seus vídeos do Google Drive diretamente do navegador.

## Funcionalidades

- 🔐 **Login Integrado** - Autenticação simplificada com sua conta Google
- 📁 **Navegação em Pastas** - Acesse suas pastas do Drive diretamente da extensão
- 🎥 **Player Rápido** - Abra vídeos no Mulakintola com um clique
- 🌓 **Tema Adaptativo** - Suporte aos temas claro e escuro do navegador
- 💾 **Cache Local** - Carregamento rápido de conteúdo já visualizado

## Instalação

1. Clone este repositório ou baixe os arquivos da extensão
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação" e selecione a pasta `extension`

## Configuração

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Ative a API do Google Drive
3. Configure as credenciais OAuth 2.0
4. Adicione o ID do cliente no arquivo `manifest.json`

## Uso

1. Clique no ícone da extensão na barra de ferramentas
2. Faça login com sua conta Google
3. Navegue por suas pastas e vídeos
4. Clique em um vídeo para abri-lo no Mulakintola

## Desenvolvimento

Para desenvolver a extensão:

1. Faça as alterações nos arquivos
2. Atualize a extensão no Chrome indo para `chrome://extensions/`
3. Clique no ícone de atualização (↻)

## Estrutura de Arquivos

```
extension/
├── manifest.json     # Configuração da extensão
├── popup.html       # Interface principal
├── popup.js        # Lógica da interface
├── background.js   # Serviço em background
├── contentScript.js # Script injetado nas páginas
└── icons/          # Ícones da extensão
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes. 