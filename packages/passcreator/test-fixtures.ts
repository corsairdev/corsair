/**
 * Response fixtures shaped after the examples in the Passcreator API docs
 * (developer.passcreator.com).
 */

export const template = {
	identifier: '6d03a4a9-cf92-4e36-80b4-a8994546e2f',
	name: 'Coupon',
};

export const pass = {
	passId: '54b4d891-4454-435d-b07f-308d01b187d3',
	identifier: '54b4d891-4454-435d-b07f-308d01b187d3',
	uniqueIdentifier: 'zcmx0ajw2u8eo2ut3p6220a38a6c856',
	barcodeValue: 'zcmx0ajw2u8eo2ut3p6220a38a6c856',
	linkToPassPage: 'https://app.passcreator.com/en/p/dzy1md7urtpg56220a38a6c842',
	passTemplate: 'Example',
	passTemplateGuid: 'a11bd546-94fe-4346-9d41-d26c59a1b4c2',
	createdOn: '2022-03-03 11:16:26',
	voided: false,
};

export const writeResult = {
	success: true,
	description: 'Pass was moved to template with name Example template',
	errors: [],
	data: [],
	statusCode: 200,
};

export const webhookSubscription = {
	subscription_url: 'https://app.passcreator.com/api/hook/subscribe/f4379715',
	target_url: 'https://example.com/webhooks/passcreator',
	event: 'pass_created',
	pass_template: null,
	pull_mode: false,
};

export const publicKeyResponse = {
	publicKey:
		'-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEpP9pRdcwFoOrhPJCX3WnH8jUpcLe\nP2PxZvOO4Y4hrGVpD8QpISTNPdVYZZBH2x4dlGuHYHMkYph5DqwvzjY00Q==\n-----END PUBLIC KEY-----',
};

export const deleteMessage = {
	success: true,
	description: 'Scraper deleted successfully.',
	errors: [],
	data: [],
	statusCode: 200,
};
