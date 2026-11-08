import {
	MemberSpotEndpointInputSchemas as Inputs,
	MemberSpotEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	AUTH_CHECK_BODY,
	COURSE_PROGRESS_BODY,
	COURSE_PROGRESS_DETAIL_BODY,
	COURSES_BODY,
	CUSTOM_PROPERTIES_BODY,
	EXAM_RESULTS_BODY,
	EXAMS_BODY,
	LOGIN_TOKEN_BODY,
	MUTATION_BODY,
	OFFERS_BODY,
	USER,
	USER_CREATED_BODY,
	USER_OFFERS_BODY,
	USERS_LIST_BODY,
	USERS_LIST_LAST_PAGE_BODY,
} from './test-fixtures';

describe('auth.check', () => {
	it('reads the school the key belongs to, keyed as schoolId', () => {
		// The spec documents no response for this route; the live field is schoolId.
		const output = Outputs.authCheck.parse(AUTH_CHECK_BODY);
		expect(output.schoolId).toBe('8PQuQExdc4cPIMsJNoFW');
		expect(output.name).toBe('test');
	});
});

describe('catalog reads', () => {
	it('offers.list returns an array, not an envelope', () => {
		// Unlike courses and exams, the offers route answers a bare array.
		const output = Outputs.offersList.parse(OFFERS_BODY);
		expect(output).toHaveLength(1);
		expect(output[0]?.hasCourseIds).toEqual(['course-1']);
	});

	it('offers.list reads the fields the spec omits', () => {
		const output = Outputs.offersList.parse(OFFERS_BODY);
		expect(output[0]?.allCourses).toBe(false);
		expect(output[0]?.priority).toBe(0);
		expect(output[0]?.internal).toBe(false);
	});

	it('offers.list keeps an unknown extra field rather than failing', () => {
		const output = Outputs.offersList.parse([
			{ id: 'o', name: 'n', brandNewField: 'x' },
		]);
		expect(output[0]).toMatchObject({ brandNewField: 'x' });
	});

	it('courses.list reads the data envelope', () => {
		const output = Outputs.coursesList.parse(COURSES_BODY);
		expect(output.data[0]?.type).toBe('regular');
	});

	it('exams.list reads examId, which is the id used for results', () => {
		const output = Outputs.examsList.parse(EXAMS_BODY);
		expect(output.data[0]?.examId).toBe('exam-1');
	});

	it('customProperties.list returns a bare array', () => {
		const output = Outputs.customPropertiesList.parse(CUSTOM_PROPERTIES_BODY);
		expect(output[0]?.type).toBe('text');
	});

	it('rejects a body missing the data envelope', () => {
		expect(() => Outputs.coursesList.parse(COURSES_BODY.data)).toThrow();
	});
});

describe('users.list', () => {
	it('reads a page with its nextPage cursor', () => {
		const output = Outputs.usersList.parse(USERS_LIST_BODY);
		expect(output.data).toHaveLength(1);
		expect(output.nextPage).toBe('cursor-2');
	});

	it('leaves nextPage absent on the last page', () => {
		const output = Outputs.usersList.parse(USERS_LIST_LAST_PAGE_BODY);
		expect(output.nextPage).toBeUndefined();
	});

	it('keeps the provider name as the last name', () => {
		const output = Outputs.usersList.parse(USERS_LIST_BODY);
		expect(output.data[0]?.name).toBe('Miller');
		expect(output.data[0]?.firstname).toBe('Jordan');
	});

	it('reads custom user properties as a string map', () => {
		const output = Outputs.usersList.parse(USERS_LIST_BODY);
		expect(output.data[0]?.customUserProperties).toEqual({
			department: 'Sales',
		});
	});

	it('rejects a user missing a required field', () => {
		expect(() =>
			Outputs.usersList.parse({ data: [{ uid: 'uid-1' }] }),
		).toThrow();
	});
});

