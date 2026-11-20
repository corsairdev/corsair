import { queryDocument } from './endpoints/query-document';
import { AgentQLEndpointInputSchemas } from './endpoints/types';

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

const PDF = new Uint8Array(Buffer.from('%PDF-1.4 invoice'));
const LINK = 'https://files.example.com/invoices/invoice.pdf';

const originalFetch = global.fetch;
const sent: Array<{ url: string; body: FormData }> = [];
const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

function context() {
	// unknown: the endpoint reads only ctx.key and ctx.db.documentQueryResults here.
	return {
		key: 'test-key',
		db: { documentQueryResults: { upsertByEntityId } },
	} as unknown as Parameters<typeof queryDocument>[0];
}

beforeEach(() => {
	mockLinks.served.set(LINK, { body: PDF, type: 'application/pdf' });
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		sent.push({ url: String(url), body: init?.body as FormData });
		return new Response(JSON.stringify({ data: { total: 42 } }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as unknown as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
	sent.length = 0;
	upsertByEntityId.mockClear();
	mockLinks.served.clear();
});

async function sentFile(): Promise<File> {
	const part = sent.at(-1)?.body.get('file');
	expect(part).toBeInstanceOf(File);
	return part as File;
}

describe('data.queryDocument takes a link, base64 or a Blob', () => {
	it('the input schema takes a link, {url}, {base64} and a Blob', () => {
		const schema = AgentQLEndpointInputSchemas.queryDocument;
		for (const file of [
			LINK,
			{ url: LINK, filename: 'a.pdf' },
			{ base64: 'JVBERg==', contentType: 'application/pdf' },
			new Blob(['x']),
		]) {
			expect(schema.safeParse({ file, query: '{ total }' }).success).toBe(true);
		}
		expect(schema.safeParse({ file: '', query: '{ total }' }).success).toBe(
			false,
		);
		expect(
			schema.safeParse({ file: { path: '/tmp/a.pdf' }, query: '{ total }' })
				.success,
		).toBe(false);
	});

	it('downloads a link and sends it as the file part with its name and type', async () => {
		await queryDocument(context(), { file: LINK, query: '{ total }' });
		expect(sent).toHaveLength(1);
		expect(sent[0]?.url).toBe('https://api.agentql.com/v1/query-document');
		const file = await sentFile();
		expect(file.name).toBe('invoice.pdf');
		expect(file.type).toBe('application/pdf');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
		expect(JSON.parse(String(sent[0]?.body.get('body')))).toEqual({
			query: '{ total }',
		});
		// The linked file's name is what the result is stored under.
		expect(upsertByEntityId.mock.calls[0]?.[1]).toMatchObject({
			fileName: 'invoice.pdf',
		});
	});

	it('sends {base64, filename, contentType} as the file part', async () => {
		await queryDocument(context(), {
			file: {
				base64: Buffer.from(PDF).toString('base64'),
				filename: 'scan.pdf',
				contentType: 'application/pdf',
			},
			prompt: 'the invoice total',
		});
		const file = await sentFile();
		expect(file.name).toBe('scan.pdf');
		expect(file.type).toBe('application/pdf');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
	});

	it('still sends a Blob as it was given, and an explicit fileName wins', async () => {
		const blob = new File([PDF], 'given.pdf', { type: 'application/pdf' });
		await queryDocument(context(), {
			file: blob,
			fileName: 'stored-as.pdf',
			query: '{ total }',
		});
		const file = await sentFile();
		expect(file.name).toBe('given.pdf');
		expect(file.type).toBe('application/pdf');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
		expect(upsertByEntityId.mock.calls[0]?.[1]).toMatchObject({
			fileName: 'stored-as.pdf',
		});
	});

	it('gives a link and the same bytes as a Blob the same cache key', async () => {
		await queryDocument(context(), {
			file: LINK,
			fileName: 'invoice.pdf',
			query: '{ total }',
		});
		await queryDocument(context(), {
			file: new Blob([PDF]),
			fileName: 'invoice.pdf',
			query: '{ total }',
		});
		const [first, second] = upsertByEntityId.mock.calls.map((call) => call[0]);
		expect(typeof first).toBe('string');
		expect(first).toBe(second);
	});

	it('refuses a private address before any AgentQL request', async () => {
		for (const file of [
			'https://127.0.0.1/a.pdf',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(
				queryDocument(context(), { file, query: '{ total }' }),
			).rejects.toThrow(/file URL/);
		}
		expect(sent).toHaveLength(0);
	});
});
