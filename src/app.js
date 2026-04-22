const datasetDefinitions = [
  {
    id: "base",
    label: "Quiz base",
    path: "data/quizzes/base.json",
    type: "base_like",
  },
  {
    id: "vela",
    label: "Quiz vela",
    path: "data/quizzes/vela.json",
    type: "vela",
  },
  {
    id: "elementi",
    label: "Elementi di carteggio",
    path: "data/quizzes/ELENCO QUIZ SU ELEMENTI DI CARTEGGIO.json",
    type: "carteggio_items",
  },
  {
    id: "carteggio",
    label: "Carteggio senza limiti",
    path: [
      "data/quizzes/ELENCO PROVE CARTEGGIO.json",
      "data/quizzes/ELENCO PROVE CARTEGGI1.json",
    ],
    type: "carteggio_items",
  },
];

const examModes = [
  {
    id: "exam_entro12_motore",
    type: "exam",
    label: "Esame entro 12M • Motore",
    description: "Quiz elementi di carteggio: 5 quesiti (min 4/5, 20 min) + Quiz base: 20 quesiti (min 16/20, 30 min).",
    sections: [
      { id: "elementi", label: "Quiz elementi di carteggio", datasetId: "elementi", pickQuestions: 1, minCorrect: 4 },
      { id: "base", label: "Quiz base", datasetId: "base", pickQuestions: 20, minCorrect: 16 },
    ],
  },
  {
    id: "exam_entro12_vela",
    type: "exam",
    label: "Esame entro 12M • Motore + Vela",
    description: "Quiz elementi di carteggio 5 quesiti (min 4/5, 20 min) + Quiz base 20 (min 16/20, 30 min) + Quiz vela 5 (min 4/5, 15 min).",
    sections: [
      { id: "elementi", label: "Quiz elementi di carteggio", datasetId: "elementi", pickQuestions: 1, minCorrect: 4 },
      { id: "base", label: "Quiz base", datasetId: "base", pickQuestions: 20, minCorrect: 16 },
      { id: "vela", label: "Quiz vela", datasetId: "vela", pickQuestions: 5, minCorrect: 4 },
    ],
  },
  {
    id: "exam_senzalimiti_motore_prima",
    type: "exam",
    label: "Esame senza limiti • Motore (prima patente)",
    description: "Prova di carteggio: 4 quesiti indipendenti (min 3/4, 60 min) + Quiz base 20 (min 16/20, 30 min).",
    sections: [
      { id: "carteggio", label: "Prova di carteggio", datasetId: "carteggio", pickQuestions: 4, minCorrect: 3 },
      { id: "base", label: "Quiz base", datasetId: "base", pickQuestions: 20, minCorrect: 16 },
    ],
  },
  {
    id: "exam_senzalimiti_vela_prima",
    type: "exam",
    label: "Esame senza limiti • Motore + Vela (prima patente)",
    description: "Prova di carteggio 4 quesiti (min 3/4, 60 min) + Quiz base 20 (min 16/20, 30 min) + Quiz vela 5 (min 4/5, 15 min).",
    sections: [
      { id: "carteggio", label: "Prova di carteggio", datasetId: "carteggio", pickQuestions: 4, minCorrect: 3 },
      { id: "base", label: "Quiz base", datasetId: "base", pickQuestions: 20, minCorrect: 16 },
      { id: "vela", label: "Quiz vela", datasetId: "vela", pickQuestions: 5, minCorrect: 4 },
    ],
  },
  {
    id: "exam_integrazione_senzalimiti_motore",
    type: "exam",
    label: "Integrazione senza limiti • Motore (da entro 12M motore)",
    description: "Solo prova di carteggio: 4 quesiti indipendenti, minimo 3 esatti (60 min).",
    sections: [
      { id: "carteggio", label: "Prova di carteggio", datasetId: "carteggio", pickQuestions: 4, minCorrect: 3 },
    ],
  },
  {
    id: "exam_integrazione_senzalimiti_vela",
    type: "exam",
    label: "Integrazione senza limiti • Motore + Vela (da entro 12M motore+vela)",
    description: "Solo prova di carteggio: 4 quesiti indipendenti, minimo 3 esatti (60 min).",
    sections: [
      { id: "carteggio", label: "Prova di carteggio", datasetId: "carteggio", pickQuestions: 4, minCorrect: 3 },
    ],
  },
  {
    id: "exam_integrazione_vela_entro12",
    type: "exam",
    label: "Estensione vela • entro 12M (da motore)",
    description: "Solo Quiz vela: 5 quesiti a risposta singola, minimo 4 esatti (15 min).",
    sections: [
      { id: "vela", label: "Quiz vela", datasetId: "vela", pickQuestions: 5, minCorrect: 4 },
    ],
  },
  {
    id: "exam_integrazione_vela_senzalimiti",
    type: "exam",
    label: "Estensione vela • senza limiti (da motore)",
    description: "Solo Quiz vela: 5 quesiti a risposta singola, minimo 4 esatti (15 min).",
    sections: [
      { id: "vela", label: "Quiz vela", datasetId: "vela", pickQuestions: 5, minCorrect: 4 },
    ],
  },
];

const primaryModes = [
  {
    id: "exam",
    label: "Esami e integrazioni",
    description: "Scegli il profilo ufficiale di esame/integrazione e simula con soglie reali.",
  },
  {
    id: "infinite",
    label: "Quiz infinito personalizzato",
    description: "Selezioni le liste e continui senza limite di domande.",
  },
  {
    id: "wrongest",
    label: "Domande più sbagliate",
    description: "Allenamento focalizzato sulle domande con più errori storici registrati.",
  },
];

