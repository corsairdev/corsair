/**
 * Live smoke tests against Taggun. They run when TAGGUN_API_KEY is set and skip
 * otherwise, so CI (which has no key) skips them.
 *
 * Every call here costs a scan on the account: Taggun bills one scan per file
 * and counts receipts that fail validation too. The suite is therefore read-only
 * apart from a single campaign create/delete pair, and it makes no more than a
 * handful of calls so it stays inside the 5-requests-per-second limit.
 *
 * `incognito: true` keeps the receipts out of Taggun's storage. Campaign
 * Validation is a plan feature: without it, `campaigns.list` answers 400 naming
 * the feature and the campaign tests report that instead of failing.
 */
import { z } from 'zod';
import type { TaggunAPIError } from './client';
import { Campaigns, Simple, Verbose } from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.TAGGUN_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;

// A receipt Taggun publishes in its own docs, used by both the simple and
// verbose examples there.
const SAMPLE_RECEIPT_URL =
	'https://files.readme.io/01cb130cf982ea1e0aec6ae8c39eab9f736cc3ecbbd1ef885c278ace6d364b26-example-file.png';

// The endpoints read only `ctx.key`, so that is all this context carries.
// unknown: the rest of the runtime context needs a database and a key manager,
// neither of which a live smoke test builds, so the cast states the subset used.
const ctx = {
	key: KEY.data ?? '',
} as unknown /* unknown: see above */ as Parameters<typeof Simple.url>[0];

/**
 * Campaign Validation is a plan feature. An account without it answers 400 with
 * a message naming the feature rather than an empty result, so that answer is
 * reported rather than failing the suite.
 */
function isFeatureUnavailable(error: Error): boolean {
	return (
		error instanceof Error &&
		'isFeatureUnavailable' in error &&
		(error as TaggunAPIError).isFeatureUnavailable === true
	);
}

if (!KEY.success) {
	// A silent skip reads as a pass in a summary, so say what is missing.
	console.warn(
		'TAGGUN_API_KEY is not set: the Taggun live smoke tests did not run.',
	);
}

describeLive('live Taggun extraction', () => {
	it('scans a receipt URL through the simple output schema', async () => {
		const result = await Simple.url(
			ctx as never,
			{
				url: SAMPLE_RECEIPT_URL,
				incognito: true,
				referenceId: 'corsair-live-simple',
			} as never,
		);

		expect(result.merchantName?.data).toBeTruthy();
		expect(typeof result.totalAmount?.data).toBe('number');
	});

	it('scans a receipt URL through the verbose output schema', async () => {
		const result = await Verbose.url(
			ctx as never,
			{
				url: SAMPLE_RECEIPT_URL,
				incognito: true,
				referenceId: 'corsair-live-verbose',
			} as never,
		);

		expect(result.trackingId).toBeTruthy();
		// Line items default to on for the verbose form, so a receipt this clear
		// should produce at least one.
		expect(result.entities?.productLineItems?.length ?? 0).toBeGreaterThan(0);
		expect(
			result.entities?.productLineItems?.[0]?.data?.name?.data,
		).toBeTruthy();
	});
});

describeLive('live Taggun campaign validation', () => {
	const campaignId = `corsair-live-${Date.now()}`;

	it('lists campaigns, or reports that the feature is unavailable', async () => {
		try {
			const ids = await Campaigns.list(ctx as never, {} as never);

			expect(Array.isArray(ids)).toBe(true);
			for (const id of ids) expect(typeof id).toBe('string');
		} catch (error) {
			// A live failure is a TaggunAPIError, which is an Error, so the
			// feature check below reads a normalised value.
			const failure = error instanceof Error ? error : new Error(String(error));
			// Campaign Validation is sold on the Advanced plan and above, so an
			// account without it is a documented answer, not a broken plugin.
			if (isFeatureUnavailable(failure)) {
				console.warn(
					'Campaign Validation is not enabled on this Taggun account: the campaign settings tests were skipped.',
				);
				return;
			}
			throw failure;
		}
	});

	it('creates, reads, and deletes a campaign', async () => {
		try {
			await Campaigns.create(
				ctx as never,
				{
					campaignId,
					settings: {
						merchantNames: { allowList: ['Corsair Live Test Merchant'] },
						balanceOwing: { max: 0.01 },
					},
				} as never,
			);

			const stored = await Campaigns.get(
				ctx as never,
				{
					campaignId,
				} as never,
			);
			expect(stored.merchantNames?.allowList).toEqual([
				'Corsair Live Test Merchant',
			]);

			const deleted = await Campaigns.remove(
				ctx as never,
				{
					campaignId,
				} as never,
			);
			expect(deleted.statusCode ?? 200).toBeLessThan(400);
		} catch (error) {
			// See the note on the listing test above.
			const failure = error instanceof Error ? error : new Error(String(error));
			if (isFeatureUnavailable(failure)) return;
			throw failure;
		}
	});
});
