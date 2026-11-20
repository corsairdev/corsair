import { bulkCreate } from './endpoints/images';
import { toBulkCsvFile } from './endpoints/shared';
import { AltTextAiEndpointInputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		// unknown: a pass-through to the real resolveFileInput, which checks its own arguments.
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file ? { 'content-type': file.type } : {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

const CSV = new Uint8Array(Buffer.from('url\nhttps://example.com/a.png\n'));
const LINK = 'https://files.example.com/exports/images.csv';

const originalFetch = global.fetch;
const sent: Array<{ url: string; method?: string; body: FormData }> = [];

// unknown: bulkCreate reads only ctx.key here.
const ctx = { key: 'test-key' } as unknown as Parameters<typeof bulkCreate>[0];

beforeEach(() => {
	mockLinks.served.set(LINK, { body: CSV, type: 'text/csv' });
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		sent.push({
			url: String(url),
			method: init?.method,
			body: init?.body as FormData,
		});
		return new Response(JSON.stringify({ success: true, rows: 1 }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as unknown as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
	sent.length = 0;
	mockLinks.served.clear();
});

async function sentFile(): Promise<File> {
	const part = sent.at(-1)?.body.get('file');
	expect(part).toBeInstanceOf(File);
	return part as File;
}

describe('images.bulkCreate takes a link, base64 or a Blob', () => {
	it('the input schema takes a link, {url}, {base64} and a Blob', () => {
		const schema = AltTextAiEndpointInputSchemas.bulkCreate;
		for (const file of [
			LINK,
			{ url: LINK },
			{ base64: 'dXJsCg==', filename: 'urls.csv' },
			new Blob(['url\n']),
		]) {
			expect(schema.safeParse({ file }).success).toBe(true);
		}
		expect(schema.safeParse({ file: 42 }).success).toBe(false);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('downloads a link and sends it as the file part, named and typed as a CSV', async () => {
		await bulkCreate(ctx, { file: LINK, email: 'ops@example.com' });
		expect(sent).toHaveLength(1);
		expect(sent[0]?.url).toBe('https://alttext.ai/api/v1/images/bulk_create');
		expect(sent[0]?.method).toBe('POST');
		const file = await sentFile();
		expect(file.name).toBe('images.csv');
		expect(file.type).toBe('text/csv');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(CSV);
		expect(sent[0]?.body.get('email')).toBe('ops@example.com');
	});

	it('sends {base64, filename, contentType} as the file part', async () => {
		await bulkCreate(ctx, {
			file: {
				base64: Buffer.from(CSV).toString('base64'),
				filename: 'urls.csv',
				contentType: 'text/csv',
			},
		});
		const file = await sentFile();
		expect(file.name).toBe('urls.csv');
		expect(file.type).toBe('text/csv');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(CSV);
	});

	it('still sends a bare Blob as bulk.csv, as before', async () => {
		await bulkCreate(ctx, { file: new Blob([CSV], { type: 'text/csv' }) });
		const file = await sentFile();
		expect(file.name).toBe('bulk.csv');
		expect(file.type).toBe('text/csv');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(CSV);
	});

	it('refuses a private address before any AltText.ai request', async () => {
		for (const file of [
			'https://127.0.0.1/images.csv',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(bulkCreate(ctx, { file })).rejects.toThrow(/file URL/);
		}
		expect(sent).toHaveLength(0);
	});
});

describe('toBulkCsvFile', () => {
	it('adds .csv to a linked name without it and types a generic file as text/csv', async () => {
		mockLinks.served.set('https://files.example.com/f/export.txt', {
			body: CSV,
			type: 'application/octet-stream',
		});
		const file = await toBulkCsvFile('https://files.example.com/f/export.txt');
		expect(file.name).toBe('export.txt.csv');
		expect(file.type).toBe('text/csv');
	});

	it('names a link that ends in a bare id bulk.csv', async () => {
		mockLinks.served.set('https://files.example.com/f/fil_abc123', {
			body: CSV,
			type: 'text/csv',
		});
		const file = await toBulkCsvFile('https://files.example.com/f/fil_abc123');
		expect(file.name).toBe('bulk.csv');
		expect(file.type).toBe('text/csv');
	});

	it('names base64 without a filename bulk.csv', async () => {
		const file = await toBulkCsvFile({
			base64: Buffer.from(CSV).toString('base64'),
		});
		expect(file.name).toBe('bulk.csv');
		expect(file.type).toBe('text/csv');
	});

	it('keeps a Blob going through toCsvUploadFile', async () => {
		const given = new File([CSV], 'mine.csv', { type: 'text/csv' });
		expect(await toBulkCsvFile(given)).toBe(given);
	});
});
