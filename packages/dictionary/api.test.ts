import 'dotenv/config';
import { buildAudioUrl, DictionaryAPIError, lookupWord } from './client';
import { Words } from './endpoints';
import {
	DictionaryEndpointOutputSchemas,
	MWLookupResponseSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.DICTIONARY_API_KEY;

function createTestContext(key: string) {
	return {
		key,
		options: { authType: 'api_key' as const },
	} as any;
}

describe('buildAudioUrl', () => {
	it('routes "bix"-prefixed filenames to the bix subdirectory', () => {
		expect(buildAudioUrl('bix1234')).toBe(
			'https://media.merriam-webster.com/audio/prons/en/us/mp3/bix/bix1234.mp3',
		);
	});

	it('routes "gg"-prefixed filenames to the gg subdirectory', () => {
		expect(buildAudioUrl('ggfoo')).toBe(
			'https://media.merriam-webster.com/audio/prons/en/us/mp3/gg/ggfoo.mp3',
		);
	});

	it('routes filenames starting with a digit or punctuation to "number"', () => {
		expect(buildAudioUrl('9foo')).toBe(
			'https://media.merriam-webster.com/audio/prons/en/us/mp3/number/9foo.mp3',
		);
	});

	it('routes other filenames to a subdirectory named after their first letter', () => {
		expect(buildAudioUrl('pencil001')).toBe(
			'https://media.merriam-webster.com/audio/prons/en/us/mp3/p/pencil001.mp3',
		);
	});
});

describe('Dictionary Live API & Endpoint Integration Tests', () => {
	const maybeTest = TEST_API_KEY ? it : it.skip;

	maybeTest(
		'lookupWord returns a parseable response for a real word',
		async () => {
			const raw = await lookupWord('hello', TEST_API_KEY!);
			const parsed = MWLookupResponseSchema.parse(raw);
			expect(parsed.length).toBeGreaterThan(0);
		},
	);

	maybeTest(
		'Words.get returns definitions, pronunciation, and audio for a known word',
		async () => {
			const ctx = createTestContext(TEST_API_KEY!);
			const result = await Words.get(ctx, { word: 'pencil' });
			const parsed = DictionaryEndpointOutputSchemas.wordsGet.parse(result);

			expect(parsed.found).toBe(true);
			expect(parsed.entries.length).toBeGreaterThan(0);

			const entry = parsed.entries[0]!;
			expect(entry.headword).toBeTruthy();
			expect(entry.shortDefinitions.length).toBeGreaterThan(0);
			if (entry.audioUrl) {
				expect(entry.audioUrl).toMatch(
					/^https:\/\/media\.merriam-webster\.com/,
				);
			}
		},
	);

	maybeTest(
		'Words.get returns suggestions instead of entries for a misspelled word',
		async () => {
			const ctx = createTestContext(TEST_API_KEY!);
			const result = await Words.get(ctx, { word: 'recieve' });
			const parsed = DictionaryEndpointOutputSchemas.wordsGet.parse(result);

			expect(parsed.found).toBe(false);
			expect(parsed.entries).toHaveLength(0);
			expect(parsed.suggestions.length).toBeGreaterThan(0);
		},
	);

	maybeTest(
		'lookupWord throws DictionaryAPIError for an invalid key',
		async () => {
			await expect(
				lookupWord('hello', 'definitely-invalid-key'),
			).rejects.toThrow(DictionaryAPIError);
		},
	);
});
