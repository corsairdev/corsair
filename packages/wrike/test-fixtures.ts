// Response bodies shaped like Wrike v4's, with made-up ids and titles.

export const taskId = 'IEAAABCDEF12345';
export const folderId = 'IEAABCDEF12345';
export const contactId = 'KUABCDEF12345';
export const rootFolderId = 'IEAFAKE00000001';

export const task = {
	id: taskId,
	title: 'Ship the new checkout',
	description: 'The cart and payment pages',
	status: 'Active',
	importance: 'High',
	permalink: 'https://www.wrike.com/open.htm?id=12345',
	dates: {
		type: 'Planned',
		duration: 480,
		start: '2024-06-01T09:00:00Z',
		due: '2024-06-05T17:00:00Z',
	},
	parentIds: [folderId],
	subTaskIds: [],
	superTaskIds: [],
	authorIds: [contactId],
	responsibleIds: [contactId],
	followerIds: [],
	sharedIds: [contactId],
	hasAttachments: false,
	recurrent: false,
	createdDate: '2024-06-01T08:00:00Z',
	updatedDate: '2024-06-02T08:00:00Z',
};

export const tasksEnvelope = { kind: 'tasks', data: [task] };

export const folder = {
	id: folderId,
	title: 'Checkout revamp',
	childIds: [],
	scope: 'WsFolder',
	space: false,
	color: 'Blue',
	project: {
		status: 'Green',
		ownerIds: [contactId],
		startDate: '2024-06-01',
		endDate: '2024-07-01',
		createdDate: '2024-05-01T08:00:00Z',
	},
};

export const foldersEnvelope = { kind: 'folders', data: [folder] };

export const plainFolder = {
	id: 'IEAFAKE00000002',
	title: 'Shared',
	childIds: [folderId],
	scope: 'WsFolder',
	space: false,
	project: null,
};

export const contact = {
	id: contactId,
	firstName: 'Jordan',
	lastName: 'Ruiz',
	primaryEmail: 'jordan@acme.example',
	title: 'Engineer',
	companyName: 'Acme',
	phone: '+15550100',
	location: 'Bayville',
	timezone: 'America/New_York',
	locale: 'en-US',
	type: 'Person',
	avatarUrl: 'https://example.com/avatar.jpg',
	deleted: false,
	me: true,
	myTeam: false,
	profiles: [{ accountId: 'acc-1', role: 'Admin' }],
};

export const contactsEnvelope = { kind: 'contacts', data: [contact] };

export const timelog = {
	id: 'TLABCDEF12345',
	taskId,
	userId: contactId,
	hours: 6.5,
	trackedDate: '2024-06-01',
	comment: 'Built the cart',
	billingType: 'Billable',
	createdDate: '2024-06-01T18:00:00Z',
	updatedDate: '2024-06-01T18:00:00Z',
	approvalStatus: 'Approved',
	lockStatus: 'Unlocked',
	categoryId: 'TCABCDEF12345',
};

export const timelogsEnvelope = { kind: 'timelogs', data: [timelog] };

export const comment = {
	id: 'CMABCDEF12345',
	text: 'Looks good to me.',
	authorId: contactId,
	type: 'Default',
	createdDate: '2024-06-02T09:00:00Z',
	updatedDate: null,
	taskId,
	folderId: null,
	rootCommentId: null,
};

export const commentsEnvelope = { kind: 'comments', data: [comment] };

export const account = {
	id: 'ACC12345',
	name: 'Acme Inc.',
	dateFormat: 'MM/dd/yyyy',
	firstDayOfWeek: 'Sunday',
	workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	rootFolderId,
	recycleBinId: 'IEARECYCLE0001',
	timezone: 'America/New_York',
	locale: 'en-US',
	subscription: { type: 'Enterprise', suspended: false },
};

export const accountEnvelope = { kind: 'account', data: [account] };

/** A delete answers an empty list. */
export const emptyEnvelope = { kind: 'tasks', data: [] };

/** The error body the API sends. */
export const invalidToken = {
	error: 'not_authorized',
	errorDescription: 'Access token is unknown or invalid',
};

export const missingToken = {
	error: 'not_authorized',
	errorDescription: 'Authorization method unknown',
};

export const forbidden = {
	error: 'access_denied',
	errorDescription: 'Access is denied',
};

export const notFound = {
	error: 'not_found',
	errorDescription: 'Task not found',
};

export const badParameter = {
	error: 'invalid_parameter',
	errorDescription: 'Title should not be empty',
};
