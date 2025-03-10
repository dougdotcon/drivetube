// Verifica se estamos em uma página de vídeo do Google Drive
function isVideoPage() {
    return window.location.pathname.includes('/file/d/') && 
           document.querySelector('video') !== null;
}

// Adiciona o botão "Abrir no Mulakintola"
function addMulakintolaBadge() {
    const container = document.createElement('div');
    container.className = 'mulakintola-badge';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: #4A5568;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
    `;

    container.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 14.5V5.5L14 10L8 14.5Z" fill="currentColor"/>
        </svg>
        <span>Abrir no Mulakintola</span>
    `;

    container.addEventListener('mouseover', () => {
        container.style.background = '#2D3748';
    });

    container.addEventListener('mouseout', () => {
        container.style.background = '#4A5568';
    });

    container.addEventListener('click', openInMulakintola);
    document.body.appendChild(container);
}

// Abre o vídeo no Mulakintola
async function openInMulakintola() {
    try {
        // Obtém o ID do vídeo da URL
        const videoId = window.location.pathname.split('/')[3];
        
        // Obtém o token de acesso
        const response = await chrome.runtime.sendMessage({ type: 'GET_TOKEN' });
        if (!response.token) {
            alert('Por favor, faça login no Mulakintola primeiro.');
            return;
        }

        // Abre o vídeo no Mulakintola
        window.open(`http://localhost:3000/watch/${videoId}`, '_blank');
    } catch (error) {
        console.error('Erro ao abrir no Mulakintola:', error);
        alert('Erro ao abrir o vídeo no Mulakintola. Por favor, tente novamente.');
    }
}

// Inicialização
if (isVideoPage()) {
    // Aguarda um momento para garantir que a página carregou completamente
    setTimeout(addMulakintolaBadge, 1000);
}

// Observa mudanças na URL para páginas de vídeo dinâmicas
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        if (isVideoPage()) {
            setTimeout(addMulakintolaBadge, 1000);
        }
    }
}).observe(document, { subtree: true, childList: true }); 