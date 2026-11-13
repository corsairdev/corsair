// Shapes taken from GenderAPI.io's canonical OpenAPI document
// (https://api.genderapi.io/api/v2/openapi.json) and live probes. A keyless
// probe answered 200 in `ip_trial` mode, so that envelope is a fixture too.

export const meta = {
	request_id: '3ccca299-3aa2-4e6a-b32f-cee661decfe8',
	duration_ms: 11,
	access: { mode: 'ip_trial', reason: 'api_key_missing' },
	usage: {
		charged_credits: 1,
		remaining_credits: 8,
		billing_status: 'confirmed',
		resets_at: '2026-11-13T16:01:56.000Z',
		limit: 10,
		period_seconds: 86400,
	},
};

export const keyedMeta = {
	...meta,
	access: { mode: 'api_key', reason: null },
	usage: {
		...meta.usage,
		charged_credits: 1,
		remaining_credits: 24999,
		limit: null,
		period_seconds: null,
	},
};

export const sophia = {
	input: { type: 'name', value: 'Sophia', country: null },
	name: 'sophia',
	gender: 'female',
	country: 'US',
	confidence: 0.9928707224334601,
	confidence_kind: 'observed_frequency',
	sample_count: 6312,
	source: 'dataset',
	result_status: 'identified',
	reason: null,
	country_source: 'dataset',
	match: {
		name: 'sophia',
		method: 'normalized',
		scope: 'global',
		country: null,
	},
};

export const sophiaResponse = { data: sophia, meta };

/** A country-scoped answer: the match scope and the country both say `US`. */
export const michaelResponse = {
	data: {
		input: { type: 'name', value: 'Michael', country: 'US' },
		name: 'michael',
		gender: 'male',
		country: 'US',
		confidence: 0.9955243316590613,
		confidence_kind: 'observed_frequency',
		sample_count: 91383,
		source: 'dataset',
		result_status: 'identified',
		reason: null,
		country_source: 'dataset',
		match: {
			name: 'michael',
			method: 'normalized',
			scope: 'country',
			country: 'US',
		},
	},
	meta,
};

/** An email answer, where the matched token is the surname. */
export const emailResponse = {
	data: {
		input: { type: 'email', value: 'sophia.lee@example.com', country: null },
		name: 'lee',
		gender: 'male',
		country: 'US',
		confidence: 0.7093032687160353,
		confidence_kind: 'observed_frequency',
		sample_count: 24658,
		source: 'dataset',
		result_status: 'identified',
		reason: null,
		country_source: 'dataset',
		match: { name: 'lee', method: 'token', scope: 'global', country: null },
	},
	meta,
};

/** An AI answer: no database match, so `match` carries nulls. */
export const aiResponse = {
	data: {
		input: { type: 'username', value: 'xX_darklord_Xx', country: null },
		name: 'darklord',
		gender: 'male',
		country: null,
		confidence: 0.62,
		confidence_kind: 'model_reported',
		sample_count: null,
		source: 'ai',
		result_status: 'identified',
		reason: null,
		country_source: null,
		match: {
			name: null,
			method: 'model_inference',
			scope: null,
			country: null,
		},
	},
	meta: { ...meta, usage: { ...meta.usage, charged_credits: 2 } },
};

/** Nothing could be inferred. This is still billed and still a 200. */
export const unknownResponse = {
	data: {
		input: { type: 'name', value: 'Xyzzyplugh', country: null },
		name: 'xyzzyplugh',
		gender: null,
		country: null,
		confidence: null,
		confidence_kind: null,
		sample_count: null,
		source: 'none',
		result_status: 'unknown',
		reason: 'not_found',
		country_source: null,
		match: {
			name: null,
			method: null,
			scope: null,
			country: null,
		},
	},
	meta,
};

export const batch = {
	data: [
		{ index: 0, charged_credits: 1, data: sophia },
		{ index: 1, charged_credits: 1, data: michaelResponse.data },
	],
	meta: {
		...meta,
		usage: { ...meta.usage, charged_credits: 2, remaining_credits: 6 },
		summary: { total: 2, succeeded: 2, identified: 2, unknown: 0, failed: 0 },
	},
};

