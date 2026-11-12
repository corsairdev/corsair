import { makeD2lBrightspaceRequest } from './client';
import { D2L_ROUTES } from './route-definitions';

const baseUrl = process.env.D2LBRIGHTSPACE_BASE_URL;
const accessToken = process.env.D2LBRIGHTSPACE_OAUTH_ACCESS_TOKEN;

const liveTest = baseUrl && accessToken ? it : it.skip;

liveTest(
	'reads the current authenticated Brightspace user context',
	async () => {
		const route = D2L_ROUTES.find((entry) =>
			entry.path.endsWith('/users/whoami'),
		);
		if (!route || !baseUrl || !accessToken) {
			throw new Error(
				'D2L live-test configuration or whoami route is missing.',
			);
		}
		const result = await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.49' } },
			baseUrl,
			{ kind: 'oauth_2', accessToken },
		);
		expect(result).toBeDefined();
	},
);
