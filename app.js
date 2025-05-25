const questions = [
    { q: "Nabi pertama dalam Islam.", a: "A", options: ["Adam", "Idris", "Nuh"] },
    { q: "Nabi yang mampu berbicara dengan hewan.", a: "C", options: ["Saleh", "Syuaib", "Sulaiman"] },
    { q: "Nabi yang membangun bahtera karena banjir besar.", a: "B", options: ["Musa", "Nuh", "Harun"] },
    { q: "Nabi yang menerima wahyu Taurat.", a: "A", options: ["Musa", "Ishaq", "Lut"] },
    { q: "Nabi yang lahir tanpa ayah.", a: "C", options: ["Yunus", "Yahya", "Isa"] },
    { q: "Nabi yang selamat dari api Raja Namrud.", a: "B", options: ["Zulkifli", "Ibrahim", "Zakaria"] },
    { q: "Nabi yang dimakan ikan besar lalu selamat.", a: "A", options: ["Yunus", "Yusuf", "Yahya"] },
    { q: "Nabi yang dikenal dengan kesabarannya.", a: "C", options: ["Harun", "Ya'qub", "Ayyub"] },
    { q: "Nabi yang diangkat menjadi rasul terakhir.", a: "B", options: ["Zakaria", "Muhammad", "Ilyas"] },
    { q: "Nabi yang sangat tampan dan dijual sebagai budak.", a: "A", options: ["Yusuf", "Harun", "Dawud"] },
    { q: "Nabi yang menjadi saudara Musa dan membantunya.", a: "C", options: ["Yunus", "Nuh", "Harun"] },
    { q: "Nabi yang membangun Ka'bah bersama ayahnya.", a: "B", options: ["Yusuf", "Ismail", "Isa"] },
    { q: "Nabi yang merupakan anak dari Ibrahim.", a: "A", options: ["Ismail", "Ya'qub", "Yunus"] },
    { q: "Nabi yang wafat muda dan dibangkitkan kembali.", a: "C", options: ["Idris", "Nuh", "Isa"] },
    { q: "Nabi yang memiliki mukjizat tangan bercahaya.", a: "B", options: ["Isa", "Musa", "Muhammad"] },
    { q: "Nabi yang diutus kepada kaum Sodom.", a: "A", options: ["Lut", "Ishaq", "Harun"] },
    { q: "Nabi yang dikenal sebagai manusia pertama.", a: "C", options: ["Nuh", "Ibrahim", "Adam"] },
    { q: "Nabi yang wafat dengan keadaan syahid dibunuh kaumnya.", a: "B", options: ["Zulkifli", "Zakaria", "Yahya"] },
    { q: "Nabi yang diberikan kitab Zabur.", a: "A", options: ["Dawud", "Isa", "Musa"] },
    { q: "Nabi yang dikenal sebagai nabi yang rajin menulis.", a: "C", options: ["Ishaq", "Yunus", "Idris"] },
  ];

  const home = document.getElementById("home");
  const startBtn = document.getElementById("startBtn");
  const playerNameInput = document.getElementById("playerName");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const leaderboardList = document.getElementById("leaderboardList");

  const quiz = document.getElementById("quiz");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const timerEl = document.getElementById("timer");
  const scorePerQuestionEl = document.getElementById("scorePerQuestion");
  const result = document.getElementById("result");

  let playerName = "";
  let score = 0;
  let currentQuestion = 0;
  let timer;
  let timeLeft = 20;
  let questionsPool = [];

  const correctSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
  const wrongSound = new Audio('https://actions.google.com/sounds/v1/cartoon/boing.ogg');

  playerNameInput.addEventListener("input", () => {
    startBtn.disabled = playerNameInput.value.trim() === "";
  });

  function shuffle(array) {
    for(let i = array.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  startBtn.onclick = () => {
    playerName = playerNameInput.value.trim();
    score = 0;
    currentQuestion = 0;
    questionsPool = shuffle([...questions]).slice(0, 10);
    home.style.display = "none";
    leaderboardList.style.display = "none";
    quiz.style.display = "block";
    result.style.display = "none";
    scorePerQuestionEl.textContent = "";
    nextQuestion();
  };

  leaderboardBtn.onclick = () => {
    showLeaderboard();
    leaderboardList.style.display = leaderboardList.style.display === "none" ? "block" : "none";
  };

  function nextQuestion() {
    optionsEl.innerHTML = "";
    scorePerQuestionEl.textContent = "";
    timerEl.classList.remove("blink");
    timeLeft = 20;
    timerEl.textContent = timeLeft;

    if(currentQuestion >= questionsPool.length) {
      endQuiz();
      return;
    }

    const q = questionsPool[currentQuestion];
    questionEl.textContent = `Pertanyaan ${currentQuestion + 1}: ${q.q}`;
    ['A', 'B', 'C'].forEach((label, idx) => {
      const opt = document.createElement('div');
      opt.className = 'option';
      opt.textContent = `${label}. ${q.options[idx]}`;
      opt.dataset.label = label;
      opt.onclick = () => selectAnswer(label);
      optionsEl.appendChild(opt);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if(timeLeft <= 5) {
        timerEl.classList.add("blink");
      } else {
        timerEl.classList.remove("blink");
      }
      if(timeLeft <= 0) {
        clearInterval(timer);
        selectAnswer(null); // timeout = salah
      }
    }, 1000);
  }

  function selectAnswer(selected) {
    clearInterval(timer);
    const q = questionsPool[currentQuestion];
    const correct = q.a;
    const optionsDivs = optionsEl.querySelectorAll('.option');

    // Disable all options after answer
    optionsDivs.forEach(opt => opt.classList.add('disabled'));

    let deltaScore = 0;

    if(selected === correct) {
      deltaScore = 10;
      correctSound.play();
    } else {
      deltaScore = +5;
      wrongSound.play();
    }
    score += deltaScore;

    // Highlight correct and wrong
    optionsDivs.forEach(opt => {
      if(opt.dataset.label === correct) {
        opt.style.backgroundColor = '#9AE6B4'; // hijau muda
      } else if(opt.dataset.label === selected) {
        opt.style.backgroundColor = '#FEB2B2'; // merah muda
      }
    });

    // Tampilkan skor per soal
    scorePerQuestionEl.textContent = (deltaScore > 0 ? `+${deltaScore}` : deltaScore) + " poin";

    // Tampilkan skor total di bawah soal juga
    setTimeout(() => {
      currentQuestion++;
      nextQuestion();
    }, 2000);
  }

  function endQuiz() {
    quiz.style.display = "none";
    scorePerQuestionEl.textContent = "";
    let colorClass = '';
    let motivationText = '';
    if(score >= 80) {
      colorClass = 'green';
      motivationText = 'Luar biasa! Teruskan semangat belajarmu!';
    } else if(score >= 55) {
      colorClass = 'yellow';
      motivationText = 'Bagus! Sedikit lagi kamu bisa lebih hebat!';
    } else {
      colorClass = 'red';
      motivationText = 'Jangan menyerah! Belajar adalah proses.';
    }

    result.innerHTML = `
      <h2>Hasil Quiz</h2>
      <p>Nama: <strong>${playerName}</strong></p>
      <p>Skor Akhir: <strong class="${colorClass}">${score}</strong></p>
      <p style="text-align:center; font-style:italic; margin: 10px 0;">${motivationText}</p>
      <button id="retryBtn">Main Lagi</button>
      <button id="toHomeBtn">Kembali ke Beranda</button>
    `;
    result.style.display = "block";

    saveScore(playerName, score);

    document.getElementById('retryBtn').onclick = () => {
      result.style.display = "none";
      score = 0;
      currentQuestion = 0;
      questionsPool = shuffle([...questions]).slice(0, 10);
      quiz.style.display = "block";
      nextQuestion();
    };
    document.getElementById('toHomeBtn').onclick = () => {
      result.style.display = "none";
      home.style.display = "block";
      playerNameInput.value = "";
      startBtn.disabled = true;
    };
  }

  function saveScore(name, score) {
    if (!name) return;
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ name, score });
    leaderboard.sort((a,b) => b.score - a.score);
    if(leaderboard.length > 5) leaderboard.length = 5;
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }

  function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboardList.innerHTML = '';
    if(leaderboard.length === 0) {
      leaderboardList.innerHTML = '<li>Belum ada skor tersimpan.</li>';
      return;
    }
    leaderboard.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.score} poin`;
      leaderboardList.appendChild(li);
    });
  }