/** An item that failed on its own, which does not fail the batch. */
export const batchWithFailure = {
	data: [
		{ index: 0, charged_credits: 1, data: sophia },
		{
			index: 1,
			// An ItemProblem, as the OpenAPI document defines it.
			error: {
				type: 'urn:genderapi:problem:validation_error',
				title: 'validation error',
				status: 422,
				detail: 'The request does not match the schema.',
				instance: 'urn:uuid:00000000-0000-4000-8000-000000000001',
				code: 'validation_error',
				request_id: '00000000-0000-4000-8000-000000000001',
				action: 'correct_request',
				errors: [{ pointer: '/value', message: 'must match pattern "\\S"' }],
			},
		},
	],
	meta: {
		...meta,
		usage: { ...meta.usage, charged_credits: 1 },
		summary: { total: 2, succeeded: 1, identified: 1, unknown: 0, failed: 1 },
	},
};

export const phone = {
	data: {
		valid: true,
		possible: true,
		e164: '+14155552671',
		country: 'US',
		country_calling_code: 1,
	},
	meta,
};

export const usage = {
	data: {
		remaining_credits: 8,
		expires_at: '2026-11-13T16:01:56.000Z',
		resets_at: '2026-11-13T16:01:56.000Z',
		limit: 10,
		period_seconds: 86400,
	},
	meta: {
		...meta,
		usage: { ...meta.usage, charged_credits: 0, billing_status: 'not_charged' },
	},
};

export const capabilities = {
	version: '2.0.0',
	documentation: '/api/v2/openapi.json',
	capabilities: {
		ai: true,
		ip_trial: { credits: 10, period_hours: 24 },
		forceToGenderize: true,
		max_batch_items: 50,
		shared_v1_keys_and_credits: true,
		default_ai_mode: { single: 'fallback', batch: 'off' },
	},
	billing_consistency: 'legacy_compatible',
};

export const errorCatalog = {
	errors: {
		validation_error: {
			code: 'validation_error',
			http_statuses: [422],
			action: 'correct_request',
			description:
				'Correct the indicated fields; IP trials allow at most 10 items.',
		},
		insufficient_credits: {
			code: 'insufficient_credits',
			http_statuses: [403],
			action: 'add_credits_or_wait_for_reset',
			description:
				'At least one starting credit is required. Add credits or wait for a reported trial reset.',
		},
	},
};

/** The RFC 7807 document a validation failure returns. */
export const validationProblem = {
	type: 'urn:genderapi:problem:validation_error',
	title: 'validation error',
	status: 422,
	detail: 'The request does not match the schema.',
	instance: 'urn:uuid:20fdb3c0-833d-49ac-9c85-b14c0115fcf4',
	code: 'validation_error',
	request_id: '20fdb3c0-833d-49ac-9c85-b14c0115fcf4',
	documentation: 'https://api.genderapi.io/api/v2/errors',
	action: 'correct_request',
	errors: [
		{ pointer: '/type', message: 'must be equal to one of the allowed values' },
	],
};

export const insufficientCreditsProblem = {
	type: 'urn:genderapi:problem:insufficient_credits',
	title: 'insufficient credits',
	status: 403,
	code: 'insufficient_credits',
	action: 'add_credits_or_wait_for_reset',
	detail: 'At least one starting credit is required.',
};

export const rateLimitProblem = {
	type: 'urn:genderapi:problem:rate_limit_exceeded',
	title: 'rate limit exceeded',
	status: 429,
	code: 'rate_limit_exceeded',
	action: 'wait_then_retry',
	detail: 'Respect Retry-After.',
};

/** A prediction that failed after a charge may have been recorded. */
export const billingProblem = {
	type: 'urn:genderapi:problem:billing_reconciliation_required',
	title: 'billing reconciliation required',
	status: 503,
	code: 'billing_reconciliation_required',
	action: 'contact_support',
	detail: 'Billing is unconfirmed. Contact support with the request reference.',
};
