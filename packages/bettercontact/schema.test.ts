import {
	BetterContactEndpointInputSchemas,
	BetterContactEndpointOutputSchemas,
} from './endpoints/types';
import { BetterContactSchema } from './schema';

describe('BetterContact schema & metadata', () => {
	it('declares a semver version and entities', () => {
		expect(BetterContactSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof BetterContactSchema.entities).toBe('object');
	});
});

describe('BetterContact input schemas - Valid inputs', () => {
	it('validates credits.get input', () => {
		expect(
			BetterContactEndpointInputSchemas.creditsGet.safeParse({}).success,
		).toBe(true);
	});

	it('validates leadFinder.create input', () => {
		const valid = BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
			filters: { lead_seniority: { include: ['cxo', 'vp'] } },
			limit: 50,
			offset: 0,
			enrich_email_address: true,
		});
		expect(valid.success).toBe(true);
	});

	it('validates leadFinder.getResults input', () => {
		const valid =
			BetterContactEndpointInputSchemas.leadFinderGetResults.safeParse({
				request_id: 'req_123',
			});
		expect(valid.success).toBe(true);
	});

	it('validates enrichment.enrich input', () => {
		const valid = BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
			data: [{ first_name: 'John', company_domain: 'example.com' }],
			enrich_phone_number: true,
		});
		expect(valid.success).toBe(true);
	});

	it('validates enrichment.getResults input', () => {
		const valid =
			BetterContactEndpointInputSchemas.enrichmentGetResults.safeParse({
				request_id: 'req_456',
			});
		expect(valid.success).toBe(true);
	});
});

describe('BetterContact input schemas - Edge & Rejection cases', () => {
	it('rejects leadFinder.create with limit > 200 or < 1', () => {
		const tooHigh =
			BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
				filters: { lead_seniority: { include: ['cxo'] } },
				limit: 250,
			});
		expect(tooHigh.success).toBe(false);

		const tooLow = BetterContactEndpointInputSchemas.leadFinderCreate.safeParse(
			{
				filters: { lead_seniority: { include: ['cxo'] } },
				limit: 0,
			},
		);
		expect(tooLow.success).toBe(false);
	});

	it('rejects leadFinder.create with negative offset', () => {
		const invalid =
			BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
				filters: { lead_seniority: { include: ['cxo'] } },
				offset: -5,
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects leadFinder.create when filters is missing (required field)', () => {
		const invalid =
			BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
				limit: 10,
			});
		expect(invalid.success).toBe(false);
		if (!invalid.success) {
			const fields = invalid.error.issues.map((i) => i.path[0]);
			expect(fields).toContain('filters');
		}
	});

	it('rejects enrichment.enrich with empty data array', () => {
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				data: [],
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects enrichment.enrich with data array > 100 items', () => {
		const items = Array.from({ length: 101 }, (_, i) => ({
			first_name: `User${i}`,
		}));
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				data: items,
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects enrichment.enrich when data field is missing entirely (required)', () => {
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				enrich_email_address: true,
			});
		expect(invalid.success).toBe(false);
		if (!invalid.success) {
			const fields = invalid.error.issues.map((i) => i.path[0]);
			expect(fields).toContain('data');
		}
	});

	it('rejects getResults without request_id', () => {
		const leadFinderInvalid =
			BetterContactEndpointInputSchemas.leadFinderGetResults.safeParse({});
		expect(leadFinderInvalid.success).toBe(false);
		if (!leadFinderInvalid.success) {
			const fields = leadFinderInvalid.error.issues.map((i) => i.path[0]);
			expect(fields).toContain('request_id');
		}

		const enrichmentInvalid =
			BetterContactEndpointInputSchemas.enrichmentGetResults.safeParse({});
		expect(enrichmentInvalid.success).toBe(false);
		if (!enrichmentInvalid.success) {
			const fields = enrichmentInvalid.error.issues.map((i) => i.path[0]);
			expect(fields).toContain('request_id');
		}
	});

	it('rejects request_id that is not a string', () => {
		const withNumber =
			BetterContactEndpointInputSchemas.leadFinderGetResults.safeParse({
				request_id: 12345,
			});
		expect(withNumber.success).toBe(false);

		const withNull =
			BetterContactEndpointInputSchemas.enrichmentGetResults.safeParse({
				request_id: null,
			});
		expect(withNull.success).toBe(false);
	});

	it('rejects enrichment.enrich timeout_seconds below 1', () => {
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				data: [{ first_name: 'Test' }],
				timeout_seconds: 0,
			});
		expect(invalid.success).toBe(false);
	});
});

describe('BetterContact output schemas', () => {
	it('parses credits response', () => {
		const res = BetterContactEndpointOutputSchemas.creditsGet.safeParse({
			success: true,
			credits_left: 1000,
			email: 'user@example.com',
		});
		expect(res.success).toBe(true);
	});

	it('parses leadFinder.create response', () => {
		const res = BetterContactEndpointOutputSchemas.leadFinderCreate.safeParse({
			success: true,
			request_id: 'req_123',
			message: 'Accepted',
		});
		expect(res.success).toBe(true);
	});

	it('parses leadFinder.getResults response with all statuses', () => {
		for (const status of [
			'not_started',
			'processing',
			'on_hold',
			'terminated',
		]) {
			const res =
				BetterContactEndpointOutputSchemas.leadFinderGetResults.safeParse({
					id: 'req_123',
					status,
					credits_consumed: 10,
					credits_left: 990,
					leads: [{ name: 'Jane' }],
				});
			expect(res.success).toBe(true);
		}
	});

	it('parses enrichment.enrich response', () => {
		const res = BetterContactEndpointOutputSchemas.enrichmentEnrich.safeParse({
			success: true,
			id: 'enrich_123',
		});
		expect(res.success).toBe(true);
	});

	it('parses enrichment.getResults response with all statuses', () => {
		for (const status of [
			'not_started',
			'processing',
			'on_hold',
			'terminated',
		]) {
			const res =
				BetterContactEndpointOutputSchemas.enrichmentGetResults.safeParse({
					id: 'enrich_123',
					status,
					credits_consumed: 5,
					credits_left: 995,
					data: [{ email: 'jane@example.com' }],
				});
			expect(res.success).toBe(true);
		}
	});
});
