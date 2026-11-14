// Response bodies in the shape Yandex Cloud sends, with made-up text.

export const translated = {
	translations: [
		{
			text: 'Привет',
			detectedLanguageCode: 'en',
		},
	],
};

export const translatedMany = {
	translations: [
		{ text: 'Привет', detectedLanguageCode: 'en' },
		{ text: 'Мир', detectedLanguageCode: 'en' },
	],
};

/** With `format: HTML`, the markup is preserved as given. */
export const translatedHtml = {
	translations: [
		{
			text: '<p>Привет</p>',
			detectedLanguageCode: 'en',
		},
	],
};

// The detect route answers one `{ languageCode }` per request, not a list.
export const detected = { languageCode: 'en' };
export const detectedGerman = { languageCode: 'de' };

export const languages = {
	languages: [
		{ code: 'en', name: 'English' },
		{ code: 'ru', name: 'Russian' },
		{ code: 'de', name: 'German' },
	],
};

/** The error body Yandex sends: a gRPC code, not an HTTP one. */
export const unknownKey = {
	code: 16,
	message: "Unknown api key '****'",
	details: [
		{
			'@type': 'type.googleapis.com/google.rpc.RequestInfo',
			requestId: 'c924952c-b657-4746-a75f-7bcb7ce82000',
		},
	],
};

/** A missing header, which is also a gRPC 16. */
export const missingKey = {
	code: 16,
	message: 'IAM token or API key has to be passed in request',
	details: [
		{
			'@type': 'type.googleapis.com/google.rpc.RequestInfo',
			requestId: 'a20fb683-800d-4943-b7e2-717b5f54aad9',
		},
	],
};

/** A bad IAM token, which reads differently from a bad API key. */
export const invalidToken = {
	code: 16,
	message: 'The token is invalid',
	details: [],
};

/** gRPC 3: a required field is missing. */
export const badArgument = {
	code: 3,
	message: 'targetLanguageCode is required',
	details: [],
};

/** gRPC 7: the role does not allow the call. */
export const permissionDenied = {
	code: 7,
	message: 'Permission denied',
	details: [],
};

/** gRPC 8: the quota is exhausted. */
export const resourceExhausted = {
	code: 8,
	message: 'Resource exhausted',
	details: [],
};
