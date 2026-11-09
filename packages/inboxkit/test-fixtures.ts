export const API_KEY = 'ik_test_key_not_a_real_key';
export const WORKSPACE = '8b2d4c6e-0000-4000-8000-000000000010';
export const DOMAIN_UID = 'c7a1d2e3-0000-4000-8000-000000000020';
export const MAILBOX_UID = 'f1e2d3c4-0000-4000-8000-000000000030';
export const TEAM_ID = '3f6c1a2e-0000-4000-8000-000000000001';

/** The credentials a mailbox delivery carries, to prove they never come out. */
export const PLAINTEXT_PASSWORD = 'plaintext-mailbox-password';
export const PLAINTEXT_APP_PASSWORD = 'plaintext-app-password';
export const PLAINTEXT_SECRET = 'plaintext-2fa-secret';

// `sha256=` and the SHA-256 of API_KEY, written out. webhooks.test.ts checks it against the key.
export const SIGNATURE =
	'sha256=d6592b05ce8ca75df802c0c637176bd86070b5c8ac94bd918d9b05e8ef97991d';

// unknown: response bodies are arbitrary JSON.
export function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

export const domainDelivery = {
	event: 'domain.status_changed',
	timestamp: '2026-11-09T10:00:00.000Z',
	team_id: TEAM_ID,
	team_name: 'Example Agency',
	data: {
		domain: {
			uid: DOMAIN_UID,
			name: 'example.com',
			tld: 'com',
			status: 'active',
			previous_status: 'dns_setup_pending',
			dns_propagation_status: 'propagated',
			nameservers: ['a.ns.example.net', 'b.ns.example.net'],
			renewal_date: null,
			renewal_status: 'na',
			registration_years: 1,
			registration_date: null,
			price: 0,
			connection_type: 'connected',
			forwarding_url: '',
		},
		metadata: {
			updated_at: '2026-11-09T10:00:00.000Z',
			workspace_id: 'internal-workspace',
			workspace_uid: WORKSPACE,
		},
	},
};

export const mailboxDelivery = {
	event: 'mailbox.status_changed',
	timestamp: '2026-11-09T10:00:00.000Z',
	team_id: TEAM_ID,
	team_name: 'Example Agency',
	data: {
		mailbox: {
			uid: MAILBOX_UID,
			email: 'jane@example.com',
			username: 'jane',
			first_name: 'Jane',
			last_name: 'Doe',
			profile_picture: '',
			status: 'active',
			previous_status: 'finalizing_setup',
			platform: 'GOOGLE',
			renewal_date: null,
			renewal_status: 'na',
			is_admin: false,
			password: PLAINTEXT_PASSWORD,
			app_password: PLAINTEXT_APP_PASSWORD,
			secret: PLAINTEXT_SECRET,
			is_add_on: false,
		},
		metadata: {
			updated_at: '2026-11-09T10:00:00.000Z',
			workspace_uid: WORKSPACE,
			domain_uid: DOMAIN_UID,
			domain_name: 'example.com',
		},
	},
};

export const consentDelivery = {
	event: 'consent_request.status_changed',
	timestamp: '2026-11-09T10:00:00.000Z',
	team_id: TEAM_ID,
	team_name: 'Example Agency',
	data: {
		consent_request: {
			uid: 'consent-1',
			status: 'pending',
			previous_status: 'queued',
			consent_url: 'https://accounts.example.com/consent',
			status_text: '',
			status_reason: '',
			retry_count: 0,
			max_retries: 3,
			completed_at: null,
		},
		metadata: { workspace_uid: WORKSPACE },
	},
};

export const clientIdDelivery = {
	event: 'client_id_request.status_changed',
	timestamp: '2026-11-09T10:00:00.000Z',
	team_id: TEAM_ID,
	team_name: 'Example Agency',
	data: {
		client_id_request: {
			uid: 'client-id-1',
			status: 'completed',
			previous_status: 'processing',
			status_text: 'Done',
			status_reason: '',
			retry_count: 0,
			max_retries: 3,
			completed_at: '2026-11-09T10:00:00.000Z',
		},
		metadata: { workspace_uid: WORKSPACE },
	},
};

export const signedHeaders = (event: string, signature = SIGNATURE) => ({
	'content-type': 'application/json',
	'user-agent': 'InboxKit-Webhook/1.0',
	'x-inboxkit-event': event,
	'x-inboxkit-timestamp': '2026-11-09T10:00:00.000Z',
	'x-inboxkit-signature': signature,
});

export const domainRow = {
	uid: DOMAIN_UID,
	name: 'example.com',
	tld: '.com',
	price: 0,
	assigned_mailboxes: 2,
	status: 'active',
	connection_type: 'connected',
	dns_propagation_status: 'propagated',
	nameserver_match_status: 'matched',
	forwarding_url: 'https://example.org',
	dns: { records: [{ host: '@', type: 'MX', value: 'smtp.google.com' }] },
};

export const mailboxRow = {
	uid: MAILBOX_UID,
	username: 'jane',
	domain_name: 'example.com',
	first_name: 'Jane',
	last_name: 'Doe',
	platform: 'GOOGLE',
	status: 'active',
	is_admin: false,
	sequencer_status: 'connected',
};
