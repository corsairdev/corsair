/**
 * Live tests against Higgsfield. They run when HIGGSFIELD_API_KEY is set (CI has
 * none, so they skip). Everything here but the generation tests is free. The
 * generation tests run only with HIGGSFIELD_LIVE_GENERATE=1 and spend about
 * $0.012 in all (three soul/v2/standard images, plus one usually canceled while
 * queued, which is refunded). Every accepted request is deleted, failed tests
 * included.
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

// Requests a test got accepted, until their delete has gone through.
const tracked = new Set<string>();

function track<T extends { request_id: string }>(response: T): T {
	tracked.add(response.request_id);
	return response;
}

async function removeRequest(requestId: string) {
	const removed = await requestsDelete(ctx, { requestId });
	tracked.delete(requestId);
	return removed;
}

/** The request's end state: the answer in hand if it has ended, else a follow. */
const untilEnded = async <T extends { status: string; request_id: string }>(
	response: T,
) =>
	TERMINAL_STATUSES.includes(response.status)
		? response
		: await followToEnd(response.request_id);

describeLive('Higgsfield live API', () => {
	jest.setTimeout(240_000);

	// Runs after a failed assertion too, so a failed test leaves no request or
	// files behind. A cancel first, in case it is still queued and needn't be paid
	// for; a delete only works once the request has ended.
	afterEach(async () => {
		for (const requestId of [...tracked]) {
			await requestsCancel(ctx, { requestId }).catch(() => undefined);
			await followToEnd(requestId).catch(() => undefined);
			await removeRequest(requestId).catch(() => undefined);
		}
	});

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
		// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
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

	it('files.upload puts base64 bytes at a public URL', async () => {
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
	});

	itGenerate(
		'submit, repeat with the same key, follow to completed, delete',
		async () => {
			const estimate = await generationsEstimate(ctx, {
				modelPath: MODEL,
				input: PROMPT,
			});
			expect(Number(estimate.usd)).toBeLessThan(0.05);

			const submitted = track(
				await generationsSubmit(ctx, {
					modelPath: MODEL,
					input: PROMPT,
					expiresAfter: 3600,
				}),
			);
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

			// A request this fresh is nearly always still running, which is a 409.
			// If it has already ended, the delete goes through, and that's fine too.
			const early = await requestsDelete(ctx, {
				requestId: submitted.request_id,
			}).catch((caught: Error) => caught);
			if (!(early instanceof Error)) {
				expect(early.status).toBe('deleted');
				tracked.delete(submitted.request_id);
				return;
			}
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

			const deleted = await removeRequest(submitted.request_id);
			expect(deleted.status).toBe('deleted');
			const again = await removeRequest(submitted.request_id);
			expect(again.status).toBe('deleted');
		},
	);

	itGenerate(
		'generations.run answers within its wait, and the request finishes',
		async () => {
			const started = Date.now();
			const running = track(
				await generationsRun(ctx, {
					modelPath: MODEL,
					input: PROMPT,
					waitSeconds: 3,
				}),
			);
			expect(Date.now() - started).toBeLessThan(5000);
			const done = await untilEnded(running);
			expect(done.status).toBe('completed');
			await removeRequest(running.request_id);
		},
	);

	itGenerate(
		'generations.run with the longest wait ends with the output',
		async () => {
			const response = track(
				await generationsRun(ctx, {
					modelPath: MODEL,
					input: PROMPT,
					waitSeconds: 15,
				}),
			);
			const done = await untilEnded(response);
			expect(done.status).toBe('completed');
			expect(done.images?.[0]?.url).toMatch(/^https:\/\//);
			await removeRequest(response.request_id);
		},
	);

	itGenerate(
		'requests.cancel cancels a queued request, or says it has started',
		async () => {
			const submitted = track(
				await generationsSubmit(ctx, { modelPath: MODEL, input: PROMPT }),
			);
			const outcome = await requestsCancel(ctx, {
				requestId: submitted.request_id,
			}).catch((caught: Error) => caught);
			if (outcome instanceof Error) {
				expect(statusOf(outcome)).toBe(400);
				expect(outcome.message).toContain('Only a queued request');
			} else {
				expect(outcome.status).toBe('canceled');
				const current = await requestsStatus(ctx, {
					requestId: submitted.request_id,
				});
				expect(current.status).toBe('canceled');
			}
			await followToEnd(submitted.request_id);
			await removeRequest(submitted.request_id);
		},
	);
});