const THEME_KEY = "nautica-theme";
const PROGRESS_KEY = "nautica-progress-v1";
const MAX_STORED_RESPONSES = 8000;

const state = {
  loaded: false,
  selectedPrimaryId: "exam",
  selectedExamModeId: examModes[0].id,
  selectedDatasetIds: new Set(["base", "vela"]),
  session: null,
  cursor: 0,
  examFinalized: false,
  lastRenderedQuestionUid: null,
  progress: loadProgress(),
};

const refs = {
  root: document.documentElement,
  themeToggle: document.getElementById("theme-toggle"),
  themeLabel: document.getElementById("theme-label"),
  openRankingBtn: document.getElementById("open-ranking-btn"),
  rankingModal: document.getElementById("ranking-modal"),
  closeRankingBtn: document.getElementById("close-ranking-btn"),
  rankingSummary: document.getElementById("ranking-summary"),
  rankingList: document.getElementById("ranking-list"),
  openSupportBtn: document.getElementById("open-support-btn"),
  supportModal: document.getElementById("support-modal"),
  closeSupportBtn: document.getElementById("close-support-btn"),
  resetMemoryBtn: document.getElementById("reset-memory-btn"),
  setupView: document.getElementById("setup-view"),
  quizView: document.getElementById("quiz-view"),
  modeDescription: document.getElementById("mode-description"),
  primaryList: document.getElementById("primary-list"),
  examConfig: document.getElementById("exam-config"),
  examModeList: document.getElementById("exam-mode-list"),
  customConfig: document.getElementById("custom-config"),
  customTitle: document.getElementById("custom-title"),
  customHelp: document.getElementById("custom-help"),
  datasetChips: document.getElementById("dataset-chips"),
  startBtn: document.getElementById("start-btn"),
  resetBtn: document.getElementById("reset-btn"),
  loadNotice: document.getElementById("load-notice"),
  backToSetupBtn: document.getElementById("back-to-setup-btn"),
  activeMode: document.getElementById("active-mode"),
  progressPill: document.getElementById("progress-pill"),
  sectionStatus: document.getElementById("section-status"),
  examResult: document.getElementById("exam-result"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong"),
  answered: document.getElementById("answered"),
  questionSource: document.getElementById("question-source"),
  questionScroll: document.getElementById("question-scroll"),
  scrollHint: document.getElementById("scroll-hint"),
  questionText: document.getElementById("question-text"),
  toggleExplanationBtn: document.getElementById("toggle-explanation-btn"),
  questionImageWrap: document.getElementById("question-image-wrap"),
  questionImage: document.getElementById("question-image"),
  answers: document.getElementById("answers"),
  questionExplanation: document.getElementById("question-explanation"),
  openActions: document.getElementById("open-actions"),
  showSolutionBtn: document.getElementById("show-solution-btn"),
  solution: document.getElementById("solution"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  submitExamBtn: document.getElementById("submit-exam-btn"),
};

init();

function init() {
  initTheme();
  bindEvents();
  renderPrimaryModes();
  renderExamModes();
  renderDatasetChips();
  syncSetupPanels();
  renderRankingBoard();
  showSetupView();
  void loadAllDatasets();
}

function bindEvents() {
  refs.themeToggle.addEventListener("click", toggleTheme);
  refs.openRankingBtn.addEventListener("click", openRankingModal);
  refs.closeRankingBtn.addEventListener("click", closeRankingModal);
  refs.openSupportBtn.addEventListener("click", openSupportModal);
  refs.closeSupportBtn.addEventListener("click", closeSupportModal);
  refs.rankingModal.addEventListener("click", (event) => {
    if (event.target === refs.rankingModal) {
      closeRankingModal();
    }
  });
  refs.supportModal.addEventListener("click", (event) => {
    if (event.target === refs.supportModal) {
      closeSupportModal();
    }
  });
  refs.resetMemoryBtn.addEventListener("click", resetStoredProgress);
  refs.startBtn.addEventListener("click", startSession);
  refs.resetBtn.addEventListener("click", resetSelections);
  refs.backToSetupBtn.addEventListener("click", showSetupView);
  refs.prevBtn.addEventListener("click", goPrev);
  refs.nextBtn.addEventListener("click", goNext);
  refs.toggleExplanationBtn.addEventListener("click", toggleExplanation);
  refs.questionScroll.addEventListener("scroll", updateScrollHint);
  window.addEventListener("resize", updateScrollHint);
  refs.showSolutionBtn.addEventListener("click", revealSolution);
  refs.submitExamBtn.addEventListener("click", finalizeExam);
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(event) {
  if (!refs.supportModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSupportModal();
    }
    return;
  }

  if (!refs.rankingModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeRankingModal();
    }
    return;
  }

  if (refs.quizView.classList.contains("hidden")) {
    return;
  }

  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  const tagName = document.activeElement?.tagName || "";
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrev();
    return;
  }

  if (event.key === "ArrowRight" || event.key === "Enter") {
    event.preventDefault();
    handleAdvanceShortcut();
    return;
  }

  if (event.key.toLowerCase() === "e") {
    event.preventDefault();
    toggleExplanation();
    return;
  }

  if (event.key.toLowerCase() === "s") {
    event.preventDefault();
    revealSolution();
    return;
  }

  if (/^[1-9]$/.test(event.key)) {
    event.preventDefault();
    handleNumericShortcut(Number(event.key));
  }
}

function handleAdvanceShortcut() {
  if (!state.session) {
    return;
  }

  const isLast = state.cursor === state.session.questions.length - 1;
  if (state.session.mode.type === "exam" && isLast && !state.examFinalized) {
    finalizeExam();
    return;
  }

  goNext();
}

