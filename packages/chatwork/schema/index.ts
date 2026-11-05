import {
	ChatworkAccount,
	ChatworkFile,
	ChatworkIncomingRequest,
	ChatworkMember,
	ChatworkMessage,
	ChatworkRoom,
	ChatworkTask,
} from './database';

export const ChatworkSchema = {
	version: '1.0.0',
	entities: {
		accounts: ChatworkAccount,
		rooms: ChatworkRoom,
		messages: ChatworkMessage,
		members: ChatworkMember,
		tasks: ChatworkTask,
		files: ChatworkFile,
		incomingRequests: ChatworkIncomingRequest,
	},
} as const;

export * from './database';
