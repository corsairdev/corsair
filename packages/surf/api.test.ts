const apiKey = process.env.SURF_API_KEY ?? '';
const describeIfKey = apiKey ? describe : describe.skip;

describeIfKey('surf live', () => {
	jest.setTimeout(180_000);

	it('parses a fear and greed read', async () => {
		const response = await fetch(
			'https://api.asksurf.ai/gateway/v1/market/fear-greed',
			{ headers: { Authorization: `Bearer ${apiKey}` } },
		);
		expect(response.ok).toBe(true);
		// fetch().json() is untyped until the assertion below.
		const body: unknown = await response.json();
		expect(body).toEqual(
			expect.objectContaining({
				data: expect.anything(),
			}),
		);
	});
});
