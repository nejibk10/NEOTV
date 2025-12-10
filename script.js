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
    const allChannelsModal = document.getElementById('all-channels-modal');
    const allChannelsList = document.getElementById('all-channels-list');
    
    // Variables d'état
    let currentIframeUrl = '';
    let currentChannelData = {};
    let isInitialLoad = true;
    
    // Initialisation des chaînes
    initializeChannels();
    
    // Fonction d'initialisation des chaînes
    function initializeChannels() {
        // Ajouter les écouteurs d'événements pour toutes les chaînes
        channelItems.forEach(item => {
            item.addEventListener('click', function() {
                const iframeUrl = this.getAttribute('data-iframe');
                const name = this.getAttribute('data-name');
                const quality = this.getAttribute('data-quality');
                const source = this.getAttribute('data-source');
                
                loadChannel(iframeUrl, name, quality, source);
            });
        });
        
        // Charger la dernière chaîne regardée
        loadLastChannel();
    }
    
    // Fonction pour charger une chaîne dans l'iframe
    function loadChannel(iframeUrl, name, quality, source) {
        if (!iframeUrl) {
            showError('URL de chaîne non disponible');
            return;
        }
        
        // Mettre à jour les données actuelles
        currentIframeUrl = iframeUrl;
        currentChannelData = {iframeUrl, name, quality, source};
        
        // Afficher l'indicateur de chargement
        showLoading();
        
        // Mettre à jour les informations de la chaîne
        updateChannelInfo(name, quality, source);
        
        // Mettre à jour l'élément actif
        updateActiveChannel(name);
        
        // Charger l'iframe avec un délai pour l'effet visuel
        setTimeout(() => {
            livePlayer.src = iframeUrl;
            livePlayer.style.display = 'block';
            
            // Sauvegarder la dernière chaîne regardée
            saveLastChannel(iframeUrl, name, quality, source);
        }, 800);
    }
    
    // Afficher l'indicateur de chargement
    function showLoading() {
        playerPlaceholder.style.display = 'none';
        livePlayer.style.display = 'none';
        loadingElement.style.display = 'block';
    }
    
    // Mettre à jour les informations de la chaîne
    function updateChannelInfo(name, quality, source) {
        currentChannelName.textContent = name;
        currentChannelDesc.textContent = `Lecture en cours - Qualité: ${quality}`;
        currentChannelSource.textContent = source;
        currentQuality.textContent = quality;
        
        // Mettre à jour le titre de la page
        document.title = `${name} - NEO TV`;
    }
    
    // Mettre à jour la chaîne active
    function updateActiveChannel(activeName) {
        channelItems.forEach(item => {
            const itemName = item.getAttribute('data-name');
            if (itemName === activeName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Sauvegarder la dernière chaîne regardée
    function saveLastChannel(iframeUrl, name, quality, source) {
        const lastChannel = {
            iframeUrl,
            name,
            quality,
            source,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('lastChannel', JSON.stringify(lastChannel));
    }
    
    // Charger la dernière chaîne regardée
    function loadLastChannel() {
        try {
            const lastChannelJson = localStorage.getItem('lastChannel');
            if (lastChannelJson) {
                const lastChannel = JSON.parse(lastChannelJson);
                
                // Vérifier si la sauvegarde a moins de 24h
                const oneDay = 24 * 60 * 60 * 1000;
                const now = new Date().getTime();
                
                if (now - lastChannel.timestamp < oneDay) {
                    loadChannel(
                        lastChannel.iframeUrl,
                        lastChannel.name,
                        lastChannel.quality,
                        lastChannel.source
                    );
                    isInitialLoad = false;
                    return;
                }
            }
        } catch (error) {
            console.log('Erreur de chargement de la dernière chaîne:', error);
        }
        
        // Charger la première chaîne par défaut
        loadDefaultChannel();
    }
    
    // Charger la première chaîne par défaut
    function loadDefaultChannel() {
        if (channelItems.length > 0) {
            const firstChannel = channelItems[0];
            const iframeUrl = firstChannel.getAttribute('data-iframe');
            const name = firstChannel.getAttribute('data-name');
            const quality = firstChannel.getAttribute('data-quality');
            const source = firstChannel.getAttribute('data-source');
            
            // Attendre un peu pour l'effet visuel
            setTimeout(() => {
                loadChannel(iframeUrl, name, quality, source);
            }, 500);
        }
    }
    
    // Gérer les événements de l'iframe
    livePlayer.addEventListener('load', function() {
        console.log('Iframe chargée avec succès:', currentChannelData.name);
        loadingElement.style.display = 'none';
        livePlayer.style.display = 'block';
        
        if (isInitialLoad) {
            isInitialLoad = false;
        }
    });
    
    livePlayer.addEventListener('error', function() {
        loadingElement.style.display = 'none';
        playerPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: #ff4d4d; font-size: 3rem;"></i>
            <p style="color: #ff4d4d; margin-top: 10px;">Erreur de chargement de la chaîne</p>
            <p style="color: #aaa; font-size: 0.9rem;">La source peut être temporairement indisponible</p>
            <button onclick="refreshPlayer()" style="margin-top: 15px; padding: 8px 15px; background: #0072ff; border: none; border-radius: 5px; color: white; cursor: pointer;">
                <i class="fas fa-redo"></i> Réessayer
            </button>
        `;
        playerPlaceholder.style.display = 'block';
        console.error('Erreur de chargement de l\'iframe:', currentChannelData.name);
    });
    
    // Afficher une erreur
    function showError(message) {
        loadingElement.style.display = 'none';
        playerPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-circle" style="color: #ff4d4d; font-size: 3rem;"></i>
            <p style="color: #ff4d4d; margin-top: 10px;">${message}</p>
        `;
        playerPlaceholder.style.display = 'block';
    }
    
    // Fonction pour rafraîchir le lecteur
    window.refreshPlayer = function() {
        if (currentIframeUrl) {
            showLoading();
            livePlayer.src = '';
            
            setTimeout(() => {
                livePlayer.src = currentIframeUrl;
            }, 500);
        }
    };
    
    // Fonction pour activer le mode plein écran
    window.toggleFullscreen = function() {
        const elem = livePlayer;
        
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
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
    
    // Fonction pour ouvrir dans un nouvel onglet
    window.openInNewTab = function() {
        if (currentIframeUrl) {
            window.open(currentIframeUrl, '_blank');
        }
    };
    
    // Fonction pour afficher toutes les chaînes
    window.showAllChannels = function() {
        // Récupérer toutes les catégories et chaînes
        const categories = document.querySelectorAll('.category');
        allChannelsList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryTitle = category.querySelector('h2').textContent;
            const categoryChannels = category.querySelectorAll('.channel-item');
            
            // Ajouter les chaînes de cette catégorie
            categoryChannels.forEach(channel => {
                const channelElement = document.createElement('div');
                channelElement.className = 'channel-item';
                channelElement.setAttribute('data-iframe', channel.getAttribute('data-iframe'));
                channelElement.setAttribute('data-name', channel.getAttribute('data-name'));
                channelElement.setAttribute('data-quality', channel.getAttribute('data-quality'));
                channelElement.setAttribute('data-source', channel.getAttribute('data-source'));
                
                channelElement.innerHTML = `
                    <div style="flex: 1;">
                        <div class="channel-name">${channel.getAttribute('data-name')}</div>
                        <div class="channel-category">${categoryTitle}</div>
                    </div>
                    <span class="channel-quality">${channel.getAttribute('data-quality')}</span>
                `;
                
                // Ajouter l'écouteur d'événements
                channelElement.addEventListener('click', function() {
                    const iframeUrl = this.getAttribute('data-iframe');
                    const name = this.getAttribute('data-name');
                    const quality = this.getAttribute('data-quality');
                    const source = this.getAttribute('data-source');
                    
                    loadChannel(iframeUrl, name, quality, source);
                    closeAllChannels();
                });
                
                allChannelsList.appendChild(channelElement);
            });
        });
        
        // Afficher la modal
        allChannelsModal.style.display = 'block';
    };
    
    // Fonction pour fermer la modal toutes les chaînes
    window.closeAllChannels = function() {
        allChannelsModal.style.display = 'none';
    };
    
    // Fermer la modal en cliquant à l'extérieur
    window.onclick = function(event) {
        if (event.target === allChannelsModal) {
            closeAllChannels();
        }
    };
    
    // Gérer les raccourcis clavier
    document.addEventListener('keydown', function(event) {
        // Échap pour fermer la modal
        if (event.key === 'Escape') {
            closeAllChannels();
        }
        
        // F pour plein écran
        if (event.key === 'f' || event.key === 'F') {
            toggleFullscreen();
        }
        
        // R pour rafraîchir
        if (event.key === 'r' || event.key === 'R') {
            if (!event.ctrlKey) {
                refreshPlayer();
            }
        }
    });
    
    // Initialisation terminée
    console.log('NEO TV initialisé avec succès');
});
