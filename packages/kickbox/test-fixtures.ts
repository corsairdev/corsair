// Shapes taken from Kickbox's single-verification reference
// (https://docs.kickbox.com/docs/single-verification-api) and a live probe of
// the open disposable endpoint.

export const deliverable = {
	result: 'deliverable',
	reason: 'accepted_email',
	role: false,
	free: true,
	disposable: false,
	accept_all: false,
	did_you_mean: null,
	sendex: 0.85,
	email: 'test@example.com',
	user: 'test',
	domain: 'example.com',
	success: true,
	message: null,
};

export const undeliverable = {
	result: 'undeliverable',
	reason: 'rejected_email',
	role: false,
	free: false,
	disposable: false,
	accept_all: false,
	did_you_mean: 'bill.lumbergh@gmail.com',
	sendex: 0.23,
	email: 'bill.lumbergh@gamil.com',
	user: 'bill.lumbergh',
	domain: 'gamil.com',
	success: true,
	message: null,
};

export const risky = {
	result: 'risky',
	reason: 'low_deliverability',
	role: false,
	free: false,
	disposable: false,
	accept_all: true,
	did_you_mean: null,
	sendex: 0.55,
	email: 'info@acceptall.example',
	user: 'info',
	domain: 'acceptall.example',
	success: true,
	message: null,
};

export const disposableHost = { disposable: true };
export const notDisposableHost = { disposable: false };

/** The 403 body Kickbox sends for a key it does not recognise. */
export const invalidKey = {
	success: false,
	code: 'FORBIDDEN',
	message: 'Invalid API key',
};

/** The 200 that still says the key is refused, which is the trap. */
export const refusedKeyOn200 = {
	success: false,
	code: 'FORBIDDEN',
	message: 'Invalid API key',
};

/**
 * A spent balance, as the live API sends it: a 403 with no `code`, only the
 * message (sandbox key, `insufficient-balance@example.com`, 11-14).
 */
export const insufficientBalance = {
	success: false,
	message: 'Insufficient balance',
};

/** An address Kickbox will not accept. */
export const badRequest = {
	success: false,
	code: 'BAD_REQUEST',
	message: 'The email parameter is required.',
};
