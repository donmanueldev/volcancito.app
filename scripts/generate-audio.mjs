import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { info } from 'node:console';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { fetch } = globalThis;
const API = 'https://api.elevenlabs.io/v1';
const MODEL = 'eleven_multilingual_v2';

export function vowelPhrases(vowels) {
  return Object.entries(vowels).flatMap(([letter, words]) =>
    words.map((entry, i) => ({
      file: `${letter}-${i}.mp3`,
      text: `${letter.toUpperCase()} de ${entry.word}.`,
    })),
  );
}

function apiKey() {
  const envFile = join(ROOT, '.env.elevenlabs');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Set ELEVENLABS_API_KEY in .env.elevenlabs or the environment.');
  return key;
}

async function listSpanishVoices(key) {
  const response = await fetch(`${API}/voices`, { headers: { 'xi-api-key': key } });
  if (!response.ok) throw new Error(`Listing voices failed: ${response.status}`);
  const { voices } = await response.json();
  return voices
    .filter(
      (voice) =>
        JSON.stringify(voice.labels ?? {}).match(/spanish|latin|mexic|es-/i) ||
        voice.fine_tuning?.language === 'es',
    )
    .map((voice) => ({ id: voice.voice_id, name: voice.name, labels: voice.labels }));
}

async function synthesize(key, voiceId, text) {
  const response = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      language_code: 'es',
      voice_settings: { stability: 0.75, similarity_boost: 0.85, style: 0, speed: 0.9 },
    }),
  });
  if (!response.ok)
    throw new Error(`"${text}" failed: ${response.status} ${await response.text()}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const key = apiKey();
  if (process.argv.includes('--list-voices')) {
    for (const voice of await listSpanishVoices(key))
      info(voice.id, voice.name, JSON.stringify(voice.labels));
    return;
  }
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? process.argv[2];
  if (!voiceId) throw new Error('Pass a voice id: node scripts/generate-audio.mjs <voice-id>');

  const vowels = JSON.parse(readFileSync(join(ROOT, 'src/generated/vowels.json'), 'utf8'));
  const outDir = join(ROOT, 'public/audio/vowels');
  mkdirSync(outDir, { recursive: true });
  for (const { file, text } of vowelPhrases(vowels)) {
    writeFileSync(join(outDir, file), await synthesize(key, voiceId, text));
    info(`${file}  ${text}`);
  }
  writeFileSync(
    join(outDir, 'voice.json'),
    `${JSON.stringify({ provider: 'ElevenLabs', model: MODEL, voiceId }, null, 2)}\n`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
