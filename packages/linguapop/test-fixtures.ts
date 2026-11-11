// Provenance, because this suite has no API key (Linguapop needs a paid plan):
//
// - `languagesFixture` is a live response: GET /api/actions/getLanguages
//   answered this exact body, with no key, on 2026-11-10.
// - `invalidKeyBody` and `validationProblemBody` are live responses to POST
//   /api/actions/sendInvitation with a made-up key and with an empty object.
// - `invitationRequestFixture` and `invitationResponseFixture` are the examples
//   from https://docs.linguapop.eu/api, NOT observed from the API. They have
//   not been checked against a real invitation. The docs write the response's
//   `invitationId` as the bare placeholder INVITATION_ID, which is not JSON, so
//   it is the number 1 here; everything else is verbatim.

/** The `apiKey` value the docs use. The client supplies the real one. */
export const DOCS_API_KEY_PLACEHOLDER = 'INTEGRATION_API_KEY';

export const languagesFixture = [
	{ name: 'English', code: 'eng' },
	{ name: 'Italian', code: 'ita' },
	{ name: 'Spanish', code: 'spa' },
	{ name: 'German', code: 'ger' },
	{ name: 'French', code: 'fra' },
];

/** The documented request body without `apiKey`, which is not an input. */
export const invitationRequestFixture = {
	externalIdentifier: 'EXTERNAL_IDENTIFIER',
	name: 'CANDIDATE_NAME',
	email: 'candidate@example.com',
	languageCode: 'ita',
	sendEmail: true,
	generateKioskCode: true,
	testReading: false,
	testListening: false,
	callbackUrl: 'https://example.com/linguapop/callback',
	returnUrl: 'https://example.com/linguapop/return',
};

export const invitationResponseFixture = {
	invitationId: 1,
	externalIdentifier: 'EXTERNAL_IDENTIFIER',
	url: 'https://app.linguapop.eu/accept-placement-test-invitation/INVITATION_TOKEN',
	emailSent: false,
	kioskCode: '000000',
};

/** What the docs promise when generateKioskCode is false. */
export const invitationNoKioskFixture = {
	...invitationResponseFixture,
	kioskCode: null,
};

/** 400 text/plain, seen live for an unrecognised key. */
export const invalidKeyBody =
	'No active integration with specified apiKey found.';

/** 400 application/problem+json, seen live for `{}`. */
export const validationProblemBody = {
	errors: {
		Email: ['The Email field is required.'],
		ApiKey: ['The ApiKey field is required.'],
		LanguageCode: ['The LanguageCode field is required.'],
	},
	type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
	title: 'One or more validation errors occurred.',
	status: 400,
	traceId: '00-5f76164cea709a51a36a6803b6754cdd-b054189fc234cdc9-00',
};

/** What a proxy or the app's fallback page answers for a missing route. */
export const htmlFallbackBody =
	'<!doctype html><html><body>Linguapop</body></html>';
