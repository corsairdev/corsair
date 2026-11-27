// Response bodies built from the official OpenAPI spec
// (console.docuseal.com/openapi.yml) and the examples at
// docuseal.com/docs/api. No live key was available, so none of these were
// captured from the running API; the live smoke test checks the list shapes.

export const pagination = { count: 2, next: null, prev: null };

export const template = {
	id: 12,
	slug: 'AfZkZbCiRkCWSo',
	name: 'Rental agreement',
	preferences: { resize_default_fields: false },
	schema: [
		{
			attachment_uuid: 'd19a4b47-2dcb-4f68-a218-01f8408c4537',
			name: 'lease.pdf',
		},
	],
	fields: [
		{
			uuid: '49b33000-9947-41ef-906f-8d594763aab5',
			submitter_uuid: '89b33000-9947-41ef-906f-8d594763aab5',
			name: 'Signature',
			type: 'signature',
			required: true,
			preferences: null,
			areas: [
				{
					x: 0.15,
					y: 0.5,
					w: 0.2,
					h: 0.08,
					attachment_uuid: 'd19a4b47-2dcb-4f68-a218-01f8408c4537',
					page: 1,
				},
			],
		},
	],
	variables_schema: {},
	submitters: [
		{ name: 'Tenant', uuid: '89b33000-9947-41ef-906f-8d594763aab5' },
	],
	author_id: 3,
	archived_at: null,
	created_at: '2026-01-15T09:00:00.000Z',
	updated_at: '2026-01-15T09:00:00.000Z',
	source: 'api',
	external_id: null,
	folder_id: null,
	folder_name: '',
	shared_link: true,
	author: {
		id: 3,
		first_name: 'Maya',
		last_name: 'Ruiz',
		email: 'maya@fieldkit.example',
	},
	documents: [
		{
			id: 41,
			uuid: 'd19a4b47-2dcb-4f68-a218-01f8408c4537',
			url: 'https://api.docuseal.com/storage/submissions/ptVfeXVQUEtsSWs=/d19a4b47-2dcb-4f68-a218-01f8408c4537.pdf',
			preview_image_url:
				'https://api.docuseal.com/storage/previews/d19a4b47-2dcb-4f68-a218-01f8408c4537-0.png',
			filename: 'lease.pdf',
		},
	],
};

export const templateList = { data: [template], pagination };

export const templateUpdateResult = {
	id: 12,
	updated_at: '2026-01-16T10:12:00.000Z',
};

export const archiveResult = {
	id: 12,
	archived_at: '2026-01-16T10:12:00.000Z',
};

export const submitter = {
	id: 77,
	submission_id: 55,
	uuid: 'b1d81ac4-9b06-4d10-8d92-bcc65okiuy7',
	email: 'jordan@acme-logistics.example',
	slug: 'STkiTbP8YgHhOa',
	sent_at: '2026-01-15T09:01:00.000Z',
	opened_at: '2026-01-15T10:00:00.000Z',
	completed_at: null,
	declined_at: null,
	created_at: '2026-01-15T09:00:00.000Z',
	updated_at: '2026-01-15T10:00:00.000Z',
	name: 'Jordan Lee',
	phone: null,
	external_id: null,
	status: 'sent',
	role: 'Tenant',
	metadata: {},
	preferences: {},
	template: null,
	submission_events: [],
	values: [{ field: 'Start date', value: '2026-02-01' }],
	documents: [
		{
			name: 'lease.pdf',
			url: 'https://api.docuseal.com/storage/signed/lease.pdf',
		},
	],
};

export const submitterCreateResult = {
	...submitter,
	embed_src: 'https://docuseal.com/s/STkiTbP8YgHhOa',
};

export const submission = {
	id: 55,
	name: null,
	slug: 'aQ9u7DkxZmPlWr',
	source: 'api',
	submitters_order: 'preserved',
	expire_at: null,
	variables: {},
	audit_log_url: 'https://api.docuseal.com/audit/55',
	combined_document_url: null,
	created_at: '2026-01-15T09:00:00.000Z',
	updated_at: '2026-01-15T09:00:00.000Z',
	archived_at: null,
	status: 'pending',
	completed_at: null,
	created_by_user: null,
	template: {
		id: 12,
		name: 'Rental agreement',
		external_id: null,
		folder_name: '',
		created_at: '2026-01-15T08:00:00.000Z',
		updated_at: '2026-01-15T08:00:00.000Z',
	},
	submitters: [
		{
			id: 77,
			submission_id: 55,
			uuid: 'b1d81ac4-9b06-4d10-8d92-bcc65okiuy7',
			email: 'jordan@acme-logistics.example',
			slug: 'STkiTbP8YgHhOa',
			sent_at: '2026-01-15T09:01:00.000Z',
			opened_at: null,
			completed_at: null,
			declined_at: null,
			created_at: '2026-01-15T09:00:00.000Z',
			updated_at: '2026-01-15T09:01:00.000Z',
			name: 'Jordan Lee',
			phone: null,
			external_id: null,
			status: 'sent',
			role: 'Tenant',
			metadata: {},
			preferences: {},
			values: [],
			documents: [],
		},
	],
	submission_events: [
		{
			id: 3,
			submitter_id: 77,
			event_type: 'send_email',
			event_timestamp: '2026-01-15T09:01:00.000Z',
		},
	],
	documents: [
		{
			name: 'lease.pdf',
			url: 'https://api.docuseal.com/storage/submissions/55/lease.pdf',
		},
	],
};

export const submissionListItem = {
	...submission,
	submitters: submission.submitters.map(
		({ values: _values, documents: _documents, ...rest }) => rest,
	),
	submission_events: undefined,
	documents: undefined,
};

export const submissionList = {
	data: [submissionListItem],
	pagination,
};

export const submissionCreateOneoffResult = {
	id: 56,
	name: 'NDA one-off',
	submitters: [submitterCreateResult],
	source: 'api',
	submitters_order: 'preserved',
	status: 'pending',
	expire_at: null,
	created_at: '2026-01-15T09:00:00.000Z',
	schema: [
		{
			attachment_uuid: 'd19a4b47-2dcb-4f68-a218-01f8408c4537',
			name: 'nda.pdf',
		},
	],
	fields: [],
};

export const submissionDocuments = {
	id: 55,
	documents: [
		{
			name: 'lease.pdf',
			url: 'https://api.docuseal.com/storage/submissions/55/lease.pdf',
		},
	],
};

export const submitterList = { data: [submitter], pagination };

export const notAuthenticated = { error: 'Not authenticated' };

// Smallest valid PDF header/trailer shape, base64-encoded; only the request
// shape travels through it, never a real document.
export const base64Pdf = 'JVBERi0xLjQKJSVFRCBPRiBGSUxF';
