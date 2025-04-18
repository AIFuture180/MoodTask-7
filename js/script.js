const moodActivities = {
    tired: [
        { activity: "Take a 10-minute power nap to recharge.", tool: "Guided nap timer (coming soon)", followUp: "Did that nap boost your energy?" },
        { activity: "Drink a glass of water to rehydrate.", tool: "Track hydration in Moodtask app", followUp: "Feeling more awake now?" },
        { activity: "Listen to an upbeat playlist.", tool: "Curated playlists in app", followUp: "Did the music lift your mood?" },
        { activity: "Do a quick stretch.", tool: "Open stretch tool", action: () => openPopup('stretch') }
    ],
    stressed: [
        { activity: "Try a 1-minute breathing exercise.", tool: "Open breathing tool", action: () => openPopup('breathing') },
        { activity: "Write down 3 things you’re grateful for.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Use a stress ball to release tension.", tool: "Shop stress ball", affiliate: "https://amzn.to/3example" },
        { activity: "Listen to a calming soundscape.", tool: "Open soundscape tool", action: () => openPopup('soundscape') }
    ],
    bored: [
        { activity: "Doodle for a minute to spark creativity.", tool: "Open doodle tool", action: () => openPopup('doodle') },
        { activity: "Solve a quick sudoku puzzle.", tool: "Open sudoku tool", action: () => openPopup('sudoku') },
        { activity: "Watch a funny video (in app).", tool: "Explore videos in Moodtask", followUp: "Did that make you smile?" },
        { activity: "Try a brain teaser (coming soon).", tool: "Placeholder for future tool" }
    ],
    excited: [
        { activity: "Share your excitement in a journal.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Set a small goal to channel energy.", tool: "Track goals in app", followUp: "Did that focus your excitement?" },
        { activity: "Dance to a favorite song.", tool: "Curated playlists in app", followUp: "Did dancing amplify your vibe?" }
    ],
    sad: [
        { activity: "Write a gratitude note to lift your spirits.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Listen to a comforting soundscape.", tool: "Open soundscape tool", action: () => openPopup('soundscape') },
        { activity: "Practice self-compassion meditation.", tool: "Guided meditation in app", followUp: "Did that bring some comfort?" }
    ],
    angry: [
        { activity: "Punch a virtual punching bag.", tool: "Open punching tool", action: () => openPopup('punching') },
        { activity: "Shred your worries.", tool: "Open worry shredder", action: () => openPopup('worry') },
        { activity: "Take 10 deep breaths.", tool: "Open breathing tool", action: () => openPopup('breathing') }
    ],
    happy: [
        { activity: "Share your happiness with a kind note.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Capture this moment in a journal.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Celebrate with a quick dance.", tool: "Curated playlists in app", followUp: "Did that boost your joy?" }
    ],
    confused: [
        { activity: "Write down what’s confusing you.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Focus on a calming color.", tool: "Open color focus tool", action: () => openPopup('color') },
        { activity: "Break your problem into steps.", tool: "Track tasks in app", followUp: "Feeling more clear now?" }
    ],
    default: [
        { activity: "Try a quick breathing exercise to center yourself.", tool: "Open breathing tool", action: () => openPopup('breathing') },
        { activity: "Write down how you’re feeling.", tool: "Open gratitude tool", action: () => openPopup('gratitude') },
        { activity: "Explore Moodtask’s habit tracker.", tool: "Download Moodtask", followUp: "Ready to start your journey?" }
    ]
};

function submitMood() {
    const input = document.getElementById('mood-input').value.trim().toLowerCase();
    const responseDiv = document.getElementById('mood-response');
    let activities = moodActivities.default;

    for (const mood in moodActivities) {
        if (input.includes(mood)) {
            activities = moodActivities[mood];
            break;
        }
    }

    let html = '<h3>Here are some ways to optimize your mood:</h3><ul>';
    activities.forEach(activity => {
        html += `<li>${activity.activity} <a href="#" ${activity.action ? `onclick="${activity.action.toString().replace(/\n/g, '')}"` : activity.affiliate ? `href="${activity.affiliate}" target="_blank" rel="noopener noreferrer"` : ''}>[${activity.tool}]</a>`;
        if (activity.followUp) html += `<p class="follow-up">${activity.followUp}</p>`;
    });
    html += '</ul>';
    responseDiv.innerHTML = html;
    document.getElementById('mood-input').value = '';
}

// Reused popup functions from original code
let currentSound = null;
const clickSound = document.getElementById('click-sound');
const successSound = document.getElementById('success-sound');
const punchSound = document.getElementById('punch-sound');
const shredSound = document.getElementById('shred-sound');
const natureSounds = {
    nature: document.getElementById('nature-sound'),
    rain: document.getElementById('rain-sound'),
    waves: document.getElementById('waves-sound')
};

function playSound(sound, volume = 0.5) {
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play().catch(err => console.error('Sound playback failed:', err));
}

