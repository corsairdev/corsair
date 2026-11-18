import { z } from 'zod';

// ==========================================
// Account Schemas
// ==========================================

export const AccountGetInputSchema = z.object({});

export const AccountGetResponseSchema = z.object({
	account_id: z.number().describe('The Chatwork account ID'),
	room_id: z.number().describe('The user personal room ID'),
	name: z.string().describe('The user name'),
	chatwork_id: z.string().optional().describe('The Chatwork ID handle'),
	organization_id: z.number().optional().describe('The organization ID'),
	organization_name: z.string().optional().describe('The organization name'),
	department: z.string().optional().describe('The department name'),
	title: z.string().optional().describe('The user title/position'),
	url: z.string().optional().describe('The user website URL'),
	introduction: z.string().optional().describe('The user profile introduction'),
	login_mail: z.string().optional().describe('The login email address'),
	mail: z.string().optional().describe('The user email address'),
	tel_organization: z.string().optional().describe('Organization phone number'),
	tel_extension: z.string().optional().describe('Extension phone number'),
	tel_mobile: z.string().optional().describe('Mobile phone number'),
	skype: z.string().optional().describe('Skype handle'),
	facebook: z.string().optional().describe('Facebook profile'),
	twitter: z.string().optional().describe('Twitter/X handle'),
	avatar_image_url: z.string().optional().describe('Avatar image URL'),
});

// ==========================================
// Rooms Schemas
// ==========================================

export const RoomsListInputSchema = z.object({});

export const ChatworkRoomSummarySchema = z.object({
	room_id: z.number().describe('The room ID'),
	name: z.string().describe('The room name'),
	type: z.string().describe('The room type (e.g. my, direct, group)'),
	role: z
		.string()
		.describe(
			'The current user role in the room (e.g. admin, member, readonly)',
		),
	sticky: z.boolean().describe('Whether the room is pinned'),
	unread_num: z.number().describe('Number of unread messages'),
	mention_num: z.number().describe('Number of unread mentions'),
	mytask_num: z.number().describe('Number of open tasks assigned to me'),
	message_num: z.number().describe('Total number of messages in the room'),
	file_num: z.number().describe('Total number of files in the room'),
	task_num: z.number().describe('Total number of tasks in the room'),
	icon_path: z.string().describe('Icon image URL or icon path'),
	last_update_time: z
		.number()
		.describe('Last updated timestamp in Unix seconds'),
	description: z.string().optional().describe('Room description'),
});

export const RoomsListResponseSchema = z.array(ChatworkRoomSummarySchema);

export const RoomsGetInputSchema = z.object({
	room_id: z
		.number()
		.int()
		.positive()
		.describe('The ID of the room to retrieve'),
});

export const RoomsGetResponseSchema = z.object({
	room_id: z.number().describe('The room ID'),
	name: z.string().describe('The room name'),
	type: z.string().describe('The room type (e.g. my, direct, group)'),
	role: z
		.string()
		.describe(
			'The current user role in the room (e.g. admin, member, readonly)',
		),
	sticky: z.boolean().describe('Whether the room is pinned'),
	unread_num: z.number().describe('Number of unread messages'),
	mention_num: z.number().describe('Number of unread mentions'),
	mytask_num: z.number().describe('Number of open tasks assigned to me'),
	message_num: z.number().describe('Total number of messages in the room'),
	file_num: z.number().describe('Total number of files in the room'),
	task_num: z.number().describe('Total number of tasks in the room'),
	icon_path: z.string().describe('Icon image URL or icon path'),
	last_update_time: z
		.number()
		.describe('Last updated timestamp in Unix seconds'),
	description: z.string().optional().describe('Detailed room description'),
});

// ==========================================
// Messages Schemas
// ==========================================

export const MessagesListInputSchema = z.object({
	room_id: z.number().int().positive().describe('The ID of the room'),
	force: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe(
			'0: get only unread messages (default), 1: get up to 100 latest messages',
		),
});

export const ChatworkMessageAccountSchema = z.object({
	account_id: z.number().describe('The sender account ID'),
	name: z.string().describe('The sender name'),
	avatar_image_url: z
		.string()
		.optional()
		.describe('The sender avatar image URL'),
});

