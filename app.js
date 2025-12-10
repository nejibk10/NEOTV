// app.js

// --- 1. État de l'Application
let currentView = 'home'; // 'home', 'channels', 'events'
let selectedCategory = 'all';
let selectedChannel = null; 
let menuOpen = false;
let searchActive = false;
let searchQuery = '';

// --- 2. Éléments de Montage (CORRIGÉ: Cible les nouveaux conteneurs)
const headerContainer = document.getElementById('header-container');
const footerContainer = document.getElementById('footer-container');
const app = document.getElementById('app');

// --- 3. Fonctions de Gestion des Événements
function toggleMenu() {
    menuOpen = !menuOpen;
    renderApp();
}

function toggleSearch() {
    searchActive = !searchActive;
    if (!searchActive) {
        searchQuery = ''; 
        currentView = 'home';
    }
    renderApp();
}

function setSearchQuery(query) {
    searchQuery = query;
    if (searchActive && searchQuery.length > 0) {
        currentView = 'channels'; 
    } else if (searchActive && searchQuery.length === 0) {
        currentView = 'home'; 
    }
    renderApp();
}

function changeView(view) {
    currentView = view;
    menuOpen = false;
    searchActive = false;
    searchQuery = '';
    selectedCategory = 'all';
    renderApp();
}

function selectCategory(categoryId) {
    selectedCategory = categoryId;
    currentView = 'channels';
    renderApp();
}

function selectChannel(channelId) {
    selectedChannel = channels.find(ch => ch.id == channelId);
    renderApp(); 
}

function selectEventChannel(channelName) {
    selectedChannel = channels.find(ch => ch.name === channelName);
    if (!selectedChannel) {
        alert(`Chaîne '${channelName}' introuvable.`);
    }
    renderApp();
}

function closePlayer() {
    selectedChannel = null;
    document.body.style.overflow = '';
    const playerElement = document.getElementById('video-player-overlay');
    if (playerElement) {
        playerElement.remove();
    }
    renderApp();
}

function goBack() {
    currentView = 'home';
    selectedCategory = 'all';
    renderApp();
}


// --- 4. Fonctions de Rendu des Composants (HTML strings)

function renderHeader() {
    const isSearchMode = searchActive;
    
    if (isSearchMode) {
        return `
            <header class="header" style="background-color: #1a1a1a;">
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                    <i data-lucide="search" style="width: 20px; height: 20px; color: #dc2626;"></i>
                    <input 
                        type="text" 
                        value="${searchQuery}" 
                        oninput="setSearchQuery(this.value)"
                        placeholder="Rechercher une chaîne..." 
                        style="flex: 1; background: none; border: none; outline: none; color: white; padding: 5px 0;"
                        autofocus
                    >
                    <button onclick="toggleSearch()" aria-label="Fermer la recherche">
                        <i data-lucide="x" style="width: 24px; height: 24px;"></i>
                    </button>
                </div>
            </header>
        `;
    }

    return `
        <header class="header">
            <button onclick="toggleMenu()" aria-label="Menu">
                <i data-lucide="menu" style="width: 24px; height: 24px;"></i>
            </button>
            <div style="display: flex; align-items: center; gap: 4px; font-weight: bold;">
                <div style="background-color: white; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 1.1em;">
                    <span>NEO</span>
                </div>
                <span>TV</span>
            </div>
            <button onclick="toggleSearch()" aria-label="Search">
                <i data-lucide="search" style="width: 24px; height: 24px;"></i>
            </button>
        </header>
    `;
}

function renderFooter() {
    const activeTab = currentView === 'events' ? 'events' : 'livetv';
    return `
        <footer class="footer">
            <button class="footer-btn ${activeTab === 'livetv' ? 'active' : ''}" 
                    onclick="changeView('home')">
                <i data-lucide="tv" style="width: 24px; height: 24px;"></i>
                <span>Live TV</span>
            </button>

            <button class="footer-btn ${activeTab === 'events' ? 'active' : ''}" 
                    onclick="changeView('events')">
                <i data-lucide="calendar" style="width: 24px; height: 24px;"></i>
                <span>Live Events</span>
            </button>
        </footer>
    `;
}

