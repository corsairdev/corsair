/**
 * Live verification against the real Bouncer API.
 *
 * The suite skips itself unless `BOUNCER_API_KEY` is set, so it never runs
 * without credentials:
 *
 *   BOUNCER_API_KEY=<key> pnpm exec jest integration
 *
 * Bouncer bills one credit per verified address, so this suite is deliberately
 * frugal: it spends four credits per run (one real-time verify, one domain
 * check, and a two-address batch) and reuses that single batch for the status,
 * results, and delete assertions. The toxicity job it creates is deleted in
 * `afterAll` so repeated runs leave nothing behind.
 */
import { Account, Email, Toxicity } from './endpoints';
import { BouncerEndpointOutputSchemas as Outputs } from './endpoints/types';

const apiKey = process.env.BOUNCER_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Account.getCredits>[0];
const ctx = { key: apiKey ?? '', authType: 'api_key' } as unknown as Ctx;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Polls until `check` reports done, or gives up and returns the last value. */
async function pollUntil<T>(
	fetchOnce: () => Promise<T>,
	done: (value: T) => boolean,
	{ attempts = 15, intervalMs = 2000 } = {},
): Promise<T> {
	let last = await fetchOnce();
	for (let i = 0; i < attempts && !done(last); i++) {
		await sleep(intervalMs);
		last = await fetchOnce();
	}
	return last;
}

describeLive('Bouncer live API', () => {
	let batchId: string | undefined;
	let toxicityJobId: string | undefined;

	afterAll(async () => {
		// Best-effort cleanup; a failed run should not leave jobs behind.
		if (batchId) {
			await Email.deleteBatchRequest(ctx, { batchId }).catch(() => undefined);
		}
		if (toxicityJobId) {
			await Toxicity.deleteToxicityListJob(ctx, {
				jobId: toxicityJobId,
			}).catch(() => undefined);
		}
	}, 30_000);

	it('getCredits returns a credit balance', async () => {
		const result = await Account.getCredits(ctx, {});
		const parsed = Outputs.getCredits.parse(result);
		expect(parsed.credits).toBeGreaterThanOrEqual(0);
	});

	it('verifyEmail returns a documented EmailRecord', async () => {
		const result = await Email.verifyEmail(ctx, {
			email: 'john@usebouncer.com',
		});
		const parsed = Outputs.verifyEmail.parse(result);
		expect(parsed.email).toBe('john@usebouncer.com');
		expect(parsed.domain?.name).toBe('usebouncer.com');
	}, 40_000);

	it('verifyDomain returns the nested domain/dns shape', async () => {
		const result = await Email.verifyDomain(ctx, { domain: 'usebouncer.com' });
		const parsed = Outputs.verifyDomain.parse(result);
		expect(parsed.domain?.name).toBe('usebouncer.com');
		expect(parsed.dns?.type).toBe('MX');
	}, 40_000);

	it('runs a batch through create, status, results and delete', async () => {
		const created = Outputs.createBatchRequest.parse(
			await Email.createBatchRequest(ctx, {
				recipients: ['john@usebouncer.com', { email: 'jenny@usebouncer.com' }],
			}),
		);
		expect(created.batchId).toBeTruthy();
		batchId = created.batchId;

		const status = Outputs.getBatchStatus.parse(
			await pollUntil(
				() => Email.getBatchStatus(ctx, { batchId: batchId!, withStats: true }),
				(s) => (s as { status: string }).status === 'completed',
			),
		);
		expect(status.status).toBe('completed');
		expect(status.stats).toBeDefined();

		const results = Outputs.getBatchResults.parse(
			await Email.getBatchResults(ctx, { batchId: batchId!, download: 'all' }),
		);
		expect(results).toHaveLength(2);
		expect(results.map((r) => r.email).sort()).toEqual([
			'jenny@usebouncer.com',
			'john@usebouncer.com',
		]);

		Outputs.deleteBatchRequest.parse(
			await Email.deleteBatchRequest(ctx, { batchId: batchId! }),
		);
		batchId = undefined;
	}, 120_000);

	it('runs a toxicity job through create, status and results', async () => {
		const created = Outputs.createToxicityListJob.parse(
			await Toxicity.createToxicityListJob(ctx, {
				emails: ['jane@usebouncer.com', 'john@usebouncer.com'],
			}),
		);
		expect(created.id).toBeTruthy();
		toxicityJobId = created.id;

		const status = Outputs.checkToxicityListJobStatus.parse(
			await pollUntil(
				() =>
					Toxicity.checkToxicityListJobStatus(ctx, { jobId: toxicityJobId! }),
				(s) => (s as { status: string }).status !== 'processing',
			),
		);
		expect(status.status).toBe('completed');

		const results = Outputs.getToxicityListResults.parse(
			await Toxicity.getToxicityListResults(ctx, { jobId: toxicityJobId! }),
		);
		expect(results).toHaveLength(2);
		for (const record of results) {
			expect(record.toxicity).toBeGreaterThanOrEqual(0);
		}
	}, 120_000);
});
