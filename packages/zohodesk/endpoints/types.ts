import { z } from 'zod';

// Zoho's OpenAPI files (github.com/zoho/zohodesk-oas) and its reference at
// desk.zoho.com/DeskAPIDocument disagree in places, and the OpenAPI notes say
// its files are a generic description. Where they differ the reference wins,
// and a value neither pins down (sortBy, for one) stays a plain string.

// ─── Shared input fields ─────────────────────────────────────────────────────

// IDs are 64-bit and exceed Number.MAX_SAFE_INTEGER, so inputs take them as
// strings. Digits only, which also keeps them safe to place in a URL path.
const ZohoDeskId = z.string().regex(/^[0-9]+$/, 'Must be a numeric Zoho ID');

const From = z
	.number()
	.int()
	.min(0)
	.describe('Index of the first record to return');

const limitUpTo = (max: number, min = 1) =>
	z
		.number()
		.int()
		.min(min)
		.max(max)
		.describe(`Number of records to return, up to ${max}`);

const SortBy = z
	.string()
	.min(1)
	.describe('Field to sort by, ascending. Prefix with - for descending');

const Fields = z
	.array(z.string().min(1))
	.min(1)
	.max(30)
	.describe('Fields to return, up to 30. Multi-line text fields are excluded');

const SearchStr = (max: number) =>
	z
		.string()
		.min(1)
		.max(max)
		.describe('Use term* for starts with, *term* for contains, term for exact');

const ThreadInclude = z
	.array(z.enum(['plainText', 'source']))
	.min(1)
	.describe('Extra data to include. plainText adds the plain text content');

// ─── Shared output fields ────────────────────────────────────────────────────

// Output fields are permissive on purpose. The docs show numbers as strings
// (`"threadCount": "121"`) and booleans as strings (`"isDefault": "false"`),
// and Zoho adds fields per channel and per org, so an unknown or differently
// typed field must never fail a real response.
const Text = z.string().nullable().optional();
const Id = z.union([z.string(), z.number()]).nullable().optional();
const Numeric = z.union([z.number(), z.string()]).nullable().optional();
const Flag = z.union([z.boolean(), z.string()]).nullable().optional();
const TextList = z.array(z.string().nullable()).nullable().optional();
const IdList = z
	.array(z.union([z.string(), z.number()]).nullable())
	.nullable()
	.optional();
// unknown: custom field names and types are defined per Zoho Desk org.
const CustomFields = z.record(z.string(), z.unknown()).nullable().optional();

const NamedRef = z.looseObject({ id: Id, name: Text }).nullable().optional();

const Person = z
	.looseObject({
		id: Id,
		name: Text,
		firstName: Text,
		lastName: Text,
		email: Text,
		photoURL: Text,
		type: Text,
	})
	.nullable()
	.optional();

const CustomerHappiness = z
	.looseObject({
		badPercentage: Numeric,
		okPercentage: Numeric,
		goodPercentage: Numeric,
	})
	.nullable()
	.optional();

const Source = z
	.looseObject({
		appName: Text,
		extId: Text,
		permalink: Text,
		type: Text,
		appPhotoURL: Text,
	})
	.nullable()
	.optional();

const Attachment = z.looseObject({
	id: Id,
	name: Text,
	size: Numeric,
	status: Text,
	href: Text,
	previewurl: Text,
});

const ReadReceipt = z.looseObject({
	senderName: Text,
	recipientType: Text,
	from: Text,
});

const Action = z.looseObject({ method: Text, rel: Text, href: Text });

// ─── Tickets ─────────────────────────────────────────────────────────────────

const TicketsListInputSchema = z.object({
	from: From.optional(),
	limit: limitUpTo(100).optional(),
	departmentIds: z
		.array(ZohoDeskId)
		.min(1)
		.optional()
		.describe('Departments to list from. Needed for an all-departments view'),
	viewId: ZohoDeskId.optional().describe('View to list tickets from'),
	assignee: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Assignee IDs, or Unassigned'),
	teamIds: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Team IDs, or Unassigned'),
	channel: z.array(z.string().min(1)).min(1).optional(),
	status: z.array(z.string().min(1)).min(1).optional(),
	priority: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Priorities such as High, Medium, Low, or custom values'),
	sortBy: SortBy.optional().describe(
		'responseDueDate, customerResponseTime or createdTime. Prefix with - for descending',
	),
	receivedInDays: z
		.union([z.literal(15), z.literal(30), z.literal(90)])
		.optional()
		.describe('Only tickets with a customerResponseTime in this many days'),
	include: z
		.array(
			z.enum([
				'contacts',
				'products',
				'assignee',
				'departments',
				'team',
				'isRead',
			]),
		)
		.min(1)
		.optional(),
	fields: Fields.optional(),
});