function handleNumericShortcut(numberKey) {
  if (!state.session) {
    return;
  }

  const question = state.session.questions[state.cursor];
  const qState = state.session.questionStates[state.cursor];
  if (!question || !qState) {
    return;
  }

  if (question.kind === "choice") {
    const answerIndex = numberKey - 1;
    if (answerIndex < 0 || answerIndex >= question.answers.length) {
      return;
    }
    selectChoiceAnswer(question, qState, question.answers[answerIndex], state.session.mode.type);
    return;
  }

  if (!qState.solutionShown) {
    if (numberKey === 1) {
      revealSolution();
    }
    return;
  }

  if (state.examFinalized) {
    return;
  }

  if (numberKey === 1 || numberKey === 2) {
    const nextPartIndex = qState.partMarks.findIndex((mark) => mark === null);
    if (nextPartIndex !== -1) {
      setOpenPartMark(question, qState, nextPartIndex, numberKey === 1);
    }
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === "dark" ? "dark" : "light");
}

function toggleTheme() {
  const next = refs.root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
}

function applyTheme(theme) {
  refs.root.dataset.theme = theme;
  refs.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  refs.themeLabel.textContent = theme === "dark" ? "Tema chiaro" : "Tema scuro";
  localStorage.setItem(THEME_KEY, theme);
}

function openRankingModal() {
  closeSupportModal();
  renderRankingBoard();
  refs.rankingModal.classList.remove("hidden");
}

function closeRankingModal() {
  refs.rankingModal.classList.add("hidden");
}

function openSupportModal() {
  closeRankingModal();
  refs.supportModal.classList.remove("hidden");
}

function closeSupportModal() {
  refs.supportModal.classList.add("hidden");
}

function renderRankingBoard() {
  const statsEntries = Object.entries(state.progress.questionStats || {});
  const ranked = statsEntries
    .map(([originKey, stat]) => {
      const attempts = Number(stat.attempts || 0);
      const wrong = Number(stat.wrong || 0);
      const ratio = attempts > 0 ? wrong / attempts : 0;
      return {
        originKey,
        datasetId: stat.datasetId || "",
        sourceLabel: stat.sourceLabel || "",
        text: stat.text || originKey,
        attempts,
        wrong,
        ratio,
      };
    })
    .filter((item) => item.wrong > 0)
    .sort((a, b) => {
      if (b.wrong !== a.wrong) {
        return b.wrong - a.wrong;
      }
      if (b.ratio !== a.ratio) {
        return b.ratio - a.ratio;
      }
      return b.attempts - a.attempts;
    });

  refs.rankingList.innerHTML = "";

  if (ranked.length === 0) {
    refs.rankingSummary.textContent = "Ancora nessun errore registrato.";
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "La classifica comparirà quando inizierai a rispondere ai quiz.";
    refs.rankingList.append(empty);
    return;
  }

  refs.rankingSummary.textContent = `Top ${Math.min(20, ranked.length)} su ${ranked.length} domande con errori registrati.`;

  const top = ranked.slice(0, 20);
  for (let i = 0; i < top.length; i += 1) {
    const item = top[i];
    const row = document.createElement("article");
    row.className = "ranking-item";

    const title = document.createElement("h4");
    title.textContent = `${i + 1}. ${item.sourceLabel || item.datasetId} · errori ${item.wrong} / tentativi ${item.attempts}`;

    const text = document.createElement("p");
    text.textContent = truncateText(item.text, 220);

    row.append(title, text);
    refs.rankingList.append(row);
  }
}

