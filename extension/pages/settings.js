// Elementos da UI
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const darkModeToggle = document.getElementById('darkMode');
const notificationsToggle = document.getElementById('notifications');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Carrega dados do usuário
        const user = await AuthService.validateToken();
        if (!user) {
            window.location.href = '../popup.html';
            return;
        }
        
        // Atualiza informações do perfil
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        if (user.avatar) {
            userAvatar.src = user.avatar;
        }
        
        // Carrega preferências
        const preferences = await chrome.storage.local.get(['darkMode', 'notifications']);
        darkModeToggle.checked = preferences.darkMode || false;
        notificationsToggle.checked = preferences.notifications || false;
        
        // Aplica tema
        applyTheme(preferences.darkMode);
        
        // Event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        window.location.href = '../popup.html';
    }
});

function setupEventListeners() {
    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await AuthService.logout();
            window.location.href = '../popup.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    });
    
    // Dark Mode
    darkModeToggle.addEventListener('change', async (e) => {
        try {
            await chrome.storage.local.set({ darkMode: e.target.checked });
            applyTheme(e.target.checked);
        } catch (error) {
            console.error('Erro ao salvar preferência de tema:', error);
            alert('Erro ao salvar preferência. Tente novamente.');
        }
    });
    
    // Notificações
    notificationsToggle.addEventListener('change', async (e) => {
        try {
            await chrome.storage.local.set({ notifications: e.target.checked });
            
            if (e.target.checked) {
                // Solicita permissão para notificações
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    e.target.checked = false;
                    await chrome.storage.local.set({ notifications: false });
                    alert('Permissão para notificações negada.');
                }
            }
        } catch (error) {
            console.error('Erro ao salvar preferência de notificações:', error);
            alert('Erro ao salvar preferência. Tente novamente.');
        }
    });
}

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
} 