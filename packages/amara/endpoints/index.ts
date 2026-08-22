import * as Activity from './activity';
import * as Languages from './languages';
import * as Messages from './messages';
import * as Teams from './teams';
import * as Users from './users';
import * as Videos from './videos';

export const VideosEndpoints = {
	list: Videos.list,
	viewDetails: Videos.viewDetails,
	create: Videos.create,
	update: Videos.update,
	listActivity: Videos.listActivity,
	listUrls: Videos.listUrls,
	addUrl: Videos.addUrl,
	getUrl: Videos.getUrl,
	deleteUrl: Videos.deleteUrl,
	makeUrlPrimary: Videos.makeUrlPrimary,
	getUrlDetails: Videos.getUrlDetails,
	listSubtitleLanguages: Videos.listSubtitleLanguages,
	getSubtitleLanguageDetails: Videos.getSubtitleLanguageDetails,
	createSubtitleLanguage: Videos.createSubtitleLanguage,
	updateSubtitleLanguage: Videos.updateSubtitleLanguage,
	fetchSubtitlesData: Videos.fetchSubtitlesData,
	createSubtitles: Videos.createSubtitles,
	listSubtitleActions: Videos.listSubtitleActions,
	performSubtitleAction: Videos.performSubtitleAction,
	listSubtitleNotes: Videos.listSubtitleNotes,
	addSubtitleNote: Videos.addSubtitleNote,
};

export const UsersEndpoints = {
	getData: Users.getData,
	getActivity: Users.getActivity,
};

export const TeamsEndpoints = {
	list: Teams.list,
	getDetails: Teams.getDetails,
	getLanguages: Teams.getLanguages,
	listProjects: Teams.listProjects,
	getProject: Teams.getProject,
	createProject: Teams.createProject,
	updateProject: Teams.updateProject,
	deleteProject: Teams.deleteProject,
	listMembers: Teams.listMembers,
	getMember: Teams.getMember,
	addMember: Teams.addMember,
	updateMember: Teams.updateMember,
	removeMember: Teams.removeMember,
	listTasks: Teams.listTasks,
	getTask: Teams.getTask,
	listApplications: Teams.listApplications,
};

export const ActivityEndpoints = {
	list: Activity.list,
	get: Activity.get,
};

export const LanguagesEndpoints = {
	listAvailable: Languages.listAvailable,
};

export const MessagesEndpoints = {
	send: Messages.send,
};

export * from './types';
