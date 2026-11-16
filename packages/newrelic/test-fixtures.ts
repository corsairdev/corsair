/**
 * Bodies below follow New Relic's REST v2 documentation and its NerdGraph
 * examples. The shapes that matter: `health_status` is a colour with `orange`
 * where the UI shows yellow, REST v2 paginates through a `Link` header, and a
 * bad NRQL query answers 200 with an `errors` array.
 */

export const applications = {
	applications: [
		{
			id: 1129082,
			name: 'My Web Page',
			language: 'java',
			health_status: 'green',
			reporting: true,
			last_reported_at: '2026-11-16T23:45:07+00:00',
			application_summary: {
				response_time: 304,
				throughput: 4570,
				error_rate: 0.0016,
				apdex_target: 523,
				apdex_score: 0.97,
			},
			end_user_summary: {
				response_time: 3.73,
				throughput: 0.333,
				apdex_target: 0,
				apdex_score: 1,
			},
			settings: {
				app_apdex_threshold: 0.5,
				end_user_apdex_threshold: 7,
				enable_real_user_monitoring: true,
				use_server_side_config: true,
			},
			links: {
				application_instances: [2928655, 3941052],
				alert_policy: 41534,
				servers: [],
				application_hosts: [2927654, 3940051],
			},
		},
	],
};

/** An app that has not reported in ten minutes shows `unknown` health. */
export const silentApplication = {
	application: {
		...applications.applications[0],
		id: 1129083,
		name: 'Silent Worker',
		health_status: 'unknown',
		reporting: false,
		last_reported_at: '',
	},
};

export const metricData = {
	metric_data: {
		from: '2026-11-16T14:42:00+00:00',
		to: '2026-11-16T15:12:00+00:00',
		metrics: [
			{
				name: 'Apdex',
				timeslice: 60,
				values: [
					{
						from: '2026-11-16T14:42:00+00:00',
						to: '2026-11-16T14:43:00+00:00',
						average_value: 0.97,
						total_value: 0.97,
						call_count: 1,
						min_value: 0.97,
						max_value: 0.97,
						sum_of_squares: 0.9409,
					},
				],
			},
		],
	},
};

export const policies = {
	policies: [
		{
			id: 41534,
			name: 'Browser Agent Alert Policy',
			incident_preference: 'PER_POLICY',
			created_at: 1763000000000,
			updated_at: 1763000000000,
		},
	],
};

export const createdPolicy = {
	policy: {
		id: 999001,
		name: 'EMEA API alerts',
		incident_preference: 'PER_CONDITION',
		created_at: 1763300000000,
		updated_at: 1763300000000,
	},
};

export const conditions = {
	conditions: [
		{
			id: 123456,
			type: 'apm_app_metric',
			name: 'Apdex (High)',
			enabled: true,
			entities: [1129082],
			metric: 'apdex',
			condition_scope: 'application',
			terms: [
				{
					duration: '5',
					operator: 'below',
					priority: 'critical',
					threshold: '0.7',
					time_function: 'all',
				},
			],
			user_defined: { message: 'Apdex is low' },
		},
	],
};

/** NerdGraph's answer: the NRQL result is nested under data.actor.account. */
export const nrqlResult = {
	data: {
		actor: {
			account: {
				nrql: {
					results: [{ count: 1234 }],
					metadata: {
						timeWindow: {
							begin: '2026-11-16T14:00:00Z',
							end: '2026-11-16T15:00:00Z',
						},
					},
				},
			},
		},
	},
};

/** REST v2's error shape: an errors array of messages. */
export const restAuthError = {
	errors: [{ message: 'authentication required' }],
};

/** A GraphQL error, which can arrive with a 200 and an extension code. */
export const graphqlNrqlError = {
	errors: [
		{
			message: 'NRQL syntax error: unrecognized statement',
			locations: [{ line: 1, column: 1 }],
			extensions: { code: 'BAD_USER_INPUT' },
		},
	],
};

export const graphqlForbidden = {
	errors: [
		{
			message: 'You do not have permission to view this account',
			extensions: { code: 'FORBIDDEN' },
		},
	],
};

/** A 429 carries its wait in a Retry-After header rather than the body. */
export const rateLimited = {
	errors: [{ message: 'rate limit exceeded' }],
};
