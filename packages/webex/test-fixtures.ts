// Response bodies shaped like the Webex REST API's, with made-up ids and
// people. They were not captured from the live API.

export const room = {
	id: 'Y2lzY29zcGFyazovL3VzL1JPT00vYTJjNDY',
	title: 'Support triage',
	type: 'group',
	isLocked: false,
	lastActivity: '2024-06-01T13:02:00.000Z',
	creatorId: 'person-1',
	created: '2024-01-01T00:00:00.000Z',
	ownerId: 'person-1',
	isPublic: false,
	isReadOnly: false,
	description: 'Where support questions land',
	siteUrl: 'acme.webex.com',
};

export const rooms = { items: [room] };

export const message = {
	id: 'message-1',
	roomId: room.id,
	roomType: 'group',
	text: 'Your order shipped.',
	markdown: null,
	html: null,
	files: ['https://files.example/invoice.pdf'],
	personId: 'person-2',
	personEmail: 'bot@acme.example',
	created: '2024-06-01T13:02:00.000Z',
	updated: null,
	parentId: null,
	isVoiceClip: false,
	contentType: 'text',
};

export const messages = { items: [message] };

export const person = {
	id: 'person-1',
	emails: ['jordan@acme.example'],
	displayName: 'Jordan Ruiz',
	nickName: 'Jordan',
	firstName: 'Jordan',
	lastName: 'Ruiz',
	avatar: 'https://example.com/avatar.jpg',
	orgId: 'org-1',
	roles: ['user'],
	licenses: ['messaging'],
	created: '2024-01-01T00:00:00.000Z',
	lastActivity: '2024-06-01T13:02:00.000Z',
	status: 'active',
	type: 'person',
};

export const people = { items: [person] };

export const team = {
	id: 'team-1',
	name: 'Support',
	creatorId: 'person-1',
	created: '2024-01-01T00:00:00.000Z',
};

export const teams = { items: [team] };

export const teamMembership = {
	id: 'tm-1',
	teamId: team.id,
	personId: person.id,
	personEmail: 'jordan@acme.example',
	personDisplayName: 'Jordan Ruiz',
	personOrgId: 'org-1',
	isModerator: false,
	created: '2024-01-01T00:00:00.000Z',
};

export const teamMemberships = { items: [teamMembership] };

export const membership = {
	id: 'mem-1',
	roomId: room.id,
	personId: person.id,
	personEmail: 'jordan@acme.example',
	personDisplayName: 'Jordan Ruiz',
	personOrgId: 'org-1',
	isModerator: false,
	isMonitor: false,
	created: '2024-01-01T00:00:00.000Z',
};

export const memberships = { items: [membership] };

export const webhook = {
	id: 'wh-1',
	name: 'Message hook',
	targetUrl: 'https://acme.example/hooks/webex',
	resource: 'messages',
	event: 'created',
	filter: `roomId=${room.id}`,
	secret: null,
	status: 'active',
	created: '2024-01-01T00:00:00.000Z',
	createdBy: 'person-1',
	orgId: 'org-1',
	ownedBy: 'creator',
};

export const webhooks = { items: [webhook] };

/** The error body the API sends: no code, but a tracking id. */
export const unauthorized = {
	message:
		'The request requires a valid access token set in the Authorization request header.',
	errors: [
		{
			description:
				'The request requires a valid access token set in the Authorization request header.',
		},
	],
	trackingId: 'ROUTERGW_adef69b1-7ab9-4498-9a11-111111111111',
};

export const forbidden = {
	message: 'The token does not have the required scope.',
	errors: [{ description: 'Required scope: spark:messages_write' }],
	trackingId: 'ROUTERGW_bbbb2222',
};

export const notFound = {
	message: 'The requested resource could not be found.',
	errors: [{ description: 'Room not found' }],
	trackingId: 'ROUTERGW_cccc3333',
};

export const badRequest = {
	message: 'The request was invalid.',
	errors: [{ description: 'roomId is required' }],
	trackingId: 'ROUTERGW_dddd4444',
};
