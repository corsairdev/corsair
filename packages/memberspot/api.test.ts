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
		// The live field is `schoolId`; the spec documents no response for this
		// route, so asserting it is what keeps the shape honest.
		expect(typeof result.schoolId).toBe('string');
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

	it('reads one user by uid, the shape the list returns too', async () => {
		const page = await makeMemberSpotRequest(key, '/v1/users/list', {
			query: { pageLength: 1 },
		});
		const listed = Outputs.usersList.parse(page);
		const uid = listed.data[0]?.uid;
		if (!uid) return; // an empty school proves nothing about the record shape

		const body = await makeMemberSpotRequest(
			key,
			`/v1/users/find-by-uid/${encodeURIComponent(uid)}`,
		);
		const user = Outputs.usersFindByUid.parse(body);
		expect(user.uid).toBe(uid);
		// `name` is the last name, not the full name.
		expect(typeof user.name).toBe('string');
	});

	it('reads one user by email', async () => {
		const page = await makeMemberSpotRequest(key, '/v1/users/list', {
			query: { pageLength: 1 },
		});
		const listed = Outputs.usersList.parse(page);
		const email = listed.data[0]?.email;
		if (!email) return;

		const body = await makeMemberSpotRequest(
			key,
			`/v1/users/find-by-mail/${encodeURIComponent(email)}`,
		);
		expect(Outputs.usersFindByEmail.parse(body).email).toBe(email);
	});

	it('reads the offers granted to that user', async () => {
		const page = await makeMemberSpotRequest(key, '/v1/users/list', {
			query: { pageLength: 1 },
		});
		const uid = Outputs.usersList.parse(page).data[0]?.uid;
		if (!uid) return;

		const body = await makeMemberSpotRequest(
			key,
			`/v1/users/offers/${encodeURIComponent(uid)}`,
		);
		const result = Outputs.usersOffers.parse(body);
		expect(result.uid).toBe(uid);
		expect(Array.isArray(result.offers)).toBe(true);
	});

	it('reads that user course progress list', async () => {
		const page = await makeMemberSpotRequest(key, '/v1/users/list', {
			query: { pageLength: 1 },
		});
		const uid = Outputs.usersList.parse(page).data[0]?.uid;
		if (!uid) return;

		const body = await makeMemberSpotRequest(
			key,
			`/v1/users/course-progress/list-by-uid/${encodeURIComponent(uid)}`,
			{ query: { pageLength: 5 } },
		);
		expect(() => Outputs.usersCourseProgressByUid.parse(body)).not.toThrow();
	});
});