function truncateText(value, max) {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max).trim()}...`;
}

function getExamModeById(id) {
  return examModes.find((mode) => mode.id === id) || examModes[0];
}

function getDatasetById(id) {
  return datasetDefinitions.find((dataset) => dataset.id === id);
}

function renderPrimaryModes() {
  refs.primaryList.innerHTML = "";

  for (const mode of primaryModes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mode-card";
    if (mode.id === state.selectedPrimaryId) {
      button.classList.add("active");
    }

    const title = document.createElement("strong");
    title.textContent = mode.label;
    const desc = document.createElement("span");
    desc.textContent = mode.description;

    button.append(title, desc);
    button.addEventListener("click", () => {
      state.selectedPrimaryId = mode.id;
      renderPrimaryModes();
      syncSetupPanels();
    });

    refs.primaryList.append(button);
  }
}

function renderExamModes() {
  refs.examModeList.innerHTML = "";

  for (const mode of examModes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mode-card";

    if (mode.id === state.selectedExamModeId) {
      button.classList.add("active");
    }

    const title = document.createElement("strong");
    title.textContent = mode.label;
    const desc = document.createElement("span");
    desc.textContent = mode.description;

    button.append(title, desc);
    button.addEventListener("click", () => {
      state.selectedExamModeId = mode.id;
      renderExamModes();
      syncSetupPanels();
    });

    refs.examModeList.append(button);
  }
}

function renderDatasetChips() {
  refs.datasetChips.innerHTML = "";

  for (const dataset of datasetDefinitions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dataset-chip";

    if (state.selectedDatasetIds.has(dataset.id)) {
      button.classList.add("active");
    }

    const count = Array.isArray(dataset.questions) ? dataset.questions.length : 0;
    const suffix = state.loaded ? `${count}` : "...";
    button.innerHTML = `${dataset.label} <small>(${suffix})</small>`;

    button.addEventListener("click", () => {
      if (state.selectedDatasetIds.has(dataset.id)) {
        if (state.selectedDatasetIds.size === 1) {
          return;
        }
        state.selectedDatasetIds.delete(dataset.id);
      } else {
        state.selectedDatasetIds.add(dataset.id);
      }
      renderDatasetChips();
    });

    refs.datasetChips.append(button);
  }
}

function syncSetupPanels() {
  const primary = primaryModes.find((mode) => mode.id === state.selectedPrimaryId) || primaryModes[0];

  if (state.selectedPrimaryId === "exam") {
    const examMode = getExamModeById(state.selectedExamModeId);
    refs.modeDescription.textContent = `${primary.description} Modalità attiva: ${examMode.label}. Riferimento: DM 323/2021, art. 6 (risposta omessa = errata).`;
    refs.examConfig.classList.remove("hidden");
    refs.customConfig.classList.add("hidden");
    refs.startBtn.textContent = "Avvia simulazione esame";
    return;
  }

  refs.examConfig.classList.add("hidden");
  refs.customConfig.classList.remove("hidden");

  if (state.selectedPrimaryId === "infinite") {
    refs.modeDescription.textContent = primary.description;
    refs.customTitle.textContent = "2) Liste del quiz infinito";
    refs.customHelp.textContent = "Seleziona da quali elenchi prendere le domande. Potrai continuare all'infinito.";
    refs.startBtn.textContent = "Avvia quiz infinito";
    return;
  }

  const wrongStats = getWrongStatsSummary();
  refs.modeDescription.textContent = primary.description;
  refs.customTitle.textContent = "2) Liste per domande più sbagliate";
  refs.customHelp.textContent = `Domande con errori registrati: ${wrongStats.questionsWithErrors}. Risposte salvate: ${wrongStats.totalResponses}.`;
  refs.startBtn.textContent = "Avvia domande più sbagliate";
}

function showSetupView() {
  refs.setupView.classList.remove("hidden");
  refs.quizView.classList.add("hidden");
}

function showQuizView() {
  refs.setupView.classList.add("hidden");
  refs.quizView.classList.remove("hidden");
}

async function loadAllDatasets() {
  refs.loadNotice.textContent = "Carico i dataset...";

  try {
    for (const dataset of datasetDefinitions) {
      const files = Array.isArray(dataset.path) ? dataset.path : [dataset.path];
      const chunks = [];

      for (const filePath of files) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Impossibile leggere ${filePath}`);
        }
        chunks.push(await response.json());
      }

      dataset.questions = normalizeDataset(dataset, chunks);
    }

    state.loaded = true;
    renderDatasetChips();
    syncSetupPanels();
    refs.loadNotice.textContent = "Dataset pronti.";
  } catch (error) {
    console.error(error);
    refs.loadNotice.textContent = "Errore nel caricamento. Avvia da server locale: python3 -m http.server";
  }
}

function normalizeDataset(dataset, chunks) {
  const questions = [];

  if (dataset.type === "base_like") {
    for (const item of chunks[0]) {
      const originKey = `${dataset.id}-${item.id}`;
      const answers = (item.risposte || []).map((answer, index) => ({
        id: `${originKey}-a${index}`,
        text: cleanText(answer.testo),
        correct: Boolean(answer.corretta),
      }));

      const correctAnswer = answers.find((answer) => answer.correct);

      questions.push({
        uid: originKey,
        originKey,
        datasetId: dataset.id,
        sourceLabel: dataset.label,
        kind: "choice",
        text: cleanText(item.domanda),
        spiegazione: cleanText(item.spiegazione || ""),
        image: resolveImage(item.immagine),
        answers,
        correctAnswerId: correctAnswer ? correctAnswer.id : null,
      });
    }
  }

  if (dataset.type === "vela") {
    for (const item of chunks[0]) {
      const originKey = `${dataset.id}-${item.id}`;
      const answerKeys = Object.keys(item).filter((key) => key.startsWith("risposta"));
      const answers = answerKeys.map((key, index) => ({
        id: `${originKey}-a${index}`,
        text: cleanText(item[key].testo),
        correct: Boolean(item[key].corretta),
      }));

      const correctAnswer = answers.find((answer) => answer.correct);

      questions.push({
        uid: originKey,
        originKey,
        datasetId: dataset.id,
        sourceLabel: dataset.label,
        kind: "choice",
        text: cleanText(item.domanda),
        spiegazione: cleanText(item.spiegazione || ""),
        image: resolveImage(item.immagine),
        answers,
        correctAnswerId: correctAnswer ? correctAnswer.id : null,
      });
    }
  }

  if (dataset.type === "carteggio_items") {
    for (const chunk of chunks) {
      const items = Array.isArray(chunk.items) ? chunk.items : [];

      for (const item of items) {
        const originKey = `${dataset.id}-${chunk.source_file || "items"}-${item.id}`;
        const rawParts = Array.isArray(item.risposte)
          ? item.risposte
          : item.risposta
            ? [item.risposta]
            : [];

        const solutionParts = rawParts
          .map((part) => cleanText(String(part)))
          .filter(Boolean);

        questions.push({
          uid: originKey,
          originKey,
          datasetId: dataset.id,
          sourceLabel: dataset.label,
          kind: "open",
          text: cleanText(item.domanda),
          spiegazione: cleanText(item.spiegazione || ""),
          image: null,
          solutionParts,
        });
      }
    }
  }

  return questions.filter((question) => question.text);
}

