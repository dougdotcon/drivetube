// Estado global
let currentFolder = null;
let folderHistory = [];

// Elementos da UI
const loginContainer = document.getElementById('loginContainer');
const contentContainer = document.getElementById('contentContainer');
const loadingContainer = document.getElementById('loadingContainer');
const videoList = document.getElementById('videoList');
const backBtn = document.getElementById('backBtn');
const currentPath = document.getElementById('currentPath');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');
const registerLink = document.getElementById('registerLink');
const settingsBtn = document.getElementById('settingsBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    showLoading();
    const user = await AuthService.validateToken();
    
    if (user) {
        showContent();
        loadRootFolder();
    } else {
        showLogin();
    }

    // Event listeners
    loginForm.addEventListener('submit', handleEmailLogin);
    loginBtn.addEventListener('click', handleGoogleLogin);
    backBtn.addEventListener('click', handleBack);
    settingsBtn.addEventListener('click', openSettings);
    registerLink.addEventListener('click', openRegister);
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
async function handleEmailLogin(e) {
    e.preventDefault();
    showLoading();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await AuthService.login(email, password);
        showContent();
        loadRootFolder();
    } catch (error) {
        console.error('Erro no login:', error);
        showLogin();
        alert(error.message);
    }
}

async function handleGoogleLogin() {
    try {
        showLoading();
        const token = await chrome.identity.getAuthToken({ 
            interactive: true,
            scopes: [
                "https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        });
        
        // Aqui você pode implementar a lógica para autenticar com o Google
        // Por enquanto, vamos apenas mostrar o conteúdo
        showContent();
        loadRootFolder();
    } catch (error) {
        console.error('Erro no login com Google:', error);
        showLogin();
        alert('Erro ao fazer login com Google');
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
    chrome.tabs.create({
        url: chrome.runtime.getURL('pages/settings.html')
    });
}

function openRegister() {
    chrome.tabs.create({
        url: 'http://localhost:3000/register'
    });
}

// Funções de carregamento de dados
async function loadRootFolder() {
    try {
        showLoading();
        const token = await AuthService.getToken();
        const response = await fetch('http://localhost:3333/api/folders/root', {
            headers: {
                'Authorization': `Bearer ${token}`
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
        await AuthService.logout();
        showLogin();
    }
}

async function loadFolder(folder) {
    try {
        showLoading();
        const token = await AuthService.getToken();
        const response = await fetch(`http://localhost:3333/api/folders/${folder.id}/contents`, {
            headers: {
                'Authorization': `Bearer ${token}`
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