// Listener para instalação/atualização da extensão
chrome.runtime.onInstalled.addListener(async () => {
    // Limpa tokens antigos
    await chrome.storage.local.remove('accessToken');
    
    // Configura as permissões iniciais
    await chrome.storage.local.set({
        settings: {
            autoPlay: true,
            darkMode: false,
            quality: 'auto'
        }
    });
});

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_TOKEN') {
        chrome.storage.local.get('accessToken', (result) => {
            sendResponse({ token: result.accessToken });
        });
        return true; // Mantém a conexão aberta para resposta assíncrona
    }
});

// Listener para atualizações de token
chrome.identity.onSignInChanged.addListener(async (account, signedIn) => {
    if (!signedIn) {
        await chrome.storage.local.remove('accessToken');
    }
});

// Gerenciamento de cache
const cache = new Map();

// Função para limpar cache antigo
function cleanupCache() {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > 3600000) { // 1 hora
            cache.delete(key);
        }
    }
}

// Limpa o cache a cada hora
setInterval(cleanupCache, 3600000);

// Função para verificar se o token está válido
async function validateToken() {
    try {
        const auth = await chrome.storage.local.get('accessToken');
        if (!auth.accessToken) return false;

        const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
            method: 'POST',
            body: JSON.stringify({ access_token: auth.accessToken })
        });

        return response.ok;
    } catch {
        return false;
    }
}

// Renovar token quando necessário
async function refreshTokenIfNeeded() {
    const isValid = await validateToken();
    if (!isValid) {
        try {
            const token = await chrome.identity.getAuthToken({ interactive: false });
            await chrome.storage.local.set({ accessToken: token });
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            await chrome.storage.local.remove('accessToken');
        }
    }
}

// Verifica o token a cada 5 minutos
setInterval(refreshTokenIfNeeded, 300000); 