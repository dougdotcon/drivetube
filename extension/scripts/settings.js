// Elementos da UI
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const currentPlan = document.getElementById('currentPlan');
const planExpiry = document.getElementById('planExpiry');
const managePlanBtn = document.getElementById('managePlanBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const notificationsToggle = document.getElementById('notificationsToggle');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserInfo();
    await loadSubscriptionInfo();
    loadPreferences();
    setupEventListeners();
});

// Carregar informações do usuário
async function loadUserInfo() {
    try {
        const auth = await chrome.storage.local.get('accessToken');
        if (!auth.accessToken) {
            window.location.href = '../popup.html';
            return;
        }

        const response = await fetch('http://localhost:3333/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar informações do usuário');

        const user = await response.json();
        userAvatar.src = user.avatar || 'https://via.placeholder.com/48';
        userName.textContent = user.name;
        userEmail.textContent = user.email;
    } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
    }
}

// Carregar informações da assinatura
async function loadSubscriptionInfo() {
    try {
        const auth = await chrome.storage.local.get('accessToken');
        if (!auth.accessToken) return;

        const response = await fetch('http://localhost:3333/api/subscription/status', {
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar informações da assinatura');

        const subscription = await response.json();
        currentPlan.textContent = subscription.plan;
        planExpiry.textContent = new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao carregar informações da assinatura:', error);
        currentPlan.textContent = 'Nenhum';
        planExpiry.textContent = '-';
    }
}

// Carregar preferências
function loadPreferences() {
    chrome.storage.sync.get(['darkMode', 'notifications'], (prefs) => {
        darkModeToggle.checked = prefs.darkMode || false;
        notificationsToggle.checked = prefs.notifications || false;
        updateTheme(prefs.darkMode);
    });
}

// Configurar event listeners
function setupEventListeners() {
    logoutBtn.addEventListener('click', handleLogout);
    managePlanBtn.addEventListener('click', handleManagePlan);
    darkModeToggle.addEventListener('change', handleDarkModeToggle);
    notificationsToggle.addEventListener('change', handleNotificationsToggle);
}

// Handlers
async function handleLogout() {
    try {
        await chrome.storage.local.remove('accessToken');
        window.location.href = '../popup.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

function handleManagePlan() {
    chrome.tabs.create({ url: 'http://localhost:3000/subscription' });
}

function handleDarkModeToggle(event) {
    const darkMode = event.target.checked;
    chrome.storage.sync.set({ darkMode });
    updateTheme(darkMode);
}

function handleNotificationsToggle(event) {
    const notifications = event.target.checked;
    chrome.storage.sync.set({ notifications });
}

// Utilitários
function updateTheme(darkMode) {
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
} 