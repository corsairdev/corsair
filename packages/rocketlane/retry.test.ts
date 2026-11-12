import { makeRocketlaneRequest } from './client';

describe('Rocketlane transport retries', () => {
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
