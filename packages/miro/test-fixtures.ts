/**
 * Fixtures follow Miro's REST v2 spec
 * (github.com/miroapp/api-clients/packages/generator/spec.json), corrected
 * against a live response. The corrections are the reason these differ from the
 * spec's own examples:
 *
 * - `createdBy`, `modifiedBy`, `owner` and `team` are reference objects, not id
 *   strings.
 * - A board carries `team` and `owner` objects; there is no `teamId`/`ownerId`.
 * - `items` and `connectors` reject a page size under 10.
 */

/**
 * Fixtures hold the resource as the API sends it. List rows are the same flat
 * object, so this keeps the two in step.
 */
function fixtureRow<T>(resource: T): T {
	return resource;
}

export const board = {
	id: 'uXjVK1abcd=',
	name: 'Product roadmap',
	description: 'Q1 planning',
	createdAt: '2026-11-01T09:00:00Z',
	// Miro sends these as reference objects, not ids: verified against a live
	// board, which the spec gets wrong.
	createdBy: { id: '3074457345618258602', type: 'user', name: 'Jordan' },
	modifiedAt: '2026-11-02T10:00:00Z',
	modifiedBy: { id: '3074457345618258602', type: 'user', name: 'Jordan' },
	owner: { id: '3074457345618258602', type: 'user', name: 'Jordan' },
	team: { id: '3074457345618258600', type: 'team', name: 'Dev team' },
	organization: { id: '3074457345618258609', type: 'organization' },
	projectId: '3074457345618258601',
	viewLink: 'https://miro.com/app/board/uXjVK1abcd=/',
	type: 'board',
	currentUserMembership: { role: 'owner' },
	policy: {
		permissionsPolicy: { copyAccess: 'team_members' },
		sharingPolicy: { access: 'edit', teamAccess: 'edit' },
	},
	links: { self: 'https://api.miro.com/v2/boards/uXjVK1abcd=' },
};

/** Boards list responses name their rows `data`. */
export const boardsListResponse = {
	data: [board],
	total: 1,
	size: 1,
	offset: 0,
	limit: 20,
	type: 'board',
	links: {},
};

export const member = {
	id: '3074457345618258603',
	role: 'editor',
	name: 'Jordan Reyes',
	email: 'jordan@acme.com',
	createdAt: '2026-11-01T09:00:00Z',
	modifiedAt: '2026-11-01T09:00:00Z',
	links: {
		self: 'https://api.miro.com/v2/boards/uXjVK1abcd=/members/3074457345618258603',
	},
};

export const membersListResponse = {
	data: [member],
	total: 1,
	size: 1,
	offset: 0,
	limit: 20,
	type: 'board_member',
	links: {},
};

/**
 * What sharing a board answers: the ids of the invitations sent, and the
 * addresses that failed with a reason each.
 */
export const invitationResult = {
	successful: [3074457350804038],
	failed: [{ email: 'gone@acme.com', reason: 'INVITATION_FAILED' }],
};

/** A sticky note, wrapped in `item` as every item route answers. */
/** Single GETs and creates return the resource flat; item routes add `item`. */
export const stickyNote = {
	id: '3458764513820541001',
	type: 'sticky_note',
	createdAt: '2026-11-01T09:00:00Z',
	modifiedAt: '2026-11-01T09:00:00Z',
	data: { content: 'Ship the roadmap', shape: 'square' },
	style: { fillColor: 'light_yellow', textAlign: 'center' },
	position: { x: 100, y: 200, origin: 'center' },
	geometry: { width: 180, height: 180, rotation: 0 },
	parent: { id: '3458764513820540000' },
	links: {
		self: 'https://api.miro.com/v2/boards/uXjVK1abcd=/sticky_notes/3458764513820541001',
	},
};

export const shape = {
	id: '3458764513820541002',
	type: 'shape',
	data: { shape: 'rectangle', content: 'Design' },
	// Sizes and opacities are strings on the wire, as the reference types them.
	style: {
		fillColor: '#ffffff',
		fillOpacity: '1.0',
		borderColor: '#1a1a1a',
		borderWidth: '2.0',
		borderOpacity: '1.0',
		borderStyle: 'normal',
		fontFamily: 'arial',
		fontSize: '14',
		textAlign: 'center',
		textAlignVertical: 'middle',
		color: '#1a1a1a',
	},
	position: { x: 300, y: 200, origin: 'center' },
	geometry: { width: 200, height: 100, rotation: 0 },
	links: {},
};

