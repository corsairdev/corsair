import { list as botsList } from './bots';
import {
	create as conversationsCreate,
	del as conversationsDelete,
	get as conversationsGet,
	list as conversationsList,
	update as conversationsUpdate,
} from './conversations';
import {
	create as documentsCreate,
	createFromFile as documentsCreateFromFile,
	createFromWebpage as documentsCreateFromWebpage,
	del as documentsDelete,
	get as documentsGet,
	list as documentsList,
} from './documents';
import {
	create as foldersCreate,
	get as foldersGet,
	list as foldersList,
	update as foldersUpdate,
} from './folders';
import {
	get as messagesGet,
	list as messagesList,
	send as messagesSend,
	sendForStream as messagesSendForStream,
} from './messages';
import { getSignedUrl as uploadsGetSignedUrl } from './uploads';

export const Bots = {
	list: botsList,
};

export const Conversations = {
	list: conversationsList,
	create: conversationsCreate,
	get: conversationsGet,
	update: conversationsUpdate,
	delete: conversationsDelete,
};

export const Documents = {
	list: documentsList,
	create: documentsCreate,
	createFromFile: documentsCreateFromFile,
	createFromWebpage: documentsCreateFromWebpage,
	get: documentsGet,
	delete: documentsDelete,
};

export const Folders = {
	list: foldersList,
	create: foldersCreate,
	get: foldersGet,
	update: foldersUpdate,
};

export const Messages = {
	list: messagesList,
	send: messagesSend,
	get: messagesGet,
	sendForStream: messagesSendForStream,
};

export const Uploads = {
	getSignedUrl: uploadsGetSignedUrl,
};

export * from './types';
