/**
 * Response bodies for the tests, transcribed from the examples in
 * https://realphonevalidation.com/api-documentation/ and each service's own page.
 *
 * The docs' JSON samples are hand-written and some carry trailing commas, so
 * these fixtures are the same values in valid JSON. Where a sample omits a field
 * the field list documents, the fixture follows the field list.
 */

// ── the four that answer status + error_text ──────────────────────────────

export const TURBO_V3_CONNECTED = {
	status: 'connected',
	// An empty object, not an empty string, when there is no error.
	error_text: {},
	phone_type: 'Mobile',
	caller_name: 'Jack Smith',
	carrier: 'Verizon Wireless:6006 - SVR/2',
	caller_type: 'Consumer',
};

export const TURBO_V3_DISCONNECTED = {
	status: 'disconnected',
	error_text: {},
	phone_type: 'Landline',
};

export const TURBO_STANDARD_CONNECTED = {
	status: 'connected',
	error_text: {},
	phone_type: 'Mobile',
};

export const TURBO_CONNECTED = {
	status: 'connected',
	error_text: {},
	iscell: 'Y',
	carrier: 'Verizon Wireless:6006 - SVR/2',
};

export const SCRUB_CONNECTED = {
	status: 'connected',
	error_text: {},
	iscell: 'Y',
	carrier: 'Verizon Wireless:6006 - SVR/2',
};

export const SCRUB_PLUS_CONNECTED = {
	status: 'connected',
	error_text: {},
	phone_type: 'Mobile',
};

// ── the four that answer RESPONSECODE + RESPONSEMSG ───────────────────────

export const ACTIVE_LANDLINE = {
	RESPONSECODE: 'L',
	RESPONSEMSG: '',
};

export const ACTIVE_INACTIVE = {
	RESPONSECODE: 'N',
	RESPONSEMSG: '',
};

export const WIRELESS_LANDLINE = {
	RESPONSECODE: 'Landline',
	RESPONSEMSG: {},
};

export const WIRELESS_CELL = {
	RESPONSECODE: 'cell',
	RESPONSEMSG: {},
};

export const DNC_CLEAR = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: {},
	national_dnc: 'N',
	state_dnc: 'N',
	dma: 'N',
	litigator: 'N',
	iscell: 'N',
	id: '4',
};

export const DNC_LISTED = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: {},
	national_dnc: 'Y',
	state_dnc: 'N',
	dma: 'N',
	litigator: 'N',
	iscell: 'N',
	id: '4',
};

// A `?` means a timeout, which is not a clearance.
export const DNC_TIMEOUT = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: {},
	national_dnc: '?',
	state_dnc: '?',
	dma: 'N',
	litigator: 'N',
	iscell: 'N',
	id: '4',
};

export const DNC_PLUS_CLEAR = {
	status: 'connected',
	error_text: {},
	iscell: 'N',
	national_dnc: 'N',
	state_dnc: 'N',
	dma: 'N',
	litigator: 'N',
};

export const DNC_PLUS_LISTED = {
	status: 'connected',
	error_text: {},
	iscell: 'N',
	national_dnc: 'Y',
	state_dnc: 'N',
	dma: 'N',
	litigator: 'N',
};

export const FRAUD_MEDIUM = {
	status: '0',
	error_text: '',
	id: '20',
	req_phone: '7275555555',
	tstatus: '300',
	tdesc: 'Transaction successfully completed',
	phn_type: '5',
	phn_desc: 'VOIP',
	risk_level: 'medium',
	recommendation: 'flag',
	score: '401',
	carrier: 'RingCentral - Sybase365',
	location_city: 'Countryside',
	location_state: 'FL',
	location_zip: '34619',
	location_metro_code: '',
	location_county: '',
	location_country_name: 'United States',
	location_country_iso2: 'US',
	location_country_iso3: 'USA',
	location_latitude: '27.99117',
	location_longitude: '-82.72413',
	location_time_zone: 'America/New_York',
	numbering_original_complete_phone_number: '17275555555',
	numbering_original_country_code: '1',
	numbering_original_phone_number: '7275555555',
};

export const REASSIGNED_NO = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: '',
	reassigned: 'no',
	id: '4-C',
};

export const REASSIGNED_YES = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: '',
	reassigned: 'yes',
	id: '4-C',
};

// No changes recorded since 27 January 2021: not the same as "safe to call".
export const REASSIGNED_NO_DATA = {
	RESPONSECODE: 'OK',
	RESPONSEMSG: '',
	reassigned: 'no_data',
	id: '13',
};

// ── email ─────────────────────────────────────────────────────────────────

export const EMAIL_VALID = {
	retval: '0',
	error_text: '',
	id: '2-C',
	status: 'valid',
	error_code: '',
	error: '',
	connected: 'N',
	disposable: 'N',
};

export const EMAIL_BAD_FORMAT = {
	retval: '-1',
	error_text: 'invalid email address format',
};

/**
 * The documented 102 on the email service: a malformed address, not an empty
 * balance as on the DNC routes.
 */
export const EMAIL_RETVAL_102 = {
	retval: '102',
	error_text: 'invalid email address format',
};

/**
 * A Turbo V3 answer for a number whose carrier gives no subscriber name. The
 * services build their JSON from XML, so an empty element arrives as {} (the
 * same way error_text does), not as "".
 */
export const TURBO_V3_NO_CALLER_NAME = {
	status: 'connected',
	error_text: {},
	phone_type: 'Landline',
	caller_name: {},
	carrier: {},
	caller_type: 'Unavailable',
};

// ── refusals that arrive inside a 200 ─────────────────────────────────────

/** The documented bad-token answer on the status routes. */
export const REFUSED_UNAUTHORIZED_STATUS = {
	status: 'unauthorized',
	error_text: {},
};

/** The documented bad-token answer on the Turbo routes. */
export const REFUSED_MISSING_TOKEN = {
	status: 'ERROR',
	error_text: 'missing token',
};

export const REFUSED_INVALID_PHONE = {
	status: 'invalid phone',
	error_text: {},
};

export const REFUSED_BAD_FORMAT = {
	status: 'invalid-format',
	error_text: '',
};

/** The documented bad-token answer on the RESPONSECODE routes. */
export const REFUSED_UNAUTHORIZED_CODE = {
	RESPONSECODE: '-1',
	RESPONSEMSG: 'unauthorized',
};

/** Code 102 is an exhausted balance on DNC Lookup. */
export const REFUSED_NO_BALANCE = {
	RESPONSECODE: '102',
	RESPONSEMSG: 'The user is invalid',
};

export const REFUSED_SERVER_UNAVAILABLE = {
	status: 'server-unavailable',
	error_text: 'Contact support',
};

// ── transport refusals ────────────────────────────────────────────────────

/** The documented throttle: 403 with an empty body. */
export const THROTTLED = '';

// Live: every route on api.realvalidation.com answered this from this network,
// including the host root, so it is the load balancer rather than a token
// problem.
export const BLOCKED = '';

export const SERVER_ERROR_HTML =
	'<html><body>Internal Server Error</body></html>';
