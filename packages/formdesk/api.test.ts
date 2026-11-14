import { makeFormdeskRequest } from './client';

const apiKey = process.env.FORMDESK_API_KEY;
const domain = process.env.FORMDESK_DOMAIN;
const host = process.env.FORMDESK_HOST;
const liveIt = apiKey && domain && host ? it : it.skip;
if (!apiKey || !domain || !host) {
	console.warn(
		'Skipping Formdesk live test: set FORMDESK_API_KEY, FORMDESK_DOMAIN and FORMDESK_HOST.',
	);
}

liveIt('lists forms with the configured Formdesk API key', async () => {
	if (!apiKey || !domain || !host)
		throw new Error('Live test configuration missing');
	const result = await makeFormdeskRequest(host, {
		method: 'GET',
		path: '/forms',
		domain,
		apiKey,
		retryable: true,
	});

	expect(Array.isArray(result.payload)).toBe(true);
	expect(
		result.creditsRemaining === null ||
			Number.isFinite(result.creditsRemaining),
	).toBe(true);
});
