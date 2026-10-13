import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { ClaidAiAPIError } from './client';
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
import { errorHandlers } from './error-handlers';
import type { ClaidAiContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => null),
}));

const logEvent = jest.mocked(logEventFromContext);
const fetchMock = jest.spyOn(global, 'fetch');

function makeStore() {
	return {
		upsertByEntityId: jest.fn(async (_id: string, _data: object) => undefined),
		deleteByEntityId: jest.fn(async (_id: string) => true),
	};
}

const db = {
	editedImages: makeStore(),
	generatedImages: makeStore(),
	imageTasks: makeStore(),
	storages: makeStore(),
	storageTypes: makeStore(),
};

// Safe: endpoints only read ctx.key, and ctx.db is attached with mock stores; the rest is unused and logEventFromContext is mocked above.
// A narrower type is not practical because ClaidAiContext also carries the hooks and key managers the runtime injects.
const ctx = Object.assign({ key: 'test-key', options: {} } as ClaidAiContext, {
	db,
});

const BASE = 'https://api.claid.ai/v1';

function respond(
	status: number,
	body: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function sentRequest() {
	expect(fetchMock).toHaveBeenCalledTimes(1);
	const [url, init] = fetchMock.mock.calls[0] ?? [];
	const headers = new Headers(init?.headers);
	return {
		url: String(url),
		method: init?.method,
		authorization: headers.get('Authorization'),
		contentType: headers.get('Content-Type'),
		body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

const IMAGE_OUT = {
	ext: 'png',
	mps: 1.048576,
	mime: 'image/png',
	format: 'png',
	width: 1024,
	height: 1024,
	tmp_url: 'https://storage.googleapis.com/claid-tmp/out.png',
};

const IMAGE_IN = {
	ext: 'jpg',
	mps: 0.25,
	mime: 'image/jpeg',
	format: 'jpeg',
	width: 500,
	height: 500,
};

const EDIT_RESPONSE = { data: { input: IMAGE_IN, output: IMAGE_OUT } };

const STORAGE = {
	id: 12,
	name: 's3-playground',
	type: 's3',
	parameters: {
		path: 'images/',
		bucket: 'playground',
		credentials: { access_key: 'AKIAEXAMPLE' },
	},
	created_at: '2025-03-13T11:37:09.160554+00:00',
};

beforeEach(() => {
	fetchMock.mockReset();
	logEvent.mockClear();
	for (const store of Object.values(db)) {
		store.upsertByEntityId.mockClear();
		store.deleteByEntityId.mockClear();
	}
});

afterAll(() => {
	fetchMock.mockRestore();
});

describe('image edit endpoints', () => {
	it('backgroundRemove posts background.remove to /image/edit', async () => {
		respond(200, EDIT_RESPONSE);

		const result = await backgroundRemove(ctx, {
			input: 'https://example.com/shoe.jpg',
			color: '#ffffff',
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/edit`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: 'https://example.com/shoe.jpg',
				operations: { background: { remove: true, color: '#ffffff' } },
			},
		});
		expect(result).toEqual(EDIT_RESPONSE);
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'claidai.background.remove',
			{ input: 'https://example.com/shoe.jpg', color: '#ffffff' },
			'completed',
		);
	});

	it('licensePlateBlur posts privacy.blur_car_plate to /image/edit', async () => {
		respond(200, EDIT_RESPONSE);

		const result = await licensePlateBlur(ctx, {
			input: 'https://example.com/car.jpg',
			output: 'storage://bucket/out/car.jpg',
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/edit`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: 'https://example.com/car.jpg',
				operations: { privacy: { blur_car_plate: true } },
				output: 'storage://bucket/out/car.jpg',
			},
		});
		expect(result).toEqual(EDIT_RESPONSE);
	});

	it('smartFrame posts a canvas resize with padding and color', async () => {
		respond(200, EDIT_RESPONSE);

		const result = await smartFrame(ctx, {
			input: 'https://example.com/bag.jpg',
			width: 1600,
			height: 900,
			padding: '10%',
			background_color: '#f5f5f5',
		});

		expect(sentRequest().body).toEqual({
			input: 'https://example.com/bag.jpg',
			operations: {
				resizing: { width: 1600, height: 900, fit: 'canvas' },
				padding: '10%',
				background: { color: '#f5f5f5' },
			},
		});
		expect(result).toEqual(EDIT_RESPONSE);
	});

	it('smartFrame omits padding and background when not given', async () => {
		respond(200, EDIT_RESPONSE);

		await smartFrame(ctx, {
			input: 'https://example.com/bag.jpg',
			width: 800,
			height: 800,
		});

		expect(sentRequest().body).toEqual({
			input: 'https://example.com/bag.jpg',
			operations: { resizing: { width: 800, height: 800, fit: 'canvas' } },
		});
	});

	it('generativeResize posts an outpaint resize', async () => {
		respond(200, EDIT_RESPONSE);

		const result = await generativeResize(ctx, {
			input: 'https://example.com/room.jpg',
			width: '150%',
			height: '100%',
			feathering: '20%',
		});

		expect(sentRequest()).toMatchObject({
			url: `${BASE}/image/edit`,
			method: 'POST',
			body: {
				input: 'https://example.com/room.jpg',
				operations: {
					resizing: {
						width: '150%',
						height: '100%',
						fit: { type: 'outpaint', feathering: '20%' },
					},
				},
			},
		});
		expect(result).toEqual(EDIT_RESPONSE);
	});

	it('generativeResize uses the plain outpaint fit without feathering', async () => {
		respond(200, EDIT_RESPONSE);

		await generativeResize(ctx, {
			input: 'https://example.com/room.jpg',
			width: 1920,
			height: 1080,
		});

		expect(sentRequest().body.operations).toEqual({
			resizing: { width: 1920, height: 1080, fit: 'outpaint' },
		});
	});

	it('polishImage posts restorations.polish to /image/edit', async () => {
		respond(200, EDIT_RESPONSE);

		const result = await polishImage(ctx, {
			input: 'https://example.com/old.jpg',
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/edit`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: 'https://example.com/old.jpg',
				operations: { restorations: { polish: true } },
			},
		});
		expect(result).toEqual(EDIT_RESPONSE);
	});
});

describe('async and generation endpoints', () => {
	it('imageEditBatch posts to /image/edit/batch and returns the task', async () => {
		const task = {
			data: {
				id: 1,
				status: 'ACCEPTED',
				result_url: `${BASE}/image/edit/batch/1`,
				created_at: '2023-03-13T11:37:09.160554+00:00',
				request: {
					input: 'storage://storage_1/input_folder/',
					operations: { resizing: { width: 1000 } },
					output: 'storage://storage_1/output_folder/',
				},
			},
		};
		respond(200, task);

		const result = await imageEditBatch(ctx, {
			input: { source: 'storage://storage_1/input_folder/', recursive: true },
			operations: { resizing: { width: 1000 } },
			output: 'storage://storage_1/output_folder/',
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/edit/batch`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: { source: 'storage://storage_1/input_folder/', recursive: true },
				operations: { resizing: { width: 1000 } },
				output: 'storage://storage_1/output_folder/',
			},
		});
		expect(result).toEqual(task);
	});

	it('imageAiEdit posts to /image/ai-edit and returns the task', async () => {
		const task = {
			data: {
				id: 7,
				status: 'ACCEPTED',
				result_url: `${BASE}/image/ai-edit/7`,
				created_at: '2025-03-13T11:37:09.160554+00:00',
			},
		};
		respond(200, task);

		const result = await imageAiEdit(ctx, {
			input: 'https://picsum.photos/500',
			options: { prompt: 'add a duck', model: 'v2' },
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/ai-edit`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: 'https://picsum.photos/500',
				options: { prompt: 'add a duck', model: 'v2' },
			},
		});
		expect(result).toEqual(task);
	});

	it('imageGenerate posts the prompt to /image/generate', async () => {
		const generated = {
			data: {
				input: { text: 'A delicious ceviche cheesecake slice' },
				output: [IMAGE_OUT],
			},
		};
		respond(200, generated);

		const result = await imageGenerate(ctx, {
			input: 'A delicious ceviche cheesecake slice',
			options: { number_of_images: 1, guidance_scale: 5 },
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/image/generate`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				input: 'A delicious ceviche cheesecake slice',
				options: { number_of_images: 1, guidance_scale: 5 },
			},
		});
		expect(result).toEqual(generated);
	});

	it('backgroundGenerate posts object and scene to /scene/create', async () => {
		const generated = { data: { output: [IMAGE_OUT] } };
		respond(200, generated);

		const result = await backgroundGenerate(ctx, {
			object: {
				image_url: 'https://example.com/product.png',
				scale: 0.55,
				position: { x: 0.35, y: 0.5 },
			},
			scene: { prompt: 'marble countertop', view: 'front' },
			output: { number_of_images: 1, format: 'png' },
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/scene/create`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				object: {
					image_url: 'https://example.com/product.png',
					scale: 0.55,
					position: { x: 0.35, y: 0.5 },
				},
				scene: { prompt: 'marble countertop', view: 'front' },
				output: { number_of_images: 1, format: 'png' },
			},
		});
		expect(result).toEqual(generated);
	});
});

describe('storage endpoints', () => {
	it('storageTypes gets /storage/storage-types', async () => {
		respond(200, { data: ['web_folder', 's3', 'gcs'] });

		const result = await storageTypes(ctx, {});

		expect(sentRequest()).toEqual({
			url: `${BASE}/storage/storage-types`,
			method: 'GET',
			authorization: 'Bearer test-key',
			contentType: null,
			body: undefined,
		});
		expect(result).toEqual({ data: ['web_folder', 's3', 'gcs'] });
	});

	it('storageList gets /storage/storages', async () => {
		const listed = {
			data: [
				{
					id: 12,
					name: 's3-playground',
					type: 's3',
					parameters: { path: '', bucket: 'playground' },
					created_at: '2025-03-13T11:37:09.160554+00:00',
				},
				{
					id: 13,
					name: 'site-images',
					type: 'web_folder',
					parameters: { base_url: 'https://example.com/images/' },
					created_at: '2025-03-14T08:00:00+00:00',
				},
			],
		};
		respond(200, listed);

		const result = await storageList(ctx, {});

		expect(sentRequest()).toMatchObject({
			url: `${BASE}/storage/storages`,
			method: 'GET',
		});
		expect(result).toEqual(listed);
	});

	it('createStorage posts credentials and keeps them out of the event log', async () => {
		respond(200, { data: STORAGE });

		const result = await createStorage(ctx, {
			name: 's3-playground',
			type: 's3',
			parameters: {
				path: 'images/',
				bucket: 'playground',
				credentials: {
					access_key: 'AKIAEXAMPLE',
					secret_access_key: 'secret-value',
				},
			},
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/storage/storages`,
			method: 'POST',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				name: 's3-playground',
				type: 's3',
				parameters: {
					path: 'images/',
					bucket: 'playground',
					credentials: {
						access_key: 'AKIAEXAMPLE',
						secret_access_key: 'secret-value',
					},
				},
			},
		});
		expect(result).toEqual({ data: STORAGE });
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'claidai.storage.create',
			{ name: 's3-playground', type: 's3' },
			'completed',
		);
	});

	it('storageDetails gets /storage/storages/{id}', async () => {
		respond(200, { data: STORAGE });

		const result = await storageDetails(ctx, { storage_id: 12 });

		expect(sentRequest()).toMatchObject({
			url: `${BASE}/storage/storages/12`,
			method: 'GET',
			body: undefined,
		});
		expect(result).toEqual({ data: STORAGE });
	});

	it('patchStorage patches /storage/storages/{id} without the id in the body', async () => {
		const renamed = { ...STORAGE, name: 'renamed' };
		respond(200, { data: renamed });

		const result = await patchStorage(ctx, {
			storage_id: 12,
			name: 'renamed',
			parameters: { credentials: { secret_access_key: 'rotated' } },
		});

		expect(sentRequest()).toEqual({
			url: `${BASE}/storage/storages/12`,
			method: 'PATCH',
			authorization: 'Bearer test-key',
			contentType: 'application/json',
			body: {
				name: 'renamed',
				parameters: { credentials: { secret_access_key: 'rotated' } },
			},
		});
		expect(result).toEqual({ data: renamed });
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'claidai.storage.patch',
			{ storage_id: 12, name: 'renamed', type: undefined },
			'completed',
		);
	});

	it('deleteStorage deletes /storage/storages/{id}', async () => {
		respond(200, { data: null });

		const result = await deleteStorage(ctx, { storage_id: 12 });

		expect(sentRequest()).toEqual({
			url: `${BASE}/storage/storages/12`,
			method: 'DELETE',
			authorization: 'Bearer test-key',
			contentType: null,
			body: undefined,
		});
		expect(result).toEqual({ data: null });
	});
});

