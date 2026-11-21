/**
 * Response fixtures shaped after the examples in the Paradym OpenAPI spec
 * (api.paradym.id/openapi.json) and docs.paradym.id.
 */

export const unauthorized = {
	message:
		'No API key provided. Please add an API key to the x-access-token request header.',
	details: [{ key: 'x-access-token', message: 'No API key provided' }],
	code: 2005,
};

export const invalidKey = {
	message:
		'Invalid API key. Make sure your API key is correct and it is not revoked.',
	details: [{ message: 'Invalid API key', key: 'x-access-token' }],
	code: 2005,
};

const LIST_META = {
	page: { maxSize: '100', size: '10', after: 'cursor-next', before: null },
};

export const wallet = {
	id: '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
	name: 'Government wallet',
	ownerId: 'user_1',
	verificationDataAccess: 'webhook',
	createdAt: '2025-06-01T09:00:00.000000Z',
	updatedAt: '2025-06-01T09:00:00.000000Z',
};

export const walletsList = { data: [wallet], meta: LIST_META };

export const credentialTemplate = {
	id: 'tmpl_1',
	walletId: '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
	name: 'PID',
	description: 'Person Identification Data',
	format: 'sd-jwt-vc',
	revocable: true,
	archived: false,
	createdAt: '2025-06-02T09:00:00.000000Z',
	updatedAt: '2025-06-02T09:00:00.000000Z',
	type: 'urn:eudi:pid:1',
	attributes: {
		given_name: {
			name: 'given_name',
			required: true,
			schema: { type: 'string' },
		},
	},
};

export const credentialTemplatesList = {
	data: [credentialTemplate],
	meta: LIST_META,
};

export const issuanceSession = {
	id: 'issuance_1',
	status: 'offered',
	credentials: [
		{ credentialTemplateId: 'tmpl_1', attributes: { given_name: 'Jane' } },
	],
	error: null,
	offerUri: 'https://paradym.id/issuance/issuance_1',
	offerQrUri: 'data:image/png;base64,...',
	offerDeeplinkUri: 'paradym://issuance/issuance_1',
	offerDeeplinkQrUri: 'data:image/png;base64,...',
	createdAt: '2025-11-20T10:00:00.000000Z',
	updatedAt: '2025-11-20T10:00:00.000000Z',
	expiresAt: '2025-11-20T10:15:00.000000Z',
};

export const issuanceList = { data: [issuanceSession], meta: LIST_META };

export const verificationSession = {
	id: 'verification_1',
	status: 'requested',
	credentials: [],
	error: null,
	presentationTemplateId: 'pres_1',
	createdAt: '2025-11-20T10:00:00.000000Z',
	updatedAt: '2025-11-20T10:00:00.000000Z',
	expiresAt: '2025-11-20T10:15:00.000000Z',
	createdVia: 'api',
	authorizationRequestUri: 'https://paradym.id/verification/verification_1',
	authorizationRequestQrUri: 'data:image/png;base64,...',
	authorizationRequestDeeplinkUri: 'paradym://verification/verification_1',
	authorizationRequestDeeplinkQrUri: 'data:image/png;base64,...',
};

export const verificationList = {
	data: [verificationSession],
	meta: LIST_META,
};

export const batchRevokeResponse = {
	revokedCredentials: [{ id: 'cred_1' }, { id: 'cred_2' }],
};

export const trustedEntity = {
	id: 'te_1',
	name: 'Government issuer',
	dids: [{ did: 'did:web:example.gov' }],
	certificates: [],
	etsiLotes: [],
	createdAt: '2025-06-03T09:00:00.000000Z',
	updatedAt: '2025-06-03T09:00:00.000000Z',
};

export const trustedEntitiesList = { data: [trustedEntity], meta: LIST_META };

export const webhookSubscription = {
	id: 'whs_1',
	name: 'Deal desk',
	url: 'https://example.com/webhooks/paradym',
	walletId: '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
	eventTypes: ['openid4vc.issuance.completed'],
	createdAt: '2025-06-04T09:00:00.000000Z',
	updatedAt: '2025-06-04T09:00:00.000000Z',
};

export const webhookSubscriptionCreated = {
	...webhookSubscription,
	signatureSecret: 'whsec_value',
};

export const webhookSubscriptionList = { data: [webhookSubscription] };

export const webhookDelivery = {
	id: 'del_1',
	status: 'failed',
	eventType: 'openid4vc.issuance.completed',
	webhookSubscriptionId: 'whs_1',
	attemptCount: 3,
	createdAt: '2025-11-20T10:05:00.000000Z',
	updatedAt: '2025-11-20T10:06:00.000000Z',
	completedAt: null,
	lastAttemptAt: '2025-11-20T10:06:00.000000Z',
	nextAttemptAt: '2025-11-20T10:14:00.000000Z',
};

export const webhookDeliveryList = { data: [webhookDelivery], meta: LIST_META };

/** The envelope Paradym puts in every delivery. */
export const webhookEvent = {
	webhookId: 'whs_1',
	webhookPublishedAt: '2025-11-20T10:05:00.000000Z',
	walletId: '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
	projectId: 'proj_1',
	eventType: 'openid4vc.issuance.completed',
	payload: { openId4VcIssuanceId: 'issuance_1' },
};
