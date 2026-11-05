const apiKey = process.env.ORBIT_API_KEY ?? '';
const describeIfKey = apiKey ? describe : describe.skip;

describeIfKey('orbit live', () => {
	jest.setTimeout(180_000);

	it('parses a missing search as not found', async () => {
		const response = await fetch(
			'https://api.orbitsearch.com/v3/search/00000000-0000-4000-8000-000000000099',
			{ headers: { Authorization: `Bearer ${apiKey}` } },
		);
		expect(response.status).toBe(404);
		// fetch().json() is untyped until the assertion below.
		const body: unknown = await response.json();
		expect(body).toMatchObject({
			status: 'failed',
			error: {
				code: 'developer_v3_search_not_found',
				message: 'Search not found',
			},
		});
	});
});
