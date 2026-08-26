import { request } from 'corsair/http';
import { buildAudioUrl, DictionaryAPIError } from '../client';
import { get } from './words';

// Mocked at the HTTP layer (not `../client`) so `lookupWord`'s real body-shape
// handling (string body → invalid key, array → entries/suggestions) runs for
// real. Scoped to this file only — api.test.ts's live-API tests still hit
// the real Merriam-Webster API and would break if `corsair/http` were mocked
// there too, since Jest's module registry resets per file, not per describe.
jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function createTestContext() {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const },
	} as any;
}

describe('Words.get (mocked Merriam-Webster responses)', () => {
	afterEach(() => {
		mockRequest.mockReset();
	});

	it('maps a full raw entry to a DictionaryEntry with pronunciation, audio, and stems', async () => {
		mockRequest.mockResolvedValue([
			{
				meta: { id: 'pencil', stems: ['pencil', 'pencils'], offensive: false },
				hwi: {
					hw: 'pen*cil',
					prs: [{ mw: 'ˈpen-səl', sound: { audio: 'pencil001' } }],
				},
				fl: 'noun',
				shortdef: ['a thin cylindrical instrument for writing or drawing'],
			},
		]);

		const result = await get(createTestContext(), { word: 'pencil' });

		expect(result.found).toBe(true);
		expect(result.suggestions).toEqual([]);
		expect(result.entries).toEqual([
			{
				id: 'pencil',
				headword: 'pen*cil',
				partOfSpeech: 'noun',
				pronunciation: 'ˈpen-səl',
				audioUrl: buildAudioUrl('pencil001'),
				shortDefinitions: [
					'a thin cylindrical instrument for writing or drawing',
				],
				stems: ['pencil', 'pencils'],
				offensive: false,
			},
		]);
	});

	it('falls back to the entry id as headword and omits pronunciation/audio when hwi is missing', async () => {
		mockRequest.mockResolvedValue([
			{
				meta: { id: 'xyz:2', stems: [], offensive: false },
				fl: 'noun',
				shortdef: ['an obscure sense'],
			},
		]);

		const result = await get(createTestContext(), { word: 'xyz' });

		expect(result.entries[0]?.headword).toBe('xyz:2');
		expect(result.entries[0]?.pronunciation).toBeUndefined();
		expect(result.entries[0]?.audioUrl).toBeUndefined();
	});

	it('returns suggestions and found:false when Merriam-Webster returns only strings', async () => {
		mockRequest.mockResolvedValue(['pencle', 'pinole', 'penciled']);

		const result = await get(createTestContext(), { word: 'pencle' });

		expect(result.found).toBe(false);
		expect(result.entries).toEqual([]);
		expect(result.suggestions).toEqual(['pencle', 'pinole', 'penciled']);
	});

	it('surfaces an invalid API key as a DictionaryAPIError instead of a parsed result', async () => {
		mockRequest.mockResolvedValue('Invalid API Key');

		await expect(get(createTestContext(), { word: 'pencil' })).rejects.toThrow(
			DictionaryAPIError,
		);
	});
});
