/**
 * Response fixtures shaped after the Persona API reference
 * (docs.withpersona.com/api-reference).
 */

export const authRequired = {
	errors: [{ title: 'Must be authenticated to access this endpoint' }],
};

export const account = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c72',
	type: 'account',
	attributes: {
		name: 'John Doe',
		email: 'john.doe@example.com',
	},
};

export const inquiry = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c71',
	type: 'inquiry',
	attributes: {
		status: 'completed',
		inquiryTemplateId: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c74',
		referenceId: 'user-42',
		createdAt: '2025-11-20T10:00:00.000Z',
	},
};

export const inquirySession = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c73',
	type: 'inquiry-session',
	attributes: {
		sessionStatus: 'created',
	},
};

export const inquiryTemplate = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c74',
	type: 'inquiry-template',
	attributes: {
		name: 'KYC Basic',
	},
};

export const webhookConfig = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c75',
	type: 'webhook-configuration',
	attributes: {
		url: 'https://example.com/webhooks/persona',
		enabled: true,
		name: 'Main',
	},
};

export const rotatedWebhook = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c75',
	type: 'webhook-configuration',
	attributes: {
		url: 'https://example.com/webhooks/persona',
		secret: 'whsec_new_value',
	},
};

export const oneTimeLink = {
	id: 'otl_1',
	reference: 'https://withpersona.com/verify?inquiry-id=inq_1&session-id=otl_1',
};

/** A webhook delivery body, as Persona posts it. */
export const webhookEvent = {
	type: 'inquiry.approved',
	data: {
		id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c71',
		attributes: { status: 'approved' },
	},
};
