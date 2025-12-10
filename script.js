// NEO TV - Script principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEO TV - Chargement...');
    
    // Éléments DOM
    const player = document.getElementById('live-player');
    const placeholder = document.getElementById('player-placeholder');
    const loading = document.getElementById('loading');
    const channelName = document.getElementById('current-channel-name');
    const channelDesc = document.getElementById('current-channel-desc');
    const channelItems = document.querySelectorAll('.channel-item');
    
    // Variables
    let currentChannel = null;
    
    // Initialiser les chaînes
    initChannels();
    
    // Charger la dernière chaîne
    loadLastChannel();
    
    // Fonction d'initialisation
    function initChannels() {
        channelItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const src = this.getAttribute('data-src');
                const name = this.getAttribute('data-name');
                const quality = this.getAttribute('data-quality');
                
                if (!src) {
                    showError('URL non disponible');
                    return;
                }
                
                // Charger la chaîne
                loadChannel(src, name, quality);
                
                // Mettre à jour l'élément actif
                updateActiveChannel(this);
                
                // Sauvegarder
                saveLastChannel(src, name);
            });
        });
        
        console.log(channelItems.length + ' chaînes initialisées');
    }
    
    // Charger une chaîne
    function loadChannel(src, name, quality) {
        // Afficher le chargement
        showLoading();
        
        // Mettre à jour les infos
        channelName.textContent = name;
        channelDesc.textContent = 'Lecture en cours - Qualité: ' + quality;
        
        // Configurer l'iframe
        player.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        player.setAttribute('allowfullscreen', '');
        player.setAttribute('frameborder', '0');
        
        // Charger la source
        player.src = src;
        currentChannel = { src, name, quality };
        
        // Cacher le placeholder après un délai
        setTimeout(() => {
            placeholder.style.display = 'none';
            player.style.display = 'block';
        }, 500);
    }
    
    // Afficher le chargement
    function showLoading() {
        placeholder.style.display = 'none';
        player.style.display = 'none';
        loading.style.display = 'block';
    }
    
    // Afficher une erreur
    function showError(message) {
        loading.style.display = 'none';
        player.style.display = 'none';
        
        placeholder.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: #ff4d4d; font-size: 3rem; margin-bottom: 15px;"></i>
            <p style="color: #ff4d4d;">${message}</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 15px; background: #0072ff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Recharger
            </button>
        `;
        placeholder.style.display = 'block';
    }
    
    // Mettre à jour la chaîne active
    function updateActiveChannel(activeElement) {
        channelItems.forEach(item => {
            item.classList.remove('active');
        });
        activeElement.classList.add('active');
    }
    
    // Sauvegarder la dernière chaîne
    function saveLastChannel(src, name) {
        try {
            localStorage.setItem('lastChannel', JSON.stringify({
                src: src,
                name: name,
                time: Date.now()
            }));
        } catch (e) {
            console.log('Impossible de sauvegarder');
        }
    }
    
    // Charger la dernière chaîne
    function loadLastChannel() {
        try {
            const saved = localStorage.getItem('lastChannel');
            if (saved) {
                const last = JSON.parse(saved);
                
                // Vérifier si c'est récent (moins de 24h)
                if (Date.now() - last.time < 86400000) {
                    // Trouver la chaîne correspondante
                    const channelElement = findChannelBySrc(last.src);
                    if (channelElement) {
                        setTimeout(() => {
                            channelElement.click();
                        }, 800);
                        return;
                    }
                }
            }
        } catch (e) {
            console.log('Erreur chargement dernière chaîne');
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
    
    // Charger la première chaîne
    function loadDefaultChannel() {
        if (channelItems.length > 0) {
            setTimeout(() => {
                channelItems[0].click();
            }, 1000);
        }
    }
    
    // Événements de l'iframe
    player.addEventListener('load', function() {
        console.log('Chaîne chargée:', currentChannel?.name);
        loading.style.display = 'none';
    });
    
    player.addEventListener('error', function() {
        showError('Erreur de chargement de la chaîne');
    });
});

// ========== FONCTIONS GLOBALES ==========

// Rafraîchir
window.refreshPlayer = function() {
    const player = document.getElementById('live-player');
    if (player && player.src) {
        const currentSrc = player.src;
        player.src = '';
        setTimeout(() => {
            player.src = currentSrc;
        }, 300);
    }
};

// Plein écran
window.toggleFullscreen = function() {
    const player = document.getElementById('live-player');
    if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) {
            player.msRequestFullscreen();
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

// Montrer 50%
window.showPageProgress = function(percent = 50) {
    const container = document.getElementById('progress-container');
    const indicator = document.getElementById('page-indicator');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    if (container && bar && indicator && text) {
        bar.style.width = percent + '%';
        text.textContent = percent + '% de la page';
        container.style.display = 'block';
        indicator.style.display = 'flex';
        
        setTimeout(() => {
            container.style.display = 'none';
            indicator.style.display = 'none';
        }, 5000);
    }
};
