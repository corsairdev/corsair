/**
 * Live tests against Higgsfield. They run when HIGGSFIELD_API_KEY is set (CI has
 * none, so they skip). Everything here but the generation tests is free. The
 * generation tests run only with HIGGSFIELD_LIVE_GENERATE=1 and spend about
 * $0.012 in all (three soul/v2/standard images, plus one canceled while queued,
 * which is refunded); each estimates first and every request is deleted after.
 */
import { z } from 'zod';
import { HiggsfieldAPIError, HiggsfieldError } from './client';
import {
	createUploadUrl as filesCreateUploadUrl,
	upload as filesUpload,
} from './endpoints/files';
import {
	estimate as generationsEstimate,
	run as generationsRun,
	submit as generationsSubmit,
} from './endpoints/generations';
import { get as modelsGet, list as modelsList } from './endpoints/models';
import {
	cancel as requestsCancel,
	deleteRequest as requestsDelete,
	status as requestsStatus,
} from './endpoints/requests';
import { TERMINAL_STATUSES } from './endpoints/types';
import { get as usageGet } from './endpoints/usage';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.HIGGSFIELD_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;
const generate = KEY.success && process.env.HIGGSFIELD_LIVE_GENERATE === '1';
const itGenerate = generate ? it : it.skip;

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof generationsSubmit
>[0];

const MODEL = 'higgsfield-ai/soul/v2/standard';
const PROMPT = { prompt: 'A paper boat on a calm pond, watercolor' };
const NO_SUCH_REQUEST = '00000000-0000-4000-8000-000000000000';
// A 1x1 PNG.
const PIXEL_PNG =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function followToEnd(requestId: string, timeoutMs = 120_000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const current = await requestsStatus(ctx, { requestId });
		if (TERMINAL_STATUSES.includes(current.status)) return current;
		await sleep(3000);
	}
	throw new Error(`${requestId} did not finish in ${timeoutMs} ms`);
}

// unknown: whatever the call threw.
const statusOf = (error: unknown) =>
	error instanceof HiggsfieldAPIError ? error.status : undefined;

