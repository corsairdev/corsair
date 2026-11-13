import { makeGoogleClassroomRequest } from './client';
import { GoogleClassroomEndpointOutputSchemas } from './endpoints/types';

const accessToken = process.env.GOOGLECLASSROOM_ACCESS_TOKEN;
if (!accessToken)
	console.warn(
		'Set GOOGLECLASSROOM_ACCESS_TOKEN to run the read-only Google Classroom live smoke test.',
	);

const liveTest = accessToken ? it : it.skip;

liveTest(
	'reads the authenticated Google Classroom profile without exposing the access token',
	async () => {
		if (!accessToken) return;
		const result = await makeGoogleClassroomRequest(
			'/v1/userProfiles/me',
			accessToken,
			{ method: 'GET', query: {} },
		);
		expect(
			GoogleClassroomEndpointOutputSchemas['userProfiles.get'].parse(result),
		).toBeDefined();
	},
);
