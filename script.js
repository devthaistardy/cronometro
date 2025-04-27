// Atualizar relógio principal
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// Funções para Wake Lock
let wakeLock = null;

// Função para solicitar o Wake Lock
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.error('Falha ao tentar bloquear a tela: ', err);
  }
}

// Função para liberar o Wake Lock
async function releaseWakeLock() {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (err) {
    console.error('Falha ao liberar o bloqueio da tela: ', err);
  }
}

// Modal
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  loadLastTimes();
  requestWakeLock(); // Solicitar o Wake Lock ao abrir o modal
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  releaseWakeLock(); // Liberar o Wake Lock ao fechar o modal
}

// Cronômetro
let stopwatchInterval;
let stopwatchSeconds = 0;

function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchSeconds++;
    displayStopwatch();
  }, 1000);
}

function pauseStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resumeStopwatch() {
  if (!stopwatchInterval) startStopwatch();
}

function resetStopwatch() {
  pauseStopwatch();
  saveLastTime('lastStopwatch', stopwatchSeconds);
  stopwatchSeconds = 0;
  displayStopwatch();
  loadLastTimes();
}

function displayStopwatch() {
  const hours = String(Math.floor(stopwatchSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((stopwatchSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(stopwatchSeconds % 60).padStart(2, '0');
  document.getElementById('stopwatch').textContent = `${hours}:${minutes}:${seconds}`;
}

// Contagem Regressiva
let countdownInterval;
let countdownSeconds = 0;

function startCountdown() {
  const input = document.getElementById('countdownInput').value;
  if (!input || countdownInterval) return;
  countdownSeconds = parseInt(input) * 60;
  document.getElementById('countdownInputWrapper').style.display = 'none';
  document.getElementById('countdown').style.display = 'block';
  document.getElementById('countdownControls').style.display = 'flex';
  displayCountdown();
  countdownInterval = setInterval(() => {
    countdownSeconds--;
    displayCountdown();
    if (countdownSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      document.getElementById('alarmSound').play();
      saveLastTime('lastCountdown', 0);
      loadLastTimes();
    }
  }, 1000);
}

function pauseCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
}

function resumeCountdown() {
  if (!countdownInterval && countdownSeconds > 0) {
    countdownInterval = setInterval(() => {
      countdownSeconds--;
      displayCountdown();
      if (countdownSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('alarmSound').play();
        saveLastTime('lastCountdown', 0);
        loadLastTimes();
      }
    }, 1000);
  }
}

function resetCountdown() {
  pauseCountdown();
  saveLastTime('lastCountdown', countdownSeconds);
  countdownSeconds = 0;
  document.getElementById('countdownInputWrapper').style.display = 'block';
  document.getElementById('countdown').style.display = 'none';
  document.getElementById('countdownControls').style.display = 'none';
  displayCountdown();
  loadLastTimes();
}

function displayCountdown() {
  const minutes = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
  const seconds = String(countdownSeconds % 60).padStart(2, '0');
  document.getElementById('countdown').textContent = `${minutes}:${seconds}`;
}

// Armazenar e carregar último tempo
function saveLastTime(id, time) {
  localStorage.setItem(id, time);
}

function loadLastTimes() {
  const lastStopwatch = localStorage.getItem('lastStopwatch');
  const lastCountdown = localStorage.getItem('lastCountdown');
  if (lastStopwatch) {
    const hours = String(Math.floor(lastStopwatch / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((lastStopwatch % 3600) / 60)).padStart(2, '0');
    const seconds = String(lastStopwatch % 60).padStart(2, '0');
    document.getElementById('lastStopwatch').textContent = `Último tempo: ${hours}:${minutes}:${seconds}`;
  }
  if (lastCountdown) {
    const minutes = String(Math.floor(lastCountdown / 60)).padStart(2, '0');
    const seconds = String(lastCountdown % 60).padStart(2, '0');
    document.getElementById('lastCountdown').textContent = `Última contagem: ${minutes}:${seconds}`;
  }
}
