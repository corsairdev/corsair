import { makeTeamworkRequest } from './client';

const apiKey = process.env.TEAMWORK_API_KEY?.trim();
const siteName = process.env.TEAMWORK_SITE_NAME?.trim();
const hasCredentials = Boolean(apiKey && siteName);

if (!hasCredentials) {
	console.warn(
		'[teamwork] live API test skipped: set TEAMWORK_API_KEY and TEAMWORK_SITE_NAME to enable it.',
	);
}

const liveTest = hasCredentials ? it : it.skip;

describe('Teamwork live API smoke test', () => {
	liveTest('reads the authenticated account profile', async () => {
		const response = await makeTeamworkRequest({
			apiKey: apiKey ?? '',
			siteName: siteName ?? '',
			version: 'v3',
			method: 'GET',
			path: '/projects/api/v3/me.json',
			pathParameters: {},
			query: {},
		});
		expect(response).toBeDefined();
	});
});
