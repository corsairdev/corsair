import {
	Assets,
	Generations,
	Media,
	Renders,
	Sources,
	Templates,
	Uploads,
} from './endpoints';
import {
	ASSET_ID,
	assetReady,
	assetsByRender,
	generationModels,
	generationQueued,
	probeResponse,
	renderDone,
	renderQueued,
	sourceList,
	sourceQueued,
	sourceReady,
	templateCreated,
	templateData,
	templateList,
	transferQueued,
	uploadCreated,
} from './test-fixtures';
import { invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondNoContent() {
	fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

function expectAuthed(origin: string, path: string, method: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe(origin);
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('x-api-key')).toBe('sst-secret-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const EDIT = 'https://api.shotstack.io';
const TIMELINE = {
	tracks: [
		{ clips: [{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 }] },
	],
};
const OUTPUT = { format: 'mp4' as const, resolution: 'sd' as const };

describe('renders', () => {
	it('create POSTs the edit to /edit/v1/render', async () => {
		respond(renderQueued, 201);

		await invoke(Renders.create, {
			timeline: TIMELINE,
			output: OUTPUT,
			merge: [{ find: 'NAME', replace: 'Jane' }],
			callback: 'https://my-server.com/callback',
			instance: 'a1',
		});

		expectAuthed(EDIT, '/edit/v1/render', 'POST');
		expect(lastRequest().body).toEqual({
			timeline: TIMELINE,
			output: OUTPUT,
			merge: [{ find: 'NAME', replace: 'Jane' }],
			callback: 'https://my-server.com/callback',
			instance: 'a1',
		});
	});

	it('get GETs /edit/v1/render/{id} with data=false always sent', async () => {
		respond(renderDone);

		await invoke(Renders.get, { id: renderDone.response.id });

		expectAuthed(EDIT, `/edit/v1/render/${renderDone.response.id}`, 'GET');
		expect(lastRequest().params).toEqual({ data: 'false' });
	});

	it('get sends merged only together with data=true', async () => {
		respond(renderDone);

		await invoke(Renders.get, {
			id: renderDone.response.id,
			data: true,
			merged: true,
		});

		expect(lastRequest().params).toEqual({ data: 'true', merged: 'true' });
	});
});

describe('templates', () => {
	it('list GETs /edit/v1/templates', async () => {
		respond(templateList);

		await invoke(Templates.list, {});

		expectAuthed(EDIT, '/edit/v1/templates', 'GET');
		expect(lastRequest().body).toBeUndefined();
	});

	it('get GETs /edit/v1/templates/{id}', async () => {
		respond(templateData);

		await invoke(Templates.get, { id: templateData.response.id });

		expectAuthed(EDIT, `/edit/v1/templates/${templateData.response.id}`, 'GET');
	});

	it('create POSTs the name and template', async () => {
		respond(templateCreated, 201);

		await invoke(Templates.create, {
			name: 'My template',
			template: { timeline: TIMELINE, output: OUTPUT },
		});

		expectAuthed(EDIT, '/edit/v1/templates', 'POST');
		expect(lastRequest().body).toEqual({
			name: 'My template',
			template: { timeline: TIMELINE, output: OUTPUT },
		});
	});

	it('update PUTs the body to /edit/v1/templates/{id}', async () => {
		respond(templateCreated);

		await invoke(Templates.update, {
			id: templateData.response.id,
			name: 'Renamed',
		});

		expectAuthed(EDIT, `/edit/v1/templates/${templateData.response.id}`, 'PUT');
		expect(lastRequest().body).toEqual({
			name: 'Renamed',
			template: undefined,
		});
	});

	it('delete DELETEs /edit/v1/templates/{id}', async () => {
		respondNoContent();

		await invoke(Templates.remove, { id: templateData.response.id });

		expectAuthed(
			EDIT,
			`/edit/v1/templates/${templateData.response.id}`,
			'DELETE',
		);
	});

	it('render POSTs the id and merge fields to /edit/v1/templates/render', async () => {
		respond(renderQueued, 201);

		await invoke(Templates.render, {
			id: templateData.response.id,
			merge: [{ find: 'NAME', replace: 'Jane' }],
		});

		expectAuthed(EDIT, '/edit/v1/templates/render', 'POST');
		expect(lastRequest().body).toEqual({
			id: templateData.response.id,
			merge: [{ find: 'NAME', replace: 'Jane' }],
		});
	});
});

describe('generations', () => {
	it('create POSTs the asset to /edit/v1/generate', async () => {
		respond(generationQueued);

		await invoke(Generations.create, {
			asset: { type: 'image', prompt: 'A lighthouse at sunset' },
			length: 5,
		});

		expectAuthed(EDIT, '/edit/v1/generate', 'POST');
		expect(lastRequest().body).toEqual({
			asset: { type: 'image', prompt: 'A lighthouse at sunset' },
			length: 5,
		});
	});

	it('create sends the Idempotency-Key header from idempotencyKey', async () => {
		respond(generationQueued);

		await invoke(Generations.create, {
			asset: { type: 'image', prompt: 'A lighthouse' },
			idempotencyKey: 'gen-key-1',
		});

		expect(lastRequest().headers.get('idempotency-key')).toBe('gen-key-1');
		expect(lastRequest().body).not.toHaveProperty('idempotencyKey');
	});

	it('get GETs /edit/v1/generate/{id}', async () => {
		respond(generationQueued);

		await invoke(Generations.get, { id: generationQueued.id });

		expectAuthed(EDIT, `/edit/v1/generate/${generationQueued.id}`, 'GET');
	});

	it('quote POSTs the same asset body to /edit/v1/generate/quote', async () => {
		respond({ credits: 1, ceiling: false });

		await invoke(Generations.quote, {
			asset: {
				type: 'video',
				prompt: 'Waves',
				model: 'seedance-2.0-text-to-video',
			},
		});

		expectAuthed(EDIT, '/edit/v1/generate/quote', 'POST');
		expect(lastRequest().body).toEqual({
			asset: {
				type: 'video',
				prompt: 'Waves',
				model: 'seedance-2.0-text-to-video',
			},
		});
	});

	it('listModels GETs /edit/v1/models', async () => {
		respond(generationModels);

		await invoke(Generations.listModels, {});

		expectAuthed(EDIT, '/edit/v1/models', 'GET');
	});

	it('getModel GETs /edit/v1/models/{id}', async () => {
		respond(generationModels.models[0]);

		await invoke(Generations.getModel, { id: 'seedance-2.0-text-to-video' });

		expectAuthed(EDIT, '/edit/v1/models/seedance-2.0-text-to-video', 'GET');
	});
});

describe('media', () => {
	it('probe GETs /edit/v1/probe/{encoded url}', async () => {
		respond(probeResponse);

		await invoke(Media.probe, {
			url: 'https://shotstack-assets.s3.amazonaws.com/footage/beach.mp4',
		});

		expectAuthed(
			EDIT,
			'/edit/v1/probe/https%3A%2F%2Fshotstack-assets.s3.amazonaws.com%2Ffootage%2Fbeach.mp4',
			'GET',
		);
	});
});

describe('sources', () => {
	it('fetch POSTs the url to /ingest/v1/sources', async () => {
		respond(sourceQueued, 201);

		await invoke(Sources.fetch, {
			url: 'https://example.com/video.mp4',
			outputs: {
				renditions: [{ format: 'webm', resolution: 'sd' }],
				transcription: { format: 'vtt' },
			},
			destinations: [{ provider: 'shotstack' }],
			callback: 'https://my-server.com/callback',
		});

		expectAuthed('https://api.shotstack.io', '/ingest/v1/sources', 'POST');
		expect(lastRequest().body).toEqual({
			url: 'https://example.com/video.mp4',
			outputs: {
				renditions: [{ format: 'webm', resolution: 'sd' }],
				transcription: { format: 'vtt' },
			},
			destinations: [{ provider: 'shotstack' }],
			callback: 'https://my-server.com/callback',
		});
	});

	it('list GETs /ingest/v1/sources', async () => {
		respond(sourceList);

		await invoke(Sources.list, {});

		expectAuthed('https://api.shotstack.io', '/ingest/v1/sources', 'GET');
	});

	it('get GETs /ingest/v1/sources/{id}', async () => {
		respond(sourceReady);

		await invoke(Sources.get, { id: 'zzytey4v-32km-kq1z-aftr-3kcuqi0brad2' });

		expectAuthed(
			'https://api.shotstack.io',
			'/ingest/v1/sources/zzytey4v-32km-kq1z-aftr-3kcuqi0brad2',
			'GET',
		);
	});

	it('delete DELETEs /ingest/v1/sources/{id}', async () => {
		respondNoContent();

		await invoke(Sources.remove, {
			id: 'zzytey4v-32km-kq1z-aftr-3kcuqi0brad2',
		});

		expectAuthed(
			'https://api.shotstack.io',
			'/ingest/v1/sources/zzytey4v-32km-kq1z-aftr-3kcuqi0brad2',
			'DELETE',
		);
	});
});

describe('uploads', () => {
	it('create POSTs an empty body to /ingest/v1/upload', async () => {
		respond(uploadCreated);

		await invoke(Uploads.create, {});

		expectAuthed('https://api.shotstack.io', '/ingest/v1/upload', 'POST');
		expect(lastRequest().body).toBeUndefined();
	});
});

describe('assets', () => {
	it('get GETs /serve/v1/assets/{id}', async () => {
		respond(assetReady);

		await invoke(Assets.get, { id: ASSET_ID });

		expectAuthed(
			'https://api.shotstack.io',
			`/serve/v1/assets/${ASSET_ID}`,
			'GET',
		);
	});

	it('getByRenderId GETs /serve/v1/assets/render/{id}', async () => {
		respond(assetsByRender);

		await invoke(Assets.getByRenderId, { id: renderDone.response.id });

		expectAuthed(
			'https://api.shotstack.io',
			`/serve/v1/assets/render/${renderDone.response.id}`,
			'GET',
		);
	});

	it('transfer POSTs url, id and destinations to /serve/v1/assets', async () => {
		respond(transferQueued);

		await invoke(Assets.transfer, {
			url: 'https://s3.amazonaws.com/my-bucket/video.mp4',
			id: '018e8937-5015-75ee-aab6-03f214981133',
			destinations: [{ provider: 'shotstack' }],
		});

		expectAuthed('https://api.shotstack.io', '/serve/v1/assets', 'POST');
		expect(lastRequest().body).toEqual({
			url: 'https://s3.amazonaws.com/my-bucket/video.mp4',
			id: '018e8937-5015-75ee-aab6-03f214981133',
			destinations: [{ provider: 'shotstack' }],
		});
	});

	it('delete DELETEs /serve/v1/assets/{id}', async () => {
		respondNoContent();

		await invoke(Assets.remove, { id: ASSET_ID });

		expectAuthed(
			'https://api.shotstack.io',
			`/serve/v1/assets/${ASSET_ID}`,
			'DELETE',
		);
	});
});