function resolveImage(images) {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }
  const first = images[0];
  if (typeof first.path !== "string") {
    return null;
  }

  if (first.path.startsWith("immagini_base/")) {
    return first.path.replace("immagini_base/", "data/images/base/");
  }

  if (first.path.startsWith("immagini_vela/")) {
    return first.path.replace("immagini_vela/", "data/images/vela/");
  }

  return first.path;
}

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function startSession() {
  if (!state.loaded) {
    refs.loadNotice.textContent = "Attendi il caricamento dei dataset.";
    return;
  }

  try {
    if (state.selectedPrimaryId === "exam") {
      const mode = getExamModeById(state.selectedExamModeId);
      state.session = buildExamSession(mode);
    } else if (state.selectedPrimaryId === "infinite") {
      state.session = buildInfiniteSession();
    } else {
      state.session = buildWrongestSession();
    }
  } catch (error) {
    refs.loadNotice.textContent = error instanceof Error ? error.message : "Impossibile avviare la sessione.";
    return;
  }

  state.cursor = 0;
  state.examFinalized = false;
  state.lastRenderedQuestionUid = null;
  showQuizView();
  renderQuiz();
}

function buildExamSession(mode) {
  const questions = [];

  for (const section of mode.sections) {
    const dataset = getDatasetById(section.datasetId);
    if (!dataset || !Array.isArray(dataset.questions) || dataset.questions.length === 0) {
      throw new Error(`Dataset non disponibile: ${section.label}`);
    }

    const selected = pickRandomItems(dataset.questions, section.pickQuestions);
    for (const question of selected) {
      questions.push(cloneForSession(question, section.id, section.label));
    }
  }

  return {
    mode,
    questions,
    questionStates: questions.map((question) => createQuestionState(question)),
    infinitePool: null,
  };
}

function buildInfiniteSession() {
  const pool = buildPoolFromSelectedDatasets();
  if (pool.length === 0) {
    throw new Error("Seleziona almeno una lista con domande disponibili.");
  }

  const firstQuestion = cloneForSession(randomFrom(pool), "infinite", "Quiz infinito");

  return {
    mode: {
      id: "infinite_custom",
      type: "infinite",
      label: "Quiz infinito personalizzato",
      sections: [],
    },
    questions: [firstQuestion],
    questionStates: [createQuestionState(firstQuestion)],
    infinitePool: pool,
  };
}

function buildWrongestSession() {
  const pool = buildPoolFromSelectedDatasets();
  if (pool.length === 0) {
    throw new Error("Seleziona almeno una lista con domande disponibili.");
  }

  const ranked = [...pool].sort((a, b) => {
    const sa = state.progress.questionStats[a.originKey] || { wrong: 0, attempts: 0 };
    const sb = state.progress.questionStats[b.originKey] || { wrong: 0, attempts: 0 };

    if (sb.wrong !== sa.wrong) {
      return sb.wrong - sa.wrong;
    }

    const ra = sa.attempts > 0 ? sa.wrong / sa.attempts : 0;
    const rb = sb.attempts > 0 ? sb.wrong / sb.attempts : 0;

    if (rb !== ra) {
      return rb - ra;
    }

    return (sb.attempts || 0) - (sa.attempts || 0);
  });

  const onlyWrong = ranked.filter((question) => {
    const stats = state.progress.questionStats[question.originKey];
    return stats && stats.wrong > 0;
  });

  const wrongPool = onlyWrong.length > 0 ? onlyWrong : ranked;
  const focusPool = wrongPool.slice(0, Math.min(400, wrongPool.length));

  const firstQuestion = cloneForSession(randomFrom(focusPool), "wrongest", "Domande più sbagliate");

  return {
    mode: {
      id: "wrongest_custom",
      type: "wrongest",
      label: "Domande più sbagliate",
      sections: [],
    },
    questions: [firstQuestion],
    questionStates: [createQuestionState(firstQuestion)],
    infinitePool: focusPool,
  };
}

function buildPoolFromSelectedDatasets() {
  const datasets = datasetDefinitions.filter((dataset) => state.selectedDatasetIds.has(dataset.id));
  return datasets.flatMap((dataset) => dataset.questions || []);
}

function cloneForSession(question, sectionId, sectionLabel) {
  if (question.kind === "choice") {
    return {
      uid: `${question.originKey}-${cryptoRandomId()}`,
      originKey: question.originKey,
      kind: "choice",
      sectionId,
      sectionLabel,
      sourceLabel: question.sourceLabel,
      datasetId: question.datasetId,
      text: question.text,
      spiegazione: question.spiegazione || "",
      image: question.image,
      answers: shuffle([...question.answers]),
      correctAnswerId: question.correctAnswerId,
    };
  }

  const parts = Array.isArray(question.solutionParts) && question.solutionParts.length > 0
    ? [...question.solutionParts]
    : ["Soluzione non disponibile"];

  return {
    uid: `${question.originKey}-${cryptoRandomId()}`,
    originKey: question.originKey,
    kind: "open",
    sectionId,
    sectionLabel,
    sourceLabel: question.sourceLabel,
    datasetId: question.datasetId,
    text: question.text,
    spiegazione: question.spiegazione || "",
    image: question.image,
    solutionParts: parts,
  };
}

function createQuestionState(question) {
  if (question.kind === "choice") {
    return {
      explanationShown: false,
      selectedAnswerId: null,
      recorded: false,
    };
  }

  return {
    explanationShown: false,
    solutionShown: false,
    partMarks: Array(question.solutionParts.length).fill(null),
    recordedParts: Array(question.solutionParts.length).fill(false),
  };
}

function resetSelections() {
  state.selectedPrimaryId = "exam";
  state.selectedExamModeId = examModes[0].id;
  state.selectedDatasetIds = new Set(["base", "vela"]);
  state.session = null;
  state.cursor = 0;
  state.examFinalized = false;
  state.lastRenderedQuestionUid = null;

  renderPrimaryModes();
  renderExamModes();
  renderDatasetChips();
  syncSetupPanels();

  refs.loadNotice.textContent = "Selezione ripristinata.";
}

