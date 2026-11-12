// Responses api.mails.so sent on 2026-11-10, copied as received. The only edit
// is the account id in `user_id`, replaced with a placeholder. The docs'
// examples differ from these (they omit did_you_mean, provider, is_disposable
// and avatar, and show `username: null` for an address that has one).

/** GET /v1/validate?email=test@example.com */
export const singleUndeliverableFixture = {
	data: {
		id: '00000000-0000-0000-0000-000000000000',
		email: 'test@example.com',
		username: 'test',
		domain: 'example.com',
		did_you_mean: null,
		mx_record: null,
		provider: null,
		score: 10,
		isv_format: true,
		isv_domain: false,
		isv_mx: false,
		isv_noblock: true,
		isv_nocatchall: true,
		isv_nogeneric: true,
		is_disposable: true,
		is_free: false,
		avatar: null,
		result: 'undeliverable',
		reason: 'invalid_domain',
	},
	error: null,
};

/** GET /v1/validate?email=hello@mails.so */
export const singleRiskyFixture = {
	data: {
		id: '00000000-0000-0000-0000-000000000000',
		email: 'hello@mails.so',
		username: 'hello',
		domain: 'mails.so',
		did_you_mean: 'hello@mail.so',
		mx_record: 'aspmx.l.google.com',
		provider: 'google_workspace',
		score: 80,
		isv_format: true,
		isv_domain: true,
		isv_mx: true,
		isv_noblock: true,
		isv_nocatchall: false,
		isv_nogeneric: true,
		is_disposable: false,
		is_free: false,
		avatar: null,
		result: 'risky',
		reason: 'catch_all',
	},
	error: null,
};

/** GET /v1/validate?email=notanemail: 200, not an error. */
export const singleInvalidFormatFixture = {
	data: {
		id: '00000000-0000-0000-0000-000000000000',
		email: 'notanemail',
		username: null,
		domain: null,
		did_you_mean: null,
		mx_record: null,
		provider: null,
		score: 0,
		isv_format: false,
		isv_domain: false,
		isv_mx: false,
		isv_noblock: true,
		isv_nocatchall: true,
		isv_nogeneric: false,
		is_disposable: false,
		is_free: false,
		avatar: null,
		result: 'undeliverable',
		reason: 'invalid_format',
	},
	error: null,
};

export const batchJobId = 'd50cc2f6-2c0a-4742-a0fa-f764240d5f77';

/** POST /v1/batch with two emails: a bare job object, no envelope. */
export const batchCreatedFixture = {
	id: batchJobId,
	name: '',
	created_at: '2026-11-10T14:55:56.932823287Z',
	updated_at: '2026-11-10T14:55:56.932823287Z',
	deleted_at: null,
	finished_at: null,
	archived_at: null,
	user: null,
	user_id: '00000000-0000-4000-8000-000000000001',
	size: 2,
	progress: 0,
	status: 'pending',
	duration: null,
	duplicates: 0,
	type: 'list',
	file_type: '',
	file_key: '',
	skip_emails: true,
};

/** GET /v1/batch/{id} a second after the POST above. */
export const batchCompletedFixture = {
	id: batchJobId,
	name: '',
	created_at: '2026-11-10T14:55:56.932823Z',
	updated_at: '2026-11-10T14:55:57.739866Z',
	deleted_at: null,
	finished_at: '2026-11-10T14:55:57.729951Z',
	archived_at: null,
	user: null,
	user_id: '00000000-0000-4000-8000-000000000001',
	size: 2,
	progress: 0,
	status: 'completed',
	duration: 0,
	duplicates: 0,
	type: 'list',
	file_type: '',
	file_key: '',
	skip_emails: true,
	stats: {
		total: 2,
		deliverable: 0,
		undeliverable: 2,
		risky: 0,
		unknown: 0,
		invalid_format: 0,
		invalid_domain: 2,
		invalid_smtp: 0,
		rejected_email: 0,
		catch_all: 0,
		disposable: 0,
		timeout: 0,
		no_connect: 0,
		other: 0,
	},
	emails: [
		{
			id: '00000000-0000-0000-0000-000000000000',
			email: 'probe-a@example.com',
			username: 'probe-a',
			domain: 'example.com',
			did_you_mean: null,
			mx_record: null,
			provider: null,
			score: 10,
			isv_format: true,
			isv_domain: false,
			isv_mx: false,
			isv_noblock: true,
			isv_nocatchall: true,
			isv_nogeneric: true,
			is_disposable: true,
			is_free: false,
			avatar: null,
			result: 'undeliverable',
			reason: 'invalid_domain',
		},
		{
			id: '00000000-0000-0000-0000-000000000000',
			email: 'probe-b@example.com',
			username: 'probe-b',
			domain: 'example.com',
			did_you_mean: null,
			mx_record: null,
			provider: null,
			score: 10,
			isv_format: true,
			isv_domain: false,
			isv_mx: false,
			isv_noblock: true,
			isv_nocatchall: true,
			isv_nogeneric: true,
			is_disposable: true,
			is_free: false,
			avatar: null,
			result: 'undeliverable',
			reason: 'invalid_domain',
		},
	],
};

// Error bodies, as sent.

/** 401 on GET /v1/validate, with a missing or wrong key. */
export const unauthorizedBody = { data: null, error: 'Unauthorized' };

/** 400 on POST /v1/batch with one email, or the same email twice. */
export const batchTooSmallBody = {
	data: null,
	error:
		'Batch lists need at least 2 different emails. Use POST /v1/validate for a single address.',
	error_code: 'BATCH_TOO_SMALL',
};

/** 400 on POST /v1/batch with `emails` that is not an array. */
export const invalidBodyBody = {
	data: null,
	error: 'The body provided has an invalid format.',
};

/** 404 on GET /v1/batch/{id} for an id that is a UUID but not a job. */
export const jobMissingBody = { data: null, error: 'the job does not exist' };

/** 400 on GET /v1/batch/{id} for an id that is not a UUID. */
export const invalidJobIdBody = { data: null, error: 'invalid job id' };

/** The plan error the docs show on POST /v1/batch for a free key. */
export const subscriptionRequiredBody = {
	data: null,
	error: 'Paid subscription required to use list validations',
};

/**
 * GET /v1/batch/{id} while the job runs: HTTP 202, and a non-null `error` that
 * is a progress note, not a failure. The docs do not mention it.
 */
export const batchProcessingFixture = {
	data: {
		created_at: '2026-11-10T15:08:14.851828Z',
		id: 'ec04b957-8ad2-49b0-8be0-6f5781d7d9dd',
		status: 'processing',
	},
	error: 'Job is still processing',
};