describe('single user reads', () => {
	it('reads a user by email or uid', () => {
		expect(Outputs.usersFindByEmail.parse(USER).uid).toBe('uid-1');
		expect(Outputs.usersFindByUid.parse(USER).uid).toBe('uid-1');
	});

	it('rejects a non-object where a user is expected', () => {
		expect(() => Outputs.usersFindByEmail.parse(null)).toThrow();
	});

	it('rejects an empty body, which is what find-by-uid sends for an unknown uid', () => {
		// The live API answers 200 with an empty body, not null, so the parse fails
		// loudly rather than handing back a blank user.
		expect(() => Outputs.usersFindByUid.parse(undefined)).toThrow();
		expect(() => Outputs.usersFindByUid.parse('')).toThrow();
	});

	it('users.offers reads grants with their active state', () => {
		const output = Outputs.usersOffers.parse(USER_OFFERS_BODY);
		expect(output.offers[0]?.active).toBe(true);
		// A null expiry means the offer never expires.
		expect(output.offers[0]?.expiresAt).toBeNull();
	});

	it('loginToken reads the token and login URL', () => {
		const output = Outputs.usersLoginToken.parse(LOGIN_TOKEN_BODY);
		expect(output.token).toBe('tok-abc');
		expect(output.loginUrl).toContain('memberspot.de');
	});
});

describe('user writes', () => {
	it('reads the created-user result including isNew', () => {
		const output = Outputs.usersGrantOffer.parse(USER_CREATED_BODY);
		expect(output.isNew).toBe(true);
		expect(output.grantedOffers?.[0]?.offerId).toBe('offer-1');
	});

	it('accepts an externalId of null', () => {
		const output = Outputs.usersGrantOffer.parse(USER_CREATED_BODY);
		expect(output.externalId).toBeNull();
	});

	it('reads a mutation envelope', () => {
		expect(Outputs.usersDelete.parse(MUTATION_BODY).success).toBe(true);
	});
});

describe('course progress', () => {
	it('reads a paginated progress list', () => {
		const output = Outputs.usersCourseProgress.parse(COURSE_PROGRESS_BODY);
		expect(output.data[0]?.completedPosts).toBe(5);
		expect(output.nextPage).toBe('cursor-2');
	});

	it('reads one course progress detail', () => {
		const output = Outputs.usersCourseProgressDetail.parse(
			COURSE_PROGRESS_DETAIL_BODY,
		);
		expect(output.progress).toBe(25);
	});

	it('rejects a progress row with a non-numeric count', () => {
		expect(() =>
			Outputs.usersCourseProgress.parse({
				data: [{ completedPosts: 'five' }],
			}),
		).toThrow();
	});
});

describe('exam results', () => {
	it('reads runs with their pass flag', () => {
		const output = Outputs.examResults.parse(EXAM_RESULTS_BODY);
		expect(output.data[0]?.runs?.[0]?.passed).toBe(true);
	});

	it('keeps the provider spelling lastSuccessfullRun', () => {
		const output = Outputs.examResults.parse({
			data: [{ uid: 'u', lastSuccessfullRun: { passed: true } }],
		});
		expect(output.data[0]?.lastSuccessfullRun?.passed).toBe(true);
	});

	it('rejects a result list without the data array', () => {
		expect(() => Outputs.examResults.parse({ nextPage: 'x' })).toThrow();
	});
});

describe('input validation', () => {
	it('requires a non-empty value for every id', () => {
		expect(() => Inputs.usersFindByUid.parse({ uid: '' })).toThrow();
		expect(() => Inputs.examResults.parse({ id: '' })).toThrow();
	});

	it('requires an email for the email-keyed routes', () => {
		expect(() => Inputs.usersFindByEmail.parse({ email: 'nope' })).toThrow();
		expect(() =>
			Inputs.usersFindByEmail.parse({ email: 'a@b.co' }),
		).not.toThrow();
	});

	it('caps a delete list at 10 for both key types', () => {
		const many = Array.from({ length: 11 }, (_, i) => `u${i}@acme.example`);
		expect(() => Inputs.usersDelete.parse({ emails: many })).toThrow();
		expect(() =>
			Inputs.usersDeleteByUid.parse({ uids: many.map((_, i) => `uid-${i}`) }),
		).toThrow();
	});

	it('rejects an empty delete list', () => {
		expect(() => Inputs.usersDelete.parse({ emails: [] })).toThrow();
	});

	it('accepts a null expiresAt, which clears the expiry', () => {
		expect(() =>
			Inputs.usersSetOfferExpires.parse({
				uid: 'uid-1',
				offerId: 'offer-1',
				expiresAt: null,
			}),
		).not.toThrow();
	});

	it('accepts a custom property value of null', () => {
		expect(() =>
			Inputs.usersSetCustomProperty.parse({
				email: 'a@b.co',
				key: 'prop-1',
				value: null,
			}),
		).not.toThrow();
	});
});
