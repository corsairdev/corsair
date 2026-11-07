// Response bodies modeled on the examples in https://docs.followupboss.com/reference,
// with made-up people, deals and accounts. They were not captured from the live API.

/** The `_metadata` block FUB attaches to list responses. */
export const metadata = {
	collection: 'people',
	offset: 0,
	limit: 10,
	total: 2,
	next: 'a2V5c2V0Ojk1MA',
	nextLink: 'https://api.followupboss.com/v1/people?next=a2V5c2V0Ojk1MA',
};

export const person = {
	id: 950,
	created: '2026-04-02T15:04:05+00:00',
	updated: '2026-05-11T09:30:00+00:00',
	name: 'Ava Reyes',
	firstName: 'Ava',
	lastName: 'Reyes',
	stage: 'Lead',
	stageUpdated: '2026-04-02T15:04:05+00:00',
	source: 'Relocation Form',
	sourceUrl: 'https://relocation.example/forms/cedar-lane',
	lastActivity: '2026-05-11T09:30:00+00:00',
	lastCommunication: '2026-05-10T18:12:00+00:00',
	contacted: true,
	price: 475000,
	emails: [{ value: 'ava.reyes@example.com', type: 'home' }],
	phones: [{ value: '+1 555-0142', type: 'mobile' }],
	addresses: [
		{
			type: 'home',
			street: '82 Cedar Lane',
			city: 'Boise',
			state: 'ID',
			postalCode: '83702',
			country: 'US',
		},
	],
	tags: ['Buyer', 'Relocation'],
	timeframeId: 1,
	background: 'Referred by Dana Cole at Frontdesk.',
	picture: 'https://pictures.example/ava-reyes.jpg',
	assignedUserId: 21,
	assignedPondId: null,
	assignedLenderId: null,
	assignedPartnerId: null,
	assignedToList: ['Maya Chen'],
	customFields: { customPricePoint: '$475,000' },
};

export const attachment = {
	id: 7,
	personId: 950,
	uri: 'https://files.example/ava-reyes/proof-of-funds.pdf',
	fileName: 'proof-of-funds.pdf',
	fileSize: 284512,
	created: '2026-05-11T09:31:00+00:00',
};

export const relationship = {
	id: 12,
	personId: 950,
	firstName: 'Marco',
	lastName: 'Reyes',
	type: 'Spouse',
	emails: [{ value: 'marco.reyes@example.com', type: 'home' }],
	phones: [{ value: '+1 555-0177', type: 'mobile' }],
	addresses: [],
	created: '2026-04-02T15:04:05+00:00',
	updated: '2026-04-02T15:04:05+00:00',
};

export const call = {
	id: 88,
	personId: 950,
	phone: '+1 555-0142',
	isIncoming: false,
	duration: 254,
	note: 'Walked through the Cedar Lane offer.',
	outcome: 'Interested',
	toNumber: '+1 555-0142',
	fromNumber: '+1 555-0100',
	created: '2026-05-11T10:02:00+00:00',
	updated: '2026-05-11T10:02:00+00:00',
};

export const textMessage = {
	id: 33,
	personId: 950,
	message: 'The open house starts at noon.',
	isIncoming: false,
	toNumber: '+1 555-0142',
	fromNumber: '+1 555-0100',
	status: 'delivered',
	externalId: 'sm-2214',
	externalLabel: 'Frontdesk',
	externalUrl: 'https://frontdesk.example/messages/sm-2214',
	created: '2026-05-11T11:20:00+00:00',
	updated: '2026-05-11T11:20:05+00:00',
};

export const note = {
	id: 55,
	personId: 950,
	subject: 'Pre-approval',
	body: 'Approved up to $500,000 with First Bank.',
	isHtml: false,
	user: { id: 21, name: 'Maya Chen' },
	created: '2026-05-11T12:00:00+00:00',
	updated: '2026-05-11T12:00:00+00:00',
};

export const event = {
	id: 601,
	type: 'Registration',
	created: '2026-05-11T14:00:00+00:00',
	system: 'Open House Pro',
	source: 'Open House Form',
	sourceType: 'api',
	sourceUrl: 'https://openhouse.example/forms/cedar-lane',
	description: 'Registered at the Cedar Lane open house.',
	message: 'Ava Reyes registered for the Cedar Lane open house.',
	personId: 950,
	person: { id: 950, firstName: 'Ava', lastName: 'Reyes' },
	property: { street: '82 Cedar Lane', city: 'Boise', state: 'ID' },
};

export const task = {
	id: 301,
	personId: 950,
	name: 'Follow up on the Cedar Lane offer',
	type: 'Follow Up',
	isCompleted: false,
	dueDate: '2026-05-15',
	dueDateTime: '2026-05-15T17:00:00+00:00',
	completed: null,
	assignedUserId: 21,
	created: '2026-05-11T15:00:00+00:00',
	updated: '2026-05-11T15:00:00+00:00',
};

export const appointment = {
	id: 402,
	title: 'Cedar Lane second showing',
	description: 'Second showing with the Reyes family.',
	startDateTime: '2026-05-21T17:00:00+00:00',
	endDateTime: '2026-05-21T18:00:00+00:00',
	allDay: false,
	location: '82 Cedar Lane, Boise',
	typeId: 6,
	persons: [{ id: 950, name: 'Ava Reyes' }],
	users: [{ id: 21, name: 'Maya Chen' }],
	createdById: 21,
	created: '2026-05-12T08:00:00+00:00',
	updated: '2026-05-12T08:00:00+00:00',
};

export const appointmentType = {
	id: 6,
	name: 'Showing',
	orderWeight: 1,
	created: '2024-11-03T10:00:00+00:00',
};

export const timeframe = {
	id: 1,
	timeframe: '0-3 Months',
};

export const smartList = {
	id: 3,
	name: 'Hot buyers',
	description: 'Buyers active in the last 30 days.',
	total: 128,
	created: '2025-01-20T09:00:00+00:00',
	updated: '2026-05-10T09:00:00+00:00',
};

/** GET /me answers with the authenticated user as a flat object. */
export const me = {
	id: 21,
	name: 'Maya Chen',
	firstName: 'Maya',
	lastName: 'Chen',
	role: 'admin',
	email: 'maya@cedarlane.example',
	created: '2024-11-03T10:00:00+00:00',
};

/** GET /identity answers with the account behind the API key. */
export const identity = {
	id: 88,
	name: 'Cedar Lane Realty',
};
