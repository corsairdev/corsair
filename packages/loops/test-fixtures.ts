/**
 * Response bodies the Loops API sends, taken from the official OpenAPI spec
 * (1.24.0) examples and the documented envelopes.
 */

export const LOOPS_BASE = 'https://app.loops.so/api';

export const contactResponse = {
	id: 'clh3k9m2p4q6r8s0t2v4x6z8',
	email: 'alex@company.com',
	firstName: 'Alex',
	lastName: null,
	source: 'API',
	subscribed: true,
	userGroup: 'customers',
	userId: 'usr_7f8e9d0c1b2a',
	mailingLists: { clm2k8j4h6g0f8d6s4a2b0z8: true },
	optInStatus: null,
	favoriteColor: 'blue',
};

export const apiKeyResponse = { success: true, teamName: 'Company name' };

export const idResponse = { success: true, id: 'cll42l54f20i1la0lfooe3z12' };

export const deletedResponse = { success: true, message: 'Contact deleted.' };

export const sentResponse = { success: true };

export const mailingListsResponse = [
	{
		id: 'clm2k8j4h6g0f8d6s4a2b0z8',
		name: 'Product updates',
		description: 'Monthly product news and release notes',
		isPublic: true,
	},
	{
		id: 'cm06f5v0e45nf0ml5754o9cix',
		name: 'Newsletter',
		description: null,
		isPublic: false,
	},
];

export const contactPropertiesResponse = [
	{ key: 'firstName', label: 'First name', type: 'string' },
	{ key: 'planName', label: 'Plan name', type: 'string' },
	{ key: 'seats', label: 'Seats', type: 'number' },
	{ key: 'trialEndsAt', label: 'Trial ends at', type: 'date' },
];

export const suppressionResponse = {
	contact: {
		id: 'clh3k9m2p4q6r8s0t2v4x6z8',
		email: 'alex@company.com',
		userId: 'usr_7f8e9d0c1b2a',
	},
	isSuppressed: false,
	removalQuota: { limit: 5, remaining: 5 },
};

export const invalidKeyResponse = {
	success: false,
	message: 'Invalid API key',
	error: 'Invalid API key',
};

export const validationErrorResponse = {
	success: false,
	message: 'Missing required data variable(s): confirmationUrl',
	error: { path: 'dataVariables', message: 'confirmationUrl is missing' },
	transactionalId: 'cll42l54f20i1la0lfooe3z12',
};

export const duplicateContactResponse = {
	success: false,
	message: 'Email already exists',
};

export const rateLimitedResponse = {
	success: false,
	message: 'Rate limit exceeded',
};

export const contentDisabledResponse = {
	success: false,
	message: 'Invalid API key or content API not enabled for this team',
	error: 'Invalid API key or content API not enabled for this team',
};

export const idempotencyConflictResponse = {
	success: false,
	message: 'Idempotency key has already been used',
};
