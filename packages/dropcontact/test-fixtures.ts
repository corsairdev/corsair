/**
 * Fixtures copied from the examples in Dropcontact's OpenAPI spec
 * (developer.dropcontact.com/openapi.json) and its documentation. There was no
 * API key for this build, so nothing here is claimed as a captured live
 * response; where a shape is inferred it says so.
 */

/** `POST /v1/enrich/all`, the clean-success example from the spec. */
export const enrichAccepted = {
	error: false,
	success: true,
	credits_left: 15276,
	request_id: 'qzmxkpvlrtdnhwa',
};

/** The same route when a record had unrecognized keys. */
export const enrichWithRecordWarnings = {
	error: false,
	success: true,
	credits_left: 15275,
	request_id: 'qzmxkpvlrtdnhwa',
	data: [
		{
			index: 0,
			warnings: { empty_field: ['job'] },
			errors: { unexpected_field: ['jobb'] },
		},
	],
};

/** The same route with `hashedInputs=true` in the query. */
export const enrichWithHashedInputs = {
	error: false,
	success: true,
	credits_left: 15274,
	request_id: 'qzmxkpvlrtdnhwa',
	hashedInputs: ['a3f5c1e0b7d24f19a6c8e2d5b9f04173'],
};

/** `GET /v1/enrich/all/{request_id}`, the ready example from the spec. */
export const resultsReady = {
	data: [
		{
			first_name: 'Denis',
			last_name: 'Cohen',
			full_name: 'Denis Cohen',
			civility: 'Mr',
			email: [{ email: 'dc@dropcontact.io', qualification: 'nominative@pro' }],
			linkedin: 'www.linkedin.com/in/cohendenis',
			location: 'Paris, Île-de-France, France',
			company: 'Dropcontact',
			website: 'www.dropcontact.com',
			siret_address: "7 Place de l'Hôtel de Ville",
			siret_zip: '93600',
			siret_city: 'Aulnay-sous-Bois',
			country: 'France',
			company_linkedin: 'www.linkedin.com/company/dropcontact-email-finder',
			phone: '+33 1 23 45 67 89',
			company_turnover: '',
			company_results: '',
			nb_employees: '10-19',
			siren: '823752647',
			siret: '82375264700029',
			naf5_code: '62.01Z',
			naf5_des: 'Programmation informatique',
			vat: 'FR11823752647',
			industry: 'Technology, Information and Internet',
			employee_count: '15',
		},
	],
	credits_left: 15277,
	error: false,
	success: true,
};

/** The same route before the batch has finished. */
export const resultsNotReady = {
	error: false,
	reason: 'Request not ready yet, try again in 30 seconds',
	success: false,
};

/** The same route with `forceResults=true` while still processing. */
export const resultsForcedInProgress = {
	data: [{ status: 'in_progress' }],
	credits_left: 0,
	status: 'in_progress',
	error: false,
	success: true,
};

/** The same route with `forceResults=true` once the batch is done. */
export const resultsForcedReady = {
	data: [
		{
			status: 'ready',
			first_name: 'Denis',
			last_name: 'Cohen',
			email: [{ email: 'dc@dropcontact.io', qualification: 'nominatif@pro' }],
		},
	],
	credits_left: 15277,
	status: 'ready',
	error: false,
	success: true,
};

/** A record with no company of its own, so only the person was found. */
export const resultsOnlyContactData = {
	data: [
		{
			first_name: 'Denis',
			last_name: 'Cohen',
			errors: { only_contact_data: true },
		},
	],
	credits_left: 15277,
	error: false,
	success: true,
};

/** A record with company data but no person. */
export const resultsOnlyOrganizationData = {
	data: [
		{
			company: 'Dropcontact',
			warnings: { only_organization_data: true },
		},
	],
	credits_left: 15276,
	error: false,
	success: true,
};

/** `GET /v1/account/credits`. */
export const creditsResponse = { credits: 15277 };

/** `GET /v1/enrich/webhook` with a URL configured. */
export const webhookConfigured = {
	error: false,
	success: true,
	callback_url: 'https://example.com/dropcontact/results',
};

/** `GET /v1/enrich/webhook` with none configured. */
export const webhookNotConfigured = {
	error: false,
	success: true,
	callback_url: null,
};

/** `PUT /v1/enrich/webhook`. */
export const webhookSetResponse = {
	error: false,
	success: true,
	callback_url: 'https://example.com/dropcontact/results',
};

/** `DELETE /v1/enrich/webhook`: the only route without the envelope. */
export const webhookDeleted = {
	detail: 'Webhook callback URL deleted',
};

/** The account has no default webhook to delete. */
export const webhookNothingToDelete = {
	error: true,
	success: false,
	reason: 'No webhook callback found',
};

/** A 401 from the provider's own envelope. */
export const unauthorized = {
	error: true,
	success: false,
	reason:
		"No api key received. Please set 'X-Access-Token' header with your api key as value.",
};

/** A 400 from the enrich route. */
export const tooManyRecords = {
	error: true,
	success: false,
	reason: 'Too many records, you can only submit up to 250 records',
};

/** A 422, which FastAPI answers with `detail` rather than `reason`. */
export const validationError = {
	detail: [
		{
			loc: ['body', 'data', 0, 'custom_callback_url'],
			msg: 'Input should be a valid URL',
			type: 'url_parsing',
		},
	],
};

/** A 422 with a plain string detail. */
export const validationErrorString = {
	detail: 'custom_callback_url is longer than 2083 characters',
};

/** A 429, which the docs describe as a rate limit or a temporary fault. */
export const rateLimited = {
	error: true,
	success: false,
	reason: 'please retry in a few seconds',
};

/** A 500. */
export const serverError = {
	detail: 'An error occurred. Please retry later.',
};
