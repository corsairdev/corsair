import { UsageSchema, VoiceSchema } from './endpoints/types';

const TEST_API_KEY = process.env.SAPERLY_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('saperly live', () => {
	jest.setTimeout(180_000);

	it('parses GET /health', async () => {
		const response = await fetch('https://api.saperly.com/health');
		expect(response.status).toBe(200);
		// fetch().json() is untyped until the schema below runs.
		const body: unknown = await response.json();
		expect(body).toMatchObject({ status: 'ok' });
	});

	it('parses GET /voices', async () => {
		const response = await fetch('https://api.saperly.com/voices', {
			headers: { Authorization: `Bearer ${TEST_API_KEY}` },
		});
		expect(response.status).toBe(200);
		// fetch().json() is untyped until VoiceSchema parses it.
		const body: unknown = await response.json();
		expect(VoiceSchema.array().parse(body).length).toBeGreaterThan(0);
	});

	it('parses GET /usage', async () => {
		const response = await fetch('https://api.saperly.com/usage', {
			headers: { Authorization: `Bearer ${TEST_API_KEY}` },
		});
		expect(response.status).toBe(200);
		// fetch().json() is untyped until UsageSchema parses it.
		const body: unknown = await response.json();
		const usage = UsageSchema.parse(body);
		expect(typeof usage.balanceCents).toBe('number');
	});
});
