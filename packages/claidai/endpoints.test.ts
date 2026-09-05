import { logEventFromContext } from 'corsair/core';
import {
	backgroundGenerate,
	backgroundRemove,
	createStorage,
	deleteStorage,
	generativeResize,
	imageAiEdit,
	imageEditBatch,
	imageGenerate,
	licensePlateBlur,
	patchStorage,
	polishImage,
	smartFrame,
	storageDetails,
	storageList,
	storageTypes,
} from './endpoints';
import { claidAiEndpointMeta, claidAiEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

// Narrow jest mock typing only; test-only, never exported.
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof storageList>[0];

function makeCtx() {
	// Test-only minimal context; real ctx comes from the Corsair runtime.
	return { key: 'test-key', options: {} } as unknown as Ctx;
}

// Unknown is test-only: fetch-mock capture/payload shapes vary per case.
let captured: { url: string; method: string; body?: unknown } | undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		let body: unknown;
		try {
			body = init?.body ? JSON.parse(String(init?.body)) : undefined;
		} catch {
			body = init?.body;
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
		// Test-only fetch stub; safe because it is restored in afterEach.
	}) as unknown as typeof global.fetch;
}

function pathOf(): string {
	const url = new URL(captured?.url ?? 'http://invalid');
	return url.pathname;
}

describe('Claid.ai endpoints', () => {
	it('backgroundRemove calls POST /v1/image/edit', async () => {
		mockFetch({ data: { output: { tmp_url: 'https://x/y.png' } } });
		const out = await backgroundRemove(makeCtx(), {
			input: 'https://example.com/a.png',
			operations: { background: { remove: true } },
		});
		expect(pathOf()).toBe('/v1/image/edit');
		expect(captured?.method).toBe('POST');
		expect(out.data).toBeDefined();
		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('imageEditBatch calls POST /v1/image/edit/batch', async () => {
		mockFetch({ data: { id: 1, status: 'ACCEPTED' } });
		const out = await imageEditBatch(makeCtx(), {
			input: ['https://example.com/a.png'],
			operations: { background: { remove: true } },
		});
		expect(pathOf()).toBe('/v1/image/edit/batch');
		expect(out.data?.status).toBe('ACCEPTED');
	});

	it('licensePlateBlur posts privacy blur_car_plate', async () => {
		mockFetch({ data: {} });
		await licensePlateBlur(makeCtx(), { input: 'https://example.com/car.png' });
		expect(pathOf()).toBe('/v1/image/edit');
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toMatchObject({
			operations: { privacy: { blur_car_plate: true } },
		});
	});

	it('smartFrame and generativeResize post to /v1/image/edit', async () => {
		mockFetch({ data: {} });
		await smartFrame(makeCtx(), {
			input: 'https://example.com/a.png',
			options: { padding: '10%' },
		});
		expect(pathOf()).toBe('/v1/image/edit');

		mockFetch({ data: {} });
		await generativeResize(makeCtx(), {
			input: 'https://example.com/a.png',
			operations: { resizing: { fit: 'outpaint' } },
		});
		expect(pathOf()).toBe('/v1/image/edit');
	});

	it('polishImage posts restorations.polish', async () => {
		mockFetch({ data: {} });
		await polishImage(makeCtx(), { input: 'https://example.com/a.png' });
		expect(captured?.body).toMatchObject({
			operations: { restorations: { polish: true } },
		});
	});

	it('imageGenerate calls POST /v1/image/generate', async () => {
		mockFetch({ data: { output: [] } });
		await imageGenerate(makeCtx(), { input: 'a red bicycle on a beach' });
		expect(pathOf()).toBe('/v1/image/generate');
		expect(captured?.method).toBe('POST');
	});

	it('backgroundGenerate calls POST /v1/scene/create', async () => {
		mockFetch({ data: { output: [] } });
		await backgroundGenerate(makeCtx(), {
			object: { image_url: 'https://example.com/p.png' },
			scene: { prompt: 'marble countertop' },
		});
		expect(pathOf()).toBe('/v1/scene/create');
	});

	it('imageAiEdit calls POST /v1/image/ai-edit', async () => {
		mockFetch({ data: { id: 7, status: 'ACCEPTED' } });
		await imageAiEdit(makeCtx(), {
			input: 'https://example.com/a.png',
			options: { prompt: 'make it sunset' },
		});
		expect(pathOf()).toBe('/v1/image/ai-edit');
	});

	it('storageTypes and storageList call GET storage reads', async () => {
		mockFetch({ data: ['web_folder', 's3', 'gcs'] });
		const types = await storageTypes(makeCtx(), {});
		expect(pathOf()).toBe('/v1/storage/storage-types');
		expect(types.data).toContain('s3');

		mockFetch({ data: [] });
		const list = await storageList(makeCtx(), {});
		expect(pathOf()).toBe('/v1/storage/storages');
		expect(Array.isArray(list.data)).toBe(true);
	});

	it('createStorage posts and patchStorage patches by id', async () => {
		mockFetch({ data: { id: 1, name: 's', type: 's3', parameters: {} } });
		await createStorage(makeCtx(), {
			name: 's3-playground',
			type: 's3',
			parameters: { bucket: 'playground' },
		});
		expect(pathOf()).toBe('/v1/storage/storages');
		expect(captured?.method).toBe('POST');

		mockFetch({ data: { id: 1, name: 'renamed', type: 's3', parameters: {} } });
		const patched = await patchStorage(makeCtx(), {
			storage_id: 1,
			name: 'renamed',
		});
		expect(pathOf()).toBe('/v1/storage/storages/1');
		expect(captured?.method).toBe('PATCH');
		expect(patched.data?.name).toBe('renamed');
	});

	it('storageDetails gets and deleteStorage deletes by id', async () => {
		mockFetch({ data: { id: 1, name: 's', type: 's3', parameters: {} } });
		const got = await storageDetails(makeCtx(), { storage_id: 1 });
		expect(pathOf()).toBe('/v1/storage/storages/1');
		expect(captured?.method).toBe('GET');
		expect(got.data?.id).toBe(1);

		mockFetch({ data: null });
		await deleteStorage(makeCtx(), { storage_id: 1 });
		expect(pathOf()).toBe('/v1/storage/storages/1');
		expect(captured?.method).toBe('DELETE');
	});

	it('covers every registered operation', () => {
		expect(Object.keys(claidAiEndpointMeta).sort()).toEqual(
			Object.keys(claidAiEndpointSchemas).sort(),
		);
		expect(Object.keys(claidAiEndpointSchemas)).toContain('deleteStorage');
	});
});
