import { prepareVoice, speak } from './voice';

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

function initVowels() {
  const field = document.querySelector<HTMLElement>('[data-vowel-field]');
  if (!field) return;
  const keys = [...field.querySelectorAll<HTMLButtonElement>('[data-vowel-key]')];
  const glyph = field.querySelector<HTMLElement>('[data-vowel-glyph]');
  const word = field.querySelector<HTMLElement>('[data-vowel-word]');
  const heading = field.querySelector<HTMLElement>('[data-vowel-heading]');
  const arts = [...field.querySelectorAll<HTMLElement>('[data-vowel-art]')];
  const listen = field.querySelector<HTMLButtonElement>('[data-vowel-listen]');
  const position: Record<string, number> = {};
  let current = 'a';
  let phrase = 'A… A, de abeja.';
  const say = () => speak(phrase);
  listen?.addEventListener('click', say);

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
      phrase = `${letter.toUpperCase()}… ${letter.toUpperCase()}, de ${chosen}.`;
      say();
    });
  }
}

function initStages() {
  const section = document.querySelector<HTMLElement>('[data-stages]');
  if (!section) return;
  const steps = [...section.querySelectorAll<HTMLButtonElement>('[data-stage-name]')];
  const screens = [...section.querySelectorAll<HTMLElement>('[data-stage-screen]')];
  let current = 0;
  let timer: number | undefined;

  const show = (index: number) => {
    current = index;
    steps.forEach((step, i) => step.setAttribute('aria-pressed', String(i === index)));
    screens.forEach((screen, i) => {
      screen.classList.toggle('opacity-0', i !== index);
      screen.setAttribute('aria-hidden', String(i !== index));
    });
  };
  const stop = () => window.clearInterval(timer);

  steps.forEach((step, i) =>
    step.addEventListener('click', () => {
      stop();
      autoplay.disconnect();
      show(i);
    }),
  );

  const autoplay = new IntersectionObserver(([entry]) => {
    stop();
    if (!entry?.isIntersecting) return;
    timer = window.setInterval(() => show((current + 1) % steps.length), 4000);
  });
  show(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay.observe(section);
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
  prepareVoice();
  initVowels();
  initStages();
}