function renderQuiz() {
  if (!state.session) {
    return;
  }

  const { mode, questions, questionStates } = state.session;
  const question = questions[state.cursor];
  const qState = questionStates[state.cursor];
  const isNewQuestion = state.lastRenderedQuestionUid !== question.uid;

  const metrics = computeMetrics(questions, questionStates);

  refs.activeMode.textContent = mode.label;
  refs.progressPill.textContent = mode.type === "exam"
    ? `${state.cursor + 1} / ${questions.length}`
    : `Domanda ${state.cursor + 1}`;

  refs.correct.textContent = String(metrics.correct);
  refs.wrong.textContent = String(metrics.wrong);
  refs.answered.textContent = `${metrics.answered} / ${metrics.total}`;

  renderSectionStatus(metrics);
  renderExamResult(metrics);

  refs.prevBtn.disabled = state.cursor === 0;
  refs.nextBtn.textContent = "Invia / Avanti";
  refs.nextBtn.disabled = mode.type === "exam" && state.cursor >= questions.length - 1;

  if (mode.type === "exam" && !state.examFinalized) {
    refs.submitExamBtn.classList.remove("hidden");
    refs.submitExamBtn.disabled = false;
  } else {
    refs.submitExamBtn.classList.add("hidden");
  }

  refs.questionSource.textContent = `${question.sectionLabel} · ${question.sourceLabel}`;
  refs.questionText.textContent = question.text;

  if (question.image) {
    refs.questionImage.src = question.image;
    refs.questionImageWrap.classList.remove("hidden");
  } else {
    refs.questionImage.src = "";
    refs.questionImageWrap.classList.add("hidden");
  }

  refs.answers.innerHTML = "";
  refs.questionExplanation.classList.add("hidden");
  refs.questionExplanation.textContent = "";
  refs.openActions.classList.add("hidden");
  refs.solution.classList.add("hidden");
  refs.solution.innerHTML = "";
  renderExplanation(question, qState);

  if (question.kind === "choice") {
    renderChoiceQuestion(question, qState, mode.type);
  } else {
    renderOpenQuestion(question, qState);
  }

  if (isNewQuestion) {
    refs.questionScroll.scrollTop = 0;
    state.lastRenderedQuestionUid = question.uid;
  }
  requestAnimationFrame(updateScrollHint);
}

function renderExplanation(question, qState) {
  const hasExplanation = Boolean(question.spiegazione && question.spiegazione.length > 0);
  const text = hasExplanation
    ? question.spiegazione
    : "Spiegazione non disponibile per questa domanda.";

  refs.toggleExplanationBtn.classList.remove("hidden");
  refs.toggleExplanationBtn.setAttribute("aria-expanded", String(qState.explanationShown));
  refs.toggleExplanationBtn.title = qState.explanationShown ? "Nascondi spiegazione" : "Mostra spiegazione";

  refs.questionExplanation.textContent = text;
  refs.questionExplanation.classList.toggle("placeholder", !hasExplanation);
  refs.questionExplanation.classList.toggle("hidden", !qState.explanationShown);
}

function toggleExplanation() {
  if (!state.session) {
    return;
  }

  const qState = state.session.questionStates[state.cursor];
  if (!qState) {
    return;
  }

  qState.explanationShown = !qState.explanationShown;
  renderQuiz();
}

function updateScrollHint() {
  const scrollEl = refs.questionScroll;
  const hasOverflow = scrollEl.scrollHeight - scrollEl.clientHeight > 8;
  const nearBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 8;
  refs.scrollHint.classList.toggle("hidden", !hasOverflow || nearBottom);
}

function renderSectionStatus(metrics) {
  const mode = state.session?.mode;

  if (!mode || mode.type !== "exam") {
    refs.sectionStatus.classList.add("hidden");
    refs.sectionStatus.innerHTML = "";
    return;
  }

  refs.sectionStatus.classList.remove("hidden");
  refs.sectionStatus.innerHTML = "";

  for (const section of mode.sections) {
    const values = metrics.bySection[section.id] || {
      total: 0,
      answered: 0,
      correct: 0,
      wrong: 0,
    };

    const maxErrors = Math.max(values.total - section.minCorrect, 0);

    const chip = document.createElement("div");
    chip.className = "section-chip";

    if (state.examFinalized) {
      chip.classList.add(values.correct >= section.minCorrect ? "pass" : "fail");
    }

    chip.innerHTML = `<strong>${section.label}</strong>
      ${values.correct}/${values.total} corrette · errori ${values.wrong}/${maxErrors}`;

    refs.sectionStatus.append(chip);
  }
}

function renderExamResult(metrics) {
  const mode = state.session?.mode;

  if (!mode || mode.type !== "exam" || !state.examFinalized) {
    refs.examResult.classList.add("hidden");
    refs.examResult.textContent = "";
    refs.examResult.classList.remove("pass", "fail");
    return;
  }

  const passed = mode.sections.every((section) => {
    const values = metrics.bySection[section.id] || { correct: 0 };
    return values.correct >= section.minCorrect;
  });

  refs.examResult.classList.remove("hidden", "pass", "fail");
  refs.examResult.classList.add(passed ? "pass" : "fail");
  refs.examResult.textContent = passed
    ? "Esame superato: tutte le sezioni sono sopra la soglia minima."
    : "Esame non superato: una o più sezioni sono sotto soglia.";
}