const TicketsGetInputSchema = z.object({
	ticketId: ZohoDeskId,
	include: z
		.array(
			z.enum([
				'contacts',
				'products',
				'assignee',
				'departments',
				'team',
				'contract',
				'isRead',
				'skills',
			]),
		)
		.min(1)
		.optional(),
});

const TicketsGetResolutionInputSchema = z.object({ ticketId: ZohoDeskId });

const TicketsGetLatestThreadInputSchema = z.object({
	ticketId: ZohoDeskId,
	needPublic: z.boolean().optional().describe('Only a public thread'),
	needIncomingThread: z
		.boolean()
		.optional()
		.describe('Only an incoming thread'),
	include: ThreadInclude.optional(),
	threadStatus: z
		.enum(['success', 'failed'])
		.optional()
		.describe('Delivery status of the thread'),
});

const TicketsGetThreadInputSchema = z.object({
	ticketId: ZohoDeskId,
	threadId: ZohoDeskId,
	include: ThreadInclude.optional(),
});

const TicketsListConversationsInputSchema = z.object({
	ticketId: ZohoDeskId,
	from: From.optional(),
	limit: limitUpTo(200).optional().describe('Up to 200. Defaults to 100'),
});

const Ticket = z.looseObject({
	id: Id,
	ticketNumber: Numeric,
	subject: Text,
	description: Text,
	status: Text,
	statusType: Text,
	priority: Text,
	channel: Text,
	channelCode: Text,
	category: Text,
	subCategory: Text,
	classification: Text,
	language: Text,
	sentiment: Text,
	resolution: Text,
	email: Text,
	phone: Text,
	departmentId: Id,
	contactId: Id,
	accountId: Id,
	assigneeId: Id,
	teamId: Id,
	productId: Id,
	createdBy: Id,
	modifiedBy: Id,
	layoutId: Id,
	slaId: Id,
	dueDate: Text,
	responseDueDate: Text,
	customerResponseTime: Text,
	createdTime: Text,
	modifiedTime: Text,
	closedTime: Text,
	onholdTime: Text,
	lockedTime: Text,
	threadCount: Numeric,
	commentCount: Numeric,
	attachmentCount: Numeric,
	taskCount: Numeric,
	tagCount: Numeric,
	followerCount: Numeric,
	isSpam: Flag,
	isOverDue: Flag,
	isEscalated: Flag,
	isRead: Flag,
	isArchived: Flag,
	isDeleted: Flag,
	isTrashed: Flag,
	webUrl: Text,
	source: Source,
	cf: CustomFields,
	customFields: CustomFields,
	contact: Person,
	assignee: Person,
	department: NamedRef,
	team: NamedRef,
	product: z.looseObject({ id: Id, productName: Text }).nullable().optional(),
});

const TicketsListResponseSchema = z.looseObject({ data: z.array(Ticket) });

const TicketResolution = z.looseObject({
	content: Text,
	modifiedTime: Text,
	author: Person,
});

const Thread = z.looseObject({
	id: Id,
	summary: Text,
	content: Text,
	plainText: Text,
	contentType: Text,
	status: Text,
	direction: Text,
	visibility: Text,
	channel: Text,
	sentiment: Text,
	createdTime: Text,
	canReply: Flag,
	hasAttach: Flag,
	isForward: Flag,
	isDescriptionThread: Flag,
	isContentTruncated: Flag,
	fullContentURL: Text,
	fromEmailAddress: Text,
	to: Text,
	cc: Text,
	bcc: Text,
	replyTo: Text,
	facebookProfile: Text,
	twitterProfile: Text,
	attachmentCount: Numeric,
	attachments: z.array(Attachment).nullable().optional(),
	readReceipts: z.array(ReadReceipt).nullable().optional(),
	actions: z.array(Action).nullable().optional(),
	keyWords: TextList,
	aspects: TextList,
	author: Person,
	impersonatedUser: Person,
	source: Source,
});

const Conversation = Thread.extend({
	type: Text,
	commentedTime: Text,
	modifiedTime: Text,
	isPublic: Flag,
	commenterId: Id,
	commenter: Person,
	responderId: Id,
	respondedIn: Text,
	lastRatingIconURL: Text,
	attachmentIds: IdList,
});

const TicketsListConversationsResponseSchema = z.looseObject({
	data: z.array(Conversation),
});

