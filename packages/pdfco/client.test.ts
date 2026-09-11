/**
 * Transport: x-api-key header, official host, `/v1` paths, zod-validated
 * outputs. API-level failures (`error: true`) surface as PdfcoAPIError.
 */

import { z } from 'zod';
import { makePdfcoRequest, PDFCO_API_BASE, PdfcoAPIError } from './client';

let captured:
	| {
			url: string;
			method: string;
			apiKey: string | null;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: string, status = 200): void {
	captured = undefined;
	global.fetch = async (input, init) => {
		const headers = new Headers(init?.headers);
		captured = {
			url: String(input),
			method: init?.method ?? 'GET',
			apiKey: headers.get('x-api-key'),
		};
		return new Response(payload, {
			status,
			headers: { 'Content-Type': 'application/json' },
		});
	};
}

const FileSchema = z.object({
	url: z.string().optional(),
	error: z.boolean().default(false),
	message: z.string().optional(),
});

describe('makePdfcoRequest', () => {
	it('hits the documented host with the x-api-key header', async () => {
		mockFetch(JSON.stringify({ url: 'https://example.com/out.pdf' }));
		const out = await makePdfcoRequest('/v1/pdf/merge', 'test-key', {
			schema: FileSchema,
			body: { url: 'https://example.com/1.pdf' },
		});
		expect(captured?.url).toBe(`${PDFCO_API_BASE}/v1/pdf/merge`);
		expect(captured?.method).toBe('POST');
		expect(captured?.apiKey).toBe('test-key');
		expect(out.url).toBe('https://example.com/out.pdf');
	});

	it('throws PdfcoAPIError when the API reports error: true', async () => {
		mockFetch(JSON.stringify({ error: true, message: 'Not enough credits.' }));
		await expect(
			makePdfcoRequest('/v1/pdf/merge', 'test-key', {
				schema: FileSchema,
				body: { url: 'https://example.com/1.pdf' },
			}),
		).rejects.toBeInstanceOf(PdfcoAPIError);
	});

	it('rejects invalid response shapes via the output schema', async () => {
		mockFetch(JSON.stringify({ url: 123 }));
		await expect(
			makePdfcoRequest('/v1/pdf/merge', 'test-key', {
				schema: FileSchema,
				body: { url: 'https://example.com/1.pdf' },
			}),
		).rejects.toThrow();
	});

	it('sends GET requests without a body', async () => {
		mockFetch(JSON.stringify({ remainingCredits: 10 }));
		const out = await makePdfcoRequest('/v1/account/credit/balance', 'k', {
			method: 'GET',
			schema: z.object({
				remainingCredits: z.number(),
				error: z.boolean().default(false),
				message: z.string().optional(),
			}),
		});
		expect(captured?.method).toBe('GET');
		expect(out.remainingCredits).toBe(10);
	});
});
