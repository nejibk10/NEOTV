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
    
    // Initialiser les écouteurs d'événements
    initializeEventListeners();
    
    // Fonction d'initialisation des écouteurs
    function initializeEventListeners() {
        // Écouteurs pour toutes les chaînes
        channelItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const channelData = getChannelDataFromElement(this);
                loadChannel(channelData);
            });
        });
        
        // Écouteurs pour l'iframe
        livePlayer.addEventListener('load', function() {
            console.log('Iframe chargée avec succès');
            loadingElement.style.display = 'none';
            livePlayer.style.display = 'block';
        });
        
        livePlayer.addEventListener('error', function() {
            console.error('Erreur de chargement de l\'iframe');
            showError('Erreur de chargement de la chaîne');
        });
        
        // Charger la dernière chaîne regardée
        loadLastChannel();
    }
    
    // Obtenir les données de la chaîne depuis l'élément
    function getChannelDataFromElement(element) {
        return {
            src: element.getAttribute('data-src'),
            name: element.getAttribute('data-name'),
            quality: element.getAttribute('data-quality'),
            source: element.getAttribute('data-source'),
            allow: element.getAttribute('data-allow'),
            sandbox: element.getAttribute('data-sandbox'),
            frameborder: element.getAttribute('data-frameborder'),
            scrolling: element.getAttribute('data-scrolling'),
            referrerpolicy: element.getAttribute('data-referrerpolicy'),
            loading: element.getAttribute('data-loading'),
            style: element.getAttribute('data-style'),
            allowfullscreen: element.getAttribute('data-allowfullscreen')
        };
    }
    
    // Charger une chaîne dans l'iframe
    function loadChannel(channelData) {
        if (!channelData || !channelData.src) {
            showError('URL de chaîne non disponible');
            return;
        }
        
        currentChannelData = channelData;
        
        // Mettre à jour les informations affichées
        updateChannelInfo(channelData);
        
        // Mettre à jour la classe active
        updateActiveChannel(channelData.name);
        
        // Afficher le chargement
        showLoading();
        
        // Configurer l'iframe avec les attributs spécifiques
        configureIframe(channelData);
        
        // Sauvegarder la dernière chaîne regardée
        saveLastChannel(channelData);
    }
    
    // Configurer l'iframe avec tous les attributs
    function configureIframe(channelData) {
        // Réinitialiser l'iframe
        livePlayer.removeAttribute('sandbox');
        livePlayer.removeAttribute('referrerpolicy');
        livePlayer.removeAttribute('loading');
        livePlayer.removeAttribute('allowfullscreen');
        livePlayer.style.cssText = '';
        
        // Définir l'URL source
        livePlayer.src = channelData.src;
        livePlayer.title = channelData.name;
        
        // Appliquer l'attribut allow
        if (channelData.allow) {
            livePlayer.setAttribute('allow', channelData.allow);
        } else {
            livePlayer.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        }
        
        // Toujours permettre le plein écran
        livePlayer.setAttribute('allowfullscreen', '');
        
        // Appliquer les autres attributs spécifiques
        if (channelData.sandbox) {
            livePlayer.setAttribute('sandbox', channelData.sandbox);
        }
        
        if (channelData.frameborder !== null) {
            livePlayer.setAttribute('frameborder', channelData.frameborder);
        } else {
            livePlayer.setAttribute('frameborder', '0');
        }
        
        if (channelData.scrolling) {
            livePlayer.setAttribute('scrolling', channelData.scrolling);
        }
        
        if (channelData.referrerpolicy) {
            livePlayer.setAttribute('referrerpolicy', channelData.referrerpolicy);
        }
        
        if (channelData.loading) {
            livePlayer.setAttribute('loading', channelData.loading);
        }
        
        if (channelData.style) {
            livePlayer.style.cssText = channelData.style;
        }
        
        // Masquer le placeholder et afficher l'iframe après un délai
        setTimeout(() => {
            playerPlaceholder.style.display = 'none';
            livePlayer.style.display = 'block';
        }, 500);
    }
    
    // Mettre à jour les informations affichées
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
    
    // Afficher l'indicateur de chargement
    function showLoading() {
        playerPlaceholder.style.display = 'none';
        livePlayer.style.display = 'none';
        loadingElement.style.display = 'block';
    }
    
    // Afficher une erreur
    function showError(message) {
        loadingElement.style.display = 'none';
        livePlayer.style.display = 'none';
        playerPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: #ff4d4d; font-size: 3rem;"></i>
            <p style="color: #ff4d4d; margin-top: 10px;">${message}</p>
            <p style="color: #aaa; font-size: 0.9rem;">Essayez une autre chaîne ou réessayez plus tard</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 15px; background: #0072ff; border: none; border-radius: 5px; color: white; cursor: pointer;">
                <i class="fas fa-redo"></i> Recharger la page
            </button>
        `;
        playerPlaceholder.style.display = 'block';
    }
    
    // Sauvegarder la dernière chaîne regardée
    function saveLastChannel(channelData) {
        try {
            const lastChannel = {
                name: channelData.name,
                src: channelData.src,
                timestamp: Date.now()
            };
            localStorage.setItem('lastChannel', JSON.stringify(lastChannel));
        } catch (e) {
            console.warn('Impossible de sauvegarder la dernière chaîne:', e);
        }
    }
    
    // Charger la dernière chaîne regardée
    function loadLastChannel() {
        try {
            const saved = localStorage.getItem('lastChannel');
            if (saved) {
                const lastChannel = JSON.parse(saved);
                
                // Vérifier si la sauvegarde est récente (moins de 24h)
                const oneDay = 24 * 60 * 60 * 1000;
                if (Date.now() - lastChannel.timestamp < oneDay) {
                    // Trouver l'élément correspondant
                    const channelElement = findChannelBySrc(lastChannel.src);
                    if (channelElement) {
                        const channelData = getChannelDataFromElement(channelElement);
                        // Charger après un court délai
                        setTimeout(() => loadChannel(channelData), 300);
                        return;
                    }
                }
            }
        } catch (e) {
            console.warn('Erreur de chargement de la dernière chaîne:', e);
        }
        
        // Charger la première chaîne par défaut
        loadDefaultChannel();
    }
    
    // Trouver une chaîne par son URL
    function findChannelBySrc(src) {
        for (const item of channelItems) {
            if (item.getAttribute('data-src') === src) {
                return item;
            }
        }
        return null;
    }
    
    // Charger la première chaîne par défaut
    function loadDefaultChannel() {
        if (channelItems.length > 0) {
            const firstChannel = channelItems[0];
            const channelData = getChannelDataFromElement(firstChannel);
            // Délai pour que l'interface se charge complètement
            setTimeout(() => loadChannel(channelData), 800);
        }
    }
    
    // ==================== FONCTIONS GLOBALES ====================
    
    // Rafraîchir le lecteur
    window.refreshPlayer = function() {
        if (currentChannelData) {
            showLoading();
            // Réinitialiser l'iframe
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
            window.open(currentChannelData.src, '_blank', 'noopener,noreferrer');
        }
    };
    
    // Afficher les informations de l'iframe
    window.showIframeInfo = function() {
        if (!currentChannelData) return;
        
        const modal = document.getElementById('iframe-info-modal');
        const content = document.getElementById('iframe-info-content');
        
        let html = `
            <h3 style="color: #00c6ff; margin-bottom: 15px;">${currentChannelData.name}</h3>
            <div class="iframe-details">
                <div class="iframe-attribute">
                    <span class="attribute-name">URL Source:</span>
                    <span class="attribute-value">${currentChannelData.src || 'Non définie'}</span>
                </div>
                <div class="iframe-attribute">
                    <span class="attribute-name">Qualité:</span>
                    <span class="attribute-value">${currentChannelData.quality || 'Non définie'}</span>
                </div>
                <div class="iframe-attribute">
                    <span class="attribute-name">Source:</span>
                    <span class="attribute-value">${currentChannelData.source || 'Non définie'}</span>
                </div>`;
        
        // Afficher les attributs iframe
        const attributes = [
            { name: 'allow', value: currentChannelData.allow },
            { name: 'sandbox', value: currentChannelData.sandbox },
            { name: 'frameborder', value: currentChannelData.frameborder },
            { name: 'scrolling', value: currentChannelData.scrolling },
            { name: 'referrerpolicy', value: currentChannelData.referrerpolicy },
            { name: 'loading', value: currentChannelData.loading },
            { name: 'style', value: currentChannelData.style },
            { name: 'allowfullscreen', value: currentChannelData.allowfullscreen }
        ];
        
        attributes.forEach(attr => {
            if (attr.value) {
                html += `
                    <div class="iframe-attribute">
                        <span class="attribute-name">${attr.name}:</span>
                        <span class="attribute-value">${attr.value}</span>
                    </div>`;
            }
        });
        
        html += `</div>`;
        content.innerHTML = html;
        modal.style.display = 'block';
    };
    
    // Fermer les informations de l'iframe
    window.closeIframeInfo = function() {
        document.getElementById('iframe-info-modal').style.display = 'none';
    };
    
    // ==================== BARRE DE PROGRESSION 50% ====================
    
    // Afficher la barre de progression
    window.showPageProgress = function(percentage = 50) {
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.getElementById('progress-container');
        const pageIndicator = document.getElementById('page-indicator');
        const progressText = document.getElementById('progress-text');
        
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${percentage}% de la page`;
        
        progressContainer.style.display = 'block';
        pageIndicator.style.display = 'flex';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            progressContainer.style.display = 'none';
            pageIndicator.style.display = 'none';
        }, 5000);
    };
    
    // Initialiser le bouton de progression
    document.getElementById('show-progress-btn').addEventListener('click', function() {
        showPageProgress(50);
    });
    
    // ==================== ADMINISTRATION ====================
    
    // Ouvrir le panneau d'administration
    window.openAdminPanel = function() {
        const modal = document.getElementById('admin-modal');
        const channelsList = document.getElementById('admin-channels-list');
        
        // Pour l'instant, afficher un message simple
        channelsList.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-cogs" style="font-size: 4rem; color: #0072ff; margin-bottom: 20px;"></i>
                <h3 style="color: #00c6ff;">Module d'administration</h3>
                <p style="color: #aaa; margin-top: 10px;">
                    Cette fonctionnalité sera disponible dans une prochaine version.
                </p>
                <button onclick="closeAdminPanel()" style="margin-top: 20px; padding: 10px 20px; background: #0072ff; border: none; border-radius: 5px; color: white; cursor: pointer;">
                    <i class="fas fa-times"></i> Fermer
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    };
    
    // Fermer le panneau d'administration
    window.closeAdminPanel = function() {
        document.getElementById('admin-modal').style.display = 'none';
    };
    
    // ==================== RACCOURCIS CLAVIER ====================
    
    document.addEventListener('keydown', function(event) {
        // Échap pour fermer les modals
        if (event.key === 'Escape') {
            closeIframeInfo();
            closeAdminPanel();
        }
        
        // F pour plein écran
        if (event.key === 'f' || event.key === 'F') {
            if (!event.ctrlKey) {
                event.preventDefault();
                toggleFullscreen();
            }
        }
        
        // R pour rafraîchir
        if (event.key === 'r' || event.key === 'R') {
            if (!event.ctrlKey) {
                event.preventDefault();
                refreshPlayer();
            }
        }
        
        // I pour informations (Ctrl+I)
        if (event.key === 'i' || event.key === 'I') {
            if (event.ctrlKey) {
                event.preventDefault();
                showIframeInfo();
            }
        }
        
        // P pour progression (Ctrl+P)
        if (event.key === 'p' || event.key === 'P') {
            if (event.ctrlKey) {
                event.preventDefault();
                showPageProgress(50);
            }
        }
        
        // A pour administration (Ctrl+Alt+A)
        if (event.key === 'a' || event.key === 'A') {
            if (event.ctrlKey && event.altKey) {
                event.preventDefault();
                openAdminPanel();
            }
        }
    });
    
    // ==================== FONCTIONS UTILITAIRES ====================
    
    // Afficher un message de confirmation
    window.showConfirmation = function(message, duration = 3000) {
        const confirmation = document.getElementById('confirmation-message');
        const text = document.getElementById('confirmation-text');
        
        if (confirmation && text) {
            text.textContent = message;
            confirmation.classList.add('show');
            
            setTimeout(() => {
                confirmation.classList.remove('show');
            }, duration);
        }
    };
    
    // Redémarrer l'application
    window.restartApp = function() {
        if (confirm('Voulez-vous redémarrer l\'application ?')) {
            localStorage.removeItem('lastChannel');
            location.reload();
        }
    };
    
    // Débogage
    console.log('NEO TV initialisé avec succès');
    console.log(`${channelItems.length} chaînes disponibles`);
    
    // Afficher un message de bienvenue après le chargement
    setTimeout(() => {
        console.log('Application prête');
        if (currentChannelData) {
            console.log(`Chaîne actuelle: ${currentChannelData.name}`);
        }
    }, 1000);
});
