// Estado global
let currentFolder = null;
let folderHistory = [];
let accessToken = null;

// Elementos da UI
const loginContainer = document.getElementById('loginContainer');
const contentContainer = document.getElementById('contentContainer');
const loadingContainer = document.getElementById('loadingContainer');
const videoList = document.getElementById('videoList');
const backBtn = document.getElementById('backBtn');
const currentPath = document.getElementById('currentPath');
const loginBtn = document.getElementById('loginBtn');
const settingsBtn = document.getElementById('settingsBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica se já está autenticado
    const auth = await chrome.storage.local.get('accessToken');
    if (auth.accessToken) {
        accessToken = auth.accessToken;
        showContent();
        loadRootFolder();
    } else {
        showLogin();
    }

    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    backBtn.addEventListener('click', handleBack);
    settingsBtn.addEventListener('click', openSettings);
});

// Funções de UI
function showLogin() {
    loginContainer.classList.remove('hidden');
    contentContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
}

function showContent() {
    loginContainer.classList.add('hidden');
    contentContainer.classList.remove('hidden');
    loadingContainer.classList.add('hidden');
}

function showLoading() {
    loginContainer.classList.add('hidden');
    contentContainer.classList.add('hidden');
    loadingContainer.classList.remove('hidden');
}

// Handlers
async function handleLogin() {
    try {
        showLoading();
        const token = await chrome.identity.getAuthToken({ 
            interactive: true,
            scopes: [
                "https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        });
        accessToken = token.token;
        await chrome.storage.local.set({ accessToken: token.token });
        showContent();
        loadRootFolder();
    } catch (error) {
        console.error('Erro no login:', error);
        showLogin();
    }
}

async function handleBack() {
    if (folderHistory.length > 0) {
        currentFolder = folderHistory.pop();
        await loadFolder(currentFolder);
        updatePath();
    }
}

function openSettings() {
    // Abre a página de configurações em uma nova aba
    chrome.tabs.create({
        url: chrome.runtime.getURL('pages/settings.html')
    });
}

// Funções de carregamento de dados
async function loadRootFolder() {
    try {
        showLoading();
        const response = await fetch('http://localhost:3333/api/folders/root', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar pasta raiz');
        
        const data = await response.json();
        currentFolder = data;
        folderHistory = [];
        await loadFolder(currentFolder);
        updatePath();
    } catch (error) {
        console.error('Erro ao carregar pasta raiz:', error);
        showLogin();
    }
}

async function loadFolder(folder) {
    try {
        showLoading();
        const response = await fetch(`http://localhost:3333/api/folders/${folder.id}/contents`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar conteúdo da pasta');
        
        const data = await response.json();
        renderFolderContents(data);
        showContent();
    } catch (error) {
        console.error('Erro ao carregar pasta:', error);
        showContent();
    }
}

// Funções de renderização
function renderFolderContents(contents) {
    videoList.innerHTML = '';
    
    contents.forEach(item => {
        const element = document.createElement('div');
        element.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-3 hover:shadow-md transition-shadow';
        
        if (item.type === 'folder') {
            element.innerHTML = `
                <div class="flex items-center cursor-pointer">
                    <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                    </svg>
                    <span class="text-gray-800 dark:text-white">${item.name}</span>
                </div>
            `;
            element.addEventListener('click', () => navigateToFolder(item));
        } else {
            element.innerHTML = `
                <div class="flex items-center cursor-pointer">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        <path d="M8 11a1 1 0 100-2 1 1 0 000 2zm0 0v3m0 0h.01M8 11h4"></path>
                    </svg>
                    <span class="text-gray-800 dark:text-white">${item.name}</span>
                </div>
            `;
            element.addEventListener('click', () => openVideo(item));
        }
        
        videoList.appendChild(element);
    });
}

async function navigateToFolder(folder) {
    folderHistory.push(currentFolder);
    currentFolder = folder;
    await loadFolder(folder);
    updatePath();
}

function openVideo(video) {
    chrome.tabs.create({ url: `http://localhost:3000/watch/${video.id}` });
}

function updatePath() {
    if (!currentFolder) {
        currentPath.textContent = 'Raiz';
        return;
    }
    currentPath.textContent = currentFolder.name;
} 