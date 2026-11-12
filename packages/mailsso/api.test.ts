/**
 * Live smoke tests against api.mails.so. They run when MAILS_SO_API_KEY is set
 * (CI has none, so they skip). Four reads.
 *
 * validations.batch starts a real job on the account, so it runs only with
 * MAILS_SO_LIVE_BATCH=1. Without a paid plan Mails.so refuses it with `Paid
 * subscription required to use list validations`; that run logs "unavailable on
 * this plan" and passes, because it says nothing about the plugin.
 */
import { z } from 'zod';
import { MailssoSubscriptionRequiredError } from './client';
import { Validations } from './endpoints';
import { MailssoEndpointOutputSchemas as Outputs } from './endpoints/types';
import { captureError, makeContext } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.MAILS_SO_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;
const liveBatch = KEY.success && process.env.MAILS_SO_LIVE_BATCH === '1';
const itBatch = liveBatch ? it : it.skip;
const apiKey = KEY.success ? KEY.data : 'not-set';

if (!KEY.success) {
	console.warn('[mailsso live] MAILS_SO_API_KEY is not set: every test skips.');
} else if (!liveBatch) {
	console.warn(
		'[mailsso live] MAILS_SO_LIVE_BATCH=1 is not set: validations.batch is skipped, because it starts a job on the account.',
	);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describeLive('Mails.so live', () => {
	const ctx = makeContext(apiKey);

	it('validates an address and answers the documented shape', async () => {
		const raw = await Validations.single(ctx, { email: 'test@example.com' });
		const result = Outputs.validationsSingle.parse(raw);

		expect(result.email).toBe('test@example.com');
		expect(result.username).toBe('test');
		expect(result.domain).toBe('example.com');
		expect(result.isv_format).toBe(true);
		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(100);
		expect(result.result).toBe('undeliverable');
		expect(result.reason).toBe('invalid_domain');
	});

	it('grades a malformed address instead of failing the call', async () => {
		const raw = await Validations.single(ctx, { email: 'notanemail' });
		const result = Outputs.validationsSingle.parse(raw);

		expect(result.isv_format).toBe(false);
		expect(result.result).toBe('undeliverable');
		expect(result.reason).toBe('invalid_format');
		expect(result.username).toBeNull();
	});

	it('rejects a wrong key with a 401', async () => {
		const caught = await captureError(
			Validations.single(makeContext('mails-not-a-real-key'), {
				email: 'test@example.com',
			}),
		);

		expect(caught).toMatchObject({ status: 401, message: 'Unauthorized' });
		expect(caught).not.toBeInstanceOf(MailssoSubscriptionRequiredError);
	});

	it('answers 404 for a batch job that does not exist', async () => {
		const caught = await captureError(
			Validations.getBatch(ctx, { id: '11111111-1111-4111-8111-111111111111' }),
		);

		expect(caught).toMatchObject({
			status: 404,
			message: 'the job does not exist',
		});
	});

	itBatch(
		'starts a batch job and reads it back',
		async () => {
			let started: z.output<typeof Outputs.validationsBatch>;
			try {
				started = Outputs.validationsBatch.parse(
					await Validations.batch(ctx, {
						emails: ['probe-a@example.com', 'probe-b@example.com'],
					}),
				);
			} catch (error) {
				if (error instanceof MailssoSubscriptionRequiredError) {
					console.warn(
						`[mailsso live] validations.batch: unavailable on this plan (${error.message}).`,
					);
					return;
				}
				throw error;
			}

			expect(started.size).toBe(2);
			expect(started.id).toEqual(expect.any(String));

			let finished: z.output<typeof Outputs.validationsGetBatch> | undefined;
			for (let attempt = 0; attempt < 15; attempt++) {
				const job = Outputs.validationsGetBatch.parse(
					await Validations.getBatch(ctx, { id: started.id }),
				);
				if (job.status === 'completed') {
					finished = job;
					break;
				}
				await sleep(1000);
			}

			expect(finished).toBeDefined();
			expect(finished?.id).toBe(started.id);
			expect(finished?.finished_at).toEqual(expect.any(String));
			expect(finished?.stats?.total).toBe(2);
			expect(finished?.emails?.map((entry) => entry.email).sort()).toEqual([
				'probe-a@example.com',
				'probe-b@example.com',
			]);
		},
		60_000,
	);
});
