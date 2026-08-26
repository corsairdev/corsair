import 'dotenv/config';
import { Credits, Enrichment, LeadFinder } from './endpoints';
import { BetterContactEndpointOutputSchemas } from './endpoints/types';

// ─── Guards ─────────────────────────────────────────────────────────────────
// Read-only tests run whenever the key is present.
// Write tests (enrichment.enrich) consume credits — require explicit opt-in
// via BETTERCONTACT_WRITE_ENABLED=true in .env.
const API_KEY = process.env.BETTERCONTACT_API_KEY;
const WRITE_ENABLED = process.env.BETTERCONTACT_WRITE_ENABLED === 'true';

const describeOrSkip = API_KEY ? describe : describe.skip;
const describeWriteOrSkip = API_KEY && WRITE_ENABLED ? describe : describe.skip;

// Minimal context that the endpoint handlers accept.
// logEventFromContext will warn (ctx.$getAccountId missing) — that is expected
// in this test environment and does not affect the API call result.
function createLiveCtx() {
	return { key: API_KEY! } as never;
}

// ─── 1. credits.get ─────────────────────────────────────────────────────────
describeOrSkip('Live: credits.get — GET /account', () => {
	it('returns success:true, a numeric credits_left, and passes the output schema', async () => {
		const response = await Credits.get(createLiveCtx(), {});

		expect(response).toBeDefined();
		// credits_left is documented as integer but API returns it as a string —
		// z.coerce.number() normalises it, so we check the coerced value
		expect(Number.isFinite(Number(response.credits_left))).toBe(true);

		// Verify the response matches our declared output schema exactly
		const parsed =
			BetterContactEndpointOutputSchemas.creditsGet.safeParse(response);
		if (!parsed.success) {
			console.error('Schema mismatch — actual response:', response);
			console.error('Zod errors:', parsed.error.issues);
		}
		expect(parsed.success).toBe(true);
	});
});

// ─── 2. leadFinder.create ───────────────────────────────────────────────────
describeOrSkip('Live: leadFinder.create — POST /lead_finder/async', () => {
	it('accepts a search request and returns a request_id string', async () => {
		let response: Awaited<ReturnType<typeof LeadFinder.create>> | undefined;
		try {
			response = await LeadFinder.create(createLiveCtx(), {
				filters: { lead_seniority: { include: ['cxo'] } },
				limit: 1,
				enrich_email_address: false,
				enrich_phone_number: false,
			});
		} catch (err: unknown) {
			const e = err as { message?: string; body?: unknown; status?: number };
			console.error('leadFinder.create failed — HTTP status:', e.status);
			console.error('leadFinder.create failed — body:', e.body);
			throw err;
		}

		expect(response).toBeDefined();
		expect(typeof response!.request_id).toBe('string');
		expect(response!.request_id.length).toBeGreaterThan(0);

		const parsed =
			BetterContactEndpointOutputSchemas.leadFinderCreate.safeParse(response);
		if (!parsed.success) {
			console.error('Schema mismatch — actual response:', response);
			console.error('Zod errors:', parsed.error.issues);
		}
		expect(parsed.success).toBe(true);
	});
});

// ─── 3. leadFinder.getResults ───────────────────────────────────────────────
describeOrSkip(
	'Live: leadFinder.getResults — GET /lead_finder/async/:request_id',
	() => {
		let storedRequestId: string;

		// Submit a real search first, then poll results with the returned id.
		beforeAll(async () => {
			if (!API_KEY) return;
			const resp = await LeadFinder.create(createLiveCtx(), {
				filters: { lead_seniority: { include: ['cxo'] } },
				limit: 1,
				enrich_email_address: false,
				enrich_phone_number: false,
			});
			storedRequestId = resp.request_id;
		});

		it('returns a valid status for a known request_id', async () => {
			const response = await LeadFinder.getResults(createLiveCtx(), {
				request_id: storedRequestId,
			});

			expect(response).toBeDefined();
			expect(typeof response.status).toBe('string');
			expect(['not_started', 'processing', 'on_hold', 'terminated']).toContain(
				response.status,
			);

			const parsed =
				BetterContactEndpointOutputSchemas.leadFinderGetResults.safeParse(
					response,
				);
			if (!parsed.success) {
				console.error('Schema mismatch — actual response:', response);
				console.error('Zod errors:', parsed.error.issues);
			}
			expect(parsed.success).toBe(true);
		});
	},
);

// ─── 4. enrichment.enrich ───────────────────────────────────────────────────
// Requires BETTERCONTACT_WRITE_ENABLED=true — consumes real credits.
describeWriteOrSkip(
	'Live: enrichment.enrich — POST /async (consumes credits)',
	() => {
		it('accepts a batch and returns an enrichment id', async () => {
			const response = await Enrichment.enrich(createLiveCtx(), {
				data: [
					{
						first_name: 'John',
						last_name: 'Smith',
						company_domain: 'microsoft.com',
					},
				],
				enrich_email_address: true,
				enrich_phone_number: false,
			});

			expect(response).toBeDefined();
			expect(typeof response.id).toBe('string');
			expect(response.id.length).toBeGreaterThan(0);

			const parsed =
				BetterContactEndpointOutputSchemas.enrichmentEnrich.safeParse(response);
			if (!parsed.success) {
				console.error('Schema mismatch — actual response:', response);
				console.error('Zod errors:', parsed.error.issues);
			}
			expect(parsed.success).toBe(true);
		});
	},
);

// ─── 5. enrichment.getResults ───────────────────────────────────────────────
// Also behind write guard — submits an enrichment first, then polls results.
describeWriteOrSkip(
	'Live: enrichment.getResults — GET /async/:request_id',
	() => {
		let storedEnrichmentId: string;

		beforeAll(async () => {
			if (!API_KEY) return;
			const resp = await Enrichment.enrich(createLiveCtx(), {
				data: [
					{
						first_name: 'Jane',
						last_name: 'Doe',
						company_domain: 'google.com',
					},
				],
				enrich_email_address: true,
				enrich_phone_number: false,
			});
			storedEnrichmentId = resp.id;
		});

		it('returns a valid status for a known enrichment id', async () => {
			const response = await Enrichment.getResults(createLiveCtx(), {
				request_id: storedEnrichmentId,
			});

			expect(response).toBeDefined();
			expect(typeof response.status).toBe('string');
			expect(['not_started', 'processing', 'on_hold', 'terminated']).toContain(
				response.status,
			);

			const parsed =
				BetterContactEndpointOutputSchemas.enrichmentGetResults.safeParse(
					response,
				);
			if (!parsed.success) {
				console.error('Schema mismatch — actual response:', response);
				console.error('Zod errors:', parsed.error.issues);
			}
			expect(parsed.success).toBe(true);
		});
	},
);
