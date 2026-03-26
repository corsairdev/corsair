import { list as teamsList, get as teamsGet, create as teamsCreate, update as teamsUpdate, remove as teamsDelete } from './teams';
import { list as channelsList, get as channelsGet, create as channelsCreate, update as channelsUpdate, remove as channelsDelete } from './channels';
import { list as messagesList, get as messagesGet, send as messagesSend, reply as messagesReply, listReplies as messagesListReplies, remove as messagesDelete } from './messages';
import { list as membersList, get as membersGet, add as membersAdd, remove as membersRemove } from './members';
import { list as chatsList, get as chatsGet, create as chatsCreate, listMessages as chatsListMessages, sendMessage as chatsSendMessage } from './chats';

export const Teams = {
	list: teamsList,
	get: teamsGet,
	create: teamsCreate,
	update: teamsUpdate,
	delete: teamsDelete,
};

export const Channels = {
	list: channelsList,
	get: channelsGet,
	create: channelsCreate,
	update: channelsUpdate,
	delete: channelsDelete,
};

export const Messages = {
	list: messagesList,
	get: messagesGet,
	send: messagesSend,
	reply: messagesReply,
	listReplies: messagesListReplies,
	delete: messagesDelete,
};

export const Members = {
	list: membersList,
	get: membersGet,
	add: membersAdd,
	remove: membersRemove,
};

export const Chats = {
	list: chatsList,
	get: chatsGet,
	create: chatsCreate,
	listMessages: chatsListMessages,
	sendMessage: chatsSendMessage,
};

export * from './types';
