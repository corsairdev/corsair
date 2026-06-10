/**
 * Zoho Mail wraps every REST response in `{ status, data }`.
 * @see https://www.zoho.com/mail/help/api/
 */
export type ZohoResponseStatus = {
	code?: number;
	description?: string;
};

export type ZohoResponse<T> = {
	status?: ZohoResponseStatus;
	data?: T;
};

export type ZohoAccount = {
	accountId?: string | number;
	accountDisplayName?: string;
	primaryEmailAddress?: string;
	mailboxAddress?: string;
	incomingUserName?: string;
	accountName?: string;
};

export type ZohoMessage = {
	messageId?: string;
	threadId?: string;
	folderId?: string;
	subject?: string;
	summary?: string;
	fromAddress?: string;
	toAddress?: string;
	ccAddress?: string;
	sender?: string;
	sentDateInGMT?: string;
	receivedTime?: string;
	size?: string;
	hasAttachment?: string;
	hasInline?: string;
	status?: string;
	status2?: string;
	flagid?: string;
	priority?: string;
	calendarType?: string;
	threadCount?: string;
};

/** Full message detail (includes decoded content) from the message details endpoint. */
export type ZohoMessageDetail = ZohoMessage & {
	content?: string;
	mailFormat?: string;
	returnPath?: string;
	bccAddress?: string;
	replyTo?: string;
};

export type ZohoFolder = {
	folderId?: string;
	folderName?: string;
	path?: string;
	parentFolderId?: string;
	previousFolderId?: string;
	folderType?: string;
	isArchived?: string | boolean;
	imapAccess?: string | boolean;
	unreadCount?: string | number;
	messageCount?: string | number;
	URI?: string;
};

export type ZohoMessageListResponse = {
	messages: ZohoMessage[];
};

export type ZohoFolderListResponse = {
	folders: ZohoFolder[];
};
