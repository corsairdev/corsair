import * as account from './account';
import * as conversations from './conversations';
import * as licenses from './licenses';
import * as pages from './pages';
import * as projects from './projects';
import * as reports from './reports';
import * as settings from './settings';
import * as sources from './sources';

export const Projects = {
	list: projects.listProjects,
	get: projects.getProject,
	create: projects.createProject,
	update: projects.updateProject,
	delete: projects.deleteProject,
	clone: projects.cloneProject,
	stats: projects.getStats,
	plugins: projects.getPlugins,
};

export const Pages = {
	list: pages.listPages,
	delete: pages.deletePage,
	reindex: pages.reindexPage,
	getMetadata: pages.getPageMetadata,
	updateMetadata: pages.updatePageMetadata,
};

export const Sources = {
	list: sources.listSources,
	add: sources.addSource,
	update: sources.updateSource,
	delete: sources.deleteSource,
};

export const Licenses = {
	list: licenses.listProjectLicenses,
	get: licenses.getProjectLicense,
	update: licenses.updateProjectLicense,
	delete: licenses.deleteProjectLicense,
};

export const Settings = {
	get: settings.getProjectSettings,
	update: settings.updateProjectSettings,
};

export const Personas = {
	list: settings.listPersonas,
	activate: settings.activatePersonaVersion,
};

export const Conversations = {
	create: conversations.createConversation,
};

export const Messages = {
	list: conversations.listConversationMessages,
	get: conversations.getMessage,
	getTrustScore: conversations.getMessageTrustScore,
	verify: conversations.verifyMessage,
	submitFeedback: conversations.submitMessageFeedback,
};

export const Reports = {
	getAnalysis: reports.getReportAnalysis,
	getConversations: reports.getReportConversations,
	getTraffic: reports.getReportTraffic,
	getIntelligence: reports.getReportIntelligence,
	exportLeads: reports.exportLeads,
};

export const Limits = {
	getUsage: account.getUsageLimits,
};

export const User = {
	getProfile: account.getUserProfile,
	updateProfile: account.updateUserProfile,
	searchTeamMembers: account.searchTeamMembers,
};

export const CustomGPT = {
	...projects,
	...pages,
	...sources,
	...licenses,
	...settings,
	...conversations,
	...reports,
	...account,
};

export * from './account';
export * from './conversations';
export * from './licenses';
export * from './pages';
export * from './projects';
export * from './reports';
export * from './settings';
export * from './sources';
export * from './types';
