import { createHash } from 'node:crypto';
import { AnalyzeAudio, ReadText } from './endpoints';
import type { AsticaAiContext } from './index';

/**
 * Live suite. Excluded from CI by filename; run with a real key:
 *   ASTICA_API_KEY=... pnpm test:live
 *
 * These call the endpoint handlers rather than the client, so a run exercises
 * input parsing, the request body, the in-body `status:'error'` check and
 * output-schema validation against real Astica responses.
 */

const TEST_API_KEY = process.env.ASTICA_API_KEY;

const upserts: Array<[string, Record<string, unknown>]> = [];

const makeEntity = () => ({
	upsertByEntityId: async (id: string, data: Record<string, unknown>) => {
		upserts.push([id, data]);
	},
});

const ctx = {
	key: TEST_API_KEY,
	db: {
		readTextResults: makeEntity(),
		audioTranscripts: makeEntity(),
	},
} as unknown as AsticaAiContext;

beforeEach(() => {
	upserts.length = 0;
});

// Sample assets published by Astica in their own documentation.
const SAMPLE_IMAGE = 'https://www.astica.org/inputs/analyze_3.jpg';
const SAMPLE_AUDIO = 'https://astica.ai/example/asticaListen_sample.wav';

describe('Astica live API', () => {
	it('readText returns an OCR result matching the output schema', async () => {
		const response = await ReadText.read(ctx, { input: SAMPLE_IMAGE });

		expect(response.status).toBe('success');
		expect(typeof response.readResult?.content).toBe('string');
		expect(upserts).toHaveLength(1);
		expect(upserts[0]?.[0]).toBe(
			createHash('sha256').update(SAMPLE_IMAGE).digest('hex'),
		);
		// The submitted input is never persisted.
		expect(upserts[0]?.[1]).not.toHaveProperty('input');
	}, 120_000);

	it('analyzeAudio returns a transcript matching the output schema', async () => {
		const response = await AnalyzeAudio.analyze(ctx, { input: SAMPLE_AUDIO });

		expect(response.status).toBe('success');
		expect(response.text ?? response.resultURI).toBeTruthy();
		expect(upserts).toHaveLength(1);
	}, 120_000);

	// Astica answers a bad key with HTTP 200 and status:'error', which is why
	// the handlers check the body rather than relying on the status code.
	it('surfaces an invalid key as a thrown error, not a success', async () => {
		const badCtx = { ...ctx, key: 'not-a-real-astica-key' };

		await expect(
			ReadText.read(badCtx as AsticaAiContext, { input: SAMPLE_IMAGE }),
		).rejects.toThrow();
	}, 120_000);

	it('does not leak the api key when the request fails', async () => {
		const badCtx = { ...ctx, key: 'not-a-real-astica-key' };

		try {
			await ReadText.read(badCtx as AsticaAiContext, { input: SAMPLE_IMAGE });
		} catch (error) {
			expect(JSON.stringify(error)).not.toContain('not-a-real-astica-key');
			expect((error as Error).message).not.toContain('not-a-real-astica-key');
			return;
		}
		throw new Error('expected the request to reject');
	}, 120_000);
});