function openPopup(tool) {
    playSound(clickSound, 0.3);
    const popup = document.getElementById(`${tool}-popup`);
    popup.style.display = 'flex';
    if (tool === 'breathing') startBreathing();
    if (tool === 'soundscape') startSoundscape();
    if (tool === 'punching') startPunching();
    if (tool === 'stretch') startStretch();
    if (tool === 'doodle') startDoodle();
    if (tool === 'worry') startWorry();
    if (tool === 'color') startColorFocus();
    if (tool === 'sudoku') startSudoku();
    if (tool === 'gratitude') startGratitude();
}

function closePopup(tool) {
    const popup = document.getElementById(`${tool}-popup`);
    popup.style.display = 'none';
    if (tool === 'breathing') clearInterval(window.breathingInterval);
    if (tool === 'soundscape') {
        clearInterval(window.soundscapeInterval);
        if (currentSound) currentSound.pause();
    }
    if (tool === 'punching') clearInterval(window.punchingInterval);
    if (tool === 'stretch') clearInterval(window.stretchInterval);
    if (tool === 'doodle') clearInterval(window.doodleInterval);
    if (tool === 'worry') {
        document.getElementById('worry-text').value = '';
        document.getElementById('paper-strips-container').innerHTML = '';
    }
    if (tool === 'color') clearInterval(window.colorInterval);
    if (tool === 'sudoku') clearInterval(window.sudokuInterval);
    if (tool === 'gratitude') document.getElementById('gratitude-text').value = '';
}

function updateProgress(elementId, total, current) {
    const progressBar = document.getElementById(elementId);
    const percentage = ((total - current) / total) * 100;
    progressBar.style.width = percentage + '%';
}

// Popup-specific functions (reused from original code)
function startBreathing() {
    let time = 60;
    let cycleTime = 0;
    const cycleDuration = 13;
    const steps = [
        { text: "Inhale", instruction: "Breathe in slowly through your nose...", class: "inhale", duration: 4 },
        { text: "Hold", instruction: "Hold your breath...", class: "hold", duration: 4 },
        { text: "Exhale", instruction: "Breathe out slowly through your mouth...", class: "exhale", duration: 4 },
        { text: "Pause", instruction: "Relax for a moment...", class: "pause", duration: 1 }
    ];
    const stepElement = document.getElementById('breathing-step');
    const instructionElement = document.getElementById('breathing-instruction');
    const timerElement = document.getElementById('breathing-timer');
    const circle = document.getElementById('breathing-circle');
    circle.className = '';
    updateProgress('breathing-progress', 60, 0);

    function updateBreathing() {
        const currentStepIndex = Math.floor(cycleTime / 4) % 4;
        const currentStep = steps[currentStepIndex];
        stepElement.textContent = currentStep.text;
        instructionElement.textContent = currentStep.instruction;
        circle.className = currentStep.class;
        cycleTime = (cycleTime + 1) % cycleDuration;
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('breathing-progress', 60, time);
        if (time <= 0) {
            clearInterval(window.breathingInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('breathing'), 1500);
        }
    }

    updateBreathing();
    window.breathingInterval = setInterval(updateBreathing, 1000);
}

function startSoundscape() {
    let time = 90;
    const timerElement = document.getElementById('soundscape-timer');
    const selectElement = document.getElementById('soundscape-select');
    const playButton = document.getElementById('play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    updateProgress('soundscape-progress', 90, 0);
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    selectElement.onchange = function() {
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0;
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    };
    playButton.onclick = function() {
        const soundType = selectElement.value;
        if (currentSound && currentSound !== natureSounds[soundType]) {
            currentSound.pause();
            currentSound.currentTime = 0;
        }
        currentSound = natureSounds[soundType];
        if (currentSound.paused) {
            currentSound.play().then(() => {
                currentSound.volume = volumeSlider.value;
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(err => console.error('Sound playback failed:', err));
        } else {
            currentSound.pause();
            currentSound.currentTime = 0;
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    };
    volumeSlider.oninput = function() {
        if (currentSound) currentSound.volume = this.value;
    };
    window.soundscapeInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('soundscape-progress', 90, time);
        if (time <= 0) {
            clearInterval(window.soundscapeInterval);
            if (currentSound) currentSound.pause();
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('soundscape'), 1500);
        }
    }, 1000);
}

function startPunching() {
    let time = 30;
    let count = 0;
    const bag = document.getElementById('punching-bag');
    const timerElement = document.getElementById('punching-timer');
    bag.textContent = '0';
    bag.style.transform = 'scale(1)';
    updateProgress('punching-progress', 30, 0);
    bag.onclick = () => {
        count++;
        bag.textContent = count;
        playSound(punchSound, 0.3);
        bag.style.transform = 'scale(0.9)';
        setTimeout(() => bag.style.transform = 'scale(1)', 100);
    };
    window.punchingInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('punching-progress', 30, time);
        if (time <= 0) {
            clearInterval(window.punchingInterval);
            playSound(successSound, 0.4);
            bag.innerHTML = `Great job! ${count} punches!`;
            setTimeout(() => closePopup('punching'), 1500);
        }
    }, 1000);
}

