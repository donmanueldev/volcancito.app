import { describe, expect, it } from 'vitest';
import { pickVoice, scoreVoice } from './voice';

const voice = (name: string, lang: string, localService = true) => ({ name, lang, localService });

describe('pickVoice', () => {
  it('ignores voices that are not Spanish', () => {
    expect(scoreVoice(voice('Samantha', 'en-US'))).toBe(-1);
    expect(pickVoice([voice('Samantha', 'en-US')])).toBeUndefined();
  });

  it('prefers natural Latin American voices over plain or Spain voices', () => {
    const voices = [
      voice('Mónica', 'es-ES'),
      voice('Paulina', 'es-MX'),
      voice('Microsoft Dalia Online (Natural) - Spanish (Mexico)', 'es-MX', false),
      voice('Google español', 'es-ES', false),
    ];
    expect(pickVoice(voices)?.name).toContain('Dalia');
  });

  it('falls back to any Spanish voice', () => {
    expect(pickVoice([voice('Jorge', 'es_ES')])?.name).toBe('Jorge');
  });
});
