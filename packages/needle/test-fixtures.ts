/**
 * Responses shaped from Needle's published OpenAPI spec
 * (https://needle.app/api/v1/openapi) and its live error envelope. Needle sends
 * one error shape only, and stores identities as bare identifiers rather than
 * the URLs a caller sends in.
 */

export const me = {
	user: {
		id: '2f1c8d9e-3a5b-4c6d-8e9f-0a1b2c3d4e5f',
		email: 'jordan@acme.com',
		name: 'Jordan Reyes',
		imageUrl: null,
		organization: {
			id: '9b8a7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
			name: 'Acme Logistics',
			domain: 'acme.com',
			imageUrl: null,
			role: 'owner',
		},
	},
	requestId: '3b73488c-76fa-4678-b020-2ae4f35f5809',
};

export const lead = {
	lead: {
		id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
		firstName: 'Dana',
		lastName: 'Okafor',
		companyName: 'Northwind Freight',
		companyDomain: 'northwind.example',
		jobTitle: 'VP Operations',
		email: 'dana@northwind.example',
		imageUrl: null,
		timezone: 'Europe/London',
		// Stored as bare identifiers, not the URLs that were sent in.
		identities: [{ channel: 'linkedin', channelIdentity: 'dana-okafor' }],
		liveEnrollment: null,
		properties: { region: 'EMEA' },
		createdAt: '2026-11-10T09:12:00.000Z',
		updatedAt: '2026-11-10T09:12:00.000Z',
	},
	requestId: '8c1d2e3f-4a5b-4c6d-8e9f-0a1b2c3d4e5f',
};

export const leadPage = {
	leads: [lead.lead],
	nextCursor: 'eyJvZmZzZXQiOjF9',
	requestId: '5d6e7f8a-9b0c-4d1e-8f2a-3b4c5d6e7f8a',
};

export const lastLeadPage = {
	leads: [lead.lead],
	nextCursor: null,
	requestId: '6e7f8a9b-0c1d-4e2f-9a3b-4c5d6e7f8a9b',
};

export const upsertCreated = {
	status: 'created',
	lead: lead.lead,
	requestId: '7f8a9b0c-1d2e-4f3a-8b4c-5d6e7f8a9b0c',
};

export const upsertMatched = {
	status: 'matched',
	lead: { ...lead.lead, jobTitle: 'SVP Operations' },
	requestId: '8a9b0c1d-2e3f-4a4b-9c5d-6e7f8a9b0c1d',
};

export const deleted = {
	deleted: true,
	requestId: '9b0c1d2e-3f4a-4b5c-8d6e-7f8a9b0c1d2e',
};

export const campaign = {
	campaign: {
		id: '4d5e6f7a-8b9c-4d0e-9f1a-2b3c4d5e6f7a',
		ownerOrgId: '9b8a7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
		name: 'EMEA logistics Q4',
		status: 'draft',
		startedAt: null,
		pausedAt: null,
		archivedAt: null,
		enrollmentCount: 0,
		progress: 0,
		createdAt: '2026-11-10T10:00:00.000Z',
		updatedAt: '2026-11-10T10:00:00.000Z',
	},
	requestId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
};

export const campaignPage = {
	campaigns: [campaign.campaign],
	nextCursor: null,
	requestId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
};

export const archived = {
	archived: true,
	requestId: 'c3d4e5f6-a7b8-4c9d-8e1f-2a3b4c5d6e7f',
};

export const campaignStats = {
	stats: {
		progress: 42,
		funnel: {
			enrolled: 120,
			skippedByReason: {
				suppressed: 4,
				recently_contacted: 2,
				missing_identity: 1,
			},
			invitesSent: 116,
			invitesAccepted: 71,
			acceptanceRate: 0.612,
			messagesSent: 190,
			repliedLeads: 23,
			replyRate: 0.121,
			repliedBySentiment: { interested: 9, neutral: 11, not_interested: 3 },
		},
	},
	requestId: 'd4e5f6a7-b8c9-4d0e-9f1a-2b3c4d5e6f7a',
};

export const campaignLeads = {
	leads: [
		{
			leadId: lead.lead.id,
			enrollmentId: 'e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a8b',
			firstName: 'Dana',
			lastName: 'Okafor',
			companyName: 'Northwind Freight',
			companyDomain: 'northwind.example',
			jobTitle: 'VP Operations',
			status: 'active',
		},
	],
	nextCursor: null,
	requestId: 'f6a7b8c9-d0e1-4f2a-9b3c-4d5e6f7a8b9c',
};

