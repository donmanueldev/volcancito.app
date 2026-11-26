const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-419';
  utterance.rate = 0.85;
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith('es'));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function initVowels() {
  const field = document.querySelector<HTMLElement>('[data-vowel-field]');
  if (!field) return;
  const keys = [...field.querySelectorAll<HTMLButtonElement>('[data-vowel-key]')];
  const glyph = field.querySelector<HTMLElement>('[data-vowel-glyph]');
  const word = field.querySelector<HTMLElement>('[data-vowel-word]');
  const heading = field.querySelector<HTMLElement>('[data-vowel-heading]');
  const arts = [...field.querySelectorAll<HTMLElement>('[data-vowel-art]')];
  const position: Record<string, number> = {};
  let current = 'a';

  for (const key of keys) {
    key.addEventListener('click', () => {
      const letter = key.dataset.vowelKey ?? 'a';
      const words: string[] = JSON.parse(key.dataset.words ?? '[]');
      const index =
        letter === current ? ((position[letter] ?? 0) + 1) % words.length : (position[letter] ?? 0);
      position[letter] = index;
      current = letter;

      for (const other of keys) other.setAttribute('aria-pressed', String(other === key));
      for (const art of arts) art.hidden = art.dataset.vowelArt !== `${letter}-${index}`;
      field.style.background = key.dataset.field ?? '';
      const chosen = words[index] ?? '';
      if (glyph) glyph.textContent = `${letter.toUpperCase()}${letter}`;
      if (word) word.textContent = capitalize(chosen);
      if (heading) heading.textContent = letter;
      speak(`${letter}, de ${chosen}`);
    });
  }
}

function initStages() {
  const section = document.querySelector<HTMLElement>('[data-stages]');
  const range = section?.querySelector<HTMLInputElement>('[data-stage-range]');
  if (!section || !range) return;
  const stages: { name: string; clause: string }[] = JSON.parse(section.dataset.stages ?? '[]');
  const clause = section.querySelector<HTMLElement>('[data-stage-clause]');
  const names = [...section.querySelectorAll<HTMLElement>('[data-stage-name]')];
  const screens = [...section.querySelectorAll<HTMLElement>('[data-stage-screen]')];

  const show = () => {
    const index = Number(range.value);
    const stage = stages[index];
    if (!stage) return;
    if (clause) clause.textContent = stage.clause;
    range.setAttribute('aria-valuetext', stage.name);
    names.forEach((name, i) => name.classList.toggle('opacity-60', i !== index));
    screens.forEach((screen, i) => screen.classList.toggle('opacity-0', i !== index));
  };
  range.addEventListener('input', show);
}

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  targets.forEach((target) => observer.observe(target));
}

export function initLanding() {
  initReveal();
  initVowels();
  initStages();
}
