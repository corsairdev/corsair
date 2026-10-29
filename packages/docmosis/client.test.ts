import { DocmosisAPIError, makeDocmosisRequest } from './client';

const json = (body: object, init: ResponseInit = {}) =>
	new Response(JSON.stringify(body), { status: 200, ...init });

describe('makeDocmosisRequest', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	function call() {
		const [url, init] = fetchMock.mock.calls[0]!;
		return { url: String(url), init: init! };
	}

	it.each([
		['us1', 'https://us1.dws4.docmosis.com/api'],
		['eu1', 'https://eu1.dws4.docmosis.com/api'],
		['au1', 'https://au1.dws4.docmosis.com/api'],
	] as const)('uses %s region base URL', async (region, base) => {
		fetchMock.mockResolvedValue(json({ succeeded: true }));

		await makeDocmosisRequest('listTemplates', 'key-1', {
			method: 'POST',
			region,
			formData: {},
		});

		expect(call().url).toBe(`${base}/listTemplates`);
		expect(new Headers(call().init.headers).get('accessKey')).toBe('key-1');
	});

	it('sends endpoint, method and form data exactly as provided', async () => {
		fetchMock.mockResolvedValue(json({ succeeded: true }));

		const result = await makeDocmosisRequest('getTemplateDetails', 'key-2', {
			method: 'POST',
			formData: { templateName: '/t.docx', stringify: 'true' },
		});

		expect(result).toEqual({ succeeded: true });
		expect(call().url).toBe(
			'https://us1.dws4.docmosis.com/api/getTemplateDetails',
		);
		expect(call().init.method).toBe('POST');
		const body = call().init.body;
		expect(body).toBeInstanceOf(FormData);
		if (body instanceof FormData) {
			expect(Object.fromEntries(body)).toEqual({
				templateName: '/t.docx',
				stringify: 'true',
			});
		}
	});

	it('returns an empty object for an empty 200 body', async () => {
		fetchMock.mockResolvedValue(new Response('', { status: 200 }));

		expect(await makeDocmosisRequest('ping', 'key', { method: 'GET' })).toEqual(
			{},
		);
		expect(call().init.body).toBeUndefined();
	});

	it('uses the Docmosis error message and status from the response body', async () => {
		fetchMock.mockResolvedValue(
			json(
				{ succeeded: false, shortMsg: 'Invalid accessKey' },
				{ status: 400 },
			),
		);

		await expect(
			makeDocmosisRequest('environment/ready', 'bad', { formData: {} }),
		).rejects.toMatchObject({
			name: 'DocmosisAPIError',
			message: 'Invalid accessKey',
			status: 400,
		});
	});

	it('prefers longMsg over shortMsg', async () => {
		fetchMock.mockResolvedValue(
			json({ shortMsg: 'short', longMsg: 'long detail' }, { status: 400 }),
		);

		await expect(makeDocmosisRequest('render', 'k')).rejects.toMatchObject({
			message: 'long detail',
		});
	});

	it('maps a 401 to a DocmosisAPIError with status 401', async () => {
		fetchMock.mockResolvedValue(new Response('', { status: 401 }));

		await expect(
			makeDocmosisRequest('listTemplates', 'k'),
		).rejects.toMatchObject({ name: 'DocmosisAPIError', status: 401 });
	});

	it('wraps network failures without a status', async () => {
		fetchMock.mockRejectedValue(new Error('network down'));

		const error = await makeDocmosisRequest('ping', 'key-4', {
			method: 'GET',
		}).catch((e: Error) => e);

		expect(error).toBeInstanceOf(DocmosisAPIError);
		expect(error).toMatchObject({ message: 'network down' });
		expect(error).toHaveProperty('status', undefined);
	});

	it('keeps the Retry-After delay on JSON 429 responses', async () => {
		fetchMock.mockResolvedValue(
			json(
				{ shortMsg: 'Rate limited' },
				{ status: 429, headers: { 'Retry-After': '2' } },
			),
		);

		await expect(
			makeDocmosisRequest('listTemplates', 'k'),
		).rejects.toMatchObject({ status: 429, retryAfter: 2000 });
	});

	it('uses the queue-delay header on JSON 429 responses without Retry-After', async () => {
		fetchMock.mockResolvedValue(
			json(
				{ shortMsg: 'Queue full' },
				{ status: 429, headers: { 'X-Docmosis-Queue-Delay-Seconds': '3' } },
			),
		);

		await expect(makeDocmosisRequest('render', 'k')).rejects.toMatchObject({
			status: 429,
			retryAfter: 3000,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('fetches binary responses as base64', async () => {
		fetchMock.mockResolvedValue(
			new Response(new Uint8Array([1, 2, 3, 4]), {
				status: 200,
				headers: { 'Content-Type': 'image/png; charset=binary' },
			}),
		);

		const result = await makeDocmosisRequest('getImage', 'key-5', {
			method: 'POST',
			formData: { imageName: '/logo.png' },
			responseType: 'arrayBuffer',
		});

		expect(result).toEqual({
			contentType: 'image/png',
			dataBase64: 'AQIDBA==',
			byteLength: 4,
		});
		expect(call().url).toBe('https://us1.dws4.docmosis.com/api/getImage');
	});

	it('keeps the queue-delay header on binary 429 responses', async () => {
		fetchMock.mockResolvedValue(
			json(
				{ shortMsg: 'Queue full', longMsg: 'Please retry shortly' },
				{ status: 429, headers: { 'X-Docmosis-Queue-Delay-Seconds': '3' } },
			),
		);

		await expect(
			makeDocmosisRequest('render', 'k', {
				formData: { templateName: '/t.docx', data: '{}' },
				responseType: 'arrayBuffer',
			}),
		).rejects.toMatchObject({
			message: 'Please retry shortly',
			status: 429,
			retryAfter: 3000,
		});
	});

	it('encodes array and numeric form fields', async () => {
		fetchMock.mockResolvedValue(json({ succeeded: true }));

		await makeDocmosisRequest('getTemplate', 'key-8', {
			formData: { templateName: ['/a.docx', '/b.docx'], pageSize: 5 },
		});

		const body = call().init.body;
		expect(body).toBeInstanceOf(FormData);
		if (body instanceof FormData) {
			expect(body.getAll('templateName')).toEqual(['/a.docx', '/b.docx']);
			expect(body.get('pageSize')).toBe('5');
		}
	});

	it('falls back to the status text when the error body is not JSON', async () => {
		fetchMock.mockResolvedValue(
			new Response('<html>oops</html>', {
				status: 500,
				statusText: 'Internal Server Error',
			}),
		);

		await expect(makeDocmosisRequest('render', 'k')).rejects.toMatchObject({
			message: 'Internal Server Error',
			status: 500,
		});
	});
});
