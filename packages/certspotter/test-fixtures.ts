/**
 * Shapes from the live API. The issuance below is a trimmed copy of a real
 * `GET /v1/issuances?domain=example.com&expand=dns_names&expand=issuer&expand=revocation`
 * answer, and the error bodies are the ones an unauthenticated probe returned.
 */

/** One issuance with every non-deprecated field expanded, as the docs show. */
export const issuance = {
	id: '4326219514',
	tbs_sha256:
		'db7c55f74732269c45fda91264003b2a25adc7ff2df687252f60772850449926',
	cert_sha256:
		'20cbc0d1e87ed1d71d3b84533667ef60f22fffee634108711376dec87a38d4e2',
	dns_names: [
		'certs.sslmate.com',
		'certs.sslmate.com',
		'sslmate.com',
		'www.sslmate.com',
	],
	pubkey_sha256:
		'1b1cebcd061ba39746a477db7b90d6871d648bd293ef50e053a6c54c5c3ac112',
	pubkey_der: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A',
	pubkey: { type: 'rsa', bit_length: 2048 },
	issuer: {
		friendly_name: 'Sectigo',
		website: 'https://sectigo.com/',
		caa_domains: ['sectigo.com', 'comodo.com'],
		operator: { name: 'Sectigo', website: 'https://sectigo.com/' },
		pubkey_sha256:
			'e1ae9c3de848ece1ba72e0d991ae4d0d9ec547c6bad1dddab9d6beb0a7e0e0d8',
		name: 'C=GB, O=Sectigo Limited, CN=Sectigo RSA Domain Validation Secure Server CA',
	},
	not_before: '2022-10-22T00:00:00Z',
	not_after: '2023-11-21T23:59:59Z',
	revoked: false,
	revocation: {
		time: null,
		reason: null,
		checked_at: '2022-12-19T18:47:39Z',
	},
	problem_reporting:
		'To revoke certificates issued by Sectigo, use https://secure.sectigo.com/products/RevocationPortal',
	cert_der: 'MIIGdDCCBVygAwIBAgIRAMFw',
};

/** A revoked certificate, with a reason code and a revocation time. */
export const revokedIssuance = {
	...issuance,
	id: '12809115180',
	revoked: true,
	revocation: {
		time: '2025-11-21T00:58:08Z',
		reason: 0,
		checked_at: '2026-11-14T14:48:22Z',
	},
};

/** An issuance whose revocation status is unknown, which the API sends as null. */
export const unknownRevocation = {
	...issuance,
	id: '12937142056',
	revoked: null,
	revocation: { time: null, reason: null, checked_at: null },
};

/** The unexpanded shape: only the always-present fields. */
export const bareIssuance = {
	id: '17433287100',
	tbs_sha256:
		'045a5fd4447d634f703e23c849d4378922d9900c1b81c9ab9e7b1bfc591ebbd8',
	cert_sha256:
		'4ec2d2ad14563fec16af62c6e1959fe7351b6559962d82c87de8eff5dee8d665',
	pubkey_sha256:
		'3116c9c532757d78e27df3dd3360f3486c5bf005aec2693a1705b89497b754a2',
	not_before: '2026-09-26T22:34:35Z',
	not_after: '2026-12-25T22:43:19Z',
	revoked: false,
};

export const issuancePage = [issuance, revokedIssuance];

// ---------------------------------------------------------------------------
// error bodies, copied from live probes
// ---------------------------------------------------------------------------

/** A free-tier request during high load, which answers 503. */
export const serviceOutage = {
	code: 'service_outage',
	message:
		'Due to high system load, the free tier is temporarily unavailable.  To access the API, sign up for a subscription by visiting https://sslmate.com/account/ct_search_api',
};

export const badCredentials = {
	code: 'bad_credentials',
	message: 'Invalid API key',
};

export const rateLimited = {
	code: 'rate_limited',
	message: 'Request rate exceeded',
};

export const queryTimeout = {
	code: 'timeout',
	message: 'Search query exceeded the time limit of your subscription',
};

export const paymentRequired = {
	code: 'payment_required',
	message: 'Your subscription has been suspended for non-payment',
};

export const laggingClient = {
	code: 'lagging_client',
	message: 'Client is not consuming the firehose quickly enough',
};

export const badQuery = {
	code: 'bad_query',
	message: 'One or more fields in the query string is invalid',
	sub_errors: [
		{ code: 'invalid_value', field: 'domain', message: 'not a domain' },
	],
};