describe('error handling', () => {
	const CLAID_ERROR = {
		detail: {
			error_code: '1001',
			error_type: 'auth',
			error_message: 'Invalid API key',
		},
	};

	it('surfaces a 401 as an ApiError the auth handler does not retry', async () => {
		respond(401, CLAID_ERROR);

		const error = await storageList(ctx, {}).catch((e: Error) => e);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
		expect(logEvent).not.toHaveBeenCalled();
	});

	it('retries a 429 after RateLimit-Reset seconds and then succeeds', async () => {
		jest.useFakeTimers();
		try {
			respond(
				429,
				{ detail: { error_message: 'Too Many Requests.' } },
				{
					'RateLimit-Reset': '1',
				},
			);
			respond(200, { data: ['s3'] });

			const pending = storageTypes(ctx, {});
			await jest.advanceTimersByTimeAsync(1000);

			expect(await pending).toEqual({ data: ['s3'] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
		}
	});

	it('gives up on a persistent 429 with the Retry-After delay attached', async () => {
		jest.useFakeTimers();
		try {
			fetchMock.mockImplementation(
				async () =>
					new Response('{"detail":{"error_message":"Too Many Requests."}}', {
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'RateLimit-Reset': '2',
						},
					}),
			);

			const pending = storageTypes(ctx, {}).catch((e: Error) => e);
			await jest.advanceTimersByTimeAsync(6000);
			const error = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(error).toBeInstanceOf(ApiError);
			if (!(error instanceof ApiError)) return;
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(2000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2000,
			});
		} finally {
			jest.useRealTimers();
		}
	});

	it('wraps network failures in ClaidAiAPIError', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(storageTypes(ctx, {})).rejects.toEqual(
			new ClaidAiAPIError('fetch failed'),
		);
	});

	it('rejects a response that does not match the schema', async () => {
		respond(200, { data: [{ id: 'not-a-number' }] });

		await expect(storageList(ctx, {})).rejects.toBeInstanceOf(ZodError);
	});

	it('fails fast without calling the API when the key is missing', async () => {
		// Safe: same partial context as above, with an empty key.
		// A narrower type is not practical because ClaidAiContext also carries runtime-injected members.
		const noKey = { key: '', options: {} } as ClaidAiContext;

		await expect(storageTypes(noKey, {})).rejects.toEqual(
			new ClaidAiAPIError('Missing Claid.ai API key'),
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('database persistence', () => {
	it('accepts null storage fields as the live API returns them', async () => {
		const live = {
			data: {
				output: {
					...IMAGE_OUT,
					object_key: null,
					object_bucket: null,
					object_uri: null,
					claid_storage_uri: null,
				},
			},
		};
		respond(200, live);

		expect(
			await polishImage(ctx, { input: 'https://example.com/a.jpg' }),
		).toEqual(live);
		expect(db.editedImages.upsertByEntityId).toHaveBeenCalledWith(
			IMAGE_OUT.tmp_url,
			expect.objectContaining({ id: IMAGE_OUT.tmp_url, object_key: null }),
		);
	});

	it('stores sync edit outputs keyed by their temporary URL', async () => {
		respond(200, EDIT_RESPONSE);
		await polishImage(ctx, { input: 'https://example.com/a.jpg' });

		expect(db.editedImages.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(db.editedImages.upsertByEntityId).toHaveBeenCalledWith(
			IMAGE_OUT.tmp_url,
			{ id: IMAGE_OUT.tmp_url, ...IMAGE_OUT },
		);
	});

	it('prefers the Claid storage URI as the image id and stores every output', async () => {
		const a = { ...IMAGE_OUT, claid_storage_uri: 'storage://s/a.png' };
		const b = { ...IMAGE_OUT, tmp_url: 'https://tmp.example/b.png' };
		respond(200, { data: { output: [a, b] } });
		await backgroundRemove(ctx, { input: 'https://example.com/a.jpg' });

		expect(
			db.editedImages.upsertByEntityId.mock.calls.map(([id]) => id),
		).toEqual(['storage://s/a.png', 'https://tmp.example/b.png']);
	});

	it('stores generated images', async () => {
		respond(200, { data: { output: [IMAGE_OUT] } });
		await imageGenerate(ctx, { input: 'a red bicycle' });

		expect(db.generatedImages.upsertByEntityId).toHaveBeenCalledWith(
			IMAGE_OUT.tmp_url,
			{ id: IMAGE_OUT.tmp_url, ...IMAGE_OUT },
		);
		expect(db.editedImages.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('stores async tasks by id', async () => {
		respond(200, {
			data: {
				id: 7,
				status: 'ACCEPTED',
				result_url: `${BASE}/image/ai-edit/7`,
				created_at: '2025-03-13T11:37:09.160554+00:00',
			},
		});
		await imageAiEdit(ctx, {
			input: 'https://example.com/a.jpg',
			options: { prompt: 'make it blue' },
		});

		expect(db.imageTasks.upsertByEntityId).toHaveBeenCalledWith('7', {
			id: '7',
			status: 'ACCEPTED',
			result_url: `${BASE}/image/ai-edit/7`,
			created_at: '2025-03-13T11:37:09.160554+00:00',
		});
	});

	it('stores storages without connection parameters or credentials', async () => {
		respond(200, { data: STORAGE });
		await storageDetails(ctx, { storage_id: 12 });

		expect(db.storages.upsertByEntityId).toHaveBeenCalledWith('12', {
			id: '12',
			name: 's3-playground',
			type: 's3',
			created_at: '2025-03-13T11:37:09.160554+00:00',
		});
	});

	it('stores every listed storage and every storage type', async () => {
		respond(200, { data: [STORAGE, { ...STORAGE, id: 13 }] });
		await storageList(ctx, {});
		expect(db.storages.upsertByEntityId.mock.calls.map(([id]) => id)).toEqual([
			'12',
			'13',
		]);

		fetchMock.mockReset();
		respond(200, { data: ['web_folder', 's3', 'gcs'] });
		await storageTypes(ctx, {});
		expect(
			db.storageTypes.upsertByEntityId.mock.calls.map(([id]) => id),
		).toEqual(['web_folder', 's3', 'gcs']);
	});

	it('removes the storage row on delete', async () => {
		respond(200, { data: null });
		await deleteStorage(ctx, { storage_id: 12 });

		expect(db.storages.deleteByEntityId).toHaveBeenCalledWith('12');
	});

	it('does not write when the API call fails', async () => {
		respond(401, { error: { message: 'bad key' } });
		await expect(storageList(ctx, {})).rejects.toBeInstanceOf(Error);

		expect(db.storages.upsertByEntityId).not.toHaveBeenCalled();
	});
});
