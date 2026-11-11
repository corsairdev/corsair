/**
 * Fixtures follow the response schemas in Heyy's OpenAPI 3.0.0 document
 * (docs.heyy.io/api-reference/openapi-v3.json) and the examples in its error
 * and rate-limit guides. There was no API key for this build, so nothing here
 * is claimed as a captured live response.
 */

export const contact = {
	id: '3f1a2b4c-0000-4000-8000-000000000001',
	createdAt: '2026-11-01T09:00:00.000Z',
	updatedAt: '2026-11-02T10:30:00.000Z',
	firstName: 'Jordan',
	lastName: 'Reyes',
	fullName: 'Jordan Reyes',
	displayName: 'Jordan Reyes',
	isSubscribed: true,
	phoneNumber: '+15550100',
	email: 'jordan@acme.com',
	labels: [{ id: 'lbl-1' }],
	// The spec's shape: the value row, with the attribute definition nested.
	attributes: [
		{
			id: '3f1a2b4c-0000-4000-8000-0000000000a1',
			contactId: '3f1a2b4c-0000-4000-8000-000000000001',
			attribute: {
				id: 'attr-1',
				createdAt: '2026-10-01T09:00:00.000Z',
				updatedAt: '2026-10-01T09:00:00.000Z',
				name: 'plan',
				type: 'single_select',
				displayName: 'Plan',
				description: null,
				visibility: { inbox: true, contacts: true, create: true },
				details: { options: [{ value: 'pro', color: '#3B82F6' }] },
			},
			value: 'pro',
		},
	],
	handles: [],
	chats: [],
	metadata: {},
};

/** A contact with every nullable field present as null. */
export const contactSparse = {
	id: '3f1a2b4c-0000-4000-8000-000000000002',
	createdAt: '2026-11-01T09:00:00.000Z',
	updatedAt: '2026-11-01T09:00:00.000Z',
	firstName: null,
	lastName: null,
	fullName: null,
	displayName: null,
	isSubscribed: false,
	phoneNumber: null,
	email: null,
	labels: null,
	attributes: null,
};

export const contactsSearchResponse = {
	data: [contact, contactSparse],
	pagination: { page: 0, limit: 25, total: 2 },
	query: {},
	success: true,
};

/** What a search with no matches returns: rows empty, total 0. */
export const contactsSearchEmpty = {
	data: [],
	pagination: { page: 0, limit: 10, total: 0 },
	query: { query: "equals(email, 'nobody@acme.com')" },
	success: true,
};

export const contactsCreateResponse = {
	success: true,
	data: contact,
};

export const attribute = {
	id: 'attr-1',
	createdAt: '2026-10-01T08:00:00.000Z',
	updatedAt: '2026-10-01T08:00:00.000Z',
	name: 'plan',
	type: 'single_select',
	displayName: 'Plan',
	visibility: { inbox: true, contacts: true, create: true },
	details: {
		options: [
			{ value: 'pro', color: '#3B82F6' },
			{ value: 'free', color: '#9CA3AF' },
		],
	},
};

export const attributesSearchResponse = {
	data: [attribute],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

export const attributesCreateResponse = {
	success: true,
	data: attribute,
};

export const label = {
	id: 'lbl-1',
	createdAt: '2026-10-01T08:00:00.000Z',
	updatedAt: '2026-10-01T08:00:00.000Z',
	name: 'Priority',
	color: '#EF4444',
};

export const labelsSearchResponse = {
	data: [label],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

export const labelsCreateResponse = { success: true, data: label };

/** A delete that found the row. */
export const deletedResponse = {
	success: true,
	data: { deletedIds: ['lbl-1'], notFoundIds: [] },
};

/**
 * A delete that found nothing. The call is still a 200 success, so a caller
 * has to read notFoundIds rather than rely on the status.
 */
export const deletedNothingResponse = {
	success: true,
	data: { deletedIds: [], notFoundIds: ['lbl-missing'] },
};

/**
 * DELETE /attributes/{id} for an id that does not exist: a 404, not the 200
 * with `notFoundIds` the label and webhook deletes give. Live call, 11-11.
 */
export const attributeNotFoundResponse = {
	success: false,
	error: { messageKey: 'attribute_not_found', message: 'Attribute not found' },
};

/**
 * What Heyy answers, with a 500, to a DELETE or PUT whose path id is not a
 * UUID. Taken from a live call on 11-11.
 */
export const heyyMalformedIdResponse = {
	success: false,
	error: {
		messageKey: 'internal_error',
		message: 'Oops! Something went wrong',
	},
};

export const webhook = {
	id: 'wh-1',
	createdAt: '2026-10-01T08:00:00.000Z',
	updatedAt: '2026-10-01T08:00:00.000Z',
	url: 'https://example.com/heyy/events',
	status: 'active',
	events: [{ type: 'message.received', scopes: [] }],
};

export const webhooksSearchResponse = {
	data: [webhook],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

export const webhookCreateResponse = { success: true, data: webhook };

export const webhookInactive = { ...webhook, status: 'inactive' };

export const channel = {
	id: 'ch-1',
	createdAt: '2026-09-01T08:00:00.000Z',
	updatedAt: '2026-09-01T08:00:00.000Z',
	name: 'Support WhatsApp',
	type: 'whatsapp',
	status: 'connected',
	vendor: 'meta',
	vendorId: '1234567890',
	vendorDetails: { phoneNumber: '+15550100' },
};

export const channelsSearchResponse = {
	data: [channel],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

export const automation = {
	id: 'auto-1',
	createdAt: '2026-09-01T08:00:00.000Z',
	updatedAt: '2026-09-05T08:00:00.000Z',
	name: 'Welcome flow',
	status: 'active',
};

export const automationsSearchResponse = {
	data: [automation],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

export const messageTemplate = {
	id: 'tpl-1',
	createdAt: '2026-09-01T08:00:00.000Z',
	updatedAt: '2026-09-01T08:00:00.000Z',
	name: 'order_update',
	type: 'whatsapp',
	status: 'active',
	vendorId: 'tpl-vendor-1',
	channelId: 'ch-1',
	messageContent: { body: 'Your order {{1}} is on its way.' },
	// The spec types variables as an array of strings.
	variables: ['1'],
	vendorDetails: { language: 'en_US' },
};

export const messageTemplatesSearchResponse = {
	data: [messageTemplate],
	pagination: { page: 0, limit: 10, total: 1 },
	query: {},
	success: true,
};

/** A 401, exactly as the live API answers it. */
export const unauthorized = {
	success: false,
	error: { messageKey: 'unauthorized', message: 'Unauthorized' },
};

/** A 404 from the error-handling guide. */
export const contactNotFound = {
	success: false,
	error: {
		messageKey: 'contact_not_found',
		message:
			'No contact could be found for this resource identifier. Please make sure to use the correct contact ID.',
	},
};

/** A 400 with field details. */
export const invalidParams = {
	success: false,
	error: {
		messageKey: 'invalid_params',
		message: 'One or more fields are invalid.',
		invalidParams: [
			{ field: 'type', message: 'must be a valid attribute type' },
		],
	},
};

/** A 429 from the rate-limiting guide. */
export const rateLimited = {
	success: false,
	error: {
		messageKey: 'rate_limit_exceeded',
		message:
			'Too many requests. Limit is applied per minute per tenant. Please retry after the time indicated by the X-RateLimit-Reset header.',
	},
};

/** A 500. */
export const serverError = {
	success: false,
	error: { messageKey: 'internal_error', message: 'Something went wrong.' },
};
