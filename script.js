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

// Manter a tela ativa
let wakeLockInterval;

function startWakeLock() {
  wakeLockInterval = setInterval(() => {
    document.body.style.background = "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
  }, 1000);
}

function stopWakeLock() {
  clearInterval(wakeLockInterval);
}

// Modal
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  loadLastTimes();
  startWakeLock(); // Manter a tela ativa ao abrir o modal
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  stopWakeLock(); // Parar a tentativa de manter a tela ativa ao fechar o modal
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
  document.getElementById('countdownInput').value = '';
  displayCountdown();
  loadLastTimes();
}

function displayCountdown() {
  const hours = String(Math.floor(countdownSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(countdownSeconds % 60).padStart(2, '0');
  document.getElementById('countdown').textContent = `${hours}:${minutes}:${seconds}`;
}

// LocalStorage
function saveLastTime(key, seconds) {
  localStorage.setItem(key, seconds);
}

function loadLastTimes() {
  const lastStopwatch = localStorage.getItem('lastStopwatch');
  const lastCountdown = localStorage.getItem('lastCountdown');

  document.getElementById('lastStopwatch').textContent = lastStopwatch ? 
    `Último tempo: ${formatSeconds(lastStopwatch)}` : 'Último tempo: --:--:--';

  document.getElementById('lastCountdown').textContent = lastCountdown ? 
    `Última contagem: ${formatSeconds(lastCountdown)}` : 'Última contagem: --:--:--';
}

function formatSeconds(sec) {
  sec = parseInt(sec);
  const hours = String(Math.floor(sec / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const seconds = String(sec % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
