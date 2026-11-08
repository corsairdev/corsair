/**
 * Response bodies shaped from the OpenAPI spec at
 * https://api.memberspot.de/api-json and from the live error envelope, which
 * was confirmed with real requests: `{ message, statusCode }`, 400 for a
 * missing key and 401 for an invalid one.
 */

/**
 * `/api-auth` has no response schema in the spec, so this is the live shape.
 * The field is `schoolId`, not `id`.
 */
export const AUTH_CHECK_BODY = {
	schoolId: '8PQuQExdc4cPIMsJNoFW',
	name: 'test',
};

export const USER = {
	uid: 'uid-1',
	email: 'jordan@acme.example',
	created: '2026-01-15T09:00:00.000Z',
	firstname: 'Jordan',
	// MemberSpot calls the last name `name`.
	name: 'Miller',
	active: true,
	progress: [],
	customUserProperties: { department: 'Sales' },
};

export const USERS_LIST_BODY = {
	data: [USER],
	nextPage: 'cursor-2',
};

export const USERS_LIST_LAST_PAGE_BODY = {
	data: [USER],
};

/** The live offer carries eleven fields; the spec listed three. */
export const OFFERS_BODY = [
	{
		id: '6af066fe007fac5285648dc8',
		name: 'Pro membership',
		hasCourseIds: ['course-1'],
		priority: 0,
		allCourses: false,
		schoolId: '8PQuQExdc4cPIMsJNoFW',
		updatedAt: '2026-11-08T12:11:42.448Z',
		hasSpaceIds: [],
		internal: false,
		pageIds: [],
		portalIds: [],
	},
];

export const COURSES_BODY = {
	data: [
		{
			id: 'course-1',
			name: 'Onboarding',
			type: 'regular',
			description: 'First week',
		},
	],
};

export const EXAMS_BODY = {
	data: [
		{
			examId: 'exam-1',
			name: 'Safety check',
			requiredPercentage: 80,
			questionCount: 10,
		},
	],
};

export const EXAM_RESULTS_BODY = {
	data: [
		{
			uid: 'uid-1',
			email: 'jordan@acme.example',
			runs: [
				{
					startedAt: '2026-02-01T10:00:00.000Z',
					finishedAt: '2026-02-01T10:20:00.000Z',
					points: 9,
					passed: true,
				},
			],
			updatedAt: '2026-02-01T10:20:00.000Z',
		},
	],
};

export const CUSTOM_PROPERTIES_BODY = [
	{ id: 'prop-1', schoolId: 'school-1', type: 'text', name: 'Department' },
];

export const USER_OFFERS_BODY = {
	uid: 'uid-1',
	offers: [
		{
			offerId: 'offer-1',
			active: true,
			grantedAt: '2026-01-15T09:00:00.000Z',
			expiresAt: null,
		},
	],
};

export const LOGIN_TOKEN_BODY = {
	token: 'tok-abc',
	loginUrl: 'https://acme.memberspot.de/login/tok-abc',
};

export const USER_CREATED_BODY = {
	uid: 'uid-1',
	externalId: null,
	isNew: true,
	firstname: 'Jordan',
	name: 'Miller',
	email: 'jordan@acme.example',
	grantedOffers: [{ offerId: 'offer-1', name: 'Pro membership' }],
	active: true,
};

export const COURSE_PROGRESS_BODY = {
	data: [
		{
			uid: 'uid-1',
			email: 'jordan@acme.example',
			courseId: 'course-1',
			active: true,
			activePosts: 20,
			completedPosts: 5,
		},
	],
	nextPage: 'cursor-2',
};

export const COURSE_PROGRESS_DETAIL_BODY = {
	courseId: 'course-1',
	activePosts: 20,
	completedPosts: 5,
	progress: 25,
};

/** Write routes answer with a bare success-shaped object. */
export const MUTATION_BODY = { success: true };

/** The live error envelope, captured from the API. */
export function errorBody(statusCode: number, message: string) {
	return { message, statusCode };
}

export const MISSING_KEY_ERROR = errorBody(400, 'API key is missing');
export const INVALID_KEY_ERROR = errorBody(401, 'Unauthorized');
