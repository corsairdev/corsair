import { AuthMissingError } from 'corsair/core';
import {
	DOCUMENSO_MAX_DOWNLOAD_BYTES,
	DOCUMENSO_MAX_UPLOAD_BYTES,
	DOCUMENSO_MAX_UPLOAD_TOTAL_BYTES,
	DOCUMENSO_REQUEST_TIMEOUT_MS,
	DocumensoAPIError,
	makeDocumensoRequest,
} from './client';
import {
	DocumensoOperationDefinitions,
	DocumensoOperationNames,
} from './endpoints/definitions';

const fetchSpy = jest.spyOn(globalThis, 'fetch');

// `unknown` because operation fixtures have different strict input types; the documented operation schema narrows each value before this transport boundary is used.
function valueAt(record: object, key: string): unknown {
	return Reflect.get(record, key);
}

function requestUrlAt(index = 0): URL {
	const requestUrl = fetchSpy.mock.calls[index]?.[0];
	if (typeof requestUrl === 'string') return new URL(requestUrl);
	if (requestUrl instanceof URL) return requestUrl;
	if (requestUrl instanceof Request) return new URL(requestUrl.url);
	throw new Error('Expected fetch to receive a request URL');
}

async function captureFailure(promise: Promise<unknown>): Promise<unknown> {
	// `unknown` because JavaScript can reject with any value; callers narrow the error type before reading its fields.
	return promise.then(
		() => null,
		(error: unknown) => error,
	);
}

