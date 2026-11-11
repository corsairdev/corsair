/**
 * Live tests against fal. They run when FAL_KEY is set (CI has none, so
 * they skip). Reads are free; the generation tests run only with
 * FAL_LIVE_GENERATE=1 and cost about $0.001 (three 256px FLUX schnell images).
 * Usage, billing and deletePayloads need a full-access key; others get 403.
 */
import { z } from 'zod';
import { billing as accountBilling } from './endpoints/account';
import { upload as filesUpload } from './endpoints/files';
import {
	estimateCost as modelsEstimateCost,
	pricing as modelsPricing,
	run as modelsRun,
	search as modelsSearch,
} from './endpoints/models';
import {
	cancel as queueCancel,
	result as queueResult,
	status as queueStatus,
	submit as queueSubmit,
} from './endpoints/queue';
import {
	deletePayloads as requestsDeletePayloads,
	list as requestsList,
} from './endpoints/requests';
import {
	billingEvents as usageBillingEvents,
	get as usageGet,
} from './endpoints/usage';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.FAL_KEY);
const describeLive = KEY.success ? describe : describe.skip;
const generate = KEY.success && process.env.FAL_LIVE_GENERATE === '1';
const itGenerate = generate ? it : it.skip;

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof queueSubmit
>[0];

const MODEL = 'fal-ai/flux/schnell';
const SMALL = {
	image_size: { width: 256, height: 256 },
	num_inference_steps: 1,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describeLive('fal live API', () => {
	jest.setTimeout(120_000);

	it('models.search finds the model and its OpenAPI', async () => {
		const response = await modelsSearch(ctx, {
			endpointIds: [MODEL],
			includeOpenApi: true,
		});
		expect(response.models[0]?.endpoint_id).toBe(MODEL);
		expect(response.models[0]?.openapi).toBeDefined();

		const page = await modelsSearch(ctx, {
			category: 'text-to-video',
			limit: 3,
		});
		expect(page.models.length).toBeGreaterThan(0);
	});

	it('models.pricing and models.estimateCost price the model', async () => {
		const prices = await modelsPricing(ctx, { endpointIds: [MODEL] });
		expect(prices.prices[0]).toMatchObject({
			endpoint_id: MODEL,
			currency: 'USD',
		});

		const estimate = await modelsEstimateCost(ctx, {
			estimateType: 'unit_price',
			endpoints: { [MODEL]: { quantity: 10 } },
		});
		expect(estimate.total_cost).toBeGreaterThan(0);
	});

	it('requests.list reads past requests', async () => {
		const requests = await requestsList(ctx, {
			endpointIds: [MODEL],
			limit: 5,
		});
		expect(Array.isArray(requests.items)).toBe(true);
	});

	// Usage, billing events and the balance need a key with billing read
	// access (fal's BILLING, READONLY or FULL presets); other keys get 403.
	it.each([
		[
			'usage.get',
			() => usageGet(ctx, { start: '2026-11-01', expand: ['summary'] }),
		],
		['usage.billingEvents', () => usageBillingEvents(ctx, { limit: 5 })],
		['account.billing', () => accountBilling(ctx, {})],
	] as const)(
		'%s answers, or refuses a key without billing scope',
		async (_op, call) => {
			try {
				expect(await call()).toBeDefined();
			} catch (error) {
				expect((error as { status?: number }).status).toBe(403);
			}
		},
	);

	itGenerate('queue: submit, follow to SUCCEEDED, read, cancel', async () => {
		const submitted = await queueSubmit(ctx, {
			endpointId: MODEL,
			input: { prompt: 'a red kite over a beach, flat illustration', ...SMALL },
		});
		expect(submitted.response_url).toContain(submitted.request_id);

		let status = await queueStatus(ctx, {
			responseUrl: submitted.response_url,
		});
		for (
			let i = 0;
			i < 60 && (status.state === 'IN_QUEUE' || status.state === 'IN_PROGRESS');
			i++
		) {
			await sleep(1000);
			status = await queueStatus(ctx, { responseUrl: submitted.response_url });
		}
		expect(status.state).toBe('SUCCEEDED');
		expect(status.output?.images).toBeDefined();

		const output = await queueResult(ctx, {
			endpointId: MODEL,
			requestId: submitted.request_id,
		});
		expect(output).toEqual(status.output);

		const cancelled = await queueCancel(ctx, {
			responseUrl: submitted.response_url,
		});
		expect(cancelled.status).toBe('ALREADY_COMPLETED');
	});

	itGenerate(
		'queue: a bad input ends FAILED with the validation error',
		async () => {
			const submitted = await queueSubmit(ctx, {
				endpointId: MODEL,
				input: SMALL,
			});
			let status = await queueStatus(ctx, {
				responseUrl: submitted.response_url,
			});
			for (
				let i = 0;
				i < 60 &&
				(status.state === 'IN_QUEUE' || status.state === 'IN_PROGRESS');
				i++
			) {
				await sleep(1000);
				status = await queueStatus(ctx, {
					responseUrl: submitted.response_url,
				});
			}
			expect(status.state).toBe('FAILED');
			expect(status.error).toContain('prompt');
		},
	);

	itGenerate(
		'models.run returns the output; deletePayloads removes its files',
		async () => {
			const output = await modelsRun(ctx, {
				endpointId: MODEL,
				input: { prompt: 'a paper boat on a pond', ...SMALL },
			});
			expect(output.state).toBe('SUCCEEDED');
			const url = (output.output?.images as { url: string }[] | undefined)?.[0]
				?.url;
			expect(url).toMatch(/^https:\/\//);
			expect((await fetch(url!)).status).toBe(200);

			// Needs a key that may delete request payloads (inference-only keys get 403).
			await sleep(3000);
			const [latest] = (
				await requestsList(ctx, {
					endpointIds: [MODEL],
					limit: 1,
					includePayloads: true,
				})
			).items;
			expect(JSON.stringify(latest?.json_output)).toContain(url);
			let deleted: Awaited<ReturnType<typeof requestsDeletePayloads>>;
			try {
				deleted = await requestsDeletePayloads(ctx, {
					requestId: latest!.request_id,
				});
			} catch (error) {
				expect((error as { status?: number }).status).toBe(403);
				return;
			}
			expect(deleted.cdn_delete_results.some((r) => r.link === url)).toBe(true);
			await sleep(2000);
			expect((await fetch(url!)).status).toBe(404);
		},
	);

	itGenerate(
		'files.upload returns a fal CDN URL serving the bytes',
		async () => {
			// 1x1 transparent PNG.
			const png =
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
			const uploaded = await filesUpload(ctx, {
				contentBase64: png,
				contentType: 'image/png',
				fileName: 'pixel.png',
			});
			expect(uploaded.file_url).toMatch(/^https:\/\//);
			const served = await fetch(uploaded.file_url);
			expect(served.ok).toBe(true);
			expect(Buffer.from(await served.arrayBuffer()).toString('base64')).toBe(
				png,
			);
		},
	);
});
