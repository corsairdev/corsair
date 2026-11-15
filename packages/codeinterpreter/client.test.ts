import {
	getCodeInterpreterBaseUrl,
	makeCodeInterpreterDownload,
	makeCodeInterpreterUpload,
	parseRetryAfterMs,
} from './client';

describe('getCodeInterpreterBaseUrl', () => {
	it('defaults to the LibreChat code interpreter host', () => {
		expect(getCodeInterpreterBaseUrl()).toBe('https://code.librechat.ai/');
	});

	it('preserves path-prefixed self-hosted bases', () => {
		expect(getCodeInterpreterBaseUrl('https://host/api/v1')).toBe(
			'https://host/api/v1/',
		);
	});
});

describe('parseRetryAfterMs', () => {
	it('parses delay seconds', () => {
		expect(parseRetryAfterMs('30')).toBe(30_000);
	});

	it('parses HTTP-date values', () => {
		const future = new Date(Date.now() + 60_000).toUTCString();
		const parsed = parseRetryAfterMs(future);
		expect(parsed).toBeGreaterThan(59_000);
		expect(parsed).toBeLessThanOrEqual(60_000);
	});

	it('returns undefined for invalid values', () => {
		expect(parseRetryAfterMs('not-a-date')).toBeUndefined();
		expect(parseRetryAfterMs(null)).toBeUndefined();
	});
});

describe('makeCodeInterpreterUpload', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('uploads utf8 text without corrupting content', async () => {
		const uploaded: { bytes: Uint8Array; filename: string }[] = [];
		global.fetch = jest.fn(async (_url, init) => {
			// Why safe: this test always passes a FormData body above.
			const body = init?.body as FormData;
			// Why safe: the client appends the upload under the 'file' key.
			const file = body.get('file') as File;
			uploaded.push({
				bytes: new Uint8Array(await file.arrayBuffer()),
				filename: file.name,
			});
			return new Response(JSON.stringify({ file_id: 'file-1' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
			// Why safe: jest.fn matches the fetch signature used by the client.
		}) as typeof fetch;

		await makeCodeInterpreterUpload(
			'test-key',
			{ filename: 'hello.txt', content: 'print(1)' },
			{ baseUrl: 'https://ci.example.com' },
		);

		expect(uploaded).toHaveLength(1);
		const [firstUpload] = uploaded;
		expect(firstUpload).toBeDefined();
		expect(Buffer.from(firstUpload!.bytes).toString('utf8')).toBe('print(1)');
		expect(firstUpload!.filename).toBe('hello.txt');
	});

	it('decodes base64 content for binary uploads', async () => {
		const uploaded: Uint8Array[] = [];
		global.fetch = jest.fn(async (_url, init) => {
			// Why safe: this test always passes a FormData body above.
			const body = init?.body as FormData;
			// Why safe: the client appends the upload under the 'file' key.
			const file = body.get('file') as File;
			uploaded.push(new Uint8Array(await file.arrayBuffer()));
			return new Response(JSON.stringify({ file_id: 'file-2' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
			// Why safe: jest.fn matches the fetch signature used by the client.
		}) as typeof fetch;

		const binary = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
		await makeCodeInterpreterUpload(
			'test-key',
			{
				filename: 'image.png',
				content: binary.toString('base64'),
				contentEncoding: 'base64',
				mimeType: 'image/png',
			},
			{ baseUrl: 'https://ci.example.com' },
		);

		const [firstUpload] = uploaded;
		expect(firstUpload).toBeDefined();
		expect(Buffer.from(firstUpload!)).toEqual(binary);
	});

	it('rejects malformed base64 content', async () => {
		await expect(
			makeCodeInterpreterUpload(
				'test-key',
				{
					filename: 'image.png',
					content: 'not!!!valid-base64',
					contentEncoding: 'base64',
				},
				{ baseUrl: 'https://ci.example.com' },
			),
		).rejects.toThrow('Invalid base64 content');
	});

	it('accepts empty base64 content for zero-byte files', async () => {
		const uploaded: Uint8Array[] = [];
		global.fetch = jest.fn(async (_url, init) => {
			// Why safe: this test always passes a FormData body above.
			const body = init?.body as FormData;
			// Why safe: the client appends the upload under the 'file' key.
			const file = body.get('file') as File;
			uploaded.push(new Uint8Array(await file.arrayBuffer()));
			return new Response(JSON.stringify({ file_id: 'file-0' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
			// Why safe: jest.fn matches the fetch signature used by the client.
		}) as typeof fetch;

		await makeCodeInterpreterUpload(
			'test-key',
			{ filename: 'empty.bin', content: '', contentEncoding: 'base64' },
			{ baseUrl: 'https://ci.example.com' },
		);

		const [firstUpload] = uploaded;
		expect(firstUpload).toBeDefined();
		expect(firstUpload!.length).toBe(0);
	});
});

describe('makeCodeInterpreterDownload', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('returns binary content as base64', async () => {
		const binary = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
		global.fetch = jest.fn(
			async () =>
				new Response(binary, {
					status: 200,
					headers: {
						'Content-Type': 'image/png',
						'Content-Disposition': 'attachment; filename="image.png"',
					},
				}),
			// Why safe: jest.fn matches the fetch signature used by the client.
		) as typeof fetch;

		const result = await makeCodeInterpreterDownload(
			'files/file-1',
			'test-key',
			{
				baseUrl: 'https://ci.example.com',
			},
		);

		expect(result.base64).toBe(binary.toString('base64'));
		expect(result.contentType).toBe('image/png');
		expect(result.filename).toBe('image.png');
	});
});
