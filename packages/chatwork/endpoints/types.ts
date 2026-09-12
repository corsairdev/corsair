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
	body: z.string().min(1).describe('The message body text'),
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
// Inferred TypeScript Types
// ==========================================

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

export type RoomsListInput = z.infer<typeof RoomsListInputSchema>;
export type RoomsListResponse = z.infer<typeof RoomsListResponseSchema>;
export type RoomsGetInput = z.infer<typeof RoomsGetInputSchema>;
export type RoomsGetResponse = z.infer<typeof RoomsGetResponseSchema>;

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;
export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

export type MembersListInput = z.infer<typeof MembersListInputSchema>;
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

// Maps for plugin contracts
export type ChatworkEndpointInputs = {
	accountGet: AccountGetInput;
	roomsList: RoomsListInput;
	roomsGet: RoomsGetInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesSend: MessagesSendInput;
	membersList: MembersListInput;
};

export type ChatworkEndpointOutputs = {
	accountGet: AccountGetResponse;
	roomsList: RoomsListResponse;
	roomsGet: RoomsGetResponse;
	messagesList: MessagesListResponse;
	messagesGet: MessagesGetResponse;
	messagesSend: MessagesSendResponse;
	membersList: MembersListResponse;
};

export const ChatworkEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	roomsList: RoomsListInputSchema,
	roomsGet: RoomsGetInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	membersList: MembersListInputSchema,
};

export const ChatworkEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	roomsList: RoomsListResponseSchema,
	roomsGet: RoomsGetResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	membersList: MembersListResponseSchema,
};
