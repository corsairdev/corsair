jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import type { DocmosisContext } from './index';
import { docmosis } from './index';

const BASE = 'https://us1.dws4.docmosis.com/api';

function makeCtx(region?: 'us1' | 'eu1' | 'au1'): DocmosisContext {
	const subset: Pick<DocmosisContext, 'key' | 'options'> = {
		key: 'secret-key',
		options: region ? { region } : {},
	};
	// Safe: the endpoints read only key, options and db from the context.
	// A narrower type is not practical because a full CorsairPluginContext needs the hub, keys and database.
	return { ...subset, db: {}, endpoints: {} } as DocmosisContext;
}

function jsonResponse(body: object, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

const pdf = () =>
	new Response(new Uint8Array([37, 80, 68, 70, 45]), {
		status: 200,
		headers: { 'Content-Type': 'application/pdf' },
	});

describe('Docmosis HTTP requests', () => {
	const endpoints = docmosis({ key: 'secret-key' }).endpoints!;
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	function lastCall() {
		const [url, init] = fetchMock.mock.calls[0]!;
		return { url: String(url), init: init! };
	}

	function sentBody(): Record<string, string> {
		const body = lastCall().init.body;
		if (!(body instanceof FormData)) {
			throw new Error('expected a FormData body');
		}
		return Object.fromEntries(
			[...body].map(([key, value]) => [key, String(value)]),
		);
	}

	function sentHeader(name: string): string | null {
		return new Headers(lastCall().init.headers).get(name);
	}

	it.each([
		[
			'environment/ready',
			'POST',
			(c: DocmosisContext) => endpoints.admin.environmentReady(c, {}),
			{},
		],
		[
			'environment/summary',
			'POST',
			(c: DocmosisContext) => endpoints.admin.environmentSummary(c, {}),
			{},
		],
		[
			'getRenderQueue',
			'POST',
			(c: DocmosisContext) => endpoints.admin.getRenderQueue(c, {}),
			{},
		],
		[
			'uploadTemplateBatchStatus',
			'POST',
			(c: DocmosisContext) =>
				endpoints.admin.getBatchUploadStatus(c, { userJobId: 'j1' }),
			{ userJobId: 'j1' },
		],
		[
			'getRenderTags',
			'POST',
			(c: DocmosisContext) =>
				endpoints.admin.getRenderTags(c, {
					tags: 'abc',
					year: 2025,
					month: 3,
					nMonths: 2,
					padBlanks: true,
				}),
			{
				tags: 'abc',
				year: '2025',
				month: '3',
				nMonths: '2',
				padBlanks: 'true',
			},
		],
		[
			'listTemplates',
			'POST',
			(c: DocmosisContext) =>
				endpoints.templates.list(c, {
					folder: '/f',
					paging: true,
					pageSize: 10,
					includeDetail: false,
				}),
			{ folder: '/f', paging: 'true', pageSize: '10', includeDetail: 'false' },
		],
		[
			'getTemplateDetails',
			'POST',
			(c: DocmosisContext) =>
				endpoints.templates.getDetails(c, {
					templateName: '/t.docx',
					stringify: true,
				}),
			{ templateName: '/t.docx', stringify: 'true' },
		],
		[
			'getTemplateStructure',
			'POST',
			(c: DocmosisContext) =>
				endpoints.templates.getStructure(c, { templateName: '/t.docx' }),
			{ templateName: '/t.docx' },
		],
		[
			'getSampleData',
			'POST',
			(c: DocmosisContext) =>
				endpoints.templates.getSampleData(c, {
					templateName: '/t.docx',
					format: 'xml',
				}),
			{ templateName: '/t.docx', format: 'xml' },
		],
		[
			'deleteTemplate',
			'POST',
			(c: DocmosisContext) =>
				endpoints.templates.delete(c, { templateName: '/t.docx' }),
			{ templateName: '/t.docx' },
		],
		[
			'listImages',
			'POST',
			(c: DocmosisContext) =>
				endpoints.images.list(c, { folder: 'img', includeSubFolders: false }),
			{ folder: 'img', includeSubFolders: 'false' },
		],
		[
			'deleteImage',
			'POST',
			(c: DocmosisContext) =>
				endpoints.images.delete(c, { imageName: 'a.png' }),
			{ imageName: 'a.png' },
		],
	] as const)(
		'%s sends %s with the accessKey header and form body',
		async (path, method, call, form) => {
			fetchMock.mockResolvedValue(jsonResponse({ succeeded: true }));

			await call(makeCtx());

			expect(lastCall().url).toBe(`${BASE}/${path}`);
			expect(lastCall().init.method).toBe(method);
			expect(sentHeader('accessKey')).toBe('secret-key');
			expect(sentBody()).toEqual(form);
		},
	);

	it('ping GETs /ping with no body', async () => {
		fetchMock.mockResolvedValue(jsonResponse({}));

		const result = await endpoints.admin.ping(makeCtx(), {});

		expect(result).toEqual({});
		expect(lastCall().url).toBe(`${BASE}/ping`);
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('uses the configured region host', async () => {
		fetchMock.mockResolvedValue(jsonResponse({ succeeded: true }));

		await endpoints.admin.environmentReady(makeCtx('eu1'), {});

		expect(lastCall().url).toBe(
			'https://eu1.dws4.docmosis.com/api/environment/ready',
		);
	});

	it('getTemplate and getImage POST and return base64 bytes', async () => {
		fetchMock.mockImplementation(async () => pdf());

		const template = await endpoints.templates.get(makeCtx(), {
			templateName: ['/a.docx', '/b.docx'],
		});

		expect(lastCall().url).toBe(`${BASE}/getTemplate`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('accessKey')).toBe('secret-key');
		const body = lastCall().init.body;
		expect(body).toBeInstanceOf(FormData);
		if (body instanceof FormData) {
			expect(body.getAll('templateName')).toEqual(['/a.docx', '/b.docx']);
		}
		expect(template).toEqual({
			contentType: 'application/pdf',
			dataBase64: 'JVBERi0=',
			byteLength: 5,
		});

		fetchMock.mockClear();
		await endpoints.images.get(makeCtx(), { imageName: 'a.png' });
		expect(lastCall().url).toBe(`${BASE}/getImage`);
	});

	it('render POSTs template, stringified data and output name', async () => {
		fetchMock.mockImplementation(async () => pdf());

		const result = await endpoints.templates.render(makeCtx(), {
			templateName: '/t.docx',
			data: { title: 'Hi' },
			outputName: 'out.pdf',
			outputFormat: 'pdf',
			devMode: false,
			tags: 'abc',
		});

		expect(lastCall().url).toBe(`${BASE}/render`);
		expect(lastCall().init.method).toBe('POST');
		const body = lastCall().init.body;
		expect(body).toBeInstanceOf(FormData);
		if (body instanceof FormData) {
			expect(Object.fromEntries(body)).toEqual({
				templateName: '/t.docx',
				data: '{"title":"Hi"}',
				outputName: 'out.pdf',
				outputFormat: 'pdf',
				devMode: 'false',
				tags: 'abc',
			});
		}
		expect(result.contentType).toBe('application/pdf');
	});

	it('surfaces a 401 as an error carrying the status', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse(
				{ succeeded: false, shortMsg: 'Unauthorized' },
				{ status: 401 },
			),
		);

		await expect(
			endpoints.admin.environmentReady(makeCtx(), {}),
		).rejects.toMatchObject({ name: 'DocmosisAPIError', status: 401 });
	});

	it('surfaces a 429 with Retry-After in milliseconds', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse(
				{ succeeded: false, shortMsg: 'Too many requests' },
				{ status: 429, headers: { 'Retry-After': '7' } },
			),
		);

		await expect(endpoints.templates.list(makeCtx(), {})).rejects.toMatchObject(
			{ status: 429, retryAfter: 7000 },
		);
	});

	it('surfaces a binary 429 with Retry-After in milliseconds', async () => {
		fetchMock.mockResolvedValue(
			new Response('{"shortMsg":"slow down"}', {
				status: 429,
				headers: { 'Retry-After': '2' },
			}),
		);

		await expect(
			endpoints.templates.get(makeCtx(), { templateName: '/a.docx' }),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
			message: 'slow down',
		});
	});
});
