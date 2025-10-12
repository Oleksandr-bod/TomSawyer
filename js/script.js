// Функція перемішування масиву (Фішера–Єйтса)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Ініціалізація змінних
let allWords = shuffleArray([...WORDS_A1_2]);
let currentSet = [];
let currentSetSize = 10;
let currentWordIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let wordVisible = true;
let roundCorrect = 0;
let roundWrong = 0;

// DOM елементи
const wordElement = document.getElementById("word");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const resultElement = document.getElementById("result");
const restartButton = document.getElementById("restart");
const showWordCheckbox = document.getElementById("showWordCheckbox");
const listenButton = document.getElementById("listenButton");
const autoSpeakCheckbox = document.getElementById("autoSpeakCheckbox");

// Озвучення
function speakWord(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

// Збереження прогресу
function saveProgress() {
  const progress = {
    allWords,
    currentSet,
    currentSetSize,
    currentWordIndex,
    correctAnswers,
    wrongAnswers,
    roundCorrect,
    roundWrong,
    wordVisible
  };
  localStorage.setItem("gameProgress", JSON.stringify(progress));
}

// Завантаження прогресу
function loadProgress() {
  const saved = localStorage.getItem("gameProgress");
  if (saved) {
    const p = JSON.parse(saved);
    allWords = p.allWords;
    currentSet = p.currentSet;
    currentSetSize = p.currentSetSize;
    currentWordIndex = p.currentWordIndex;
    correctAnswers = p.correctAnswers;
    wrongAnswers = p.wrongAnswers;
    roundCorrect = p.roundCorrect;
    roundWrong = p.roundWrong;
    wordVisible = p.wordVisible;

    scoreElement.textContent = `Правильних: ${correctAnswers} | Неправильних: ${wrongAnswers}`;
    showWordCheckbox.checked = wordVisible;
    showWord();
    return true;
  }
  return false;
}

// Почати новий раунд
function startRound() {
  if (allWords.length === 0) {
    endGame();
    return;
  }

  currentSet = allWords.slice(0, currentSetSize);
  currentSet = shuffleArray(currentSet);
  currentWordIndex = 0;
  roundCorrect = 0;
  roundWrong = 0;
  showWord();
}

// Показати слово
function showWord() {
  if (currentWordIndex >= currentSet.length) {
    endRound();
    return;
  }

  const currentWord = currentSet[currentWordIndex];
  wordElement.textContent = wordVisible ? currentWord.en : "*******";

  if (autoSpeakCheckbox.checked) speakWord(currentWord.en);

  let options = [currentWord.uk];
  let used = new Set([allWords.indexOf(currentWord)]);
  while (options.length < 4) {
    const i = Math.floor(Math.random() * allWords.length);
    if (!used.has(i)) {
      options.push(allWords[i].uk);
      used.add(i);
    }
  }

  options = shuffleArray(options);
  optionsElement.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => checkAnswer(option, currentWord.uk, btn));
    optionsElement.appendChild(btn);
  });

  saveProgress();
}

// Перевірка відповіді
function checkAnswer(selected, correct, btn) {
  const buttons = document.querySelectorAll(".option-btn");
  if (selected === correct) {
    btn.classList.add("correct");
    correctAnswers++;
    roundCorrect++;
  } else {
    btn.classList.add("wrong");
    wrongAnswers++;
    roundWrong++;
    buttons.forEach(b => {
      if (b.textContent === correct) b.classList.add("correct");
    });
  }

  scoreElement.textContent = `Правильних: ${correctAnswers} | Неправильних: ${wrongAnswers}`;
  currentWordIndex++;
  saveProgress();

  setTimeout(showWord, 1000);
}

// Кінець раунду
function endRound() {
  if (roundWrong === 0) {
    currentSetSize++;
    resultElement.textContent = `✅ Усі правильні! Додаємо +1 слово (${currentSetSize})`;
    allWords.splice(0, currentSetSize - 1);
  } else {
    resultElement.textContent = `🔁 Є помилки (${roundWrong}). Повторюємо ті ж слова.`;
  }

  saveProgress();
  setTimeout(startRound, 2000);
}

// 🎁 Кінець гри — показуємо абзац книги
function endGame() {
  wordElement.textContent = "🎉 Вітаємо! Ви переклали всі слова!";
  optionsElement.innerHTML = "";
  scoreElement.textContent = `✅ Ваш результат: ${correctAnswers} правильних, ${wrongAnswers} неправильних.`;

  const paragraph = `
  “You don’t know about me without you have read a book by the name of The Adventures of Tom Sawyer;
  but that ain’t no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly.
  There was things which he stretched, but mainly he told the truth. That is nothing.
  I never seen anybody but lied one time or another, without it was Aunt Polly, or the widow,
  or maybe Mary. Aunt Polly—Tom’s Aunt Polly, she is—and Mary, and the Widow Douglas is all told
  about in that book, which is mostly a true book, with some stretchers, as I said before.”`;

  resultElement.innerHTML = `
    <div class="gift-box">
      <h2>🎁 Подарунок:</h2>
      <p class="gift-text">${paragraph}</p>
    </div>
  `;

  // Озвучка абзацу
  speakWord("You don't know about me without you have read a book by the name of The Adventures of Tom Sawyer...");

  localStorage.removeItem("gameProgress");
}

// Обробники подій
showWordCheckbox.addEventListener("change", () => {
  wordVisible = showWordCheckbox.checked;
  const current = currentSet[currentWordIndex];
  if (current) wordElement.textContent = wordVisible ? current.en : "*******";
  saveProgress();
});

listenButton.addEventListener("click", () => {
  const current = currentSet[currentWordIndex];
  if (current) speakWord(current.en);
});

restartButton.addEventListener("click", () => {
  localStorage.removeItem("gameProgress");
  allWords = shuffleArray([...WORDS_A1_2]);
  currentSetSize = 10;
  correctAnswers = 0;
  wrongAnswers = 0;
  resultElement.textContent = "";
  scoreElement.textContent = "";
  startRound();
});

// Початкові значення
showWordCheckbox.checked = true;
wordVisible = true;

if (!loadProgress()) startRound();
