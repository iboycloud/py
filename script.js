const bar = document.getElementById('p-bar');
const statusText = document.getElementById('loader-status');

// 1. LOADING & WELCOME LOGIC
window.addEventListener('load', () => {
    let width = 0;
    const states = ["Loading Assets...", "Setting Up UI...", "Ready!"];
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            showWelcome();
        } else {
            width += 2;
            bar.style.width = width + '%';
            if (width < 40) statusText.innerText = states[0];
            else if (width < 80) statusText.innerText = states[1];
            else statusText.innerText = states[2];
        }
    }, 30);
});

function showWelcome() {
    const loader = document.getElementById('loader');
    const welcome = document.getElementById('welcome-overlay');
    const welcomeText = document.querySelector('.welcome-text');
    
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        welcome.style.display = 'flex';
        setTimeout(() => {
            welcomeText.classList.add('show');
            setTimeout(() => {
                welcome.style.opacity = '0';
                setTimeout(() => {
                    welcome.style.display = 'none';
                    document.getElementById('mainContent').classList.add('show');
                    const video = document.getElementById('bgVideo');
                    video.play().then(() => video.classList.add('video-visible')).catch(()=>console.log("Autoplay blocked"));
                }, 500);
            }, 2000);
        }, 100);
    }, 800);
}

// 2. SIDEBAR LOGIC
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// 3. BATTERY STATUS LOGIC
const batLevelText = document.getElementById('bat-level');
const batIcon = document.getElementById('bat-icon');
const chargeIcon = document.getElementById('charge-icon');

function updateBatteryUI(battery) {
    const level = Math.round(battery.level * 100);
    batLevelText.innerText = level + '%';
    if (level >= 90) batIcon.className = 'fas fa-battery-full';
    else if (level >= 60) batIcon.className = 'fas fa-battery-three-quarters';
    else if (level >= 30) batIcon.className = 'fas fa-battery-half';
    else batIcon.className = 'fas fa-battery-quarter';
    
    batIcon.style.color = level <= 20 ? '#ef4444' : '#ffffff';
    if (battery.charging) {
        chargeIcon.style.display = 'inline-block';
        batIcon.style.color = '#10b981';
    } else {
        chargeIcon.style.display = 'none';
    }
}

if ('getBattery' in navigator) {
    navigator.getBattery().then(bat => {
        updateBatteryUI(bat);
        bat.addEventListener('levelchange', () => updateBatteryUI(bat));
        bat.addEventListener('chargingchange', () => updateBatteryUI(bat));
    });
} else {
    batLevelText.innerText = '100%';
}

// 4. MODAL & COPY LOGIC
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(e) { if(e.target.classList.contains('modal')) e.target.classList.remove('active'); }
function copy(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    });
}

// 5. MUSIC PLAYER LOGIC
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const seekBar = document.getElementById('seekBar');

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}
audio.ontimeupdate = () => {
    seekBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
};
function seek(e) {
    audio.currentTime = (e.offsetX / e.currentTarget.clientWidth) * audio.duration;
}

// Autoplay fix for mobile
window.addEventListener('touchstart', () => {
    const video = document.getElementById('bgVideo');
    if (video.paused) video.play();
}, { once: true });
