// Envelope Context bodies modeled on the response models in Moosend's
// official PHP wrapper (moosend/api-wrappers-php): snake_case keys. The 104
// failure envelope was captured from the live API.

export const mailingList = {
	id: '8c4f9a52-3f3e-4f29-a497-1f4c30f10be9',
	name: 'Newsletter',
	created_on: '2026-01-15T08:00:00.000Z',
	updated_on: '2026-02-20T09:00:00.000Z',
	created_by: 'someone@example.com',
	status: 1,
	active_member_count: 1200,
	bounced_member_count: 12,
	removed_member_count: 3,
	unsubscribed_member_count: 45,
	custom_fields_definition: [
		{
			custom_field_id: 'cf1',
			name: 'Country',
			type: 'Text',
			is_required: false,
			options: [],
		},
	],
};

export const subscriber = {
	id: '6c09ba25-8b2e-4d84-9f7c-9f34f6a1c6d0',
	name: 'Jana Berger',
	email: 'jana.berger@beachy.example',
	created_on: '2026-02-01T10:00:00.000Z',
	updated_on: '2026-02-01T10:00:00.000Z',
	unsubscribed_on: null,
	subscribe_type: 1,
	subscribe_method: 2,
	custom_fields: [{ custom_field_id: 'cf1', name: 'Country', value: 'NL' }],
};

export const paging = {
	current_page: 1,
	page_size: 10,
	sort_expression: null,
	sort_is_ascending: true,
	total_page_count: 12,
	total_results: 120,
};

/** The probed failure envelope; Moosend answers failures with HTTP 200. */
export const invalidKeyEnvelope = {
	Code: 104,
	Error: 'API_KEY_NOT_VALID',
	Context: null,
};

export const unknownListEnvelope = {
	Code: 209,
	Error: 'MAILING_LIST_NOT_FOUND',
	Context: null,
};