// ─── Contacts ────────────────────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	from: From.optional(),
	limit: limitUpTo(100).optional(),
	viewId: ZohoDeskId.optional().describe('View to apply'),
	filterId: ZohoDeskId.optional().describe('Saved filter to apply'),
	sortBy: SortBy.optional().describe(
		'firstName, lastName or createdTime. Prefix with - for descending',
	),
	include: z
		.array(z.enum(['accounts']))
		.min(1)
		.optional(),
	fields: Fields.optional(),
});

const ContactsGetInputSchema = z.object({
	contactId: ZohoDeskId,
	include: z
		.array(z.enum(['accounts', 'owner']))
		.min(1)
		.optional(),
});

const ContactsGetByIdsInputSchema = z.object({
	ids: z.array(ZohoDeskId).min(1).max(20).describe('Up to 20 contact IDs'),
});

const ContactsListAccountsInputSchema = z.object({
	contactId: ZohoDeskId,
	from: From.optional(),
	limit: limitUpTo(100).optional(),
	sortBy: SortBy.optional().describe(
		'accountName, createdTime or mappingType. Prefix with - for descending',
	),
	startsWith: z
		.string()
		.min(1)
		.optional()
		.describe('Letter account names must start with'),
});

const Contact = z.looseObject({
	id: Id,
	firstName: Text,
	lastName: Text,
	email: Text,
	secondaryEmail: Text,
	phone: Text,
	mobile: Text,
	type: Text,
	title: Text,
	description: Text,
	street: Text,
	city: Text,
	state: Text,
	country: Text,
	zip: Numeric,
	facebook: Text,
	twitter: Text,
	photoURL: Text,
	webUrl: Text,
	accountId: Id,
	ownerId: Id,
	layoutId: Id,
	accountCount: Numeric,
	createdTime: Text,
	modifiedTime: Text,
	isSpam: Flag,
	isAnonymous: Flag,
	isEndUser: Flag,
	isFollowing: Flag,
	isDeleted: Flag,
	isTrashed: Flag,
	cf: CustomFields,
	customFields: CustomFields,
	customerHappiness: CustomerHappiness,
	zohoCRMContact: z.looseObject({ id: Id, type: Text }).nullable().optional(),
	owner: Person,
	account: z
		.looseObject({ id: Id, accountName: Text, website: Text })
		.nullable()
		.optional(),
});

const ContactsListResponseSchema = z.looseObject({ data: z.array(Contact) });

const ContactAccount = z.looseObject({
	id: Id,
	accountName: Text,
	website: Text,
	phone: Text,
	email: Text,
	webUrl: Text,
	createdTime: Text,
	mappingType: Text,
	mappingInfo: z
		.looseObject({
			mappingId: Id,
			mappingType: Text,
			isAccountTicketsViewable: Flag,
		})
		.nullable()
		.optional(),
	zohoCRMAccount: z.looseObject({ id: Id }).nullable().optional(),
	customerHappiness: CustomerHappiness,
});

const ContactsListAccountsResponseSchema = z.looseObject({
	data: z.array(ContactAccount),
});

// ─── Agents ──────────────────────────────────────────────────────────────────

const AgentsGetInputSchema = z.object({
	agentId: ZohoDeskId,
	include: z
		.array(
			z.enum([
				'profile',
				'role',
				'associatedDepartments',
				'associatedChatDepartments',
				'verifiedEmails',
			]),
		)
		.min(1)
		.optional(),
});

const AgentsGetCountInputSchema = z.object({
	status: z.enum(['ACTIVE', 'DISABLED']).optional(),
	isConfirmed: z.boolean().optional(),
	includeLightAgent: z.boolean().optional(),
});

const Agent = z.looseObject({
	id: Id,
	zuid: Id,
	name: Text,
	firstName: Text,
	lastName: Text,
	emailId: Text,
	status: Text,
	isConfirmed: Flag,
	roleId: Id,
	profileId: Id,
	rolePermissionType: Text,
	langCode: Text,
	countryCode: Text,
	timeZone: Text,
	aboutInfo: Text,
	phone: Text,
	mobile: Text,
	extn: Text,
	photoURL: Text,
	channelExpert: TextList,
	associatedDepartmentIds: IdList,
	associatedChatDepartmentIds: IdList,
	cf: CustomFields,
	role: NamedRef,
	profile: NamedRef,
	associatedDepartments: z.array(z.looseObject({})).nullable().optional(),
	associatedChatDepartments: z.array(z.looseObject({})).nullable().optional(),
	verifiedEmails: TextList,
});

