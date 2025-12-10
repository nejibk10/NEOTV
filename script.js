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
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    // Extraire les données de la chaîne depuis l'élément
    function extractChannelData(element) {
        const data = {
            src: element.getAttribute('data-src'),
            name: element.getAttribute('data-name'),
            quality: element.getAttribute('data-quality'),
            source: element.getAttribute('data-source')
        };
        
        // Extraire tous les attributs d'iframe
        const iframeAttributes = {};
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-') && attr.name !== 'data-src' && 
                attr.name !== 'data-name' && attr.name !== 'data-quality' && 
                attr.name !== 'data-source') {
                const attrName = attr.name.replace('data-', '');
                iframeAttributes[attrName] = attr.value;
            }
        });
        
        data.iframeAttributes = iframeAttributes;
        return data;
    }
    
    // Charger une chaîne
    function loadChannel(channelData) {
        if (!channelData.src) {
            showError('URL de chaîne non disponible');
            return;
        }
        
        currentChannelData = channelData;
        
        // Afficher le chargement
        showLoading();
        
        // Mettre à jour les informations
        updateChannelInfo(channelData);
        
        // Configurer et charger l'iframe
        configureIframe(channelData);
        
        // Sauvegarder la dernière chaîne
        saveLastChannel(channelData);
    }
    
    // Configurer l'iframe selon les attributs spécifiques
    function configureIframe(channelData) {
        // Réinitialiser l'iframe
        livePlayer.src = '';
        livePlayer.removeAttribute('allowfullscreen');
        livePlayer.removeAttribute('sandbox');
        livePlayer.removeAttribute('referrerpolicy');
        livePlayer.removeAttribute('loading');
        livePlayer.style.cssText = '';
        
        // Définir les attributs de base
        livePlayer.src = channelData.src;
        livePlayer.title = channelData.name;
        
        // Appliquer les attributs spécifiques
        if (channelData.iframeAttributes) {
            Object.keys(channelData.iframeAttributes).forEach(key => {
                const value = channelData.iframeAttributes[key];
                
                switch(key) {
                    case 'allow':
                        livePlayer.setAttribute('allow', value);
                        break;
                    case 'sandbox':
                        livePlayer.setAttribute('sandbox', value);
                        break;
                    case 'frameborder':
                        livePlayer.setAttribute('frameborder', value);
                        break;
                    case 'allowfullscreen':
                        if (value === 'true' || value === '') {
                            livePlayer.setAttribute('allowfullscreen', '');
                        }
                        break;
                    case 'scrolling':
                        livePlayer.setAttribute('scrolling', value);
                        break;
                    case 'referrerpolicy':
                        livePlayer.setAttribute('referrerpolicy', value);
                        break;
                    case 'loading':
                        livePlayer.setAttribute('loading', value);
                        break;
                    case 'style':
                        livePlayer.style.cssText = value;
                        break;
                    default:
                        livePlayer.setAttribute(key, value);
                }
            });
        }
        
        // Toujours permettre le plein écran
        if (!livePlayer.hasAttribute('allowfullscreen')) {
            livePlayer.setAttribute('allowfullscreen', '');
        }
        
        // Afficher l'iframe après un délai
        setTimeout(() => {
            livePlayer.style.display = 'block';
        }, 800);
    }
    
    // Gérer le chargement de l'iframe
    function handleIframeLoad() {
        console.log('Iframe chargée:', currentChannelData.name);
        loadingElement.style.display = 'none';
        
        // Mettre à jour l'élément actif
        updateActiveChannel(currentChannelData.name);
    }
    
    // Gérer les erreurs de l'iframe
    function handleIframeError() {
        console.error('Erreur de chargement:', currentChannelData.name);
        loadingElement.style.display = 'none';
        
        playerPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: #ff4d4d; font-size: 3rem;"></i>
            <p style="color: #ff4d4d; margin-top: 10px;">Erreur de chargement</p>
            <p style="color: #aaa; font-size: 0.9rem;">La source peut être temporairement indisponible</p>
            <button onclick="refreshPlayer()" style="margin-top: 15px; padding: 8px 15px; background: #0072ff; border: none; border-radius: 5px; color: white; cursor: pointer;">
                <i class="fas fa-redo"></i> Réessayer
            </button>
        `;
        playerPlaceholder.style.display = 'block';
    }
    
    // Mettre à jour les informations de la chaîne
    function updateChannelInfo(channelData) {
        currentChannelName.textContent = channelData.name;
        currentChannelDesc.textContent = `Lecture en cours - Qualité: ${channelData.quality}`;
        currentChannelSource.textContent = `Source: ${channelData.source}`;
        currentQuality.textContent = channelData.quality;
        
        // Mettre à jour le titre de la page
        document.title = `${channelData.name} - NEO TV`;
    }
    
    // Mettre à jour la chaîne active
    function updateActiveChannel(channelName) {
        channelItems.forEach(item => {
            const itemName = item.getAttribute('data-name');
            if (itemName === channelName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Sauvegarder la dernière chaîne
    function saveLastChannel(channelData) {
        const lastChannel = {
            name: channelData.name,
            src: channelData.src,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('lastChannel', JSON.stringify(lastChannel));
    }
    
    // Charger la dernière chaîne
    function loadLastChannel() {
        try {
            const lastChannelJson = localStorage.getItem('lastChannel');
            if (lastChannelJson) {
                const lastChannel = JSON.parse(lastChannelJson);
                
                // Trouver la chaîne correspondante
                const channelElement = findChannelElementByName(lastChannel.name);
                if (channelElement) {
                    const channelData = extractChannelData(channelElement);
                    setTimeout(() => loadChannel(channelData), 500);
                    return;
                }
            }
        } catch (error) {
            console.log('Erreur de chargement de la dernière chaîne:', error);
        }
        
        // Charger la première chaîne par défaut
        loadDefaultChannel();
    }
    
    // Trouver un élément de chaîne par nom
    function findChannelElementByName(name) {
        for (const item of channelItems) {
            if (item.getAttribute('data-name') === name) {
                return item;
            }
        }
        return null;
    }
    
    // Charger la chaîne par défaut
    function loadDefaultChannel() {
        if (channelItems.length > 0) {
            const firstChannel = channelItems[0];
            const channelData = extractChannelData(firstChannel);
            setTimeout(() => loadChannel(channelData), 1000);
        }
    }
    
    // Afficher l'indicateur de chargement
    function showLoading() {
        playerPlaceholder.style.display = 'none';
        livePlayer.style.display = 'none';
        loadingElement.style.display = 'block';
    }
    
    // Afficher une erreur
    function showError(message) {
        loadingElement.style.display = 'none';
        playerPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-circle" style="color: #ff4d4d; font-size: 3rem;"></i>
            <p style="color: #ff4d4d; margin-top: 10px;">${message}</p>
        `;
        playerPlaceholder.style.display = 'block';
    }
    
    // ==================== FONCTIONS DE CONTRÔLE ====================
    
    // Rafraîchir le lecteur
    window.refreshPlayer = function() {
        if (currentChannelData) {
            showLoading();
            livePlayer.src = '';
            setTimeout(() => {
                configureIframe(currentChannelData);
            }, 300);
        }
    };
    
    // Basculer le plein écran
    window.toggleFullscreen = function() {
        if (!document.fullscreenElement) {
            if (livePlayer.requestFullscreen) {
                livePlayer.requestFullscreen();
            } else if (livePlayer.webkitRequestFullscreen) {
                livePlayer.webkitRequestFullscreen();
            } else if (livePlayer.msRequestFullscreen) {
                livePlayer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };
    
    // Ouvrir dans un nouvel onglet
    window.openInNewTab = function() {
        if (currentChannelData && currentChannelData.src) {
            window.open(currentChannelData.src, '_blank');
        }
    };
    
    // Afficher les informations de l'iframe
    window.showIframeInfo = function() {
        if (!currentChannelData) return;
        
        const modal = document.getElementById('iframe-info-modal');
        const content = document.getElementById('iframe-info-content');
        
        let html = `
            <h3 style="color: #00c6ff;">${currentChannelData.name}</h3>
            <div class="iframe-details">
                <div class="iframe-attribute">
                    <span class="attribute-name">URL Source:</span>
                    <span class="attribute-value">${currentChannelData.src}</span>
                </div>
                <div class="iframe-attribute">
                    <span class="attribute-name">Qualité:</span>
                    <span class="attribute-value">${currentChannelData.quality}</span>
                </div>
                <div class="iframe-attribute">
                    <span class="attribute-name">Source:</span>
                    <span class="attribute-value">${currentChannelData.source}</span>
                </div>`;
        
        // Afficher tous les attributs iframe
        if (currentChannelData.iframeAttributes) {
            Object.keys(currentChannelData.iframeAttributes).forEach(key => {
                html += `
                    <div class="iframe-attribute">
                        <span class="attribute-name">${key}:</span>
                        <span class="attribute-value">${currentChannelData.iframeAttributes[key]}</span>
                    </div>`;
            });
        }
        
        html += `</div>`;
        content.innerHTML = html;
        modal.style.display = 'block';
    };
    
    // Fermer les informations de l'iframe
    window.closeIframeInfo = function() {
        document.getElementById('iframe-info-modal').style.display = 'none';
    };
    
    // ==================== FONCTIONS SUPPLEMENTAIRES ====================
    
    function initializeAdditionalFeatures() {
        // Initialiser la barre de progression
        document.getElementById('show-progress-btn').addEventListener('click', showPageProgress);
        
        // Initialiser l'administration
        document.getElementById('admin-toggle-btn').addEventListener('click', openAdminPanel);
    }
    
    // Afficher la progression de la page
    function showPageProgress(percentage = 50) {
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.getElementById('progress-container');
        const pageIndicator = document.getElementById('page-indicator');
        const progressText = document.getElementById('progress-text');
        
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${percentage}% de la page`;
        
        progressContainer.style.display = 'block';
        pageIndicator.style.display = 'flex';
        
        setTimeout(() => {
            progressContainer.style.display = 'none';
            pageIndicator.style.display = 'none';
        }, 5000);
    }
    
    // Gérer les raccourcis clavier
    function handleKeyboardShortcuts(event) {
        // Échap pour fermer les modals
        if (event.key === 'Escape') {
            closeIframeInfo();
            closeAdminPanel();
        }
        
        // F pour plein écran
        if (event.key === 'f' || event.key === 'F') {
            if (!event.ctrlKey) {
                toggleFullscreen();
            }
        }
        
        // R pour rafraîchir
        if (event.key === 'r' || event.key === 'R') {
            if (!event.ctrlKey) {
                refreshPlayer();
            }
        }
        
        // I pour informations iframe
        if (event.key === 'i' || event.key === 'I') {
            if (event.ctrlKey) {
                showIframeInfo();
            }
        }
        
        // P pour progression
        if (event.key === 'p' || event.key === 'P') {
            if (event.ctrlKey) {
                showPageProgress();
            }
        }
    }
    
    // ==================== ADMINISTRATION ====================
    
    // Ouvrir le panneau d'administration
    function openAdminPanel() {
        const modal = document.getElementById('admin-modal');
        const channelsList = document.getElementById('admin-channels-list');
        
        // Générer l'interface d'édition
        channelsList.innerHTML = generateAdminInterface();
        
        modal.style.display = 'block';
        
        // Activer les toggles avancés
        document.querySelectorAll('.advanced-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const options = this.nextElementSibling;
                options.style.display = options.style.display === 'block' ? 'none' : 'block';
                this.innerHTML = options.style.display === 'block' 
                    ? '<i class="fas fa-chevron-up"></i> Masquer les options avancées' 
                    : '<i class="fas fa-chevron-down"></i> Afficher les options avancées';
            });
        });
    }
    
    // Générer l'interface d'administration
    function generateAdminInterface() {
        let html = '';
        
        channelsConfig.channels.forEach((channel, index) => {
            html += `
                <div class="channel-editor" data-channel-id="${channel.id}">
                    <h3>
                        ${channel.name}
                        <span class="channel-id">ID: ${channel.id}</span>
                    </h3>
                    
                    <div class="channel-input-group">
                        <div>
                            <label class="input-label">Nom de la chaîne</label>
                            <input type="text" class="channel-input" 
                                   data-field="name" 
                                   value="${channel.name}" 
                                   placeholder="Nom de la chaîne">
                        </div>
                        <div>
                            <label class="input-label">URL Source</label>
                            <input type="text" class="channel-input" 
                                   data-field="src" 
                                   value="${channel.src}" 
                                   placeholder="https://exemple.com/embed">
                        </div>
                    </div>
                    
                    <div class="channel-input-group">
                        <div>
                            <label class="input-label">Qualité</label>
                            <input type="text" class="channel-input" 
                                   data-field="quality" 
                                   value="${channel.quality}" 
                                   placeholder="1080P, 720P, etc.">
                        </div>
                        <div>
                            <label class="input-label">Source</label>
                            <input type="text" class="channel-input" 
                                   data-field="source" 
                                   value="${channel.source}" 
                                   placeholder="Nom de la source">
                        </div>
                    </div>
                    
                    <button class="advanced-toggle">
                        <i class="fas fa-chevron-down"></i> Afficher les options avancées
                    </button>
                    
                    <div class="advanced-options">
                        <div class="channel-input-group">
                            <div>
                                <label class="input-label">Attribut allow</label>
                                <input type="text" class="channel-input" 
                                       data-field="allow" 
                                       value="${channel.allow || ''}" 
                                       placeholder="autoplay; encrypted-media; etc.">
                            </div>
                            <div>
                                <label class="input-label">Sandbox</label>
                                <input type="text" class="channel-input" 
                                       data-field="sandbox" 
                                       value="${channel.sandbox || ''}" 
                                       placeholder="allow-scripts allow-same-origin">
                            </div>
                        </div>
                        
                        <div class="channel-input-group">
                            <div>
                                <label class="input-label">Frameborder</label>
                                <input type="text" class="channel-input" 
                                       data-field="frameborder" 
                                       value="${channel.frameborder || ''}" 
                                       placeholder="0">
                            </div>
                            <div>
                                <label class="input-label">Scrolling</label>
                                <input type="text" class="channel-input" 
                                       data-field="scrolling" 
                                       value="${channel.scrolling || ''}" 
                                       placeholder="no, auto, yes">
                            </div>
                        </div>
                        
                        <div class="channel-input-group">
                            <div>
                                <label class="input-label">Referrer Policy</label>
                                <input type="text" class="channel-input" 
                                       data-field="referrerpolicy" 
                                       value="${channel.referrerpolicy || ''}" 
                                       placeholder="no-referrer, origin, etc.">
                            </div>
                            <div>
                                <label class="input-label">Loading</label>
                                <input type="text" class="channel-input" 
                                       data-field="loading" 
                                       value="${channel.loading || ''}" 
                                       placeholder="lazy, eager">
                            </div>
                        </div>
                        
                        <div class="channel-input-group full-width">
                            <div>
                                <label class="input-label">Style CSS</label>
                                <input type="text" class="channel-input" 
                                       data-field="style" 
                                       value="${channel.style || ''}" 
                                       placeholder="border: none; width: 100%;">
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        
        return html;
    }
    
    // Sauvegarder tous les changements
    window.saveAllChannels = function() {
        const channelEditors = document.querySelectorAll('.channel-editor');
        
        channelEditors.forEach(editor => {
            const channelId = editor.getAttribute('data-channel-id');
            const inputs = editor.querySelectorAll('.channel-input');
            const channelIndex = channelsConfig.channels.findIndex(c => c.id === channelId);
            
            if (channelIndex !== -1) {
                inputs.forEach(input => {
                    const field = input.getAttribute('data-field');
                    const value = input.value.trim();
                    
                    if (value) {
                        channelsConfig.channels[channelIndex][field] = value;
                    } else {
                        delete channelsConfig.channels[channelIndex][field];
                    }
                });
            }
        });
        
        // Sauvegarder la configuration
        saveChannelsConfig();
        
        // Mettre à jour l'interface utilisateur
        updateUIFromConfig();
        
        // Afficher la confirmation
        showConfirmation('Configuration sauvegardée avec succès!');
        
        // Fermer le panneau d'administration
        closeAdminPanel();
    };
    
    // Mettre à jour l'interface utilisateur depuis la configuration
    function updateUIFromConfig() {
        // Cette fonction mettrait à jour les éléments HTML avec la nouvelle configuration
        // Pour l'instant, il faut recharger la page pour voir les changements
        showConfirmation('Rechargez la page pour voir les changements');
    }
    
    // Restaurer la configuration par défaut
    window.resetToDefault = function() {
        if (confirm('Voulez-vous vraiment restaurer la configuration par défaut ?')) {
            channelsConfig = JSON.parse(JSON.stringify(defaultChannelsConfig));
            saveChannelsConfig();
            showConfirmation('Configuration restaurée par défaut');
            closeAdminPanel();
            setTimeout(() => location.reload(), 1000);
        }
    };
    
    // Exporter la configuration
    window.exportChannels = function() {
        const dataStr = JSON.stringify(channelsConfig, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `neo-tv-config-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showConfirmation('Configuration exportée');
    };
    
    // Importer la configuration
    window.importChannels = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedConfig = JSON.parse(e.target.result);
                if (importedConfig && importedConfig.channels) {
                    channelsConfig = importedConfig;
                    saveChannelsConfig();
                    showConfirmation('Configuration importée avec succès');
                    closeAdminPanel();
                    setTimeout(() => location.reload(), 1000);
                } else {
                    throw new Error('Format de fichier invalide');
                }
            } catch (error) {
                showConfirmation('Erreur: Fichier JSON invalide', 'error');
                console.error('Erreur d\'importation:', error);
            }
        };
        reader.readAsText(file);
        
        // Réinitialiser l'input file
        event.target.value = '';
    };
    
    // Fermer le panneau d'administration
    window.closeAdminPanel = function() {
        document.getElementById('admin-modal').style.display = 'none';
    };
    
    // Afficher un message de confirmation
    function showConfirmation(message, type = 'success') {
        const confirmation = document.getElementById('confirmation-message');
        const text = document.getElementById('confirmation-text');
        
        text.textContent = message;
        confirmation.className = 'confirmation-message';
        
        if (type === 'error') {
            confirmation.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        }
        
        confirmation.classList.add('show');
        
        setTimeout(() => {
            confirmation.classList.remove('show');
        }, 3000);
    }
});
