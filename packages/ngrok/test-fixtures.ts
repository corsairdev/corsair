/**
 * Bodies below follow ngrok's published OpenAPI spec
 * (https://raw.githubusercontent.com/ngrok/ngrok-openapi/main/ngrok.yaml) and
 * its live error envelopes. The shapes that matter: paging is by `before_id`,
 * a delete answers 204 with no body, and an API key's `token` appears only on
 * the create response.
 */

export const endpoints = {
	endpoints: [
		{
			id: 'ep_2f1c8d9e3a5b4c6d8e9f0a1b2c3d4e5f',
			region: 'us',
			created_at: '2026-11-10T09:12:00Z',
			updated_at: '2026-11-10T09:12:00Z',
			public_url: 'https://acme-api.ngrok.app',
			proto: 'HTTPS',
			scheme: 'HTTPS',
			hostport: 'acme-api.ngrok.app:443',
			host: 'acme-api.ngrok.app',
			port: 443,
			type: 'cloud',
			description: 'Acme API',
			url: 'https://acme-api.ngrok.app',
			upstream_url: 'https://internal.example.com',
			upstream_protocol: 'HTTPS',
			traffic_policy: '',
			bindings: ['public'],
			domain: {
				id: 'rd_1',
				uri: 'https://api.ngrok.com/reserved_domains/rd_1',
			},
			tunnel: {
				id: 'tn_1',
				uri: 'https://api.ngrok.com/tunnels/tn_1',
			},
		},
	],
	uri: 'https://api.ngrok.com/endpoints',
	next_page_uri: 'https://api.ngrok.com/endpoints?before_id=ep_next',
};

export const singleEndpoint = endpoints.endpoints[0];

/** The last page: next_page_uri is absent rather than a URL. */
export const endpointsLastPage = {
	endpoints: [singleEndpoint],
	uri: 'https://api.ngrok.com/endpoints',
};

export const reservedDomains = {
	reserved_domains: [
		{
			id: 'rd_2f1c8d9e3a5b4c6d',
			uri: 'https://api.ngrok.com/reserved_domains/rd_2f1c8d9e3a5b4c6d',
			created_at: '2026-11-01T08:00:00Z',
			description: 'Acme production',
			domain: 'acme.example.com',
			region: 'us',
			cname_target: 'abc123.cname.us.ngrok-cname.com',
			certificate: null,
			certificate_management_policy: 'automatic',
			certificate_management_status: {
				renews_at: null,
				provisioning_job: null,
			},
			acme_challenge_cname_target:
				'_acme-challenge.acme.example.com.abc123.cname.us.ngrok-cname.com',
		},
	],
	uri: 'https://api.ngrok.com/reserved_domains',
};

export const singleDomain = reservedDomains.reserved_domains[0];

export const tunnels = {
	tunnels: [
		{
			id: 'tn_2f1c8d9e3a5b4c6d',
			public_url: 'https://acme-api.ngrok.app',
			started_at: '2026-11-16T07:00:00Z',
			proto: 'https',
			region: 'us',
			labels: { env: 'prod' },
			forwards_to: 'http://localhost:8080',
			tunnel_session: {
				id: 'ts_1',
				uri: 'https://api.ngrok.com/tunnel_sessions/ts_1',
			},
			endpoint: { id: 'ep_1', uri: 'https://api.ngrok.com/endpoints/ep_1' },
		},
	],
	uri: 'https://api.ngrok.com/tunnels',
};

/** A key list never carries tokens. */
export const apiKeys = {
	keys: [
		{
			id: 'ak_2f1c8d9e3a5b4c6d',
			uri: 'https://api.ngrok.com/api_keys/ak_2f1c8d9e3a5b4c6d',
			description: 'CI deploy',
			created_at: '2026-11-01T08:00:00Z',
			owner_id: 'usr_1',
		},
	],
	uri: 'https://api.ngrok.com/api_keys',
};

/** Only the create response carries `token`, and only once. */
export const createdApiKey = {
	id: 'ak_2f1c8d9e3a5b4c6d',
	uri: 'https://api.ngrok.com/api_keys/ak_2f1c8d9e3a5b4c6d',
	description: 'CI deploy',
	created_at: '2026-11-16T10:00:00Z',
	token: '2f1c8d9e3a5b4c6d8e9f0a1b2c3d4e5f_6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
	owner_id: 'usr_1',
};

export const eventSubscriptions = {
	event_subscriptions: [
		{
			id: 'es_2f1c8d9e3a5b4c6d',
			uri: 'https://api.ngrok.com/event_subscriptions/es_2f1c8d9e3a5b4c6d',
			created_at: '2026-11-01T08:00:00Z',
			description: 'Endpoint changes',
			sources: [
				{
					type: 'endpoint.created',
					uri: 'https://api.ngrok.com/event_sources/endpoint.created',
				},
			],
			destinations: [
				{
					id: 'ed_1',
					uri: 'https://api.ngrok.com/event_destinations/ed_1',
					description: 'Ops webhook',
					created_at: '2026-11-01T08:00:00Z',
				},
			],
		},
	],
	uri: 'https://api.ngrok.com/event_subscriptions',
};

export const singleEventSubscription =
	eventSubscriptions.event_subscriptions[0];

/**
 * ngrok's one error shape. The 403 pair matters: 200 is a missing header and 202
 * an unrecognised credential, which look identical by status alone.
 */
export const missingAuthHeader = {
	error_code: 'ERR_NGROK_200',
	status_code: 403,
	msg: 'The ngrok API requires that you set the Authorization header for authentication. Your API keys and instructions are available on your dashboard: https://dashboard.ngrok.com/api-keys',
	details: { operation_id: 'op_3MBbpK3oyzD9emvsCA4PiXjR13c' },
};

export const invalidCredential = {
	error_code: 'ERR_NGROK_202',
	status_code: 403,
	msg: 'The API authentication you specified does not look like a valid credential. API keys and instructions are available on your dashboard: https://dashboard.ngrok.com/api-keys',
	details: { operation_id: 'op_3MBbpR8VoQVKJ9wkptaQd4UVx48' },
};

export const revokedKey = {
	error_code: 'ERR_NGROK_201',
	status_code: 401,
	msg: 'The API key you specified is invalid or has been revoked.',
};

export const domainConflict = {
	error_code: 'ERR_NGROK_230',
	status_code: 409,
	msg: 'The domain acme.example.com is already reserved by another account.',
};
