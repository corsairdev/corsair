import { logEventFromContext } from 'corsair/core';
import { makeSuzanneDownloadRequest, makeSuzanneRequest } from './client';
import { Generations, Jobs, Models, Uploads } from './endpoints';
import type { SuzanneContext } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeSuzanneRequest: jest.fn(),
		makeSuzanneDownloadRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeSuzanneRequest);
const mockDownload = jest.mocked(makeSuzanneDownloadRequest);

const accepted = {
	job_id: 'job_1',
	status: 'queued',
	created_at: '2026-06-01T00:00:00.000Z',
	billable_amount_cents: 0,
};

const job = {
	job_id: 'job_1',
	status: 'done',
	model: 'sculptor',
	created_at: '2026-06-01T00:00:00.000Z',
	updated_at: '2026-06-01T00:02:00.000Z',
	completed_at: '2026-06-01T00:02:00.000Z',
	outputs: [
		{
			format: 'glb',
			download_url:
				'https://api.suzanne3d.com/v1/models/job_1/download?format=glb',
		},
	],
	error: null,
};

// Endpoint functions only read key, options, and database.
function ctx(): SuzanneContext {
	return { key: 'x_key_test', options: {} } as SuzanneContext;
}

type RequestOptions = {
	method?: string;
	// The mock records the request before the endpoint schema parses it.
	body?: unknown;
	path?: unknown;
	headers?: unknown;
	query?: unknown;
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('suzanne routing', () => {
	const cases: Array<{
		name: string;
		// Each case calls a different endpoint, so there is no single return type.
		run: () => Promise<unknown>;
		// The mock body is parsed by that endpoint's own output schema.
		response: unknown;
		method: string;
		url: string;
		// Expected request pieces stay untyped until the assertion compares them.
		body?: unknown;
		path?: unknown;
		headers?: unknown;
	}> = [
		{
			name: 'generations.textTo3d',
			run: () =>
				Generations.textTo3d(ctx(), {
					model: 'sculptor',
					prompt: 'a low-poly fox',
					idempotencyKey: 'idem-1',
					params: { faces: 500_000, pbr: true },
				}),
			response: accepted,
			method: 'POST',
			url: '/v1/generations/text-to-3d',
			headers: { 'Idempotency-Key': 'idem-1' },
			body: {
				model: 'sculptor',
				prompt: 'a low-poly fox',
				params: { faces: 500_000, pbr: true },
			},
		},
		{
			name: 'generations.photoTo3d',
			run: () =>
				Generations.photoTo3d(ctx(), {
					model: 'sculptor',
					images_upload_ids: { front: 'upl_front' },
				}),
			response: accepted,
			method: 'POST',
			url: '/v1/generations/photo-to-3d',
			body: {
				model: 'sculptor',
				images_upload_ids: { front: 'upl_front' },
			},
		},
		{
			name: 'uploads.create',
			run: () => Uploads.create(ctx(), {}),
			response: {
				upload_id: 'upl_1',
				upload_url: 'https://s3.example/put',
				expires_at: '2026-06-01T00:05:00.000Z',
			},
			method: 'POST',
			url: '/v1/uploads',
		},
		{
			name: 'jobs.get',
			run: () => Jobs.get(ctx(), { job_id: 'job_1' }),
			response: job,
			method: 'GET',
			url: '/v1/jobs/{job_id}',
			path: { job_id: 'job_1' },
		},
		{
			name: 'jobs.cancel',
			run: () => Jobs.cancel(ctx(), { job_id: 'job_1' }),
			response: {
				job_id: 'job_1',
				status: 'cancelled',
				already_terminal: false,
			},
			method: 'POST',
			url: '/v1/jobs/{job_id}/cancel',
			path: { job_id: 'job_1' },
		},
	];

	it.each(cases)(
		'$name calls $method $url',
		async ({ run, response, method, url, body, path, headers }) => {
			mockRequest.mockResolvedValue(response);
			await run();
			const call = mockRequest.mock.calls[0];
			if (!call) throw new Error('request was not made');
			// jest's mock call tuple is untyped.
			const [calledUrl, key, options] = call as [
				string,
				string,
				RequestOptions,
			];
			expect(calledUrl).toBe(url);
			expect(key).toBe('x_key_test');
			expect(options.method ?? 'GET').toBe(method);
			if (body !== undefined) expect(options.body).toEqual(body);
			if (path !== undefined) expect(options.path).toEqual(path);
			if (headers !== undefined) expect(options.headers).toEqual(headers);
			expect(logEventFromContext).toHaveBeenCalled();
		},
	);

	it('reads a download redirect without the JSON client', async () => {
		mockDownload.mockResolvedValue({ url: 'https://s3.example/mesh.glb' });
		await Models.download(ctx(), { job_id: 'job_1', format: 'glb' });
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockDownload).toHaveBeenCalledWith(
			'x_key_test',
			expect.objectContaining({ jobId: 'job_1', format: 'glb' }),
		);
	});

	it('rejects an oversized prompt before any request', async () => {
		await expect(
			Generations.textTo3d(ctx(), {
				model: 'sculptor',
				prompt: 'x'.repeat(4001),
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