const Count = z.looseObject({ count: Numeric });

// ─── Departments ─────────────────────────────────────────────────────────────

const DepartmentsListInputSchema = z.object({
	from: From.optional(),
	limit: limitUpTo(200, 0).optional(),
	isEnabled: z.boolean().optional(),
	searchStr: SearchStr(100).optional(),
	chatStatus: z
		.enum(['AVAILABLE', 'DISABLED', 'NOT_CREATED', '${UNAVAILABLE}'])
		.optional()
		.describe('${UNAVAILABLE} means departments not available for chat'),
});

const DepartmentsGetInputSchema = z.object({ departmentId: ZohoDeskId });

const DepartmentsGetCountInputSchema = z.object({
	isEnabled: z.boolean().optional(),
});

const DepartmentsListTeamsInputSchema = z.object({
	departmentId: ZohoDeskId,
	from: From.optional(),
	limit: limitUpTo(200, 0)
		.optional()
		.describe('Up to 200. Omit or pass 0 for every team'),
	searchStr: z.string().min(1).max(50).optional().describe('Team name search'),
});

const DepartmentsGetLogoInputSchema = z.object({
	departmentId: ZohoDeskId,
	fileSize: z
		.enum(['ACTUAL', 'THUMBNAIL'])
		.optional()
		.describe('Image size. Zoho defaults to ACTUAL'),
});

const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const DepartmentsUploadLogoInputSchema = z.object({
	departmentId: ZohoDeskId,
	fileName: z
		.string()
		.regex(/\.(jpe?g|png|gif)$/i, 'Must be a jpg, jpeg, png or gif file')
		.describe('File name ending in jpg, jpeg, png or gif'),
	contentBase64: z
		.string()
		.regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Must be plain base64, not a data URL')
		.refine((value) => Buffer.byteLength(value, 'base64') <= LOGO_MAX_BYTES, {
			message: 'Logo must be 2MB or smaller',
		})
		.describe('Image bytes as base64, 2MB at most'),
});

const Department = z.looseObject({
	id: Id,
	name: Text,
	description: Text,
	nameInCustomerPortal: Text,
	sanitizedName: Text,
	chatStatus: Text,
	creatorId: Id,
	createdTime: Text,
	isDefault: Flag,
	isEnabled: Flag,
	hasLogo: Flag,
	isAssignToTeamEnabled: Flag,
	isVisibleInCustomerPortal: Flag,
	associatedAgentIds: IdList,
});

const DepartmentsListResponseSchema = z.looseObject({
	data: z.array(Department),
});

const Team = z.looseObject({
	id: Id,
	name: Text,
	description: Text,
	departmentId: Id,
	logoUrl: Text,
	agents: IdList,
	derivedAgents: IdList,
	roles: IdList,
	rolesWithSubordinates: IdList,
	subTeams: IdList,
});

const DepartmentsListTeamsResponseSchema = z.looseObject({
	teams: z.array(Team),
});

const DepartmentsGetLogoResponseSchema = z.object({
	contentType: z.string(),
	contentBase64: z.string().describe('Image bytes as base64'),
	size: z.number().describe('Size of the image in bytes'),
});

// Zoho documents a 204, so `uploaded` is all there is to report. Loose because
// the sibling organization logo route answers with JSON instead.
const DepartmentsUploadLogoResponseSchema = z.looseObject({
	uploaded: z.boolean().default(true),
});

// ─── Organizations ───────────────────────────────────────────────────────────

const OrganizationsListInputSchema = z.object({});

const Organization = z.looseObject({
	id: Id,
	companyName: Text,
	portalName: Text,
	portalURL: Text,
	alias: Text,
	edition: Text,
	description: Text,
	website: Text,
	phoneNumber: Text,
	dialCode: Text,
	mobile: Text,
	fax: Text,
	primaryContact: Text,
	street: Text,
	city: Text,
	state: Text,
	country: Text,
	zip: Numeric,
	timeZone: Text,
	currencyCode: Text,
	currencyLocale: Text,
	currencySymbol: Text,
	employeeCount: Numeric,
	employeeCountRange: Text,
	industry: Text,
	logoURL: Text,
	faviconURL: Text,
	isDefault: Flag,
	isAdminInOrg: Flag,
	isSandboxPortal: Flag,
	isPayloadEncryptionEnabled: Flag,
});

const OrganizationsListResponseSchema = z.looseObject({
	data: z.array(Organization),
});