function renderChannelCard(channel) {
    return `
        <button class="channel-card" onclick="selectChannel('${channel.id}')">
            <img src="${channel.logo}" alt="${channel.name}" class="channel-card-img">
            <div class="channel-card-info">
                <h3>${channel.name}</h3>
                <p>${channel.currentProgram}</p>
            </div>
        </button>
    `;
}

function renderEventCard(event) {
    return `
        <button class="event-card" onclick="selectEventChannel('${event.channel}')">
            ${event.isLive ? `
                <div class="live-badge">
                    <div class="live-dot"></div>
                    <span>LIVE</span>
                </div>` : `
                <div style="height: 20px; margin-bottom: 10px;"></div>
            `}
            
            <h4 style="color: #999; font-size: 0.9em; margin-bottom: 10px;">${event.league || 'Événement Sportif'}</h4>

            <div class="event-teams">
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <div class="team-logo"><img src="${event.logo1}" alt="${event.team1}"></div>
                    <span style="font-size: 0.9em;">${event.team1}</span>
                </div>
                <span class="event-vs">VS</span>
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <div class="team-logo"><img src="${event.logo2}" alt="${event.team2}"></div>
                    <span style="font-size: 0.9em;">${event.team2}</span>
                </div>
            </div>

            <div style="padding-top: 10px; border-top: 1px solid #333; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #999; font-size: 0.8em; display: flex; align-items: center; gap: 5px;">
                    <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                    <span>${event.time}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <img src="${event.channelLogo}" alt="${event.channel}" style="width: 16px; height: 16px; border-radius: 2px;">
                    <span style="font-size: 0.8em; color: white;">${event.channel}</span>
                </div>
            </div>
        </button>
    `;
}

function renderMenu() {
    if (!menuOpen) return '';
    return `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.8); z-index: 60; padding-top: 60px;">
            <div style="padding: 20px; color: white;">
                <h3 style="margin-bottom: 15px;">Menu</h3>
                <p style="margin-bottom: 20px;">Ici se trouveront les options du menu (Aide, À propos, etc.).</p>
                <button onclick="toggleMenu()" style="background-color: #dc2626; padding: 10px 15px; border-radius: 8px;">Fermer Menu</button>
            </div>
        </div>
    `;
}

function renderHomePage() {
    const categoryGrid = categories.map(cat => `
        <button class="category-btn" onclick="selectCategory('${cat.id}')">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: white; padding: 25px;">
                <i data-lucide="${cat.icon || 'tv'}" style="width: 32px; height: 32px;"></i>
                <span style="font-size: 1.1em;">${cat.name}</span>
            </div>
        </button>
    `).join('');

    return `
        <div class="content-area">
            <h2 class="page-title">Choisissez une catégorie</h2>
            <div class="categories-grid">
                ${categoryGrid}
            </div>
        </div>
    `;
}

function renderChannelsPage() {
    let categoryName = 'Toutes les Chaînes';
    let filteredChannels = channels;

    if (searchQuery.length > 0) {
        const searchLower = searchQuery.toLowerCase();
        filteredChannels = channels.filter(ch => 
            ch.name.toLowerCase().includes(searchLower) || 
            ch.currentProgram.toLowerCase().includes(searchLower)
        );
        categoryName = `Résultats pour "${searchQuery}"`;
    } else if (selectedCategory !== 'all') {
        const cat = categories.find(c => c.id === selectedCategory);
        if (cat) categoryName = cat.name;
        filteredChannels = channels.filter(ch => ch.category === selectedCategory);
    }
    
    const channelGrid = filteredChannels.map(renderChannelCard).join('');

    const backButton = searchQuery.length === 0 ? `
        <button onclick="goBack()" style="padding: 5px;">
            <i data-lucide="arrow-left" style="width: 24px; height: 24px;"></i>
        </button>
    ` : '';

    return `
        <div class="content-area">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                ${backButton}
                <h2 class="page-title" style="margin-bottom: 0;">${categoryName}</h2>
            </div>
            
            <div class="channels-grid">
                ${filteredChannels.length > 0 ? channelGrid : '<p style="color: #999;">Aucune chaîne trouvée.</p>'}
            </div>
        </div>
    `;
}

