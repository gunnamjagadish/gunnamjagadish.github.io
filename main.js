const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
const numbersPerPage = 50;
let currentPage = 1;
const totalPages = Math.ceil(numbers.length / numbersPerPage);

const container = document.getElementById('numbers-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

const sounds = {};
let currentSound = null;

const leftEyePupil = document.getElementById('left-eye-pupil');
const rightEyePupil = document.getElementById('right-eye-pupil');
const mouth = document.getElementById('mouth');

// Preload sounds for all numbers
numbers.forEach(num => {
  sounds[num] = new Howl({
    src: [`assets/audio/${num}.mp3`],
    volume: 1.0,
    onplay: () => {
      animateBearFace(true);
    },
    onend: () => {
      animateBearFace(false);
    },
    onstop: () => {
      animateBearFace(false);
    }
  });
});

// Render buttons for current page
function renderPage(page) {
  container.innerHTML = '';  // Clear existing buttons

  const startIdx = (page - 1) * numbersPerPage;
  const endIdx = Math.min(startIdx + numbersPerPage, numbers.length);

  for (let i = startIdx; i < endIdx; i++) {
    const num = numbers[i];
    const btn = document.createElement('button');
    btn.className = 'number-btn';
    btn.setAttribute('aria-label', 'Number ' + num);
    btn.textContent = num;
    btn.setAttribute('role', 'listitem');
    btn.onclick = () => playNumberSound(num);
    container.appendChild(btn);
  }

  // Update buttons states and page info text
  pageInfo.textContent = `Page ${page} of ${totalPages}`;
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === totalPages;
}

// Animate bear face: mouth moves and eyes blink when playing
function animateBearFace(isPlaying) {
  if (isPlaying) {
    mouth.classList.add('mouth-move');
    leftEyePupil.classList.add('eye-blink');
    rightEyePupil.classList.add('eye-blink');
  } else {
    mouth.classList.remove('mouth-move');
    leftEyePupil.classList.remove('eye-blink');
    rightEyePupil.classList.remove('eye-blink');
  }
}

// Play selected number sound
function playNumberSound(num) {
  if (currentSound && currentSound.playing()) {
    currentSound.stop();
  }
  currentSound = sounds[num];
  if (currentSound) {
    currentSound.play();
  }
}

// Hook up pagination buttons
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Initial render
renderPage(currentPage);
