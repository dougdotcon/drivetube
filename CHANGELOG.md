# Changelog

## [1.1.0] - 2024-03-12

### Adicionado
- Explorador de arquivos locais
  - Navegação por diretórios do sistema
  - Visualização de detalhes dos arquivos (nome, tamanho, data de modificação)
  - Abertura de arquivos com aplicativo padrão do sistema
  - Busca de arquivos por nome
  - Ícones específicos para cada tipo de arquivo
  - Navegação entre diretórios com botão "Voltar"
  - Atualização de diretório atual

- Componentes de UI
  - Textarea
  - Toast notifications
  - Sidebar responsiva
  - FileExplorer
  - Formatação de bytes e datas

- Backend
  - Rotas para gerenciamento de arquivos locais
  - Controlador de arquivos com suporte a Windows, macOS e Linux
  - Middleware de autenticação para rotas de arquivos

### Modificado
- Layout do dashboard
  - Adicionado link para explorador de arquivos
  - Melhorada organização dos itens do menu
  - Atualizada estrutura de navegação

- Utilitários
  - Adicionada função formatBytes para exibição de tamanhos de arquivo
  - Melhorada função formatDate para padrão brasileiro

### Segurança
- Implementada validação de autenticação para acesso a arquivos locais
- Validação de caminhos de arquivo para evitar acesso não autorizado
- Abertura segura de arquivos usando aplicativo padrão do sistema

## [1.0.0] - 2024-03-11

### Adicionado
- Sistema de autenticação completo
  - Login com email e senha
  - Login com Google
  - Registro de usuário
  - Validação de token
  - Logout

- Interface do usuário
  - Página de login com formulário
  - Navegação de pastas e vídeos
  - Página de configurações
  - Suporte a tema escuro
  - Loading states

- Funcionalidades
  - Navegação hierárquica de pastas
  - Visualização de vídeos
  - Sistema de notificações
  - Persistência de preferências
  - Integração com Google Drive

### Modificado
- Manifest.json
  - Atualizado para Manifest V3
  - Adicionadas permissões necessárias
  - Configurado OAuth2 para Google
  - Adicionados recursos web acessíveis

- Background Service Worker
  - Implementado gerenciamento de cache
  - Adicionada verificação de token
  - Implementado sistema de notificações
  - Adicionada limpeza automática de cache

### Removido
- Código legado de autenticação
- Implementações antigas de UI
- Permissões desnecessárias no manifest

### Corrigido
- Problemas de navegação entre pastas
- Erros de autenticação
- Problemas de cache
- Bugs de UI/UX

### Segurança
- Implementada validação de token
- Adicionada proteção contra XSS
- Melhorado gerenciamento de sessão
- Implementada limpeza segura de dados

### Documentação
- Adicionados comentários no código
- Melhorada documentação de funções
- Atualizada documentação de API
- Adicionado CHANGELOG

### Dependências
- Adicionado TailwindCSS
- Configurado TypeScript
- Atualizadas dependências do projeto
- Adicionados scripts de build

### Infraestrutura
- Configurado ambiente de desenvolvimento
- Adicionados scripts de build
- Configurado Docker
- Implementado CI/CD básico

## [1.2.0] - 2024-03-12

### Adicionado
- Integração com Proton Drive:
  - Serviço para interação com a API do Proton Drive
  - Componente ProtonDriveExplorer para visualização e gerenciamento de arquivos
  - Página dedicada para o Proton Drive no dashboard
  - Funcionalidades de upload, download, criação de pastas e compartilhamento
  - Ícones específicos para diferentes tipos de arquivos
  - Navegação intuitiva entre pastas
  - Busca de arquivos por nome
  - Integração com o layout do dashboard

### Segurança
- Validação de autenticação para acesso ao Proton Drive
- Gerenciamento seguro de operações de arquivo
- Proteção contra acesso não autorizado a pastas

## [1.3.0-beta] - 2024-03-12

### Adicionado (Beta)
- Integração inicial com Telegram:
  - Serviço para interação com a API do Telegram Bot
  - Componente de configuração do bot
  - Página dedicada para gerenciamento do Telegram
  - Funcionalidades básicas de conexão e desconexão do bot
  - Indicadores de status do bot
  - Alertas de funcionalidade em desenvolvimento

### Modificado
- Layout do dashboard:
  - Adicionado link para o Telegram (marcado como Beta)
  - Atualizada organização do menu lateral

### Notas
- A integração com o Telegram está em fase beta e pode sofrer alterações significativas
- Algumas funcionalidades podem não estar disponíveis ou podem ser modificadas
- Use com cautela em ambiente de produção

## [1.3.1] - 2024-03-12

### Corrigido
- Refatoração da UI da extensão:
  - Substituído código legado por componente React moderno
  - Removida manipulação direta do DOM
  - Eliminadas variáveis globais
  - Adicionado gerenciamento de estado com hooks
  - Melhorada gestão de erros e feedback ao usuário
  - Interface atualizada com componentes do design system
  - Adicionadas animações de loading
  - Melhorada navegação entre pastas

### Modificado
- Estrutura da extensão:
  - Migrado para arquitetura baseada em componentes
  - Adicionado suporte a TypeScript
  - Integrado com o design system existente
  - Melhorada organização do código
