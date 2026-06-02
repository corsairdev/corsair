import {
	create as channelsCreate,
	remove as channelsDelete,
	get as channelsGet,
	list as channelsList,
	update as channelsUpdate,
} from './channels';
import {
	create as chatsCreate,
	get as chatsGet,
	list as chatsList,
	listMessages as chatsListMessages,
	sendMessage as chatsSendMessage,
} from './chats';
import {
	add as membersAdd,
	get as membersGet,
	list as membersList,
	remove as membersRemove,
} from './members';
import {
	remove as messagesDelete,
	get as messagesGet,
	list as messagesList,
	listReplies as messagesListReplies,
	reply as messagesReply,
	send as messagesSend,
} from './messages';
import {
	create as teamsCreate,
	remove as teamsDelete,
	get as teamsGet,
	list as teamsList,
	update as teamsUpdate,
} from './teams';

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
