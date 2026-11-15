/**
 * Fixtures transcribed from the provider's OpenAPI document, whose examples are
 * what the API returns for these routes (https://app.satismeter.com/apidoc).
 * Each one keeps the `{ data }` envelope the v3 reads use, because the plugin's
 * unwrapping is part of what is being tested.
 *
 * The error bodies are the ones a live probe returned verbatim, and they matter
 * because they disagree with the spec's `Error` schema in a way that changes the
 * client: a v3 read with a bad key answers `404 Project not found`, not 403.
 */

export const PROJECT_BODY = {
	data: {
		id: '61fce0adea447e24ec27d606',
		name: 'SatisMeter Sample App',
	},
};

export const SURVEYS_BODY = {
	data: [
		{
			id: '61fce0adea447e24ec27d609',
			name: 'CSAT Survey',
			type: 'csat',
			state: 'live',
		},
		{
			id: '61fd0539d0f7c177bab4b49b',
			name: 'NPS Survey',
			type: 'nps',
			state: 'draft',
		},
	],
};

export const SURVEY_BODY = {
	data: {
		id: '61fce0adea447e24ec27d609',
		name: 'CSAT Survey',
		type: 'csat',
		state: 'live',
	},
};

/** One page of responses, as the provider's example lays them out. */
export const RESPONSES_BODY = {
	page: {
		hasNextPage: true,
		nextPageCursor: 'eyJjcmVhdGVkIjoiMjAyMi0wMi0wNFQxMDoyMjo0OC42MThaIn0',
		size: 20,
	},
	data: [
		{
			id: '61fcfe9f1f8c2a4a91d23dc9',
			project: '61fce0adea447e24ec27d606',
			campaign: '61fce0adea447e24ec27d609',
			created: '2022-02-04T10:23:27.165Z',
			answers: [
				{
					label: 'How satisfied were you with the service you received?',
					id: '5dd3b8d0-85a4-11ec-a5f4-69c24c3482af',
					value: 5,
					type: 'smiley',
					metric: 'csat',
				},
				{
					label: 'What could we do to improve?',
					id: '0ad562e4-85a6-11ec-a8a3-0242ac120002',
					value: 'Nothing. Everything is great.',
					type: 'long-text',
				},
			],
			user: {
				id: '61fcfe9d6f8492a197205e99',
				name: 'Jane Doe',
				email: 'jane@doe.com',
				userId: '4321',
				deleted: false,
				traits: {
					createdAt: '2022-01-04T10:21:59.522Z',
					email: 'jane@doe.com',
					name: 'Jane Doe',
				},
			},
			device: { os: 'Linux', type: 'desktop' },
			referrer: 'https://test-page.com',
			method: 'In-app',
			language: 'en',
		},
		{
			id: '61fcfe781f8c2a4a91d23dc8',
			project: '61fce0adea447e24ec27d606',
			campaign: '61fce0adea447e24ec27d609',
			created: '2022-02-04T10:22:48.618Z',
			answers: [
				{
					label: 'How satisfied were you with the service you received?',
					id: '5dd3b8d0-85a4-11ec-a5f4-69c24c3482af',
					value: 3,
					type: 'smiley',
					metric: 'csat',
				},
			],
			user: {
				id: '61fcfe9d6f8492a197205e9a',
				userId: '9999',
				deleted: false,
				traits: {},
			},
			device: { os: 'iOS', type: 'phone' },
			referrer: null,
			method: 'Mobile',
			language: 'en',
		},
	],
};

/** The last page: no cursor, and `hasNextPage` false. */
export const RESPONSES_LAST_PAGE_BODY = {
	page: { hasNextPage: false, size: 20 },
	data: [],
};

export const STATISTICS_BODY = {
	data: {
		statistics: { responses: 2, displays: 2, responseRate: 1 },
		questions: [
			{
				id: '5dd3b8d0-85a4-11ec-a5f4-69c24c3482af',
				label: 'How satisfied were you with the service you received?',
				type: 'smiley',
				statistics: {
					answers: 2,
					values: [
						{ value: 1, answers: 0 },
						{ value: 2, answers: 0 },
						{ value: 3, answers: 1 },
						{ value: 4, answers: 0 },
						{ value: 5, answers: 1 },
					],
					metric: { type: 'csat', value: 50 },
				},
			},
			{
				// long-text carries a count and no `values` array.
				id: '0ad562e4-85a6-11ec-a8a3-0242ac120002',
				label: 'What could we do to improve?',
				type: 'long-text',
				statistics: { answers: 1 },
			},
		],
	},
};

export const USERS_BODY = {
	users: [
		{
			project: '5808e7031a943c7e564cdb16',
			userId: '007',
			lastSeen: '2016-12-01T00:00:00.000Z',
			traits: {
				email: 'john@doe.com',
				name: 'John Doe',
				createdAt: '2016-01-01T00:00:00.000Z',
			},
			email: 'john@doe.com',
			name: 'John Doe',
			unsubscribed: false,
			created: '2016-01-01T00:00:00.000Z',
			id: '5808e7031a943c7e564cdb17',
		},
	],
};

/** A project with no surveys answers an empty list, not 404. */
export const EMPTY_SURVEYS_BODY = { data: [] };

// ── Error bodies, captured live ───────────────────────────────────────────

export const PROJECT_NOT_FOUND_BODY = {
	errors: [{ title: 'Project not found' }],
};

export const CAMPAIGN_NOT_FOUND_BODY = {
	errors: [{ title: 'Campaign not found' }],
};

export const NOT_AUTHORIZED_BODY = { errors: [{ title: 'Not authorized' }] };

export const FORBIDDEN_BODY = { errors: [{ title: 'Forbidden' }] };

export const NO_WRITE_KEY_BODY = { errors: [{ title: 'No write key' }] };

export const USER_NOT_FOUND_BODY = { errors: [{ title: 'User not found' }] };

export const NOT_FOUND_ROUTE_BODY = { errors: [{ title: 'Not Found' }] };

export const SERVER_ERROR_BODY = {
	errors: [{ title: 'Internal server error' }],
};
