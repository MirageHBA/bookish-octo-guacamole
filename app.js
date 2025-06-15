const wordList = [
  { word: "serendipity", meaning: "Finding something good without looking for it" },
  { word: "ephemeral", meaning: "Lasting a very short time" },
  { word: "lucid", meaning: "Expressed clearly; easy to understand" },
  { word: "benevolent", meaning: "Well meaning and kindly" },
  { word: "elated", meaning: "Very happy or proud" },
  { word: "obscure", meaning: "Not discovered or known about" },
  { word: "resilient", meaning: "Able to recover quickly" },
  { word: "candid", meaning: "Truthful and straightforward" },
  { word: "vivid", meaning: "Producing powerful feelings or strong images" },
  { word: "nostalgia", meaning: "A sentimental longing for the past" },
  { word: "tangible", meaning: "Perceptible by touch" },
  { word: "arduous", meaning: "Involving a lot of effort" }
];

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const wordSection = document.getElementById("word-list");
const quizSection = document.getElementById("quiz-section");
const quizContainer = document.getElementById("quiz-container");
const progress = document.getElementById("progress");
const searchInput = document.getElementById("search-word");
const searchResult = document.getElementById("search-result");

function getStorage() {
  return JSON.parse(localStorage.getItem("dictionary-data") || "{}");
}

function setStorage(data) {
  localStorage.setItem("dictionary-data", JSON.stringify(data));
}

function getRandomWords() {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

function displayTodayWords(words) {
  wordSection.innerHTML = "";
  words.forEach(item => {
    const div = document.createElement("div");
    div.className = "word-item";
    div.innerHTML = `<strong>${item.word}</strong><br>${item.meaning}`;
    wordSection.appendChild(div);
  });
}

function displayQuiz(words) {
  quizSection.classList.remove("hidden");
  quizContainer.innerHTML = "";
  words.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "quiz-item";
    div.innerHTML = `
      <p><strong>${item.meaning}</strong></p>
      <input type="text" data-answer="${item.word}" placeholder="Your answer..." />
    `;
    quizContainer.appendChild(div);
  });
}

function updateProgress(data) {
  const dates = Object.keys(data);
  progress.innerHTML = `Answered Days: ${dates.filter(d => data[d].completed).length} / ${dates.length}`;
}

function searchWord(value) {
  const found = wordList.find(w => w.word.toLowerCase() === value.toLowerCase());
  if (found) {
    searchResult.innerHTML = `<strong>${found.word}</strong><br>${found.meaning}`;
  } else {
    searchResult.innerHTML = `Word not found.`;
  }
}

// Initial Load
const data = getStorage();

if (!data[today]) {
  const newWords = getRandomWords();
  data[today] = { words: newWords, completed: false };
  setStorage(data);
}

if (data[yesterday] && !data[yesterday].completed) {
  displayQuiz(data[yesterday].words);
} else {
  displayTodayWords(data[today].words);
}

updateProgress(data);

// Quiz Submission
const submitBtn = document.getElementById("submit-quiz");
submitBtn?.addEventListener("click", () => {
  const inputs = quizContainer.querySelectorAll("input");
  let correct = 0;
  inputs.forEach(input => {
    if (input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()) {
      correct++;
    }
  });

  if (correct >= 7) {
    data[yesterday].completed = true;
    setStorage(data);
    alert("✅ Quiz passed! Today's words are now unlocked.");
    location.reload();
  } else {
    alert("❌ Not enough correct answers. Try again.");
  }
});

// Search Feature
searchInput.addEventListener("input", e => {
  const value = e.target.value.trim();
  if (value.length > 1) {
    searchWord(value);
  } else {
    searchResult.innerHTML = "";
  }
});