function renderChoiceQuestion(question, qState, modeType) {
  const frozen = state.examFinalized || qState.selectedAnswerId !== null;

  for (let index = 0; index < question.answers.length; index += 1) {
    const answer = question.answers[index];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = `${index + 1}. ${answer.text}`;

    const selected = qState.selectedAnswerId === answer.id;
    if (selected) {
      button.classList.add("selected");
    }

    if (frozen) {
      button.disabled = true;

      if (answer.id === question.correctAnswerId) {
        button.classList.add("reveal");
      }

      if (selected) {
        button.classList.add(answer.id === question.correctAnswerId ? "correct" : "wrong");
      }
    }

    button.addEventListener("click", () => {
      selectChoiceAnswer(question, qState, answer, modeType);
    });

    refs.answers.append(button);
  }
}

function renderOpenQuestion(question, qState) {
  const intro = document.createElement("p");
  intro.className = "notice";
  intro.textContent = "Confronta la soluzione e marca i quesiti. Tastiera: S (o 1) mostra soluzione, poi 1=giusta e 2=sbagliata sul prossimo quesito non marcato.";
  refs.answers.append(intro);

  refs.openActions.classList.remove("hidden");
  refs.showSolutionBtn.disabled = qState.solutionShown;

  if (!qState.solutionShown) {
    return;
  }

  refs.solution.classList.remove("hidden");

  for (let i = 0; i < question.solutionParts.length; i += 1) {
    const part = question.solutionParts[i];
    const mark = qState.partMarks[i];

    const partWrap = document.createElement("div");
    partWrap.className = "solution-part";

    const text = document.createElement("p");
    const prefix = question.solutionParts.length > 1 ? `Quesito ${i + 1}: ` : "Risposta: ";
    text.textContent = `${prefix}${part}`;

    const actions = document.createElement("div");
    actions.className = "part-actions";

    const yesBtn = document.createElement("button");
    yesBtn.type = "button";
    yesBtn.className = "part-btn";
    yesBtn.textContent = "Giusta";
    if (mark === true) {
      yesBtn.classList.add("active-yes");
    }

    const noBtn = document.createElement("button");
    noBtn.type = "button";
    noBtn.className = "part-btn";
    noBtn.textContent = "Sbagliata";
    if (mark === false) {
      noBtn.classList.add("active-no");
    }

    const lockedPart = state.examFinalized || mark !== null;
    yesBtn.disabled = lockedPart;
    noBtn.disabled = lockedPart;

    yesBtn.addEventListener("click", () => {
      setOpenPartMark(question, qState, i, true);
    });

    noBtn.addEventListener("click", () => {
      setOpenPartMark(question, qState, i, false);
    });

    actions.append(yesBtn, noBtn);
    partWrap.append(text, actions);
    refs.solution.append(partWrap);
  }
}

function revealSolution() {
  const question = state.session?.questions[state.cursor];
  const qState = state.session?.questionStates[state.cursor];

  if (!question || !qState || question.kind !== "open") {
    return;
  }

  qState.solutionShown = true;
  renderQuiz();
}

function selectChoiceAnswer(question, qState, answer, modeType) {
  if (state.examFinalized || qState.selectedAnswerId !== null) {
    return;
  }

  qState.selectedAnswerId = answer.id;

  if (!qState.recorded) {
    qState.recorded = true;
    recordResponse({
      question,
      isCorrect: answer.id === question.correctAnswerId,
      responseKind: "choice",
      responseValue: answer.text,
      modeType,
    });
  }

  renderQuiz();
}

function setOpenPartMark(question, qState, partIndex, isCorrect) {
  if (state.examFinalized || qState.partMarks[partIndex] !== null) {
    return;
  }

  qState.partMarks[partIndex] = isCorrect;

  if (!qState.recordedParts[partIndex]) {
    qState.recordedParts[partIndex] = true;
    recordResponse({
      question,
      isCorrect,
      responseKind: "open_part",
      responseValue: isCorrect ? `Q${partIndex + 1}: corretta` : `Q${partIndex + 1}: sbagliata`,
      partIndex,
      modeType: state.session?.mode.type || "unknown",
    });
  }

  renderQuiz();
}

function goPrev() {
  if (!state.session || state.cursor === 0) {
    return;
  }

  state.cursor -= 1;
  renderQuiz();
}

function goNext() {
  if (!state.session) {
    return;
  }

  const mode = state.session.mode;

  if (mode.type === "exam") {
    if (state.cursor < state.session.questions.length - 1) {
      state.cursor += 1;
      renderQuiz();
    }
    return;
  }

  if (state.cursor === state.session.questions.length - 1) {
    appendContinuousQuestion();
  }

  state.cursor += 1;
  renderQuiz();
}

function appendContinuousQuestion() {
  if (!state.session || !Array.isArray(state.session.infinitePool) || state.session.infinitePool.length === 0) {
    return;
  }

  const modeType = state.session.mode.type;
  const sourcePool = state.session.infinitePool;

  const baseQuestion = modeType === "wrongest"
    ? pickWeightedWrongQuestion(sourcePool)
    : randomFrom(sourcePool);

  const sectionLabel = modeType === "wrongest" ? "Domande più sbagliate" : "Quiz infinito";
  const sectionId = modeType === "wrongest" ? "wrongest" : "infinite";

  const cloned = cloneForSession(baseQuestion, sectionId, sectionLabel);
  state.session.questions.push(cloned);
  state.session.questionStates.push(createQuestionState(cloned));
}

