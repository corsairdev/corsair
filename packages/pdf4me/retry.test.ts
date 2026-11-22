import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { pdf4me } from './index';
import { pdfInfo } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because each processing call charges credits.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pdf4me', 'default');
	const corsair = createCorsair({
		plugins: [pdf4me({ key: 'pdf4me-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it("retries a 429 through the transport's rate-limit handling", async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond(pdfInfo);

			await expect(
				corsair.pdf4me.api.pdf.getInfo({
					docContent: 'AAAA',
					docName: 'in.pdf',
				}),
			).resolves.toMatchObject({ pageCount: 12 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed read on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 503);
			respond({ jobId: 'job-1', isFinished: true, isSuccess: true });

			await expect(
				corsair.pdf4me.api.jobs.status({ jobId: 'job-1' }),
			).resolves.toMatchObject({ jobId: 'job-1', isFinished: true });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the compress write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 502);

			await expect(
				corsair.pdf4me.api.pdf.compress({
					docContent: 'AAAA',
					docName: 'in.pdf',
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('', 401, { 'Content-Type': 'text/plain' });

			await expect(
				corsair.pdf4me.api.pdf.getInfo({
					docContent: 'AAAA',
					docName: 'in.pdf',
				}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
