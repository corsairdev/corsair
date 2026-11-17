import * as Attachments from './attachments';
import * as Comments from './comments';
import * as Drafts from './drafts';
import * as Emails from './emails';
import * as Filters from './filters';
import * as Labels from './labels';
import * as Replies from './replies';
import * as Reports from './reports';
import * as Snippets from './snippets';
import * as Teams from './teams';
import * as Tickets from './tickets';
import * as Users from './users';

export const TicketsEndpoints = {
	list: Tickets.list,
	create: Tickets.create,
	search: Tickets.search,
	get: Tickets.get,
	delete: Tickets.remove,
	archive: Tickets.archive,
	unarchive: Tickets.unarchive,
	markAnswered: Tickets.markAnswered,
	markUnanswered: Tickets.markUnanswered,
	markSpam: Tickets.markSpam,
	unmarkSpam: Tickets.unmarkSpam,
	trash: Tickets.trash,
	untrash: Tickets.untrash,
	assignUser: Tickets.assignUser,
	unassignUser: Tickets.unassignUser,
	assignTeam: Tickets.assignTeam,
	unassignTeam: Tickets.unassignTeam,
	audit: Tickets.audit,
	addLabel: Tickets.addLabel,
	removeLabel: Tickets.removeLabel,
};

export const RepliesEndpoints = {
	list: Replies.list,
	get: Replies.get,
	create: Replies.create,
};

export const CommentsEndpoints = {
	list: Comments.list,
	create: Comments.create,
};

export const DraftsEndpoints = {
	get: Drafts.get,
	create: Drafts.create,
	update: Drafts.update,
	delete: Drafts.remove,
};

export const UsersEndpoints = {
	list: Users.list,
	create: Users.create,
	get: Users.get,
	update: Users.update,
	listMembers: Users.listMembers,
	addMember: Users.addMember,
};

export const TeamsEndpoints = {
	list: Teams.list,
};

export const AttachmentsEndpoints = {
	create: Attachments.create,
};

export const SnippetsEndpoints = {
	list: Snippets.list,
	create: Snippets.create,
	update: Snippets.update,
	delete: Snippets.remove,
};

export const FiltersEndpoints = {
	createRule: Filters.createRule,
	createConsequence: Filters.createConsequence,
	create: Filters.create,
};

export const EmailsEndpoints = {
	list: Emails.list,
	create: Emails.create,
};

export const ReportsEndpoints = {
	avgFirstResponseTime: Reports.avgFirstResponseTime,
	ticketsCount: Reports.ticketsCount,
	repliesCount: Reports.repliesCount,
};

export const LabelsEndpoints = {
	list: Labels.list,
};

export * from './types';
