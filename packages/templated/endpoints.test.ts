import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { Assets, Renders, Templates } from './endpoints';
import {
	account,
	authErrorResponse,
	folder,
	foldersList,
	fontsList,
	mergedPdf,
	notFoundResponse,
	pendingRender,
	render,
	renderCreated,
	rendersList,
	tagsResponse,
	template,
	templateLayer,
	templateLayers,
	templatesList,
	upload,
	uploadsList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'templated-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: parsed.searchParams,
		queryObject: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.templated.io');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/**
 * Resolves to the rejection reason, narrowed to core's ApiError, which the
 * client passes on.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('renders.list and renders.get', () => {
	it('GETs /v1/renders with no query, because the route takes none', async () => {
		respond(rendersList);

		const result = await invoke(Renders.rendersList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/renders',
			method: 'GET',
		});
		expect(lastRequest().queryObject).toEqual({});
		expect(result).toHaveLength(1);
		expect(result[0]?.format).toBe('jpg');
	});

	it('rejects a filter the route does not define', async () => {
		// The renders list documents no query parameters, so passing one is a
		// mistake the schema should catch rather than send and have ignored.
		await expect(invoke(Renders.rendersList, { page: 1 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('GETs one render by id', async () => {
		respond(render);

		const result = await invoke(Renders.rendersGet, {
			renderId: 'ce424057-6b54-41bb-afec-adc35a2b9175',
		});

		expect(lastRequest().path).toBe(
			'/v1/render/ce424057-6b54-41bb-afec-adc35a2b9175',
		);
		expect(result.status).toBe('COMPLETED');
	});
});

describe('renders.create', () => {
	it('POSTs a render with its template and layer overrides', async () => {
		respond(renderCreated);

		const result = await invoke(Renders.rendersCreate, {
			template: '1f1231-dasd123-fsdf12312-fds4123-asdas23',
			layers: { 'text-1': { text: 'Hello', color: '#FF0000' } },
			format: 'pdf',
			flatten: true,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/render',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			template: '1f1231-dasd123-fsdf12312-fds4123-asdas23',
			layers: { 'text-1': { text: 'Hello', color: '#FF0000' } },
			format: 'pdf',
			flatten: true,
		});
		// A single render answers one object, not an array.
		expect(Array.isArray(result)).toBe(false);
		expect((result as { url?: string | null }).url).toBe(render.url);
	});

	it('sends numeric, boolean and object layer overrides as given', async () => {
		respond(renderCreated);

		await invoke(Renders.rendersCreate, {
			template: 'tpl-1',
			layers: {
				title: { x: 100, hide: true, animation: { in: { type: 'fade' } } },
			},
		});

		expect(lastRequest().body).toMatchObject({
			layers: {
				title: { x: 100, hide: true, animation: { in: { type: 'fade' } } },
			},
		});
	});

	it('accepts a batch of templates without a single template', async () => {
		respond([renderCreated]);

		await invoke(Renders.rendersCreate, {
			templates: ['t-1', 't-2'],
		});

		expect(lastRequest().body).toMatchObject({ templates: ['t-1', 't-2'] });
	});

	it('rejects a render with neither template nor templates', async () => {
		await expect(
			invoke(Renders.rendersCreate, { format: 'pdf' }),
		).rejects.toThrow(/template/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a width outside the documented 100 to 5000 range', async () => {
		await expect(
			invoke(Renders.rendersCreate, { template: 't-1', width: 50 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown format', async () => {
		await expect(
			invoke(Renders.rendersCreate, { template: 't-1', format: 'gif' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('parses an async render that is still pending', async () => {
		respond(pendingRender);

		const result = await invoke(Renders.rendersCreate, {
			template: 't-1',
			async: true,
		});

		const single = result as { status?: string | null; url?: string | null };
		expect(single.status).toBe('PENDING');
		// A pending render has no URL yet.
		expect(single.url).toBeNull();
	});
});

describe('renders.duplicate, delete and merge', () => {
	it('POSTs a duplicate', async () => {
		respond(renderCreated);

		await invoke(Renders.rendersDuplicate, { renderId: render.id });

		expect(lastRequest()).toMatchObject({
			path: `/v1/render/${render.id}/duplicate`,
			method: 'POST',
		});
	});

	it('DELETEs a render and reports success for the 204', async () => {
		respondEmpty(204);

		const result = await invoke(Renders.rendersRemove, {
			renderId: render.id,
		});

		expect(lastRequest()).toMatchObject({
			path: `/v1/render/${render.id}`,
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('merges renders and always asks for the hosted URL', async () => {
		respond(mergedPdf);

		const result = await invoke(Renders.rendersMerge, {
			ids: ['r-1', 'r-2'],
			name: 'packet',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/render/merge',
			method: 'POST',
		});
		// Without host: true the route answers the file bytes, which this plugin
		// does not model.
		expect(lastRequest().body).toMatchObject({
			ids: ['r-1', 'r-2'],
			host: true,
		});
		expect(result.url).toBe(mergedPdf.url);
	});

	it('rejects a merge with no render ids', async () => {
		await expect(invoke(Renders.rendersMerge, { ids: [] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('templates', () => {
	it('lists templates with the documented filters', async () => {
		respond(templatesList);

		const result = await invoke(Templates.templatesList, {
			page: 0,
			limit: 25,
			width: 1024,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/templates',
			method: 'GET',
		});
		expect(lastRequest().queryObject).toEqual({
			page: '0',
			limit: '25',
			width: '1024',
		});
		expect(result[0]?.layersCount).toBe(3);
	});

	it('gets a template with its layers', async () => {
		respond(template);

		await invoke(Templates.templatesGet, {
			templateId: template.id,
			includeLayers: true,
		});

		expect(lastRequest().path).toBe(`/v1/template/${template.id}`);
		expect(lastRequest().queryObject).toEqual({ includeLayers: 'true' });
	});

	it('lists the layers and can include locked ones', async () => {
		respond(templateLayers);

		const result = await invoke(Templates.templatesLayers, {
			templateId: template.id,
			includeLockedLayers: true,
		});

		expect(lastRequest().path).toBe(`/v1/template/${template.id}/layers`);
		expect(lastRequest().queryObject).toEqual({ includeLockedLayers: 'true' });
		expect(result[0]?.layer).toBe('text-1');
	});

	it('creates a template from its layers', async () => {
		respond(template);

		await invoke(Templates.templatesCreate, {
			name: 'Twitter Bubble Square Template',
			width: 1024,
			height: 1024,
			layers: [templateLayer],
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/template',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			name: 'Twitter Bubble Square Template',
			width: 1024,
			height: 1024,
		});
	});

	it('rejects a template wider than 5000', async () => {
		await expect(
			invoke(Templates.templatesCreate, {
				name: 'x',
				width: 6000,
				height: 100,
				layers: [templateLayer],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a template', async () => {
		respondEmpty(204);

		const result = await invoke(Templates.templatesRemove, {
			templateId: template.id,
		});

		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
		expect(result).toEqual({ success: true });
	});

	it('sends tags as a bare array on add, and on remove', async () => {
		respond(tagsResponse);

		await invoke(Templates.templatesAddTags, {
			templateId: template.id,
			tags: ['instagram', 'story'],
		});
		expect(lastRequest()).toMatchObject({
			path: `/v1/template/${template.id}/tags`,
			method: 'POST',
		});
		// The docs show a bare array, not { tags: [...] }.
		expect(lastRequest().body).toEqual(['instagram', 'story']);

		respond(tagsResponse);
		await invoke(Templates.templatesRemoveTags, {
			templateId: template.id,
			tags: ['story'],
		});
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
		expect(lastRequest().body).toEqual(['story']);
	});

	it('rejects an empty tag list', async () => {
		await expect(
			invoke(Templates.templatesAddTags, { templateId: template.id, tags: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('uploads', () => {
	it('lists uploads with a comma-joined tag filter', async () => {
		respond(uploadsList);

		const result = await invoke(Assets.uploadsList, {
			query: 'banner',
			tags: ['social', 'marketing'],
			page: 0,
			limit: 10,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/uploads',
			method: 'GET',
		});
		expect(lastRequest().queryObject).toMatchObject({
			query: 'banner',
			tags: 'social,marketing',
			page: '0',
			limit: '10',
		});
		expect(result[0]?.id).toBe('upl_123abc');
	});

	it('uploads a file as multipart, never JSON', async () => {
		respond(upload);

		const result = await invoke(Assets.uploadsCreate, {
			fileName: 'logo.png',
			fileBase64: Buffer.from('fake-png-bytes').toString('base64'),
			contentType: 'image/png',
			tags: ['brand'],
			externalId: 'asset-1',
		});

		const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(new URL(url).pathname).toBe('/v1/upload');
		expect(init.method).toBe('POST');
		// fetch writes the boundary itself.
		expect(new Headers(init.headers).get('content-type')).toBeNull();

		const sent = init.body as FormData;
		expect(sent).toBeInstanceOf(FormData);
		expect(sent.get('file')).toBeInstanceOf(Blob);
		// A named file part, not the default "blob".
		expect((sent.get('file') as File).name).toBe('logo.png');
		expect(sent.getAll('tags')).toEqual(['brand']);
		expect(sent.get('externalId')).toBe('asset-1');
		expect(result.id).toBe('upl_123abc');
	});

	it('infers the media type from the extension when none is given', async () => {
		respond(upload);

		await invoke(Assets.uploadsCreate, {
			fileName: 'logo.webp',
			fileBase64: Buffer.from('fake-webp-bytes').toString('base64'),
		});

		const [, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		const file = (init.body as FormData).get('file') as File;
		expect(file.type).toBe('image/webp');
	});

	it('deletes uploads with repeated ids query values', async () => {
		respondEmpty(204);

		const result = await invoke(Assets.uploadsRemove, {
			uploadIds: ['upl_1', 'upl_2'],
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({ path: '/v1/uploads', method: 'DELETE' });
		// The route takes repeated ids parameters, not one comma-joined value.
		expect(sent.query.getAll('ids')).toEqual(['upl_1', 'upl_2']);
		expect(result).toEqual({ success: true });
	});
});

describe('folders, fonts and account', () => {
	it('lists, creates, renames and deletes a folder', async () => {
		respond(foldersList);
		const listed = await invoke(Assets.foldersList, { page: 0 });
		expect(lastRequest().path).toBe('/v1/folders');
		expect(listed[0]?.templateCount).toBe(4);

		respond(folder);
		await invoke(Assets.foldersCreate, { name: 'My New Folder' });
		expect(lastRequest().body).toEqual({ name: 'My New Folder' });

		respond(folder);
		await invoke(Assets.foldersUpdate, {
			folderId: folder.id,
			name: 'Renamed',
		});
		expect(lastRequest()).toMatchObject({
			path: `/v1/folder/${folder.id}`,
			method: 'PUT',
		});

		respondEmpty(204);
		await invoke(Assets.foldersRemove, { folderId: folder.id });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});

	it('lists account fonts and the gallery', async () => {
		respond(fontsList);
		const mine = await invoke(Assets.fontsList, {});
		expect(lastRequest().path).toBe('/v1/fonts');
		expect(mine[0]?.isGoogleFont).toBe(true);

		respond(fontsList);
		await invoke(Assets.galleryFontsList, {});
		expect(lastRequest().path).toBe('/v1/fonts/gallery');
	});

	it('reads the account usage', async () => {
		respond(account);

		const result = await invoke(Assets.accountGet, {});

		expect(lastRequest().path).toBe('/v1/account');
		expect(result.apiUsage).toBe(5400);
		expect(result.plan).toBe('Scale');
	});
});

describe('error handling', () => {
	it('parses the auth envelope', async () => {
		respond(authErrorResponse, 401);

		const error = await rejection(invoke(Renders.rendersList, {}));

		expect(error.status).toBe(401);
		expect(error.message).toContain('Templated 401');
		expect(error.message).toContain('API key not valid');
	});

	it('parses the framework envelope and keeps the path', async () => {
		respond(notFoundResponse, 404);

		const error = await rejection(
			invoke(Renders.rendersGet, { renderId: 'missing' }),
		);

		expect(error.status).toBe(404);
		expect(error.body).toMatchObject({ error: 'Not Found', path: '/v1/nope' });
	});

	it('drops the render payload from the error it throws', async () => {
		respond(notFoundResponse, 404);

		const error = await rejection(
			invoke(Renders.rendersCreate, {
				template: 'tpl-1',
				layers: { 'text-1': { text: 'Client secret plan for Jane Doe' } },
			}),
		);

		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('Jane Doe');
		expect(require('node:util').inspect(error, { depth: 10 })).not.toContain(
			'Jane Doe',
		);
	});

	it('encodes ids so a crafted one cannot reach another route', async () => {
		respond(render);

		await invoke(Renders.rendersGet, { renderId: '../template/abc?x=1' });

		expect(lastRequest().path).toBe('/v1/render/..%2Ftemplate%2Fabc%3Fx%3D1');
	});

	it('never leaks the key through the error', async () => {
		respond(authErrorResponse, 401);

		const error = await rejection(invoke(Renders.rendersList, {}));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('fails loudly when a list answers a non-array', async () => {
		respond({ renders: [] });

		await expect(invoke(Renders.rendersList, {})).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(render);

		await invoke(Renders.rendersGet, { renderId: render.id });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'templated.renders.get',
			{},
			'completed',
		);
	});
});