/** Enrollment reports one result per lead, accepted or skipped with a reason. */
export const enrollResults = {
	results: [
		{
			index: 0,
			status: 'accepted',
			leadId: lead.lead.id,
			enrollmentId: 'e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a8b',
		},
		{
			index: 1,
			status: 'skipped',
			leadId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
			reason: 'suppressed',
		},
	],
	requestId: 'a7b8c9d0-e1f2-4a3b-8c4d-5e6f7a8b9c0d',
};

export const stopResults = {
	results: [
		{
			index: 0,
			status: 'stopped',
			leadId: lead.lead.id,
		},
		{
			index: 1,
			status: 'not_enrolled',
			leadId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
		},
	],
	requestId: 'b8c9d0e1-f2a3-4b4c-9d5e-6f7a8b9c0d1e',
};

export const suppressionPage = {
	suppressions: [
		{
			id: 'c9d0e1f2-a3b4-4c5d-8e6f-7a8b9c0d1e2f',
			scope: 'lead',
			leadId: lead.lead.id,
			companyDomain: null,
			reason: 'unsubscribed',
			note: 'Replied asking to stop',
			expiresAt: null,
			createdAt: '2026-11-09T08:00:00.000Z',
		},
		{
			id: 'd0e1f2a3-b4c5-4d6e-9f7a-8b9c0d1e2f3a',
			scope: 'company',
			leadId: null,
			companyDomain: 'competitor.example',
			reason: 'competitor',
			note: null,
			expiresAt: null,
			createdAt: '2026-11-08T12:00:00.000Z',
		},
	],
	nextCursor: null,
	requestId: 'e1f2a3b4-c5d6-4e7f-8a8b-9c0d1e2f3a4b',
};

export const suppressionCreated = {
	created: 2,
	alreadyListed: 1,
	requestId: 'f2a3b4c5-d6e7-4f8a-9b9c-0d1e2f3a4b5c',
};

/** A check answers contactable per identity, with the reason when false. */
export const suppressionCheckResults = {
	results: [
		{
			channel: 'linkedin',
			identity: 'dana-okafor',
			decision: {
				contactable: false,
				reason: 'unsubscribed',
				source: 'suppression_list',
			},
		},
		{
			channel: 'linkedin',
			identity: 'sam-rivera',
			decision: { contactable: true },
		},
	],
	requestId: 'a3b4c5d6-e7f8-4a9b-8c0d-1e2f3a4b5c6d',
};

export const placeHits = {
	hits: [
		{
			id: 'ChIJ1234567890',
			name: 'Zahnarztpraxis Dr. Weber',
			formattedAddress: 'Leopoldstraße 12, 80802 München, Germany',
			city: 'Munich',
			region: 'Bavaria',
			country: 'Germany',
			postalCode: '80802',
			location: { latitude: 48.1583, longitude: 11.5867 },
			googleMapsUrl: 'https://maps.google.com/?cid=1234567890',
			websiteUrl: 'https://dr-weber.example',
		},
	],
	requestId: 'b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e',
};

export const composed = {
	text: 'Hi Dana, saw Northwind opened a Rotterdam hub. Worth a quick chat about the EMEA lane?',
	meta: {
		contextUsed: [
			{ source: 'profile', cached: false },
			{ source: 'posts', cached: true },
		],
	},
	requestId: 'c5d6e7f8-a9b0-4c1d-8e2f-3a4b5c6d7e8f',
};

/** The one error shape Needle sends, with a requestId to quote to support. */
export const invalidKey = {
	requestId: '3b73488c-76fa-4678-b020-2ae4f35f5809',
	error:
		'This API key is invalid or has been revoked. Create a new key in Needle and try again.',
};

export const validationError = {
	requestId: '4c8e5a1d-2b3f-4e6a-9c7d-1a2b3c4d5e6f',
	error: 'identities must contain at least one channel',
	data: { field: 'identities' },
};

export const duplicateLead = {
	requestId: '5d9f6b2e-3c4a-4f7b-8d1e-2b3c4d5e6f7a',
	error: 'A lead with this identity already exists',
};

export const rateLimited = {
	requestId: '6ea07c3f-4d5b-4a8c-9e2f-3c4d5e6f7a8b',
	error: 'Too many requests for this account',
};