export const card = {
	id: '3458764513820541003',
	type: 'card',
	data: {
		title: 'Review designs',
		description: 'Before Friday',
		dueDate: '2026-12-01T00:00:00Z',
		assigneeId: '3074457345618258602',
	},
	style: { cardTheme: '#2d9bf0' },
	position: { x: 400, y: 300, origin: 'center' },
	geometry: { width: 320, height: 200, rotation: 0 },
	links: {},
};

export const textItem = {
	id: '3458764513820541004',
	type: 'text',
	data: { content: 'Sprint 12' },
	style: {
		color: '#1a1a1a',
		fillColor: '#ffffff',
		fillOpacity: '1.0',
		fontFamily: 'arial',
		fontSize: '24',
		textAlign: 'left',
	},
	position: { x: 50, y: 50, origin: 'center' },
	geometry: { width: 160, rotation: 0 },
	links: {},
};

export const frame = {
	id: '3458764513820541005',
	type: 'frame',
	data: {
		title: 'Discovery',
		type: 'freeform',
		format: 'custom',
		showContent: true,
	},
	style: { fillColor: '#ffffff' },
	position: { x: 0, y: 0, origin: 'center' },
	geometry: { width: 800, height: 600, rotation: 0 },
	links: {},
};

export const embed = {
	id: '3458764513820541006',
	type: 'embed',
	data: { url: 'https://www.youtube.com/watch?v=abc', mode: 'inline' },
	position: { x: 600, y: 400, origin: 'center' },
	geometry: { width: 480, height: 270, rotation: 0 },
	links: {},
};

export const connector = {
	id: '3458764513820541007',
	type: 'connector',
	startItem: { id: '3458764513820541002', links: {} },
	endItem: { id: '3458764513820541003', links: {} },
	shape: 'curved',
	style: {
		strokeColor: '#4262ff',
		strokeWidth: '2.0',
		strokeStyle: 'normal',
		startStrokeCap: 'none',
		endStrokeCap: 'stealth',
	},
	// Captions are objects on the wire, in requests and responses alike.
	captions: [
		{ content: 'depends on', position: '50%', textAlignVertical: 'middle' },
	],
	links: {},
};

export const tag = {
	id: '3458764513820541008',
	type: 'tag',
	title: 'priority',
	fillColor: 'red',
	links: {
		self: 'https://api.miro.com/v2/boards/uXjVK1abcd=/tags/3458764513820541008',
	},
};

/** Items page by cursor. */
export const itemsListResponse = {
	data: [stickyNote, shape, card],
	total: 3,
	size: 3,
	limit: 10,
	cursor: 'next-cursor-token',
	links: {},
};

/** List rows are the resource itself, not wrapped in `item`. */
export const connectorsListResponse = {
	data: [connector],
	total: 1,
	size: 1,
	limit: 10,
	cursor: null,
	links: {},
};

export const tagsListResponse = {
	data: [fixtureRow(tag)],
	total: 1,
	size: 1,
	offset: 0,
	limit: 20,
	type: 'tag',
	links: {},
};

/** The item-tags route keys its rows `tags`, not `data`. */
export const itemTagsResponse = {
	tags: [fixtureRow(tag)],
	size: 1,
	limit: 20,
	links: {},
};

export const itemsByTagResponse = {
	data: [stickyNote],
	total: 1,
	size: 1,
	offset: 0,
	limit: 20,
	type: 'sticky_note',
	links: {},
};

/** A 401, exactly as the live API answers it. */
export const tokenNotProvided = {
	status: 401,
	code: 'tokenNotProvided',
	message: 'No authorization data was found on the request',
	type: 'error',
};

/** A 401 for a token that was revoked. */
export const unauthorized = {
	status: 401,
	code: 'unauthorized',
	message: 'Token is invalid or expired',
	type: 'error',
};

/** A 404 for an unknown board. */
export const boardNotFound = {
	status: 404,
	code: 'notFound',
	message: 'Board not found',
	type: 'error',
};

/** A 400 for a bad body. */
export const badRequest = {
	status: 400,
	code: 'invalidArgument',
	message: 'The request body is invalid',
	type: 'error',
};

/** A 429. */
export const rateLimited = {
	status: 429,
	code: 'rateLimitExceeded',
	message: 'Rate limit exceeded',
	type: 'error',
};
