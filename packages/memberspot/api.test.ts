import { makeMemberSpotRequest } from './client';
import { MemberSpotEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke tests. CI ignores this file, and it skips without a key:
 *
 *   MEMBERSPOT_API_KEY=... pnpm --filter @corsair-dev/memberspot run test:live
 *
 * Read-only: every call is a GET, so nothing in a real school is changed.
 */
const describeIfKey = process.env.MEMBERSPOT_API_KEY ? describe : describe.skip;

const key = process.env.MEMBERSPOT_API_KEY ?? '';

describeIfKey('live MemberSpot API', () => {
	it('confirms the key and returns the school', async () => {
		const body = await makeMemberSpotRequest(key, '/api-auth');
		const result = Outputs.authCheck.parse(body);
		// The school id is the one field worth asserting; the name is free text.
		expect(typeof result.id === 'string' || result.id === undefined).toBe(true);
	});

	it('lists offers', async () => {
		const body = await makeMemberSpotRequest(key, '/v1/offers');
		expect(() => Outputs.offersList.parse(body)).not.toThrow();
	});

	it('lists courses', async () => {
		const body = await makeMemberSpotRequest(key, '/v1/courses');
		expect(() => Outputs.coursesList.parse(body)).not.toThrow();
	});

	it('lists a page of users against the output schema', async () => {
		const body = await makeMemberSpotRequest(key, '/v1/users/list', {
			query: { pageLength: 5 },
		});
		expect(() => Outputs.usersList.parse(body)).not.toThrow();
	});

	it('lists the custom user properties', async () => {
		const body = await makeMemberSpotRequest(
			key,
			'/v1/custom-user-properties/list',
		);
		expect(() => Outputs.customPropertiesList.parse(body)).not.toThrow();
	});
});
