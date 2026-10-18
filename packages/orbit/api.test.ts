const apiKey = process.env.ORBIT_API_KEY ?? '';
const describeIfKey = apiKey ? describe : describe.skip;

describeIfKey('orbit live', () => {
	jest.setTimeout(180_000);

	it('parses a missing search as not found', async () => {
		const response = await fetch(
			'https://api.orbitsearch.com/v3/search/search_does_not_exist',
			{ headers: { Authorization: `Bearer ${apiKey}` } },
		);
		expect(response.status).toBe(404);
		// fetch().json() is untyped until the assertion below.
		const body: unknown = await response.json();
		expect(body).toMatchObject({
			status: 'failed',
			error: { code: expect.any(String), message: expect.any(String) },
		});
	});
});