function renderEventsPage() {
    const live = liveEvents.filter(e => e.isLive);
    const upcoming = liveEvents.filter(e => !e.isLive);

    const liveGrid = live.map(renderEventCard).join('');
    const upcomingGrid = upcoming.map(renderEventCard).join('');

    return `
        <div class="content-area">
            <h2 class="page-title">Événements en direct et à venir</h2>

            ${live.length > 0 ? `
                <h3 style="color: white; font-size: 1.3em; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="activity" style="width: 20px; height: 20px; color: #dc2626;"></i>
                    En Direct
                </h3>
                <div class="events-grid" style="margin-bottom: 40px;">
                    ${liveGrid}
                </div>
            ` : ''}

            ${upcoming.length > 0 ? `
                <h3 style="color: white; font-size: 1.3em; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clock" style="width: 20px; height: 20px; color: #fff;"></i>
                    À Venir
                </h3>
                <div class="events-grid">
                    ${upcomingGrid}
                </div>
            ` : ''}

            ${live.length === 0 && upcoming.length === 0 ? `
                <p style="color: #999;">Aucun événement planifié pour le moment.</p>
            ` : ''}
        </div>
    `;
}

function renderVideoPlayer() {
    if (!selectedChannel) {
        document.body.style.overflow = '';
        return; 
    }

    const existingPlayer = document.getElementById('video-player-overlay');
    if (existingPlayer) existingPlayer.remove();

    document.body.style.overflow = 'hidden';

    const { cropSettings, streamUrl, name } = selectedChannel;
    
    const width = cropSettings?.width || '100%';
    const height = cropSettings?.height || '100%';
    const top = cropSettings?.top || '0';
    const left = cropSettings?.left || '0';

    const playerHTML = `
        <div class="video-player-overlay" id="video-player-overlay">
            <button class="close-btn" onclick="closePlayer()" aria-label="Fermer le lecteur">
                <i data-lucide="x" style="width: 28px; height: 28px;"></i>
            </button>

            <div class="video-container">
                <iframe
                    src="${streamUrl}"
                    title="${name}"
                    class="video-player-iframe"
                    style="
                        width: ${width};
                        height: ${height};
                        top: ${top};
                        left: ${left};
                    "
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                ></iframe>
            </div>
            
            <div style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(0, 0, 0, 0.6); padding: 10px 20px; border-radius: 8px;">
                <h3 style="color: white; font-size: 1.2em;">${name}</h3>
            </div>
        </div>
    `;
    
    const playerContainer = document.createElement('div');
    playerContainer.innerHTML = playerHTML;
    document.body.appendChild(playerContainer.firstChild);

    setTimeout(() => lucide.createIcons(), 0);
}


// --- 5. Fonction de Rendu Principale (CORRIGÉE: Rend chaque partie séparément)

function renderApp() {
    // 1. Rendre les éléments fixes (Header et Footer)
    headerContainer.innerHTML = renderHeader();
    footerContainer.innerHTML = renderFooter();

    // 2. Rendre le contenu principal (#app)
    let content = '';
    if (currentView === 'home') {
        content = renderHomePage();
    } else if (currentView === 'channels') {
        content = renderChannelsPage();
    } else if (currentView === 'events') {
        content = renderEventsPage();
    }
    app.innerHTML = content;

    // 3. Rendre le Menu (au-dessus du contenu principal)
    // On rend le menu DANS le corps s'il est ouvert pour ne pas perturber #app
    const existingMenu = document.querySelector('.menu-drawer');
    if (existingMenu) existingMenu.remove();
    if (menuOpen) {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-drawer';
        menuContainer.innerHTML = renderMenu();
        document.body.appendChild(menuContainer.firstChild);
    }
    
    // 4. Re-initialisation des icônes Lucide (important après chaque innerHTML)
    setTimeout(() => lucide.createIcons(), 0);

    // 5. Rendre le lecteur vidéo S'IL est actif
    if (selectedChannel) {
        renderVideoPlayer();
    }
}


// --- 6. Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Rend la première vue au chargement de la page
    renderApp();
});
