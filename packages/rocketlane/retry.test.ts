import { makeRocketlaneRequest } from './client';

describe('Rocketlane transport retries', () => {
	it('serializes selected fields as one comma-separated query value', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		try {
			await makeRocketlaneRequest('1.0/projects/42', 'key', {
				query: { includeFields: ['projectFee', 'allocatedHours'] },
			});
			const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
			expect(url.searchParams.getAll('includeFields')).toEqual([
				'projectFee,allocatedHours',
			]);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('surfaces a rate limit without replaying a write', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '1' },
			}),
		);
		try {
			await expect(
				makeRocketlaneRequest('1.0/projects', 'key', {
					method: 'POST',
					body: { projectName: 'Acme' },
				}),
			).rejects.toMatchObject({ status: 429, retryAfter: 1000 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			fetchMock.mockRestore();
		}
	});
});
