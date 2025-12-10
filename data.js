// data.js

// Définition des catégories
const categories = [
    { id: 'sport', name: 'Sport', icon: 'zap' },
    { id: 'films', name: 'Films', icon: 'film' },
    { id: 'actualites', name: 'Actualités', icon: 'newspaper' },
];

// Définition des chaînes (avec les paramètres de recadrage pour l'iframe)
const channels = [
    {
        id: 101,
        name: 'beIN SPORTS 1 HD',
        logo: 'https://placehold.co/200x112?text=B1+FOOT',
        category: 'sport',
        currentProgram: 'Football Live - PSG vs OL',
        streamUrl: 'https://s.streams-on.live/b-3/', // URL d'exemple
        // IMPORTANT: Paramètres de recadrage pour masquer les barres/logos du site hôte
        cropSettings: { width: '108%', height: '110%', top: '-20px', left: '-10px' },
    },
    {
        id: 102,
        name: 'Euronews HD',
        logo: 'https://placehold.co/200x112?text=EURONEWS',
        category: 'actualites',
        currentProgram: 'Breaking News',
        streamUrl: 'about:blank', // URL vide pour l'exemple
        cropSettings: { width: '100%', height: '100%', top: '0', left: '0' },
    },
    {
        id: 103,
        name: 'Cinéma Max',
        logo: 'https://placehold.co/200x112?text=CINEMA',
        category: 'films',
        currentProgram: 'Film Action',
        streamUrl: 'about:blank',
        cropSettings: { width: '100%', height: '100%', top: '0', left: '0' },
    },
];

// Définition des événements
const liveEvents = [
    {
        id: 201,
        league: 'Ligue 1',
        team1: 'Paris SG',
        team2: 'Lyon',
        logo1: 'https://placehold.co/50x50?text=PSG',
        logo2: 'https://placehold.co/50x50?text=OL',
        channel: 'beIN SPORTS 1 HD', // Le nom doit correspondre à une chaîne existante
        channelLogo: 'https://placehold.co/20x20?text=B1',
        time: 'Now',
        isLive: true,
        category: 'Football',
    },
    {
        id: 202,
        league: 'NBA',
        team1: 'Lakers',
        team2: 'Celtics',
        logo1: 'https://placehold.co/50x50?text=LA',
        logo2: 'https://placehold.co/50x50?text=BOS',
        channel: 'Euronews HD',
        channelLogo: 'https://placehold.co/20x20?text=EN',
        time: '23:00',
        isLive: false,
        category: 'Basketball',
    },
];
