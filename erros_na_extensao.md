1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
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