import {
	archive,
	close,
	create,
	get,
	getHistory,
	getMembers,
	getReplies,
	invite,
	join,
	kick,
	leave,
	list,
	open,
	random,
	rename,
	setPurpose,
	setTopic,
	unarchive,
} from './channels';
import { get as filesGet, list as filesList, upload } from './files';
import {
	deleteMessage,
	getPermalink,
	postMessage,
	search,
	update,
} from './messages';
import {
	add as reactionsAdd,
	get as reactionsGet,
	remove as reactionsRemove,
} from './reactions';
import {
	add as starsAdd,
	list as starsList,
	remove as starsRemove,
} from './stars';
import {
	disable,
	enable,
	create as userGroupsCreate,
	list as userGroupsList,
	update as userGroupsUpdate,
} from './user-groups';
import {
	getPresence,
	getProfile,
	updateProfile,
	get as usersGet,
	list as usersList,
} from './users';

export const Channels = {
	random,
	archive,
	close,
	create,
	get,
	list,
	getHistory,
	invite,
	join,
	kick,
	leave,
	getMembers,
	open,
	rename,
	getReplies,
	setPurpose,
	setTopic,
	unarchive,
};

export const Files = {
	get: filesGet,
	list: filesList,
	upload,
};

export const Messages = {
	delete: deleteMessage,
	getPermalink,
	search,
	post: postMessage,
	update,
};

export const Reactions = {
	add: reactionsAdd,
	get: reactionsGet,
	remove: reactionsRemove,
};

export const Stars = {
	add: starsAdd,
	remove: starsRemove,
	list: starsList,
};

export const UserGroups = {
	create: userGroupsCreate,
	disable,
	enable,
	list: userGroupsList,
	update: userGroupsUpdate,
};

export const Users = {
	get: usersGet,
	list: usersList,
	getProfile,
	getPresence,
	updateProfile,
};

export type { SlackReactionName } from './reactions';
export * from './types';