export const ChatworkMessageItemSchema = z.object({
	message_id: z.string().describe('The unique message ID'),
	account: ChatworkMessageAccountSchema.describe('The sender profile summary'),
	body: z.string().describe('The message content'),
	send_time: z.number().describe('Sent timestamp in Unix seconds'),
	update_time: z
		.number()
		.describe('Updated timestamp in Unix seconds (0 if not updated)'),
});

export const MessagesListResponseSchema = z.array(ChatworkMessageItemSchema);

export const MessagesGetInputSchema = z.object({
	room_id: z.number().int().positive().describe('The ID of the room'),
	message_id: z.string().min(1).describe('The ID of the message to retrieve'),
});

export const MessagesGetResponseSchema = ChatworkMessageItemSchema;

export const MessagesSendInputSchema = z.object({
	room_id: z
		.number()
		.int()
		.positive()
		.describe('The ID of the room to post to'),
	body: z.string().min(1).max(65535).describe('The message body text'),
	self_unread: z
		.union([z.literal(0), z.literal(1), z.boolean()])
		.optional()
		.describe(
			'Whether the posted message should be marked as unread for the sender (0: read, 1: unread)',
		),
});

export const MessagesSendResponseSchema = z.object({
	message_id: z.string().describe('The ID of the created message'),
});

// ==========================================
// Members Schemas
// ==========================================

export const MembersListInputSchema = z.object({
	room_id: z.number().int().positive().describe('The ID of the room'),
});

export const ChatworkMemberItemSchema = z.object({
	account_id: z.number().describe('The member account ID'),
	role: z
		.enum(['admin', 'member', 'readonly'])
		.or(z.string())
		.describe('The role in the room'),
	name: z.string().describe('The member name'),
	chatwork_id: z.string().optional().describe('The Chatwork ID handle'),
	organization_id: z.number().optional().describe('Organization ID'),
	organization_name: z.string().optional().describe('Organization name'),
	department: z.string().optional().describe('Department name'),
	avatar_image_url: z.string().optional().describe('Avatar image URL'),
});

export const MembersListResponseSchema = z.array(ChatworkMemberItemSchema);

// ==========================================
// Shared Field Schemas
// ==========================================

const RoomId = z.number().int().positive().describe('The ID of the room');
const AccountIdList = z.array(z.number().int().positive());
const TaskStatus = z.enum(['open', 'done']);
const TaskLimitType = z.enum(['none', 'date', 'time']);
const IconPreset = z.enum([
	'group',
	'check',
	'document',
	'meeting',
	'event',
	'project',
	'business',
	'study',
	'security',
	'star',
	'idea',
	'heart',
	'magcup',
	'beer',
	'music',
	'sports',
	'travel',
]);
const LinkCode = z
	.string()
	.min(1)
	.max(50)
	.regex(/^[A-Za-z0-9_-]+$/)
	.describe('Path part of the invitation link URL (random if omitted)');

// ==========================================
// My Status / My Tasks Schemas
// ==========================================

export const AccountGetStatusInputSchema = z.object({});

export const AccountGetStatusResponseSchema = z.object({
	unread_room_num: z.number().describe('Number of rooms with unread messages'),
	mention_room_num: z.number().describe('Number of rooms with unread mentions'),
	mytask_room_num: z.number().describe('Number of rooms with my open tasks'),
	unread_num: z.number().describe('Total unread messages'),
	mention_num: z.number().describe('Total unread mentions'),
	mytask_num: z.number().describe('Total open tasks assigned to me'),
});

export const AccountListTasksInputSchema = z.object({
	assigned_by_account_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only tasks assigned by this account ID'),
	status: TaskStatus.optional().describe('Task status filter (default open)'),
});

const ChatworkTaskBaseSchema = z.object({
	task_id: z.number().describe('The task ID'),
	assigned_by_account: ChatworkMessageAccountSchema.describe(
		'The account that assigned the task',
	),
	message_id: z.string().describe('The message ID the task belongs to'),
	body: z.string().describe('The task content'),
	limit_time: z.number().describe('Deadline in Unix seconds (0 if none)'),
	status: TaskStatus.describe('The task status'),
	limit_type: TaskLimitType.optional().describe('The deadline type'),
});

export const ChatworkMyTaskItemSchema = ChatworkTaskBaseSchema.extend({
	room: z
		.object({
			room_id: z.number(),
			name: z.string(),
			icon_path: z.string(),
		})
		.describe('The room the task belongs to'),
});