function startStretch() {
    let time = 60;
    const stretches = [
        "Reach up high for 10 seconds.",
        "Touch your toes for 10 seconds.",
        "Stretch your arms behind your back.",
        "Rotate your shoulders slowly."
    ];
    const stretchElement = document.getElementById('stretch-prompt');
    const timerElement = document.getElementById('stretch-timer');
    stretchElement.textContent = stretches[Math.floor(Math.random() * stretches.length)];
    updateProgress('stretch-progress', 60, 0);
    window.stretchInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('stretch-progress', 60, time);
        if (time <= 0) {
            clearInterval(window.stretchInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('stretch'), 1500);
        }
    }, 1000);
}

function startDoodle() {
    let time = 90;
    const canvas = document.getElementById('doodle-canvas');
    const ctx = canvas.getContext('2d');
    const timerElement = document.getElementById('doodle-timer');
    let isDrawing = false;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    canvas.onmousedown = () => isDrawing = true;
    canvas.onmouseup = () => isDrawing = false;
    canvas.onmousemove = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };
    updateProgress('doodle-progress', 90, 0);
    window.doodleInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('doodle-progress', 90, time);
        if (time <= 0) {
            clearInterval(window.doodleInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('doodle'), 1500);
        }
    }, 1000);
}

function startWorry() {
    let time = 30;
    const worryText = document.getElementById('worry-text');
    const timerElement = document.getElementById('worry-timer');
    worryText.value = '';
    updateProgress('worry-progress', 30, 0);
    window.worryInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('worry-progress', 30, time);
        if (time <= 0) {
            clearInterval(window.worryInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('worry'), 1500);
        }
    }, 1000);
}

function shredWorry() {
    const worryText = document.getElementById('worry-text');
    const container = document.getElementById('paper-strips-container');
    if (!worryText.value.trim()) {
        alert('Please enter a worry to shred.');
        return;
    }
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const strip = document.createElement('div');
        strip.className = 'paper-strip';
        strip.style.left = `${i * 20}px`;
        container.appendChild(strip);
    }
    playSound(shredSound, 0.5);
    setTimeout(() => {
        worryText.value = '';
        container.innerHTML = '';
        playSound(successSound, 0.4);
        alert('Worry shredded!');
    }, 1000);
}

function startColorFocus() {
    let time = 60;
    const colors = ['#ff6347', '#4682b4', '#32cd32'];
    const colorBox = document.getElementById('color-square');
    const timerElement = document.getElementById('color-timer');
    colorBox.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    updateProgress('color-progress', 60, 0);
    window.colorInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('color-progress', 60, time);
        if (time <= 0) {
            clearInterval(window.colorInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('color'), 1500);
        }
    }, 1000);
}

function startSudoku() {
    let time = 90;
    const gridElement = document.getElementById('sudoku-grid');
    const timerElement = document.getElementById('sudoku-timer');
    gridElement.innerHTML = '';
    const puzzle = [
        [5, 3, '', '', 7, '', '', '', ''],
        [6, '', '', 1, 9, 5, '', '', ''],
        ['', 9, 8, '', '', '', '', 6, ''],
        [8, '', '', '', 6, '', '', '', 3],
        [4, '', '', 8, '', 3, '', '', 1],
        ['', '', '', '', 2, '', '', '', 6],
        ['', 6, '', '', '', '', 2, 8, ''],
        ['', '', '', 4, 1, 9, '', '', 5],
        ['', '', '', '', 8, '', '', 7, 9]
    ];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = puzzle[i][j] || '';
            input.disabled = !!puzzle[i][j];
            input.oninput = () => {
                if (!/^[1-9]?$/.test(input.value)) input.value = '';
            };
            gridElement.appendChild(input);
        }
    }
    updateProgress('sudoku-progress', 90, 0);
    window.sudokuInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('sudoku-progress', 90, time);
        if (time <= 0) {
            clearInterval(window.sudokuInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('sudoku'), 1500);
        }
    }, 1000);
}

function startGratitude() {
    let time = 30;
    const gratitudeText = document.getElementById('gratitude-text');
    const timerElement = document.getElementById('gratitude-timer');
    gratitudeText.value = '';
    updateProgress('gratitude-progress', 30, 0);
    window.gratitudeInterval = setInterval(() => {
        time--;
        timerElement.textContent = `Time remaining: ${time}s`;
        updateProgress('gratitude-progress', 30, time);
        if (time <= 0) {
            clearInterval(window.gratitudeInterval);
            playSound(successSound, 0.4);
            setTimeout(() => closePopup('gratitude'), 1500);
        }
    }, 1000);
}

function saveGratitude() {
    const gratitudeText = document.getElementById('gratitude-text');
    if (!gratitudeText.value.trim()) {
        alert('Please enter something you are grateful for.');
        return;
    }
    let gratitudes = JSON.parse(localStorage.getItem('gratitudes') || '[]');
    gratitudes.push({ text: gratitudeText.value, date: new Date().toLocaleString() });
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
    playSound(successSound, 0.4);
    alert('Gratitude saved!');
    gratitudeText.value = '';
}

function clearCanvas() {
    const canvas = document.getElementById('doodle-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveDoodle() {
    const canvas = document.getElementById('doodle-canvas');
    const link = document.createElement('a');
    link.download = 'doodle.png';
    link.href = canvas.toDataURL();
    link.click();
}
