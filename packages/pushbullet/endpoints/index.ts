import * as account from './account';
import * as chats from './chats';
import * as devices from './devices';
import * as pushes from './pushes';

/** Notes, links and files sent to devices, people or channels. */
export const Pushes = {
	create: pushes.create,
	list: pushes.list,
	update: pushes.update,
	delete: pushes.remove,
	deleteAll: pushes.removeAll,
};

/** Devices registered to the account, and valid push targets. */
export const Devices = {
	register: devices.register,
	list: devices.list,
	update: devices.update,
	delete: devices.remove,
};

/** Conversations with other Pushbullet users. */
export const Chats = {
	create: chats.create,
	list: chats.list,
	setMuted: chats.setMuted,
	delete: chats.remove,
};

/** The authenticated account. */
export const Users = {
	me: account.me,
};

/** File upload reservation for file pushes. */
export const Files = {
	uploadRequest: account.uploadRequest,
};

export * from './types';