export const AccountListTasksResponseSchema = z.array(ChatworkMyTaskItemSchema);

// ==========================================
// Contacts Schemas
// ==========================================

export const ContactsListInputSchema = z.object({});

export const ChatworkContactItemSchema = z.object({
	account_id: z.number().describe('The contact account ID'),
	room_id: z.number().describe('The direct chat room ID with the contact'),
	name: z.string().describe('The contact name'),
	chatwork_id: z.string().optional().describe('The Chatwork ID handle'),
	organization_id: z.number().optional().describe('Organization ID'),
	organization_name: z.string().optional().describe('Organization name'),
	department: z.string().optional().describe('Department name'),
	avatar_image_url: z.string().optional().describe('Avatar image URL'),
});

export const ContactsListResponseSchema = z.array(ChatworkContactItemSchema);

export const ContactsListIncomingRequestsInputSchema = z.object({});

export const ChatworkIncomingRequestItemSchema = z.object({
	request_id: z.number().describe('The contact request ID'),
	account_id: z.number().describe('The requester account ID'),
	message: z.string().nullable().optional().describe('The request message'),
	name: z.string().describe('The requester name'),
	chatwork_id: z.string().optional().describe('The Chatwork ID handle'),
	organization_id: z.number().optional().describe('Organization ID'),
	organization_name: z.string().optional().describe('Organization name'),
	department: z.string().optional().describe('Department name'),
	avatar_image_url: z.string().optional().describe('Avatar image URL'),
});

export const ContactsListIncomingRequestsResponseSchema = z.array(
	ChatworkIncomingRequestItemSchema,
);

// ==========================================
// Room Management Schemas
// ==========================================

const RoomMembersSchema = z.object({
	members_admin_ids: AccountIdList.min(1).describe(
		'Account IDs to grant the admin role (at least one)',
	),
	members_member_ids: AccountIdList.optional().describe(
		'Account IDs to grant the member role',
	),
	members_readonly_ids: AccountIdList.optional().describe(
		'Account IDs to grant the read-only role',
	),
});

export const RoomsCreateInputSchema = RoomMembersSchema.extend({
	name: z.string().min(1).max(255).describe('The group chat name'),
	description: z.string().optional().describe('The group chat description'),
	icon_preset: IconPreset.optional().describe('The group chat icon type'),
	link: z.boolean().optional().describe('Whether to create an invitation link'),
	link_code: LinkCode.optional(),
	link_need_acceptance: z
		.boolean()
		.optional()
		.describe('Whether joining via the link requires admin approval'),
});

export const RoomIdResponseSchema = z.object({
	room_id: z.number().describe('The room ID'),
});

export const RoomsUpdateInputSchema = z.object({
	room_id: RoomId,
	name: z.string().min(1).max(255).optional().describe('New group chat name'),
	description: z.string().optional().describe('New group chat description'),
	icon_preset: IconPreset.optional().describe('New group chat icon type'),
});

export const RoomsDeleteInputSchema = z.object({
	room_id: RoomId,
	action_type: z
		.enum(['leave', 'delete'])
		.describe(
			'leave: leave the group chat; delete: delete it for every member (irreversible)',
		),
});

export const SuccessResponseSchema = z.object({
	success: z.boolean().describe('Whether the operation succeeded'),
});

// ==========================================
// Invitation Link Schemas
// ==========================================

export const LinksGetInputSchema = z.object({ room_id: RoomId });

export const ChatworkRoomLinkSchema = z.object({
	public: z.boolean().describe('Whether the invitation link is enabled'),
	url: z.string().optional().describe('The invitation link URL'),
	need_acceptance: z
		.boolean()
		.optional()
		.describe('Whether joining requires admin approval'),
	description: z.string().optional().describe('The link page description'),
});

export const LinksCreateInputSchema = z.object({
	room_id: RoomId,
	code: LinkCode.optional(),
	need_acceptance: z
		.boolean()
		.optional()
		.describe('Whether joining requires admin approval (default true)'),
	description: z
		.string()
		.optional()
		.describe('Description shown on the link page'),
});

export const LinksUpdateInputSchema = LinksCreateInputSchema;

export const LinksDeleteInputSchema = z.object({ room_id: RoomId });

// ==========================================
// Message Management Schemas
// ==========================================

