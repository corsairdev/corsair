/**
 * Shapes taken from SignWell's published OpenAPI definitions, embedded in
 * https://developers.signwell.com/reference/*.md. Values keep every documented
 * field type honest: `false` where a field can be false, `null` where the spec
 * allows it.
 */

export const DOCUMENT_ID = 'a692e1ce-9929-4541-adc7-61932bab39d3';
export const TEMPLATE_ID = 'd7315111-c671-4b15-8354-c9a19bbaefa0';
export const WEBHOOK_ID = '0f5c4c2a-1c1f-4a2e-9f0a-6c1f2d3e4b5a';
export const APPLICATION_ID = '5a67dbd7-928a-4ea0-a7e2-e476a0eb045f';

export const recipient = {
	id: '1',
	name: 'Jane Doe',
	email: 'jane@example.com',
	body: '',
	message: null,
	subject: null,
	send_email: true,
	send_email_delay: null,
	delivery_method: 'email',
	signing_order: 1,
	signing_url: 'https://www.signwell.com/d/abc',
	embedded_signing_url: null,
	bounced: false,
	status: 'Sent',
};

export const document = {
	id: DOCUMENT_ID,
	test_mode: false,
	cfr_part11: false,
	cfr_part11_signing_mode: null,
	api_application_id: null,
	requester_email_address: 'sender@example.com',
	custom_requester_name: null,
	custom_requester_email: null,
	name: 'Offer letter',
	subject: 'Please sign',
	message: 'Thanks!',
	metadata: { dealId: '42' },
	created_at: '2026-02-01T10:00:00Z',
	updated_at: '2026-02-01T10:05:00Z',
	recipients: [recipient],
	status: 'Sent',
	reminders: false,
	archived: false,
	embedded: false,
	embedded_signing: false,
	embedded_edit_url: '',
	apply_signing_order: false,
	redirect_url: null,
	decline_redirect_url: null,
	language: 'en',
	expires_in: 30,
	decline_message: null,
	error_message: null,
	template_id: null,
	template_ids: [],
	files: [{ name: 'offer.pdf' }],
	copied_contacts: [],
	allow_decline: true,
	allow_reassign: true,
	labels: [],
};

export const template = {
	id: TEMPLATE_ID,
	name: 'Employment contract',
	subject: 'Please sign',
	message: 'Thanks!',
	status: 'Completed',
	placeholders: [
		{ id: '1', name: 'Employee' },
		{ id: '2', name: 'Manager' },
	],
	copied_placeholders: [],
	template_link: 'https://www.signwell.com/t/abc',
	template_id: TEMPLATE_ID,
	files: [{ name: 'contract.pdf' }],
	labels: [],
};

export const webhook = {
	id: WEBHOOK_ID,
	callback_url: 'https://acme.test/hooks/signwell',
	api_application_id: null,
};

export const account = {
	id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d',
	name: 'Acme Corp',
	logo_url: null,
	plan_tier: 'premium',
	preferences: {
		date_format: 'MM/DD/YYYY',
		days_until_links_expire: 30,
		enable_redirect: false,
		redirect_url: null,
		separate_audit_pdf: false,
		separate_completed_file: false,
		enable_nom151_compliance: false,
		time_zone: 'UTC',
		recipient_language: null,
	},
};

export const me = {
	id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d',
	role: 'owner',
	archived: false,
	user: {
		id: 'u1',
		name: 'Jane Doe',
		email: 'jane@example.com',
		first_name: 'Jane',
		has_google_registration: false,
		preferences: {
			sales_document: false,
			time_zone: 'UTC',
			smart_fields: true,
		},
	},
	account: { id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d', name: 'Acme Corp' },
	workspace: { id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d', name: 'Acme Corp' },
	contact: {
		id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d',
		email: 'jane@example.com',
		name: 'Jane Doe',
		company_name: 'Acme',
		phone_number: null,
		alt_phone_number: null,
		website: null,
		initials: 'JD',
		archived: false,
	},
};

export const bulkSend = {
	id: '5a67dbd7-928a-4ea0-a7e2-e476a0eb045f',
	name: 'October offers',
	documents_count: 10,
	documents_completed: 4,
	documents_not_completed: 6,
	created_at: '2026-02-01T10:00:00Z',
	status: 'Processing',
	templates: [{ id: TEMPLATE_ID, name: 'Employment contract' }],
};

export const bulkSendList = {
	bulk_sends: [bulkSend],
	current_page: 1,
	next_page: 2,
	previous_page: null,
	total_count: 11,
	total_pages: 2,
};

export const apiApplication = {
	id: APPLICATION_ID,
	name: 'Acme app',
	callback_urls: ['https://acme.test/hooks/signwell'],
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
	owner: {
		id: '1a111111-1111-4111-8111-111111111111',
		account_id: 'c2099ac1-b4b5-4b30-934e-3933c2d9922d',
		name: 'Jane Doe',
		email: 'jane@example.com',
	},
	preferences: {
		button_text_color: null,
		buttons_border_radius: 4,
		custom_logo_file: null,
		link_text_color: null,
		primary_color: null,
	},
};

// ── Error bodies ──────────────────────────────────────────────────────────

/** A 422, which names the fields that failed. */
export const validationErrorBody = {
	errors: {
		recipients: ['Recipient email is required'],
		'files[0]': ['Either file_url or file_base64 must be present'],
	},
};

/** A 401, which carries a machine-readable code in `meta.error`. */
export const authErrorBody = {
	message: 'Missing or invalid authorization key',
	meta: {
		error: 'api_key_unauthorized_error',
		message: 'Not valid authorization token',
		messages: ['Not valid authorization token'],
	},
};

/** A 429 answers `{ error }` rather than the usual envelope. */
export const rateLimitErrorBody = {
	error: 'Rate limit exceeded. Try again in 30 seconds.',
};