describeLive('Higgsfield live API', () => {
	jest.setTimeout(240_000);

	it('models.list lists, filters and carries schemas on request', async () => {
		const all = await modelsList(ctx, {});
		expect(all.items.length).toBeGreaterThan(10);
		expect(all.items.every((m) => !m.input_schema)).toBe(true);

		const soul = await modelsList(ctx, { search: 'soul' });
		expect(soul.items.map((m) => m.slug)).toContain(MODEL);
		expect(soul.items.length).toBeLessThan(all.items.length);

		const video = await modelsList(ctx, { outputType: 'video' });
		expect(video.items.every((m) => m.output_type === 'video')).toBe(true);

		const edits = await modelsList(ctx, { operationType: 'image_edit' });
		expect(
			edits.items.every((m) => m.operation_type?.includes('image_edit')),
		).toBe(true);

		const withSchemas = await modelsList(ctx, {
			search: 'soul',
			includeSchema: true,
		});
		expect(withSchemas.items.every((m) => m.input_schema)).toBe(true);
	});

	it('models.get returns one model with its input fields', async () => {
		const model = await modelsGet(ctx, { modelPath: MODEL });
		expect(model.slug).toBe(MODEL);
		expect(model.input_schema?.required).toEqual(['prompt']);
		await expect(
			modelsGet(ctx, { modelPath: 'no/such-model' }),
		).rejects.toBeInstanceOf(HiggsfieldError);
	});

	it('generations.estimate prices a model and errors on an unknown one', async () => {
		const estimate = await generationsEstimate(ctx, {
			modelPath: MODEL,
			input: PROMPT,
		});
		expect(Number(estimate.usd)).toBeGreaterThan(0);
		expect(estimate.type).toBe('estimate');

		const error = await generationsEstimate(ctx, {
			modelPath: 'no/such-model',
			input: PROMPT,
		}).catch((caught: Error) => caught);
		expect(statusOf(error)).toBe(404);
		expect((error as Error).message).toContain('model_not_found');
		expect((error as HiggsfieldAPIError).correlationId).toBeTruthy();

		const missing = await generationsEstimate(ctx, {
			modelPath: MODEL,
			input: {},
		}).catch((caught: Error) => caught);
		expect(statusOf(missing)).toBe(400);
		expect((missing as Error).message).toContain('prompt');
	});

	it('requests.* answer 404 for a request that does not exist', async () => {
		for (const call of [requestsStatus, requestsCancel, requestsDelete]) {
			const error = await call(ctx, { requestId: NO_SUCH_REQUEST }).catch(
				(caught: Error) => caught,
			);
			expect(statusOf(error)).toBe(404);
		}
	});

	it('a wrong key is a 401 and its secret stays out of the error', async () => {
		const wrongCtx = { key: 'wrong-id:wrong-secret' } as unknown as typeof ctx;
		const error = await modelsList(wrongCtx, {}).catch(
			(caught: Error) => caught,
		);
		expect(statusOf(error)).toBe(401);
		expect((error as Error).message).toContain('Invalid credentials');
		expect((error as Error).message).not.toContain('wrong-secret');
	});

	it('usage.get answers its documented shape', async () => {
		const usage = await usageGet(ctx, { timeframe: 'day', limit: 5 });
		expect(Array.isArray(usage.time_series)).toBe(true);
		expect(usage.limit).toBe(5);
	});

	it('files.createUploadUrl answers a presigned URL and its headers', async () => {
		const created = await filesCreateUploadUrl(ctx, {
			contentType: 'image/png',
		});
		expect(created.upload_url).toMatch(/^https:\/\//);
		expect(created.public_url).toMatch(/^https:\/\//);
		expect(created.upload_headers?.['Content-Type']).toBe('image/png');
	});

	it.each([
		'image/webp',
		'video/mp4',
		'audio/wav',
		'audio/mpeg',
		'audio/flac',
	] as const)('files.createUploadUrl accepts %s', async (contentType) => {
		const created = await filesCreateUploadUrl(ctx, { contentType });
		expect(created.upload_url).toMatch(/^https:\/\//);
	});

	it('files.upload puts base64 bytes at a public URL, and copies from a URL', async () => {
		const uploaded = await filesUpload(ctx, {
			contentBase64: PIXEL_PNG,
			contentType: 'image/png',
		});
		expect(uploaded.size).toBe(Buffer.from(PIXEL_PNG, 'base64').byteLength);
		const served = await fetch(uploaded.public_url);
		expect(served.status).toBe(200);
		expect(Buffer.from(await served.arrayBuffer()).toString('base64')).toBe(
			PIXEL_PNG,
		);

		const copied = await filesUpload(ctx, { sourceUrl: uploaded.public_url });
		expect(copied.content_type).toBe('image/png');
		expect(copied.size).toBe(uploaded.size);
		expect(copied.public_url).not.toBe(uploaded.public_url);
	});

	itGenerate(
		'submit, repeat with the same key, follow to completed, delete',
		async () => {
			const estimate = await generationsEstimate(ctx, {
				modelPath: MODEL,
				input: PROMPT,
			});
			expect(Number(estimate.usd)).toBeLessThan(0.05);

			const submitted = await generationsSubmit(ctx, {
				modelPath: MODEL,
				input: PROMPT,
				expiresAfter: 3600,
			});
			expect(submitted.status).toBe('queued');
			expect(submitted.expires_after).toBe(3600);

			const repeat = await generationsSubmit(ctx, {
				modelPath: MODEL,
				input: PROMPT,
				expiresAfter: 3600,
				idempotencyKey: submitted.idempotency_key,
			});
			expect(repeat.request_id).toBe(submitted.request_id);

			const changed = await generationsSubmit(ctx, {
				modelPath: MODEL,
				input: { prompt: 'something else' },
				idempotencyKey: submitted.idempotency_key,
			}).catch((caught: Error) => caught);
			expect(statusOf(changed)).toBe(422);
			expect((changed as Error).message).toContain('already used');

			// Deleting while it runs is refused; a request this fresh can't have ended.
			const early = await requestsDelete(ctx, {
				requestId: submitted.request_id,
			}).catch((caught: Error) => caught);
			expect(statusOf(early)).toBe(409);

			const done = await followToEnd(submitted.request_id);
			expect(done.status).toBe('completed');
			expect(done.images?.[0]?.url).toMatch(/^https:\/\//);
			expect(done.expires_at).toBeTruthy();

			// Finished requests can't be canceled.
			const tooLate = await requestsCancel(ctx, {
				requestId: submitted.request_id,
			}).catch((caught: Error) => caught);
			expect(statusOf(tooLate)).toBe(400);
			expect((tooLate as Error).message).toContain('Only a queued request');

			const deleted = await requestsDelete(ctx, {
				requestId: submitted.request_id,
			});
			expect(deleted.status).toBe('deleted');
			const again = await requestsDelete(ctx, {
				requestId: submitted.request_id,
			});
			expect(again.status).toBe('deleted');
		},
	);

	itGenerate(
		'generations.run answers the job when the wait runs out, and it finishes',
		async () => {
			const started = Date.now();
			const running = await generationsRun(ctx, {
				modelPath: MODEL,
				input: PROMPT,
				waitSeconds: 3,
			});
			expect(Date.now() - started).toBeLessThan(5000);
			expect(['queued', 'in_progress']).toContain(running.status);
			const done = await followToEnd(running.request_id);
			expect(done.status).toBe('completed');
			await requestsDelete(ctx, { requestId: running.request_id });
		},
	);

	itGenerate(
		'generations.run with the longest wait answers the output of a fast model',
		async () => {
			const response = await generationsRun(ctx, {
				modelPath: MODEL,
				input: PROMPT,
				waitSeconds: 15,
			});
			if (response.status === 'completed') {
				expect(response.images?.[0]?.url).toMatch(/^https:\/\//);
			} else {
				expect(['queued', 'in_progress']).toContain(response.status);
				await followToEnd(response.request_id);
			}
			await requestsDelete(ctx, { requestId: response.request_id });
		},
	);

	itGenerate('requests.cancel cancels a queued request', async () => {
		const submitted = await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: PROMPT,
		});
		const canceled = await requestsCancel(ctx, {
			requestId: submitted.request_id,
		});
		expect(canceled.status).toBe('canceled');
		const current = await requestsStatus(ctx, {
			requestId: submitted.request_id,
		});
		expect(current.status).toBe('canceled');
		await requestsDelete(ctx, { requestId: submitted.request_id });
	});
});
