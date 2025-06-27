// Variables de jeu
let gameState = {
    coins: 0,
    coinsPerClick: 1,
    coinsPerSecond: 0,
    level: 1,
    levelProgress: 0,
    clickMultiplier: 1,
    totalClicks: 0,
    achievements: []
};

// Définition des améliorations
const upgrades = [
    {
        id: 'cursor',
        name: '👆 Curseur Magique',
        description: '+1 crypto par clic',
        baseCost: 15,
        owned: 0,
        effect: 'click',
        value: 1
    },
    {
        id: 'miner',
        name: '⛏️ Mini Mineur',
        description: '+1 crypto par seconde',
        baseCost: 100,
        owned: 0,
        effect: 'auto',
        value: 1
    },
    {
        id: 'gpu',
        name: '🔥 GPU Gamer',
        description: '+5 cryptos par seconde',
        baseCost: 1000,
        owned: 0,
        effect: 'auto',
        value: 5
    },
    {
        id: 'farm',
        name: '🏭 Ferme de Minage',
        description: '+25 cryptos par seconde',
        baseCost: 10000,
        owned: 0,
        effect: 'auto',
        value: 25
    },
    {
        id: 'datacenter',
        name: '🏢 Data Center',
        description: '+100 cryptos par seconde',
        baseCost: 100000,
        owned: 0,
        effect: 'auto',
        value: 100
    },
    {
        id: 'quantum',
        name: '🌌 Ordinateur Quantique',
        description: '+500 cryptos par seconde',
        baseCost: 1000000,
        owned: 0,
        effect: 'auto',
        value: 500
    }
];

// Achievements
const achievements = [
    { id: 'first_click', name: 'Premier Clic!', condition: () => gameState.totalClicks >= 1 },
    { id: 'hundred_clicks', name: 'Clicker Pro!', condition: () => gameState.totalClicks >= 100 },
    { id: 'thousand_coins', name: 'Millionnaire!', condition: () => gameState.coins >= 1000 },
    { id: 'first_upgrade', name: 'Première Amélioration!', condition: () => upgrades.some(u => u.owned > 0) },
    { id: 'level_10', name: 'Niveau 10!', condition: () => gameState.level >= 10 }
];

// Éléments DOM
const coinsDisplay = document.getElementById('coins');
const perClickDisplay = document.getElementById('perClick');
const perSecondDisplay = document.getElementById('perSecond');
const levelDisplay = document.getElementById('level');
const levelProgressBar = document.getElementById('levelProgress');
const mineButton = document.getElementById('mineButton');
const upgradesContainer = document.getElementById('upgradesContainer');
const clickBonusDisplay = document.getElementById('clickBonus');

// Fonctions de jeu
function updateDisplay() {
    coinsDisplay.textContent = formatNumber(Math.floor(gameState.coins));
    perClickDisplay.textContent = formatNumber(gameState.coinsPerClick);
    perSecondDisplay.textContent = formatNumber(gameState.coinsPerSecond);
    levelDisplay.textContent = gameState.level;
    
    const levelRequirement = gameState.level * 1000;
    const progress = (gameState.levelProgress / levelRequirement) * 100;
    levelProgressBar.style.width = progress + '%';
    
    clickBonusDisplay.textContent = `Bonus de clic: x${gameState.clickMultiplier.toFixed(1)}`;
}

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function mine() {
    const earnedCoins = gameState.coinsPerClick * gameState.clickMultiplier;
    gameState.coins += earnedCoins;
    gameState.totalClicks++;
    gameState.levelProgress += earnedCoins;
    
    // Animation de texte flottant
    showFloatingText('+' + formatNumber(earnedCoins), mineButton);
    
    // Vérifier le niveau
    checkLevelUp();
    
    // Vérifier les achievements
    checkAchievements();
    
    updateDisplay();
    updateUpgrades();
}

function showFloatingText(text, element) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = (rect.left + rect.width / 2 - 25) + 'px';
    floatingText.style.top = (rect.top - 10) + 'px';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
}

