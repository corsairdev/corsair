/**
 * Response fixtures shaped after the Penpot RPC API (/api/_doc). Penpot
 * documents request schemas; response shapes come from the RPC docstrings
 * and are kept loose in the schemas.
 */

export const authRequired = {
	type: 'authentication',
	code: 'authentication-required',
	hint: 'authentication required for this endpoint',
};

export const team = {
	id: '5f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
	name: 'Design Guild',
	isDefault: false,
};

export const project = {
	id: '6f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5e',
	name: 'Website Redesign',
	teamId: '5f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
};

export const file = {
	id: '7f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
	name: 'Landing page',
	projectId: '6f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5e',
	modifiedAt: '2025-11-20T10:00:00.000Z',
};

export const snapshot = {
	id: '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c60',
	label: 'Before handoff',
	createdAt: '2025-11-20T09:00:00.000Z',
};

export const shareLink = {
	id: '9f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c61',
	fileId: '7f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
};

export const commentThread = {
	id: 'af2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c62',
	content: 'Can we tighten the spacing here?',
	pageId: 'bf2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c63',
	createdAt: '2025-11-20T11:00:00.000Z',
};

export const comment = {
	id: 'cf2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c64',
	content: 'Done in the latest push.',
	createdAt: '2025-11-20T11:05:00.000Z',
};

export const webhookSubscription = {
	id: 'df2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c65',
	uri: 'https://example.com/webhooks/penpot',
	mtype: 'application/json',
	isActive: true,
	teamId: '5f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
};

export const accessToken = {
	id: 'ef2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c66',
	name: 'CI token',
	createdAt: '2025-11-20T08:00:00.000Z',
	expiration: null,
};

/** A webhook delivery body, as the help center documents the envelope. */
export const webhookEvent = {
	event: 'penpot.file.updated',
	payload: {
		fileId: '7f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
		profileId: 'ff2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c67',
	},
};