export const MessagesUpdateInputSchema = z.object({
	room_id: RoomId,
	message_id: z.string().min(1).describe('The ID of the message to update'),
	body: z.string().min(1).max(65535).describe('The new message body'),
});

export const MessagesDeleteInputSchema = z.object({
	room_id: RoomId,
	message_id: z.string().min(1).describe('The ID of the message to delete'),
});

export const MessageIdResponseSchema = z.object({
	message_id: z.string().describe('The message ID'),
});

export const MessagesMarkReadInputSchema = z.object({
	room_id: RoomId,
	message_id: z
		.string()
		.min(1)
		.optional()
		.describe('Mark messages up to this ID as read (all if omitted)'),
});

export const MessagesMarkUnreadInputSchema = z.object({
	room_id: RoomId,
	message_id: z
		.string()
		.min(1)
		.describe('Mark this message and every later one as unread'),
});

export const UnreadCountResponseSchema = z.object({
	unread_num: z.number().describe('Remaining unread messages in the room'),
	mention_num: z.number().describe('Remaining unread mentions in the room'),
});

// ==========================================
// Member Management Schemas
// ==========================================

export const MembersUpdateInputSchema = RoomMembersSchema.extend({
	room_id: RoomId,
});

export const MembersUpdateResponseSchema = z.object({
	admin: z.array(z.number()).describe('Account IDs with the admin role'),
	member: z.array(z.number()).describe('Account IDs with the member role'),
	readonly: z.array(z.number()).describe('Account IDs with the read-only role'),
});

// ==========================================
// Tasks Schemas
// ==========================================

export const ChatworkTaskItemSchema = ChatworkTaskBaseSchema.extend({
	account: ChatworkMessageAccountSchema.describe('The task assignee'),
});

export const TasksListInputSchema = z.object({
	room_id: RoomId,
	account_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only tasks assigned to this account ID'),
	assigned_by_account_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only tasks assigned by this account ID'),
	status: TaskStatus.optional().describe('Task status filter (default open)'),
});

export const TasksListResponseSchema = z.array(ChatworkTaskItemSchema);

export const TasksGetInputSchema = z.object({
	room_id: RoomId,
	task_id: z.number().int().positive().describe('The ID of the task'),
});

export const TasksCreateInputSchema = z.object({
	room_id: RoomId,
	body: z.string().min(1).max(65535).describe('The task content'),
	to_ids: AccountIdList.min(1).describe('Account IDs of the assignees'),
	limit: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Deadline as a Unix timestamp in seconds'),
	limit_type: TaskLimitType.optional().describe('The deadline type'),
});

export const TasksCreateResponseSchema = z.object({
	task_ids: z.array(z.number()).describe('IDs of the created tasks'),
});

export const TasksUpdateStatusInputSchema = z.object({
	room_id: RoomId,
	task_id: z.number().int().positive().describe('The ID of the task'),
	status: TaskStatus.describe('done: complete the task; open: reopen it'),
});

export const TasksUpdateStatusResponseSchema = z.object({
	task_id: z.number().describe('The updated task ID'),
});

// ==========================================
// Files Schemas
// ==========================================

export const ChatworkFileItemSchema = z.object({
	file_id: z.number().describe('The file ID'),
	account: ChatworkMessageAccountSchema.describe('The uploader'),
	message_id: z.string().describe('The message ID the file was posted with'),
	filename: z.string().describe('The file name'),
	filesize: z.number().describe('The file size in bytes'),
	upload_time: z.number().describe('Upload timestamp in Unix seconds'),
});

export const FilesListInputSchema = z.object({
	room_id: RoomId,
	account_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only files uploaded by this account ID'),
});

export const FilesListResponseSchema = z.array(ChatworkFileItemSchema);

export const FilesGetInputSchema = z.object({
	room_id: RoomId,
	file_id: z.number().int().positive().describe('The ID of the file'),
	create_download_url: z
		.boolean()
		.optional()
		.describe('Generate a download URL valid for 30 seconds'),
});

export const FilesGetResponseSchema = ChatworkFileItemSchema.extend({
	download_url: z.string().optional().describe('Temporary download URL'),
});

