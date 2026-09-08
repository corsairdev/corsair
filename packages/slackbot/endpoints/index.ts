import * as calls from './calls';
import * as canvases from './canvases';
import * as conversations from './conversations';
import * as files from './files';
import * as messages from './messages';
import * as reminders from './reminders';
import * as team from './team';
import * as userGroups from './user-groups';
import * as users from './users';

/** Files stored in Slack, plus the remote-file metadata surface. */
export const Files = {
	info: files.info,
	list: files.list,
	delete: files.remove,
	upload: files.upload,
	download: files.download,
	commentsDelete: files.commentsDelete,
	sharePublicUrl: files.sharePublicUrl,
	revokePublicUrl: files.revokePublicUrl,
	remoteAdd: files.remoteAdd,
	remoteInfo: files.remoteInfo,
	remoteList: files.remoteList,
	remoteUpdate: files.remoteUpdate,
	remoteRemove: files.remoteRemove,
	remoteShare: files.remoteShare,
};

/** Sending, editing and annotating messages. */
export const Messages = {
	post: messages.post,
	postEphemeral: messages.postEphemeral,
	postMe: messages.postMe,
	schedule: messages.schedule,
	deleteScheduled: messages.deleteScheduled,
	update: messages.update,
	delete: messages.deleteMessage,
	history: messages.history,
	replies: messages.replies,
	reactionAdd: messages.reactionAdd,
	reactionRemove: messages.reactionRemove,
	reactionsGet: messages.reactionsGet,
	reactionsList: messages.reactionsList,
	pinAdd: messages.pinAdd,
	pinRemove: messages.pinRemove,
	pinsList: messages.pinsList,
};

/** Channel, group and DM lifecycle. */
export const Conversations = {
	create: conversations.create,
	info: conversations.info,
	list: conversations.list,
	listForUser: conversations.listForUser,
	find: conversations.find,
	members: conversations.members,
	invite: conversations.invite,
	kick: conversations.kick,
	join: conversations.join,
	leave: conversations.leave,
	rename: conversations.rename,
	setPurpose: conversations.setPurpose,
	setTopic: conversations.setTopic,
	mark: conversations.mark,
	archive: conversations.archive,
	unarchive: conversations.unarchive,
	close: conversations.close,
};

/** Directory lookups, presence and do-not-disturb. */
export const Users = {
	list: users.list,
	find: users.find,
	info: users.info,
	getProfile: users.getProfile,
	getPresence: users.getPresence,
	setPresence: users.setPresence,
	setActive: users.setActive,
	lookupByEmail: users.lookupByEmail,
	botsInfo: users.botsInfo,
	dndInfo: users.dndInfo,
	dndTeamInfo: users.dndTeamInfo,
};

/** Slack reminders, the basis for scheduled nudges. */
export const Reminders = {
	add: reminders.add,
	info: reminders.info,
	list: reminders.list,
	delete: reminders.remove,
	complete: reminders.complete,
};

/** Named groups used for mentions and bulk membership. */
export const UserGroups = {
	create: userGroups.create,
	update: userGroups.update,
	list: userGroups.list,
	disable: userGroups.disable,
	enable: userGroups.enable,
	usersList: userGroups.usersList,
	usersUpdate: userGroups.usersUpdate,
};

/** Canvas documents, standalone or attached to a channel. */
export const Canvases = {
	create: canvases.create,
	edit: canvases.edit,
	delete: canvases.remove,
	get: canvases.get,
	list: canvases.list,
	sectionsLookup: canvases.sectionsLookup,
};

/** Slack call cards. */
export const Calls = {
	add: calls.add,
	info: calls.info,
	update: calls.update,
	end: calls.end,
	participantsAdd: calls.participantsAdd,
	participantsRemove: calls.participantsRemove,
};

/** Workspace metadata, link unfurls and DM opening. */
export const Team = {
	info: team.info,
	profileGet: team.profileGet,
	emojiList: team.emojiList,
	unfurl: team.unfurl,
	openDm: team.openDm,
};

export * from './types';
