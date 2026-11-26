export type VoiceInfo = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'localService'>;

const NATURAL = /natural|neural|online|premium|enhanced|mejorada|siri|google/i;
const LATAM = /^es[-_](mx|us|419|ni|co|ar|cl|pe|cr|gt|hn|sv|pa|ve|ec|bo|py|uy|do|pr|cu)/i;

export function scoreVoice(voice: VoiceInfo): number {
  const lang = voice.lang.replace('_', '-');
  if (!lang.toLowerCase().startsWith('es')) return -1;
  let score = 1;
  if (NATURAL.test(voice.name)) score += 4;
  if (LATAM.test(lang)) score += 2;
  if (!voice.localService) score += 1;
  return score;
}

export function pickVoice<T extends VoiceInfo>(voices: readonly T[]): T | undefined {
  let best: T | undefined;
  let bestScore = 0;
  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

let cached: SpeechSynthesisVoice | undefined;

function loadVoice() {
  cached = pickVoice(window.speechSynthesis.getVoices());
}

export function prepareVoice() {
  if (!('speechSynthesis' in window)) return;
  loadVoice();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoice);
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  if (!cached) loadVoice();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = cached?.lang ?? 'es-MX';
  if (cached) utterance.voice = cached;
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}