describe('Documenso HTTP client', () => {
	beforeEach(() => {
		fetchSpy.mockReset();
	});

	afterAll(() => {
		fetchSpy.mockRestore();
	});

	for (const name of DocumensoOperationNames) {
		const definition = DocumensoOperationDefinitions[name];
		it(`sends the documented ${definition.method} ${definition.path} request`, async () => {
			const response = definition.binaryDownload
				? new Response(Buffer.from('%PDF-1.4'), {
						headers: { 'content-type': 'application/pdf' },
					})
				: Response.json(definition.outputExample);
			fetchSpy.mockResolvedValue(response);

			await makeDocumensoRequest(
				name,
				{
					key: 'api_documenso_test',
					baseUrl: 'https://tenant.documenso.invalid/api/v2',
				},
				definition.inputExample,
			);

			const url = requestUrlAt();
			let expectedPath: string = definition.path;
			for (const parameter of definition.pathTokens) {
				const value = valueAt(definition.inputExample, parameter);
				expectedPath = expectedPath.replace(
					`{${parameter}}`,
					encodeURIComponent(String(value)),
				);
			}
			expect(url.origin + url.pathname).toBe(
				`https://tenant.documenso.invalid/api/v2${expectedPath}`,
			);

			for (const parameter of definition.queryParams) {
				const value = valueAt(definition.inputExample, parameter);
				if (
					typeof value === 'string' ||
					typeof value === 'number' ||
					typeof value === 'boolean'
				) {
					expect(url.searchParams.get(parameter)).toBe(String(value));
				} else {
					expect(url.searchParams.has(parameter)).toBe(false);
				}
			}

			const init = fetchSpy.mock.calls[0]?.[1];
			expect(init?.method).toBe(definition.method);
			const headers = new Headers(init?.headers);
			expect(headers.get('Authorization')).toBe('api_documenso_test');
			expect(init?.credentials).toBe('omit');
			expect(init?.signal).toBeInstanceOf(AbortSignal);

			if (definition.bodyMedia === 'application/json') {
				expect(headers.get('Content-Type')).toBe('application/json');
				const body = init?.body;
				if (typeof body !== 'string')
					throw new Error('Expected JSON request body');
				// `unknown` is necessary because JSON.parse is untrusted and this loop covers heterogeneous per-operation body shapes; no narrower static type is safe before schema validation.
				const parsedBody: unknown = JSON.parse(body);
				// `unknown` is necessary because request keys and value types vary by operation; this expected record is assembled dynamically and checked against each operation's Zod schema in the endpoint tests.
				const expectedBody: Record<string, unknown> = {};
				for (const key of definition.bodyKeys) {
					const value = valueAt(definition.inputExample, key);
					if (value !== undefined) expectedBody[key] = value;
				}
				expect(parsedBody).toEqual(expectedBody);
			} else if (definition.bodyMedia === 'multipart/form-data') {
				expect(headers.get('Content-Type')).toBeNull();
				const body = init?.body;
				if (!(body instanceof FormData))
					throw new Error('Expected multipart FormData');
				const payload = valueAt(definition.inputExample, 'payload');
				if (payload !== undefined)
					expect(body.get('payload')).toBe(JSON.stringify(payload));
				for (const fieldName of definition.bodyKeys) {
					if (fieldName !== 'file' && fieldName !== 'files') continue;
					const uploads = valueAt(definition.inputExample, fieldName);
					expect(body.getAll(fieldName)).toHaveLength(
						Array.isArray(uploads)
							? uploads.length
							: uploads === undefined
								? 0
								: 1,
					);
				}
			} else {
				expect(init?.body).toBeUndefined();
			}
		});
	}

	it('uses a bounded 20-second timeout and rejects missing or empty keys before fetch', async () => {
		expect(DOCUMENSO_REQUEST_TIMEOUT_MS).toBe(20_000);
		await expect(
			makeDocumensoRequest('envelopeFind', { key: '' }, {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('keeps the production v2 base URL when no override is supplied', async () => {
		fetchSpy.mockResolvedValue(
			Response.json({
				data: [],
				count: 0,
				currentPage: 1,
				perPage: 10,
				totalPages: 0,
			}),
		);
		await makeDocumensoRequest('envelopeFind', { key: 'api_test' }, {});
		expect(requestUrlAt().origin + requestUrlAt().pathname).toBe(
			'https://app.documenso.com/api/v2/envelope',
		);
	});

	it('supports self-hosted base URLs but rejects credential-bearing or non-HTTP URLs', async () => {
		fetchSpy.mockResolvedValue(
			Response.json({
				data: [],
				count: 0,
				currentPage: 1,
				perPage: 10,
				totalPages: 0,
			}),
		);
		await makeDocumensoRequest(
			'envelopeFind',
			{
				key: 'api_test',
				baseUrl: 'https://selfhost.documenso.invalid/api/v2/',
			},
			{},
		);
		expect(requestUrlAt().origin + requestUrlAt().pathname).toBe(
			'https://selfhost.documenso.invalid/api/v2/envelope',
		);
		await expect(
			makeDocumensoRequest(
				'envelopeFind',
				{
					key: 'api_test',
					baseUrl: 'https://user:secret@selfhost.documenso.invalid/api/v2',
				},
				{},
			),
		).rejects.toThrow('HTTP(S) URL');
		await expect(
			makeDocumensoRequest(
				'envelopeFind',
				{ key: 'api_test', baseUrl: 'file:///tmp/api' },
				{},
			),
		).rejects.toThrow('HTTP(S) URL');
	});

	it('preserves Retry-After from a real transport response without replaying the request', async () => {
		fetchSpy.mockResolvedValue(
			new Response('{"error":"api_secret_echo"}', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'retry-after': '4' },
			}),
		);
		const failure = await captureFailure(
			makeDocumensoRequest(
				'envelopeFind',
				{ key: 'api_test', baseUrl: 'https://tenant.documenso.invalid/api/v2' },
				{},
			),
		);
		expect(failure).toBeInstanceOf(DocumensoAPIError);
		if (!(failure instanceof DocumensoAPIError))
			throw new Error('Expected a Documenso API error');
		expect(failure.status).toBe(429);
		expect(failure.retryAfter).toBe(4000);
		expect(failure.message).not.toContain('api_secret_echo');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('redacts echoed credentials and request data from propagated HTTP errors', async () => {
		fetchSpy.mockResolvedValue(
			new Response('{"message":"api_test and signer@documenso.invalid"}', {
				status: 500,
			}),
		);
		const failure = await captureFailure(
			makeDocumensoRequest('envelopeFind', { key: 'api_test' }, {}),
		);
		expect(failure).toBeInstanceOf(DocumensoAPIError);
		if (!(failure instanceof DocumensoAPIError))
			throw new Error('Expected a Documenso API error');
		expect(failure.message).not.toContain('api_test');
		expect(failure.message).not.toContain('signer@documenso.invalid');
	});

	it('uploads PDF bytes as multipart without leaking content into headers', async () => {
		fetchSpy.mockResolvedValue(Response.json({ id: 'envelope_created' }));
		const definition = DocumensoOperationDefinitions.envelopeCreate;
		await makeDocumensoRequest(
			'envelopeCreate',
			{ key: 'api_test' },
			definition.inputExample,
		);
		const body = fetchSpy.mock.calls[0]?.[1]?.body;
		if (!(body instanceof FormData))
			throw new Error('Expected multipart form data');
		const file = body.get('files');
		expect(file).toBeInstanceOf(File);
		if (!(file instanceof File)) throw new Error('Expected an uploaded File');
		expect(file.name).toBe('contract.pdf');
		expect(file.type).toBe('application/pdf');
		expect(file.size).toBeLessThanOrEqual(DOCUMENSO_MAX_UPLOAD_BYTES);
	});

	it('bounds aggregate multipart bytes across multiple files', async () => {
		const contentBase64 = Buffer.alloc(12 * 1024 * 1024).toString('base64');
		const definition = DocumensoOperationDefinitions.envelopeCreate;
		const input = {
			...definition.inputExample,
			files: [0, 1, 2].map((index) => ({
				filename: `contract-${index}.pdf`,
				contentType: 'application/pdf',
				contentBase64,
			})),
		};

		await expect(
			makeDocumensoRequest('envelopeCreate', { key: 'api_test' }, input),
		).rejects.toThrow(`${DOCUMENSO_MAX_UPLOAD_TOTAL_BYTES}-byte plugin limit`);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('returns PDF downloads as bounded base64 data with exact byte size', async () => {
		const bytes = Buffer.from('%PDF-1.4\n');
		fetchSpy.mockResolvedValue(
			new Response(bytes, { headers: { 'content-type': 'application/pdf' } }),
		);
		const result = await makeDocumensoRequest(
			'envelopeItemDownload',
			{ key: 'api_test' },
			DocumensoOperationDefinitions.envelopeItemDownload.inputExample,
		);
		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: bytes.toString('base64'),
			size: bytes.byteLength,
		});
		expect(DOCUMENSO_MAX_DOWNLOAD_BYTES).toBe(20 * 1024 * 1024);
	});

	it('cancels downloads whose declared size exceeds the cap', async () => {
		fetchSpy.mockResolvedValue(
			new Response('too large', {
				headers: {
					'content-type': 'application/pdf',
					'content-length': String(DOCUMENSO_MAX_DOWNLOAD_BYTES + 1),
				},
			}),
		);
		await expect(
			makeDocumensoRequest(
				'envelopeItemDownload',
				{ key: 'api_test' },
				DocumensoOperationDefinitions.envelopeItemDownload.inputExample,
			),
		).rejects.toThrow('plugin limit');
	});
});
