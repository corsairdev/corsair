import { makeBasecampRequest } from './client';

const token = process.env.BASECAMP_ACCESS_TOKEN;
const accountId = process.env.BASECAMP_ACCOUNT_ID;
const userAgent =
	process.env.BASECAMP_USER_AGENT ??
	'Corsair Basecamp Integration (https://corsair.dev)';
const live = token && accountId ? describe : describe.skip;

live('Basecamp live verification', () => {
	it('lists projects using the selected OAuth account', async () => {
		const result = await makeBasecampRequest<unknown[]>(
			'/' + accountId + '/projects.json',
			token!,
			userAgent,
			{ method: 'GET', query: { page: 1 }, retrySafe: true },
		);
		expect(Array.isArray(result)).toBe(true);
	});
});
