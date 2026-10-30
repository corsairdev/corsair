import { request } from 'corsair/http';
import { buildAudioUrl, MerriamWebsterDictAPIError } from '../client';
import { get } from './words';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function createTestContext(reference?: string) {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const, reference },
		$getAccountId: async () => null,
		db: {
			entries: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

describe('Words.get (mocked Merriam-Webster responses)', () => {
	afterEach(() => {
		mockRequest.mockReset();
	});

	it('maps a full raw entry including etymology, pronunciation, audio, and stems', async () => {
		mockRequest.mockResolvedValue([
			{
				meta: {
					id: 'pencil',
					uuid: 'u1',
					src: 'collegiate',
					section: 'alpha',
					stems: ['pencil', 'pencils'],
					offensive: false,
				},
				hwi: {
					hw: 'pen*cil',
					prs: [{ mw: 'ˈpen-səl', sound: { audio: 'pencil001' } }],
				},
				fl: 'noun',
				shortdef: ['a thin cylindrical instrument for writing or drawing'],
				et: [['text', 'Middle English pencel']],
			},
		]);

		const ctx = createTestContext();
		const result = await get(ctx as never, { word: 'pencil' });

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
				etymology: ['Middle English pencel'],
				stems: ['pencil', 'pencils'],
				offensive: false,
			},
		]);
		expect(ctx.db.entries.upsertByEntityId).toHaveBeenCalledWith(
			'collegiate:u1',
			expect.objectContaining({
				id: 'pencil',
				hw: 'pen*cil',
				shortdef: ['a thin cylindrical instrument for writing or drawing'],
				et: ['Middle English pencel'],
			}),
		);
	});

	it('falls back to the entry id as headword and omits pronunciation/audio when hwi is missing', async () => {
		mockRequest.mockResolvedValue([
			{
				meta: { id: 'xyz:2', stems: [], offensive: false },
				fl: 'noun',
				shortdef: ['an obscure sense'],
			},
		]);

		const result = await get(createTestContext() as never, { word: 'xyz' });

		expect(result.entries[0]?.headword).toBe('xyz:2');
		expect(result.entries[0]?.pronunciation).toBeUndefined();
		expect(result.entries[0]?.audioUrl).toBeUndefined();
	});

	it('returns suggestions and found:false when Merriam-Webster returns only strings', async () => {
		mockRequest.mockResolvedValue(['pencle', 'pinole', 'penciled']);

		const ctx = createTestContext();
		const result = await get(ctx as never, { word: 'pencle' });

		expect(result.found).toBe(false);
		expect(result.entries).toEqual([]);
		expect(result.suggestions).toEqual(['pencle', 'pinole', 'penciled']);
		expect(ctx.db.entries.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('surfaces an invalid API key as a MerriamWebsterDictAPIError instead of a parsed result', async () => {
		mockRequest.mockResolvedValue('Invalid API Key');

		await expect(
			get(createTestContext() as never, { word: 'pencil' }),
		).rejects.toThrow(MerriamWebsterDictAPIError);
	});

	it('rejects an unknown dictionary reference before calling the API', async () => {
		await expect(
			get(createTestContext('not-a-product') as never, { word: 'pencil' }),
		).rejects.toThrow(MerriamWebsterDictAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