// ─── Roles ───────────────────────────────────────────────────────────────────

const RolesListInputSchema = z.object({
	from: From.optional(),
	limit: limitUpTo(500, 0).optional(),
	isVisible: z.boolean().optional(),
	isDefault: z.boolean().optional(),
	searchStr: SearchStr(100).optional(),
});

const RolesListByIdsInputSchema = z.object({
	roleIds: z.array(ZohoDeskId).min(1).max(50).describe('Up to 50 role IDs'),
});

const Role = z.looseObject({
	id: Id,
	name: Text,
	description: Text,
	reportsTo: Id,
	isDefault: Flag,
	isVisible: Flag,
	shareDataWithPeers: Flag,
	immediateSubRoles: IdList,
});

const RolesListResponseSchema = z.looseObject({ data: z.array(Role) });

// ─── Tasks ───────────────────────────────────────────────────────────────────

const TasksUpdateManyInputSchema = z.object({
	ids: z.array(ZohoDeskId).min(1).max(50).describe('Up to 50 task IDs'),
	fieldName: z.string().min(1).max(320).describe('Field to update'),
	fieldValue: z.string().max(320).optional().describe('New value of the field'),
	isCustomField: z
		.boolean()
		.optional()
		.describe('Whether fieldName is a user-defined field'),
});

// One task can fail while the rest succeed, so read each result's `success`.
const TasksUpdateManyResponseSchema = z.looseObject({
	results: z.array(
		z.looseObject({
			id: Id,
			success: Flag,
			errors: z
				.looseObject({ errorCode: Text, errorMessage: Text, httpCode: Numeric })
				.nullable()
				.optional(),
		}),
	),
});

// ─── Maps ────────────────────────────────────────────────────────────────────

export const ZohoDeskEndpointInputSchemas = {
	ticketsList: TicketsListInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsGetResolution: TicketsGetResolutionInputSchema,
	ticketsGetLatestThread: TicketsGetLatestThreadInputSchema,
	ticketsGetThread: TicketsGetThreadInputSchema,
	ticketsListConversations: TicketsListConversationsInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsGetByIds: ContactsGetByIdsInputSchema,
	contactsListAccounts: ContactsListAccountsInputSchema,
	agentsGet: AgentsGetInputSchema,
	agentsGetCount: AgentsGetCountInputSchema,
	departmentsList: DepartmentsListInputSchema,
	departmentsGet: DepartmentsGetInputSchema,
	departmentsGetCount: DepartmentsGetCountInputSchema,
	departmentsListTeams: DepartmentsListTeamsInputSchema,
	departmentsGetLogo: DepartmentsGetLogoInputSchema,
	departmentsUploadLogo: DepartmentsUploadLogoInputSchema,
	organizationsList: OrganizationsListInputSchema,
	rolesList: RolesListInputSchema,
	rolesListByIds: RolesListByIdsInputSchema,
	tasksUpdateMany: TasksUpdateManyInputSchema,
} as const;

export const ZohoDeskEndpointOutputSchemas = {
	ticketsList: TicketsListResponseSchema,
	ticketsGet: Ticket,
	// Null when Zoho answers 204: no resolution, or a ticket with no threads.
	ticketsGetResolution: TicketResolution.nullable(),
	ticketsGetLatestThread: Thread.nullable(),
	ticketsGetThread: Thread,
	ticketsListConversations: TicketsListConversationsResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: Contact,
	contactsGetByIds: ContactsListResponseSchema,
	contactsListAccounts: ContactsListAccountsResponseSchema,
	agentsGet: Agent,
	agentsGetCount: Count,
	departmentsList: DepartmentsListResponseSchema,
	departmentsGet: Department,
	departmentsGetCount: Count,
	departmentsListTeams: DepartmentsListTeamsResponseSchema,
	departmentsGetLogo: DepartmentsGetLogoResponseSchema,
	departmentsUploadLogo: DepartmentsUploadLogoResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	rolesList: RolesListResponseSchema,
	rolesListByIds: RolesListResponseSchema,
	tasksUpdateMany: TasksUpdateManyResponseSchema,
} as const;

export type ZohoDeskEndpointInputs = {
	[K in keyof typeof ZohoDeskEndpointInputSchemas]: z.infer<
		(typeof ZohoDeskEndpointInputSchemas)[K]
	>;
};

export type ZohoDeskEndpointOutputs = {
	[K in keyof typeof ZohoDeskEndpointOutputSchemas]: z.infer<
		(typeof ZohoDeskEndpointOutputSchemas)[K]
	>;
};