export const FilesUploadInputSchema = z.object({
	room_id: RoomId,
	file_base64: z.base64().min(1).describe('File contents as base64 (max 5MB)'),
	file_name: z.string().min(1).describe('File name including extension'),
	content_type: z
		.string()
		.optional()
		.describe('MIME type of the file (default application/octet-stream)'),
	message: z
		.string()
		.optional()
		.describe('Message body to post together with the file'),
});

export const FilesUploadResponseSchema = z.object({
	file_id: z.number().describe('The uploaded file ID'),
});

// ==========================================
// Inferred TypeScript Types
// ==========================================

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;
export type AccountGetStatusInput = z.infer<typeof AccountGetStatusInputSchema>;
export type AccountGetStatusResponse = z.infer<
	typeof AccountGetStatusResponseSchema
>;
export type AccountListTasksInput = z.infer<typeof AccountListTasksInputSchema>;
export type AccountListTasksResponse = z.infer<
	typeof AccountListTasksResponseSchema
>;
export type ChatworkRoomLink = z.infer<typeof ChatworkRoomLinkSchema>;
export type ChatworkTaskItem = z.infer<typeof ChatworkTaskItemSchema>;
export type ContactsListIncomingRequestsInput = z.infer<
	typeof ContactsListIncomingRequestsInputSchema
>;
export type ContactsListIncomingRequestsResponse = z.infer<
	typeof ContactsListIncomingRequestsResponseSchema
>;
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;
export type FilesGetInput = z.infer<typeof FilesGetInputSchema>;
export type FilesGetResponse = z.infer<typeof FilesGetResponseSchema>;
export type FilesListInput = z.infer<typeof FilesListInputSchema>;
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;
export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;
export type LinksCreateInput = z.infer<typeof LinksCreateInputSchema>;
export type LinksDeleteInput = z.infer<typeof LinksDeleteInputSchema>;
export type LinksGetInput = z.infer<typeof LinksGetInputSchema>;
export type LinksUpdateInput = z.infer<typeof LinksUpdateInputSchema>;
export type MembersListInput = z.infer<typeof MembersListInputSchema>;
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;
export type MembersUpdateInput = z.infer<typeof MembersUpdateInputSchema>;
export type MembersUpdateResponse = z.infer<typeof MembersUpdateResponseSchema>;
export type MessageIdResponse = z.infer<typeof MessageIdResponseSchema>;
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;
export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;
export type MessagesMarkReadInput = z.infer<typeof MessagesMarkReadInputSchema>;
export type MessagesMarkUnreadInput = z.infer<
	typeof MessagesMarkUnreadInputSchema
>;
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;
export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;
export type RoomIdResponse = z.infer<typeof RoomIdResponseSchema>;
export type RoomsCreateInput = z.infer<typeof RoomsCreateInputSchema>;
export type RoomsDeleteInput = z.infer<typeof RoomsDeleteInputSchema>;
export type RoomsGetInput = z.infer<typeof RoomsGetInputSchema>;
export type RoomsGetResponse = z.infer<typeof RoomsGetResponseSchema>;
export type RoomsListInput = z.infer<typeof RoomsListInputSchema>;
export type RoomsListResponse = z.infer<typeof RoomsListResponseSchema>;
export type RoomsUpdateInput = z.infer<typeof RoomsUpdateInputSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;
export type TasksListInput = z.infer<typeof TasksListInputSchema>;
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;
export type TasksUpdateStatusInput = z.infer<
	typeof TasksUpdateStatusInputSchema
>;
export type TasksUpdateStatusResponse = z.infer<
	typeof TasksUpdateStatusResponseSchema
>;
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;

export type ChatworkEndpointInputs = {
	accountGet: AccountGetInput;
	accountGetStatus: AccountGetStatusInput;
	accountListTasks: AccountListTasksInput;
	contactsList: ContactsListInput;
	contactsListIncomingRequests: ContactsListIncomingRequestsInput;
	roomsList: RoomsListInput;
	roomsGet: RoomsGetInput;
	roomsCreate: RoomsCreateInput;
	roomsUpdate: RoomsUpdateInput;
	roomsDelete: RoomsDeleteInput;
	linksGet: LinksGetInput;
	linksCreate: LinksCreateInput;
	linksUpdate: LinksUpdateInput;
	linksDelete: LinksDeleteInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesSend: MessagesSendInput;
	messagesUpdate: MessagesUpdateInput;
	messagesDelete: MessagesDeleteInput;
	messagesMarkRead: MessagesMarkReadInput;
	messagesMarkUnread: MessagesMarkUnreadInput;
	membersList: MembersListInput;
	membersUpdate: MembersUpdateInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdateStatus: TasksUpdateStatusInput;
	filesList: FilesListInput;
	filesGet: FilesGetInput;
	filesUpload: FilesUploadInput;
};

