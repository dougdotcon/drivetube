# Guia do Desenvolvedor - mulakintola

Este guia contém informações técnicas detalhadas para desenvolvedores que desejam contribuir ou personalizar o mulakintola.

## Arquitetura do Projeto

### Estrutura de Diretórios

```
mulakintola/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── videos/
│   │   └── video/
│   ├── components/
│   │   ├── Providers.tsx
│   │   ├── Sidebar.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── VideoModal.tsx
│   ├── lib/
│   │   └── drive.ts
│   ├── types/
│   │   └── drive.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── docs/
├── public/
└── package.json
```

### Componentes Principais

1. **Sidebar.tsx**
   - Gerencia a navegação lateral
   - Organiza vídeos em grupos/pastas
   - Implementa cache local para melhor performance

2. **VideoPlayer.tsx**
   - Reproduz vídeos do Google Drive
   - Suporta diferentes formatos
   - Gerencia estados de carregamento e erro

3. **VideoModal.tsx**
   - Exibe vídeos em modo fullscreen
   - Gerencia transições e animações

### APIs e Rotas

1. **/api/videos**
   - Lista todos os vídeos disponíveis
   - Implementa paginação e cache
   - Organiza vídeos em estrutura de pastas

2. **/api/video**
   - Retorna informações detalhadas de um vídeo
   - Gerencia tokens de acesso
   - Implementa streaming otimizado

## Fluxo de Autenticação

1. **Inicialização**
   - Verifica sessão existente
   - Redireciona para login se necessário

2. **Login com Google**
   - Utiliza NextAuth.js
   - Gerencia tokens OAuth
   - Mantém sessão ativa

3. **Renovação de Tokens**
   - Atualiza automaticamente tokens expirados
   - Gerencia refresh tokens
   - Mantém estado de autenticação

## Cache e Performance

### Cache Local

```typescript
// Exemplo de implementação do cache
const cacheVideo = (videoData: DriveVideo) => {
  localStorage.setItem('driveVideosCache', JSON.stringify(videoData));
  localStorage.setItem('driveVideosCacheTime', Date.now().toString());
};

const getCachedVideo = (): DriveVideo | null => {
  const cachedData = localStorage.getItem('driveVideosCache');
  const cacheTimestamp = localStorage.getItem('driveVideosCacheTime');
  
  if (cachedData && cacheTimestamp) {
    const cacheAge = Date.now() - parseInt(cacheTimestamp);
    if (cacheAge < 60 * 60 * 1000) { // 1 hora
      return JSON.parse(cachedData);
    }
  }
  return null;
};
```

### Otimizações

1. **Carregamento Lazy**
   - Componentes carregados sob demanda
   - Imagens otimizadas
   - Paginação eficiente

2. **Streaming de Vídeo**
   - Buffering otimizado
   - Qualidade adaptativa
   - Preload inteligente

## Personalização

### Temas e Estilos

O projeto usa CSS Modules para estilização. Para personalizar:

1. Modifique `globals.css` para estilos globais
2. Use classes modulares para componentes específicos
3. Mantenha consistência com a paleta de cores

### Configurações

Principais variáveis de configuração:

```typescript
// config/constants.ts
export const CONFIG = {
  CACHE_DURATION: 60 * 60 * 1000, // 1 hora
  MAX_VIDEOS_PER_PAGE: 50,
  SUPPORTED_FORMATS: ['mp4', 'webm', 'mov'],
  DEFAULT_THUMBNAIL_SIZE: '220x124',
};
```

## Boas Práticas

1. **Código**
   - Use TypeScript estritamente
   - Mantenha componentes pequenos e focados
   - Documente funções complexas

2. **Performance**
   - Implemente caching quando possível
   - Otimize carregamento de recursos
   - Monitore métricas de performance

3. **Segurança**
   - Nunca exponha tokens no cliente
   - Valide todas as entradas
   - Mantenha dependências atualizadas

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Envie um Pull Request

## Debugging

### Ferramentas Recomendadas

- Chrome DevTools
- React Developer Tools
- Network Monitor

### Logs

O sistema usa diferentes níveis de log:

```typescript
// Exemplo de implementação de logs
const logLevels = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
};

const log = (level: string, message: string, data?: any) => {
  console[level](`[mulakintola] ${message}`, data);
};
```

## Deploy

### Preparação

1. Build do projeto:
   ```bash
   npm run build
   ```

2. Verificação de ambiente:
   ```bash
   npm run lint
   ```

### Ambientes

1. **Desenvolvimento**
   - Use `npm run dev`
   - Ative logs detalhados
   - Configure variáveis de ambiente

2. **Produção**
   - Use `npm start`
   - Otimize para performance
   - Configure CDN se necessário

## Recursos Adicionais

- [Documentação da Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) 