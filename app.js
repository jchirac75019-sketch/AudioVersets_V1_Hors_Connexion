// app.js

// Données des sourates
const SOURATES = [
  {num:1,nom:"الفاتحة",versets:7},
  {num:2,nom:"البقرة",versets:286},
  /* ... jusqu'à 114 ... */
];

// Récitateurs
const RECITERS = [
  {id:"mishary",name:"مشاري راشد العفاسي",path:"Alafasy_128kbps"},
  /* ... autres récitateurs ... */
];

// Sélection d'éléments
const E = {
  home:      document.getElementById('home'),
  quiz:      document.getElementById('quiz'),
  results:   document.getElementById('results'),
  startSurah:document.getElementById('startSurah'),
  endSurah:  document.getElementById('endSurah'),
  startVerse:document.getElementById('startVerse'),
  endVerse:  document.getElementById('endVerse'),
  startVerseErr:document.getElementById('startVerseErr'),
  endVerseErr:document.getElementById('endVerseErr'),
  attempts:  document.getElementById('attempts'),
  mode:      document.getElementById('mode'),
  reciter:   document.getElementById('reciter'),
  reciterSection:document.getElementById('reciterSection'),
  totalVerses:document.getElementById('totalVerses'),
  startBtn:  document.getElementById('startBtn'),
  homeBtn:   document.getElementById('homeBtn'),
  ok:        document.getElementById('ok'),
  ko:        document.getElementById('ko'),
  time:      document.getElementById('time'),
  cur:       document.getElementById('cur'),
  tot:       document.getElementById('tot'),
  vNum:      document.getElementById('vNum'),
  sName:     document.getElementById('sName'),
  vText:     document.getElementById('vText'),
  showVerse: document.getElementById('showVerse'),
  answersText:document.getElementById('answersText'),
  okBtn1:    document.getElementById('okBtn1'),
  koBtn1:    document.getElementById('koBtn1'),
  next1:     document.getElementById('next1'),
  player:    document.getElementById('player'),
  replay:    document.getElementById('replay'),
  showInfo:  document.getElementById('showInfo'),
  info:      document.getElementById('info'),
  tAudio:    document.getElementById('tAudio'),
  sAudio:    document.getElementById('sAudio'),
  nAudio:    document.getElementById('nAudio'),
  pAudio:    document.getElementById('pAudio'),
  jAudio:    document.getElementById('jAudio'),
  answersAudio:document.getElementById('answersAudio'),
  okBtn2:    document.getElementById('okBtn2'),
  koBtn2:    document.getElementById('koBtn2'),
  next2:     document.getElementById('next2'),
  fOk:       document.getElementById('fOk'),
  fKo:       document.getElementById('fKo'),
  fTime:     document.getElementById('fTime'),
  tStart:    document.getElementById('tStart'),
  tEnd:      document.getElementById('tEnd'),
  pct:       document.getElementById('pct'),
  hist:      document.getElementById('hist'),
  newQuiz:   document.getElementById('newQuiz'),
  nosleep:   document.getElementById('nosleep'),
  qCounter:  document.getElementById('qCounter')
};

// État du quiz
let state = {
  startTime: null,
  endTime:   null,
  activeMs:  0,
  lastTick:  null,
  active:    true,
  timer:     null,
  ok:        0,
  ko:        0,
  questions: [],
  idx:       0,
  mode:      "text",
  reciter:   "mishary",
  history:   []
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  initSelectors();
  bindEvents();
  updateTotals();
  toggleReciter();
  preventSleep();
  registerSWInline();
});

function initSelectors() {
  SOURATES.forEach(s => {
    const o1 = document.createElement('option');
    o1.value = s.num;
    o1.textContent = `${s.num}. ${s.nom}`;
    E.startSurah.appendChild(o1);
    const o2 = o1.cloneNode(true);
    E.endSurah.appendChild(o2);
  });
  E.startSurah.value = 1;
  E.endSurah.value   = 114;
  E.startVerse.value = 1;
  setEndMax();

  RECITERS.forEach(r => {
    const o = document.createElement('option');
    o.value = r.id;
    o.textContent = r.name;
    E.reciter.appendChild(o);
  });
  E.reciter.value = "mishary";
}

function bindEvents() {
  E.startSurah.addEventListener('change', () => { validateStart(); updateTotals(); });
  E.endSurah.addEventListener('change',  () => { setEndMax(); validateEnd(); updateTotals(); });
  E.startVerse.addEventListener('input', () => { validateStart(); updateTotals(); });
  E.endVerse.addEventListener('input',   () => { validateEnd(); updateTotals(); });
  E.mode.addEventListener('change', toggleReciter);
  E.startBtn.addEventListener('click', startQuiz);
  E.homeBtn.addEventListener('click', () => goto('home'));
  E.newQuiz.addEventListener('click', ()=> goto('home'));

  E.showVerse.addEventListener('click', showVerseText);
  E.okBtn1.addEventListener('click', () => record(true));
  E.koBtn1.addEventListener('click', () => record(false));
  E.next1.addEventListener('click', next);

  E.replay.addEventListener('click', () => { E.player.currentTime = 0; E.player.play().catch(()=>{}); });
  E.showInfo.addEventListener('click', showAudioInfo);
  E.okBtn2.addEventListener('click', () => record(true));
  E.koBtn2.addEventListener('click', () => record(false));
  E.next2.addEventListener('click', next);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? pauseTimer() : resumeTimer();
  });
  window.addEventListener('blur', pauseTimer);
  window.addEventListener('focus', resumeTimer);
}

// ... toutes les fonctions utilitaires (setEndMax, validateStart, validateEnd, updateTotals, etc.)

// Voir les fonctions showVerseText(), showAudioInfo() corrigées précédemment
// ... loadAudio, navigate pages, timer, shuffle, preventSleep, registerSWInline