export type ChatworkEndpointOutputs = {
	accountGet: AccountGetResponse;
	accountGetStatus: AccountGetStatusResponse;
	accountListTasks: AccountListTasksResponse;
	contactsList: ContactsListResponse;
	contactsListIncomingRequests: ContactsListIncomingRequestsResponse;
	roomsList: RoomsListResponse;
	roomsGet: RoomsGetResponse;
	roomsCreate: RoomIdResponse;
	roomsUpdate: RoomIdResponse;
	roomsDelete: SuccessResponse;
	linksGet: ChatworkRoomLink;
	linksCreate: ChatworkRoomLink;
	linksUpdate: ChatworkRoomLink;
	linksDelete: ChatworkRoomLink;
	messagesList: MessagesListResponse;
	messagesGet: MessagesGetResponse;
	messagesSend: MessagesSendResponse;
	messagesUpdate: MessageIdResponse;
	messagesDelete: MessageIdResponse;
	messagesMarkRead: UnreadCountResponse;
	messagesMarkUnread: UnreadCountResponse;
	membersList: MembersListResponse;
	membersUpdate: MembersUpdateResponse;
	tasksList: TasksListResponse;
	tasksGet: ChatworkTaskItem;
	tasksCreate: TasksCreateResponse;
	tasksUpdateStatus: TasksUpdateStatusResponse;
	filesList: FilesListResponse;
	filesGet: FilesGetResponse;
	filesUpload: FilesUploadResponse;
};

export const ChatworkEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	accountGetStatus: AccountGetStatusInputSchema,
	accountListTasks: AccountListTasksInputSchema,
	contactsList: ContactsListInputSchema,
	contactsListIncomingRequests: ContactsListIncomingRequestsInputSchema,
	roomsList: RoomsListInputSchema,
	roomsGet: RoomsGetInputSchema,
	roomsCreate: RoomsCreateInputSchema,
	roomsUpdate: RoomsUpdateInputSchema,
	roomsDelete: RoomsDeleteInputSchema,
	linksGet: LinksGetInputSchema,
	linksCreate: LinksCreateInputSchema,
	linksUpdate: LinksUpdateInputSchema,
	linksDelete: LinksDeleteInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesMarkRead: MessagesMarkReadInputSchema,
	messagesMarkUnread: MessagesMarkUnreadInputSchema,
	membersList: MembersListInputSchema,
	membersUpdate: MembersUpdateInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdateStatus: TasksUpdateStatusInputSchema,
	filesList: FilesListInputSchema,
	filesGet: FilesGetInputSchema,
	filesUpload: FilesUploadInputSchema,
} as const;

export const ChatworkEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	accountGetStatus: AccountGetStatusResponseSchema,
	accountListTasks: AccountListTasksResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsListIncomingRequests: ContactsListIncomingRequestsResponseSchema,
	roomsList: RoomsListResponseSchema,
	roomsGet: RoomsGetResponseSchema,
	roomsCreate: RoomIdResponseSchema,
	roomsUpdate: RoomIdResponseSchema,
	roomsDelete: SuccessResponseSchema,
	linksGet: ChatworkRoomLinkSchema,
	linksCreate: ChatworkRoomLinkSchema,
	linksUpdate: ChatworkRoomLinkSchema,
	linksDelete: ChatworkRoomLinkSchema,
	messagesList: MessagesListResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	messagesUpdate: MessageIdResponseSchema,
	messagesDelete: MessageIdResponseSchema,
	messagesMarkRead: UnreadCountResponseSchema,
	messagesMarkUnread: UnreadCountResponseSchema,
	membersList: MembersListResponseSchema,
	membersUpdate: MembersUpdateResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: ChatworkTaskItemSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdateStatus: TasksUpdateStatusResponseSchema,
	filesList: FilesListResponseSchema,
	filesGet: FilesGetResponseSchema,
	filesUpload: FilesUploadResponseSchema,
} as const;
