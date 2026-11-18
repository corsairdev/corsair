// Response bodies shaped like the examples at desk.zoho.com/DeskAPIDocument,
// with made-up people and IDs. They keep the docs' quirks on purpose: counts
// and some booleans arrive as strings, and IDs above 2^53 as strings too.
// No live Zoho call was made to produce them.

export const ORG_ID = '2389290';
export const TICKET_ID = '1892000000042034';
export const THREAD_ID = '1892000000135387';
export const CONTACT_ID = '1892000000042032';
export const AGENT_ID = '1892000000056096';
export const DEPARTMENT_ID = '1892000000082069';

export const ticket = {
	id: TICKET_ID,
	ticketNumber: '101',
	subject: 'Real time analysis requirement',
	status: 'Open',
	statusType: 'Open',
	priority: 'High',
	channel: 'Email',
	category: null,
	subCategory: null,
	sentiment: 'NEGATIVE',
	language: 'English',
	departmentId: '1892000000006907',
	contactId: CONTACT_ID,
	accountId: '189200000005345',
	assigneeId: '1892000000056007',
	teamId: '8920000000069071',
	productId: null,
	email: 'carol@zylker.example',
	phone: null,
	dueDate: '2016-06-21T16:16:16.000Z',
	responseDueDate: null,
	closedTime: null,
	onholdTime: null,
	createdTime: '2013-11-04T11:21:07.000Z',
	customerResponseTime: '2013-11-04T11:21:07.912Z',
	threadCount: '121',
	commentCount: '1',
	sharedCount: '0',
	isSpam: false,
	isRead: false,
	webUrl: 'https://desk.zoho.com/support/zylker/ShowHomePage.do#Cases/dv/1',
	source: {
		appName: null,
		extId: null,
		type: 'SYSTEM',
		permalink: null,
		appPhotoURL: null,
	},
	department: { name: 'Support', id: '1892000000006907' },
	team: { name: 'Tier 2', id: '8920000000069071', logoUrl: null },
	assignee: {
		firstName: 'Jack',
		lastName: 'Rue',
		photoURL: null,
		id: '1892000000056007',
		email: 'jack@zylker.example',
	},
};

export const resolution = {
	content: 'Restarted the sync job.',
	modifiedTime: '2015-12-12T00:00:00Z',
	author: {
		id: 160200000000068000,
		firstName: 'Mira',
		lastName: 'Rao',
		photoURL: null,
		email: 'mira@zylker.example',
	},
};

export const thread = {
	id: THREAD_ID,
	summary: 'We found the cause.',
	content: '<div>We found the cause.</div>',
	contentType: 'text/html',
	status: 'SUCCESS',
	direction: 'out',
	visibility: 'public',
	channel: 'EMAIL',
	sentiment: 'NEUTRAL',
	createdTime: '2016-06-21T10:16:16.000Z',
	canReply: true,
	hasAttach: false,
	isForward: false,
	attachmentCount: '0',
	attachments: [],
	fromEmailAddress: 'support@zylker.example',
	to: 'carol@zylker.example',
	cc: '',
	bcc: '',
	replyTo: null,
	author: {
		id: '1892000000056007',
		name: 'Jack Rue',
		firstName: 'Jack',
		lastName: 'Rue',
		email: 'jack@zylker.example',
		photoURL: null,
		type: 'AGENT',
	},
};

export const comment = {
	id: '1892000000135500',
	type: 'comment',
	content: 'Called the customer.',
	contentType: 'text/plain',
	isPublic: false,
	commenterId: '1892000000056007',
	commentedTime: '2016-06-21T11:00:00.000Z',
	modifiedTime: '2016-06-21T11:00:00.000Z',
	attachments: [],
};

export const contact = {
	id: CONTACT_ID,
	firstName: 'Carol',
	lastName: 'Lucas',
	email: 'carol@zylker.example',
	secondaryEmail: null,
	phone: '1 888 900 9646',
	mobile: '9876543210',
	type: null,
	accountId: '1892000000091433',
	ownerId: null,
	accountCount: '1',
	createdTime: '2016-05-04T09:57:17.000Z',
	webUrl: 'https://desk.zoho.com/support/zylker/ShowHomePage.do#Contacts/dv/1',
	isSpam: false,
	isAnonymous: false,
	isEndUser: true,
	zohoCRMContact: { id: '1892000000042099', type: 'contacts_leads' },
	customerHappiness: {
		badPercentage: '20',
		okPercentage: '30',
		goodPercentage: '50',
	},
};

export const contactAccount = {
	id: '1892000000052001',
	accountName: 'Zylker',
	website: 'www.zylker.example',
	phone: '8822120911',
	email: null,
	mappingInfo: {
		mappingId: 1892000000052072,
		mappingType: 'PRIMARY',
		isAccountTicketsViewable: true,
	},
};

export const agent = {
	id: AGENT_ID,
	firstName: 'Jack',
	lastName: 'Rue',
	emailId: 'jack@zylker.example',
	status: 'ACTIVE',
	isConfirmed: true,
	roleId: '1892000000056099',
	profileId: '1892000000056100',
	langCode: 'fr_FR',
	extn: '3298',
	associatedDepartmentIds: ['1892000000006907'],
	associatedChatDepartmentIds: [],
	role: { name: 'CEO', id: '1892000000056099' },
	associatedChatDepartments: [{ name: 'Development', id: '1892000000006907' }],
};

export const department = {
	id: DEPARTMENT_ID,
	name: 'Zylker',
	description: 'Consumer electronics support.',
	nameInCustomerPortal: 'ZylCares',
	chatStatus: 'AVAILABLE',
	creatorId: '1892000000042001',
	createdTime: '2019-07-26T13:11:02.000Z',
	hasLogo: true,
	isDefault: true,
	isEnabled: true,
	isAssignToTeamEnabled: true,
	isVisibleInCustomerPortal: true,
};

export const team = {
	id: '6000000012001',
	name: 'Tier 2',
	description: 'Escalations',
	departmentId: DEPARTMENT_ID,
	logoUrl: null,
	agents: ['1892000000056007'],
	derivedAgents: [],
	roles: [],
	rolesWithSubordinates: [],
	subTeams: [],
};

export const organization = {
	id: ORG_ID,
	companyName: 'Zylker INC.',
	portalName: 'zylker',
	edition: 'ENTERPRISE',
	employeeCount: '10',
	// The docs show these two as strings and isAdminInOrg as a boolean.
	isDefault: 'false',
	isPayloadEncryptionEnabled: 'false',
	isAdminInOrg: true,
};

export const role = {
	id: '4000000012414',
	name: 'CEO',
	description: "Can access all other users' data.",
	reportsTo: null,
	isDefault: true,
	isVisible: true,
	shareDataWithPeers: false,
	immediateSubRoles: ['4000000012420', '4000000012417'],
};

export const taskResults = {
	results: [
		{ success: true, id: '1892000000093303', errors: null },
		{
			success: false,
			id: '1892000000050003',
			errors: {
				errorMessage: 'Either the field is invalid or restricted',
				errorCode: 'UNPROCESSABLE_ENTITY',
				httpCode: '422',
			},
		},
	],
};

export function errorBody(errorCode: string, message = 'Request failed') {
	return { errorCode, message };
}

export function tokenResponse(accessToken: string) {
	return {
		access_token: accessToken,
		api_domain: 'https://www.zohoapis.com',
		token_type: 'Bearer',
		expires_in: 3600,
	};
}
