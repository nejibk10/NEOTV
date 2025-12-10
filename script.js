// Configuration par défaut des chaînes
const defaultChannelsConfig = {
    channels: [
        {
            id: 'bein1',
            name: 'beIN SPORTS 1',
            src: 'https://s.streams-on.live/b-3/',
            quality: '1080P',
            source: 'Streams-on.live',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            sandbox: 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
            scrolling: 'no',
            frameborder: '0'
        },
        {
            id: 'bein2',
            name: 'beIN SPORTS 2',
            src: 'https://v3.player.rcs.revma.com/1jqx8u7d1t7qu',
            quality: '720P',
            source: 'Revma Player',
            allow: 'autoplay; encrypted-media',
            frameborder: '0',
            allowfullscreen: 'true'
        },
        {
            id: 'bein3',
            name: 'beIN SPORTS 3',
            src: 'https://player.tvstreams.net/embed/bein-sports-3',
            quality: '360P',
            source: 'TVStreams',
            allow: 'autoplay; fullscreen',
            scrolling: 'no',
            style: 'border: none;'
        },
        {
            id: 'beinent',
            name: 'beIN ENTERTAINMENT',
            src: 'https://embed.myiptv.website/beinentertainment',
            quality: '720P',
            source: 'MyIPTV',
            allow: 'autoplay; picture-in-picture',
            loading: 'lazy'
        },
        {
            id: 'mbc1',
            name: 'MBC 1',
            src: 'https://embed.streamingtv.com/mbc1',
            quality: '1080P',
            source: 'StreamingTV',
            allow: 'autoplay; encrypted-media',
            referrerpolicy: 'no-referrer'
        },
        {
            id: 'mbc2',
            name: 'MBC 2',
            src: 'https://player.arabictv.net/mbc2',
            quality: '720P',
            source: 'ArabicTV',
            allow: 'autoplay; fullscreen',
            sandbox: 'allow-scripts allow-same-origin'
        }
        // Ajoutez d'autres chaînes ici selon le même modèle
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const channelItems = document.querySelectorAll('.channel-item');
    const livePlayer = document.getElementById('live-player');
    const playerPlaceholder = document.getElementById('player-placeholder');
    const loadingElement = document.getElementById('loading');
    const currentChannelName = document.getElementById('current-channel-name');
    const currentChannelDesc = document.getElementById('current-channel-desc');
    const currentChannelSource = document.getElementById('current-channel-source');
    const currentQuality = document.getElementById('current-quality');
    
    // Variables d'état
    let currentChannelData = null;
    let channelsConfig = null;
    
    // Initialisation
    initializeApp();
    
    // Fonction d'initialisation principale
    function initializeApp() {
        // Charger la configuration
        loadChannelsConfig();
        
        // Initialiser les écouteurs d'événements
        initializeEventListeners();
        
        // Initialiser les fonctionnalités supplémentaires
        initializeAdditionalFeatures();
        
        // Charger la dernière chaîne regardée
        loadLastChannel();
        
        console.log('NEO TV initialisé avec succès');
    }
    
    // Charger la configuration des chaînes
    function loadChannelsConfig() {
        const savedConfig = localStorage.getItem('channelsConfig');
        if (savedConfig) {
            try {
                channelsConfig = JSON.parse(savedConfig);
                console.log('Configuration chargée depuis le stockage local');
            } catch (e) {
                console.error('Erreur de chargement de la configuration:', e);
                channelsConfig = defaultChannelsConfig;
            }
        } else {
            channelsConfig = defaultChannelsConfig;
            saveChannelsConfig();
        }
    }
    
    // Sauvegarder la configuration
    function saveChannelsConfig() {
        localStorage.setItem('channelsConfig', JSON.stringify(channelsConfig));
        console.log('Configuration sauvegardée');
    }
    
    // Initialiser les écouteurs d'événements
    function initializeEventListeners() {
        // Écouteurs pour les chaînes
        channelItems.forEach(item => {
            item.addEventListener('click', function() {
                const channelData = extractChannelData(this);
                loadChannel(channelData);
            });
        });
        
        // Écouteurs pour l'iframe
        livePlayer.addEventListener('load', handleIframeLoad);
        livePlayer.addEventListener('error', handleIframeError);
        
        // Écouteur pour le bouton de progression
        document.getElementById('show-progress-btn').addEventListener('click', showPageProgress);
        
        // Écouteur pour le bouton d'administration
        document.getElementById('admin-toggle-btn').addEventListener('click', openAdminPanel);
        
        // Raccourcis clavier
        document.addEventListener('keydown', handleKeyboardShort
