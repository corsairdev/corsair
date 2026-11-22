/**
 * Response fixtures shaped after the examples in the PandaDoc API reference
 * (developers.pandadoc.com), which is also where the status spellings and
 * envelope come from.
 */

export const unauthorized = {
	type: 'authentication_error',
	detail: 'Authentication credentials were not provided.',
};

export const invalidBody = {
	type: 'validation_error',
	detail: 'Validation failed.',
};

export const documentListItem = {
	id: 'XjV64iXRJMerjSpk428QSF',
	name: 'Sample Document',
	status: 'document.draft',
	date_created: '2024-07-02T16:21:35.770196Z',
	date_modified: '2024-07-02T16:21:37.696724Z',
	date_sent: null,
	expiration_date: null,
	version: '2',
};

export const document = {
	id: 'XjV64iXRJMerjSpk428QSF',
	uuid: '5e0f2f6b-6f6a-4d3f-9f1a-2b3c4d5e6f70',
	name: 'Sample Document',
	status: 'document.completed',
	ref_number: 'inb_7C8GctbvLGr9DpcFdcqm8J',
	folder_uuid: 'Zugfh5DZNREisAVyLcVyCJ',
	date_created: '2024-07-02T16:21:35.770196Z',
	date_modified: '2024-07-02T16:21:37.696724Z',
	date_sent: '2024-01-25T15:40:12.482301Z',
	date_completed: '2024-01-26T09:15:00.000000Z',
	expiration_date: '2024-08-20T15:07:32.869069Z',
	version: '2',
	recipients: [
		{
			email: 'jane@example.com',
			first_name: 'Jane',
			last_name: 'Roe',
			role: 'Signer',
			signing_order: 1,
		},
	],
	metadata: { opportunity_id: '2181432' },
	tokens: [{ name: 'cosigner', value: 'Mia' }],
	created_by: { email: 'owner@example.com' },
};

export const createdDocument = {
	id: 'RsXrKarV524iCpjci9CMGa',
	name: 'Contract for Acme Corp',
	status: 'document.create_pending',
	uuid: 'b0f2f6b6-f66a-4d3f-9f1a-2b3c4d5e6f71',
	version: '2',
	date_created: '2025-11-20T10:00:00.000000Z',
	recipients: [
		{
			email: 'jane@example.com',
			first_name: 'Jane',
			last_name: 'Roe',
			role: 'Signer',
		},
	],
};

export const sentDocument = {
	id: 'RsXrKarV524iCpjci9CMGa',
	name: 'Contract for Acme Corp',
	status: 'document.sent',
	uuid: 'b0f2f6b6-f66a-4d3f-9f1a-2b3c4d5e6f71',
	version: '2',
	recipients: [
		{
			email: 'jane@example.com',
			first_name: 'Jane',
			last_name: 'Roe',
			role: 'Signer',
		},
	],
};

export const documentFields = {
	fields: [
		{
			uuid: '9f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
			name: 'Signature',
			type: 'signature',
			page: 1,
			position: { offset_x: 10, offset_y: 20, anchor_point: 'topleft' },
			style: { width: 10, height: 5 },
		},
		{
			name: 'Date signed',
			type: 'date',
		},
	],
};

export const templateListItem = {
	id: 'ustHNnVaPCD6MzuoNBbZ8L',
	name: 'Standard NDA',
	status: 'template.active',
	folder_uuid: null,
	date_created: '2024-06-01T08:00:00.000000Z',
	date_modified: '2024-09-14T11:30:00.000000Z',
	tags: ['legal'],
};

export const templateDetails = {
	id: 'ustHNnVaPCD6MzuoNBbZ8L',
	name: 'Standard NDA',
	folder_uuid: null,
	date_created: '2024-06-01T08:00:00.000000Z',
	date_modified: '2024-09-14T11:30:00.000000Z',
	tokens: [{ name: 'cosigner' }],
	fields: [{ 'Signature|sgn': { type: 'signature', role: 'Signer' } }],
	roles: [{ name: 'Signer' }],
	tags: ['legal'],
	metadata: {},
};

export const contact = {
	id: 'SyoufNkJiHRn24LpuJ7RXb',
	email: 'nobody@example.com',
	first_name: 'FName',
	last_name: 'LName',
	company: 'CompanyName',
	job_title: 'JobTitle',
	phone: 'Phone',
	country: 'Country',
	state: 'State',
	street_address: 'Street',
	city: 'City',
	postal_code: '12345',
};

export const folder = {
	uuid: 'Zugfh5DZNREisAVyLcVyCJ',
	name: 'Contracts',
	parent_uuid: null,
	date_created: '2024-05-01T09:00:00.000000Z',
};

export const webhookSubscription = {
	uuid: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5e',
	name: 'Deal desk deliveries',
	url: 'https://example.com/webhooks/pandadoc',
	active: true,
	triggers: ['document_state_changed', 'recipient_completed'],
	payload: ['metadata'],
	workspace_id: 'wsp_123',
	shared_key: 'whsec_shared_key_value',
	status: 'ACTIVE',
};

export const webhookEvent = {
	id: 'd0c1b2a3-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
	event: 'document_state_changed',
	created_on: '2025-11-20T10:05:00.000000Z',
	data: { id: 'RsXrKarV524iCpjci9CMGa', status: 'document.completed' },
};

/** The array-of-events body PandaDoc puts in one delivery. */
export const webhookDelivery = [
	{
		event: 'document_state_changed',
		data: { id: 'RsXrKarV524iCpjci9CMGa', status: 'document.sent' },
	},
	{
		event: 'recipient_completed',
		data: {
			id: 'RsXrKarV524iCpjci9CMGa',
			action_by: 'jane@example.com',
			action_date: '2025-11-20T10:05:00.000000Z',
		},
	},
];
