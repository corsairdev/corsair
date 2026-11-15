const TEST_API_KEY = process.env.SUZANNE_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('suzanne live', () => {
	jest.setTimeout(180_000);

	it('parses a missing job as not_found', async () => {
		const response = await fetch(
			'https://api.suzanne3d.com/v1/jobs/job_00000000-0000-0000-0000-000000000000',
			{ headers: { Authorization: `Bearer ${TEST_API_KEY}` } },
		);
		expect(response.status).toBe(404);
		// fetch().json() is untyped until the assertion below.
		const body: unknown = await response.json();
		expect(body).toMatchObject({
			error: { code: 'not_found' },
		});
	});

	it('parses a missing download as not_found', async () => {
		const response = await fetch(
			'https://api.suzanne3d.com/v1/models/job_00000000-0000-0000-0000-000000000000/download?format=glb',
			{
				headers: { Authorization: `Bearer ${TEST_API_KEY}` },
				redirect: 'manual',
			},
		);
		expect(response.status).toBe(404);
		// fetch().json() is untyped until the assertion below.
		const body: unknown = await response.json();
		expect(body).toMatchObject({
			error: { code: 'not_found' },
		});
	});
});
