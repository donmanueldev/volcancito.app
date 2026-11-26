import { describe, expect, it } from 'vitest';

import { vowelPhrases } from './generate-audio.mjs';

describe('vowelPhrases', () => {
  it('names one clip per vowel word with the phrase the site says', () => {
    expect(
      vowelPhrases({ a: [{ word: 'abeja' }, { word: 'araña' }], u: [{ word: 'uva' }] }),
    ).toEqual([
      { file: 'a-0.mp3', text: 'A de abeja.' },
      { file: 'a-1.mp3', text: 'A de araña.' },
      { file: 'u-0.mp3', text: 'U de uva.' },
    ]);
  });
});