function pickWeightedWrongQuestion(pool) {
  const weighted = pool.map((question) => {
    const stats = state.progress.questionStats[question.originKey] || { wrong: 0, attempts: 0 };
    const weight = Math.max(1, stats.wrong * 3 + (stats.attempts > 0 ? 1 : 0));
    return { question, weight };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let pick = Math.random() * totalWeight;

  for (const item of weighted) {
    pick -= item.weight;
    if (pick <= 0) {
      return item.question;
    }
  }

  return weighted[weighted.length - 1].question;
}

function finalizeExam() {
  if (!state.session || state.session.mode.type !== "exam" || state.examFinalized) {
    return;
  }

  for (let i = 0; i < state.session.questions.length; i += 1) {
    const question = state.session.questions[i];
    const qState = state.session.questionStates[i];

    if (question.kind === "choice") {
      if (qState.selectedAnswerId === null) {
        qState.selectedAnswerId = "__omitted__";
      }

      if (!qState.recorded) {
        qState.recorded = true;
        recordResponse({
          question,
          isCorrect: qState.selectedAnswerId === question.correctAnswerId,
          responseKind: "choice",
          responseValue: qState.selectedAnswerId === "__omitted__" ? "omessa" : "risposta data",
          modeType: "exam",
        });
      }
      continue;
    }

    qState.solutionShown = true;

    for (let partIndex = 0; partIndex < qState.partMarks.length; partIndex += 1) {
      if (qState.partMarks[partIndex] === null) {
        qState.partMarks[partIndex] = false;
      }

      if (!qState.recordedParts[partIndex]) {
        qState.recordedParts[partIndex] = true;
        recordResponse({
          question,
          isCorrect: qState.partMarks[partIndex] === true,
          responseKind: "open_part",
          responseValue: qState.partMarks[partIndex] ? `Q${partIndex + 1}: corretta` : `Q${partIndex + 1}: errata/omessa`,
          partIndex,
          modeType: "exam",
        });
      }
    }
  }

  state.examFinalized = true;
  renderQuiz();
}

function computeMetrics(questions, questionStates) {
  const metrics = {
    total: 0,
    answered: 0,
    correct: 0,
    wrong: 0,
    bySection: {},
  };

  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    const qState = questionStates[i];

    if (!metrics.bySection[question.sectionId]) {
      metrics.bySection[question.sectionId] = {
        total: 0,
        answered: 0,
        correct: 0,
        wrong: 0,
      };
    }

    const section = metrics.bySection[question.sectionId];

    if (question.kind === "choice") {
      metrics.total += 1;
      section.total += 1;

      if (qState.selectedAnswerId !== null) {
        metrics.answered += 1;
        section.answered += 1;

        if (qState.selectedAnswerId === question.correctAnswerId) {
          metrics.correct += 1;
          section.correct += 1;
        } else {
          metrics.wrong += 1;
          section.wrong += 1;
        }
      }
      continue;
    }

    const marks = Array.isArray(qState.partMarks) ? qState.partMarks : [];
    const partCount = marks.length;

    metrics.total += partCount;
    section.total += partCount;

    for (const mark of marks) {
      if (mark === null) {
        continue;
      }

      metrics.answered += 1;
      section.answered += 1;

      if (mark) {
        metrics.correct += 1;
        section.correct += 1;
      } else {
        metrics.wrong += 1;
        section.wrong += 1;
      }
    }
  }

  return metrics;
}

function recordResponse({ question, isCorrect, responseKind, responseValue, partIndex = null, modeType }) {
  const event = {
    id: cryptoRandomId(),
    ts: new Date().toISOString(),
    originKey: question.originKey,
    datasetId: question.datasetId,
    sectionId: question.sectionId,
    sourceLabel: question.sourceLabel,
    kind: question.kind,
    responseKind,
    responseValue,
    partIndex,
    isCorrect,
    modeType,
  };

  state.progress.responses.push(event);
  if (state.progress.responses.length > MAX_STORED_RESPONSES) {
    state.progress.responses.splice(0, state.progress.responses.length - MAX_STORED_RESPONSES);
  }

  if (!state.progress.questionStats[question.originKey]) {
    state.progress.questionStats[question.originKey] = {
      datasetId: question.datasetId,
      sourceLabel: question.sourceLabel,
      text: question.text,
      attempts: 0,
      correct: 0,
      wrong: 0,
      lastTs: null,
    };
  }

  const stats = state.progress.questionStats[question.originKey];
  stats.attempts += 1;
  if (isCorrect) {
    stats.correct += 1;
  } else {
    stats.wrong += 1;
  }
  stats.lastTs = event.ts;

  saveProgress();
  renderRankingBoard();
  if (state.selectedPrimaryId === "wrongest") {
    syncSetupPanels();
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return {
        responses: [],
        questionStats: {},
      };
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return { responses: [], questionStats: {} };
    }

    const responses = Array.isArray(parsed.responses) ? parsed.responses : [];
    const questionStats = parsed.questionStats && typeof parsed.questionStats === "object"
      ? parsed.questionStats
      : {};

    return {
      responses,
      questionStats,
    };
  } catch {
    return {
      responses: [],
      questionStats: {},
    };
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function resetStoredProgress() {
  state.progress = {
    responses: [],
    questionStats: {},
  };

  saveProgress();
  renderRankingBoard();
  syncSetupPanels();
  refs.loadNotice.textContent = "Memoria risposte azzerata.";
}

function getWrongStatsSummary() {
  const stats = Object.values(state.progress.questionStats || {});
  const questionsWithErrors = stats.filter((item) => (item.wrong || 0) > 0).length;

  return {
    totalResponses: Array.isArray(state.progress.responses) ? state.progress.responses.length : 0,
    questionsWithErrors,
  };
}

function pickRandomItems(items, count) {
  if (count <= 0) {
    return [];
  }
  return shuffle([...items]).slice(0, Math.min(count, items.length));
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