function checkLevelUp() {
    const levelRequirement = gameState.level * 1000;
    if (gameState.levelProgress >= levelRequirement) {
        gameState.level++;
        gameState.levelProgress = 0;
        gameState.clickMultiplier += 0.1;
        showAchievement(`Niveau ${gameState.level} atteint! Bonus de clic augmenté!`);
    }
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition()) {
            gameState.achievements.push(achievement.id);
            showAchievement(achievement.name);
        }
    });
}

function showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = '🏆 ' + text;
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        document.body.removeChild(achievement);
    }, 4000);
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
    
    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        upgrade.owned++;
        
        if (upgrade.effect === 'click') {
            gameState.coinsPerClick += upgrade.value;
        } else if (upgrade.effect === 'auto') {
            gameState.coinsPerSecond += upgrade.value;
        }
        
        updateDisplay();
        updateUpgrades();
        checkAchievements();
    }
}

function updateUpgrades() {
    upgradesContainer.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
        const canAfford = gameState.coins >= cost;
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <div class="upgrade-info">
                <h3>${upgrade.name} (${upgrade.owned})</h3>
                <p>${upgrade.description}</p>
            </div>
            <button class="upgrade-button" ${!canAfford ? 'disabled' : ''} onclick="buyUpgrade('${upgrade.id}')">
                ${formatNumber(cost)} 💰
            </button>
        `;
        
        upgradesContainer.appendChild(upgradeElement);
    });
}

// Fonctions premium (simulées)
function buyBoost(multiplier, duration) {
    alert(`Boost x${multiplier} activé pour ${duration}h! (Simulation - intégrez un vrai système de paiement)`);
    gameState.clickMultiplier *= multiplier;
    setTimeout(() => {
        gameState.clickMultiplier /= multiplier;
        updateDisplay();
    }, duration * 60 * 60 * 1000);
    updateDisplay();
}

function buyCryptos(amount) {
    alert(`${formatNumber(amount)} cryptos ajoutés! (Simulation - intégrez un vrai système de paiement)`);
    gameState.coins += amount;
    updateDisplay();
}

function buyAutoClicker() {
    alert("Auto-clicker activé! (Simulation - intégrez un vrai système de paiement)");
    setInterval(() => {
        if (Math.random() < 0.8) { // 80% de chance de cliquer
            mine();
        }
    }, 200); // 5 clics par seconde
}

// Boucle de jeu pour les gains automatiques
setInterval(() => {
    if (gameState.coinsPerSecond > 0) {
        gameState.coins += gameState.coinsPerSecond / 10;
        gameState.levelProgress += gameState.coinsPerSecond / 10;
        checkLevelUp();
        updateDisplay();
    }
}, 100);

// Sauvegarde automatique
setInterval(() => {
    saveGame();
}, 5000);

function saveGame() {
    localStorage.setItem('cryptoMinerSave', JSON.stringify(gameState));
}

// Chargement de la sauvegarde
function loadGame() {
    const saved = localStorage.getItem('cryptoMinerSave');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
        // Recalculer les stats basées sur les améliorations
        gameState.coinsPerClick = 1;
        gameState.coinsPerSecond = 0;
        upgrades.forEach(upgrade => {
            if (upgrade.effect === 'click') {
                gameState.coinsPerClick += upgrade.value * upgrade.owned;
            } else if (upgrade.effect === 'auto') {
                gameState.coinsPerSecond += upgrade.value * upgrade.owned;
            }
        });
    }
}

// Event listeners
mineButton.addEventListener('click', mine);

// Initialisation
loadGame();
updateDisplay();
updateUpgrades();

// Bonus de clics rapides
let lastClickTime = 0;
let clickCombo = 0;

mineButton.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClickTime < 500) { // Moins de 500ms entre les clics
        clickCombo++;
        if (clickCombo >= 5) {
            gameState.clickMultiplier += 0.1;
            showAchievement('Combo de clics! Multiplicateur augmenté!');
            clickCombo = 0;
        }
    } else {
        clickCombo = 0;
    }
    lastClickTime = now;
});