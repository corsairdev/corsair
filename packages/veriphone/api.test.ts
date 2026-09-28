import { makeVeriphoneRequest } from './client';
import { VeriphoneEndpointOutputSchemas } from './endpoints/types';

// Live API tests — skipped unless VERIPHONE_API_KEY is set in the
// environment. They hit the real Veriphone API and prove the endpoint
// output schemas accept the shapes the provider actually returns.
// verifyPhoneNumber: https://veriphone.io/docs/v3#verify
// getExamplePhoneNumber: GET /v2/example (undocumented officially;
// documented by the RapidAPI Veriphone mirror).
function requireApiKey(): string {
	const key = process.env.VERIPHONE_API_KEY;
	if (key === undefined || key === '') {
		throw new Error('VERIPHONE_API_KEY is not set');
	}
	return key;
}

const hasApiKey =
	process.env.VERIPHONE_API_KEY !== undefined &&
	process.env.VERIPHONE_API_KEY !== '';

const describeOrSkip = hasApiKey ? describe : describe.skip;

describeOrSkip('Veriphone API Type Tests', () => {
	it('verifyPhoneNumber returns correct type', async () => {
		const response = await makeVeriphoneRequest('v3/verify', requireApiKey(), {
			query: { phone: '+14169670000' },
		});

		const parsed =
			VeriphoneEndpointOutputSchemas.verifyPhoneNumber.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.phone_valid).toBe(true);
		expect(parsed.country_code).toBe('CA');
	});

	it('getExamplePhoneNumber returns correct type', async () => {
		const response = await makeVeriphoneRequest('v2/example', requireApiKey(), {
			query: { country_code: 'US', type: 'mobile' },
		});

		const parsed =
			VeriphoneEndpointOutputSchemas.getExamplePhoneNumber.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.country_code).toBe('US');
	});

	it('getCredits returns correct type', async () => {
		const response = await makeVeriphoneRequest('v3/credits', requireApiKey());

		const parsed = VeriphoneEndpointOutputSchemas.credits.parse(response);
		expect(typeof parsed.counter).toBe('number');
		expect(parsed.active).toBe(true);
	});

	it('getCoverage returns a country list', async () => {
		const response = await makeVeriphoneRequest(
			'v3/coverage/current',
			requireApiKey(),
		);

		const parsed = VeriphoneEndpointOutputSchemas.coverage.parse(response);
		expect(Array.isArray(parsed.countries)).toBe(true);
		expect(parsed.countries.length).toBeGreaterThan(0);
		const first = parsed.countries[0];
		if (first === undefined) {
			throw new Error('expected at least one country');
		}
		expect(first).toHaveProperty('iso');
	});
});

// `mode=current` costs 10 credits per lookup AND, on the free plan, is only
// covered by purchased pay-as-you-go credits — the free monthly allowance
// does not cover it (provider error: "on the free plan, mode 'current' uses
// pay-as-you-go credits only"). So this test is additionally gated behind
// VERIPHONE_CURRENT_ENABLED=true, mirroring the repo's opt-in pattern for
// costly live tests (see abuseipdb's ABUSEIPDB_WRITE_ENABLED).
const currentEnabled = process.env.VERIPHONE_CURRENT_ENABLED === 'true';

const describeCurrentOrSkip =
	hasApiKey && currentEnabled ? describe : describe.skip;

describeCurrentOrSkip('Veriphone API current-mode tests', () => {
	it('verifyPhoneNumber with mode=current returns current-carrier fields', async () => {
		const response = await makeVeriphoneRequest('v3/verify', requireApiKey(), {
			query: { phone: '+14169670000', mode: 'current' },
		});

		const parsed =
			VeriphoneEndpointOutputSchemas.verifyPhoneNumber.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.mode).toBe('current');
		expect(parsed).toHaveProperty('original_carrier');
	});
});
