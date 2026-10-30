import {
	archive as clientsArchive,
	create as clientsCreate,
	get as clientsGet,
	list as clientsList,
	remove as clientsRemove,
	update as clientsUpdate,
} from './clients';
import {
	disableProductEmails as meDisableProductEmails,
	disableWeeklyReport as meDisableWeeklyReport,
	get as meGet,
	getClients as meGetClients,
	getLocation as meGetLocation,
	getLogged as meGetLogged,
	getPreferences as meGetPreferences,
	getProjects as meGetProjects,
	getQuota as meGetQuota,
	getTags as meGetTags,
	getTasks as meGetTasks,
	update as meUpdate,
	updatePreferences as meUpdatePreferences,
} from './me';
import {
	create as organizationsCreate,
	createGroup as organizationsCreateGroup,
	createInvitation as organizationsCreateInvitation,
	deleteGroup as organizationsDeleteGroup,
	get as organizationsGet,
	getGroups as organizationsGetGroups,
	getPlans as organizationsGetPlans,
	getSubscriptionPlans as organizationsGetSubscriptionPlans,
	getUsers as organizationsGetUsers,
	getWorkspaces as organizationsGetWorkspaces,
	update as organizationsUpdate,
} from './organizations';
import {
	addUser as projectsAddUser,
	create as projectsCreate,
	deleteGroup as projectsDeleteGroup,
	get as projectsGet,
	list as projectsList,
	remove as projectsRemove,
	update as projectsUpdate,
} from './projects';
import {
	getCountries as referenceGetCountries,
	getCountrySubdivisions as referenceGetCountrySubdivisions,
	getCurrencies as referenceGetCurrencies,
	getKeys as referenceGetKeys,
	getTimezoneOffsets as referenceGetTimezoneOffsets,
	getTimezones as referenceGetTimezones,
} from './reference';
import {
	sendContact as smailSendContact,
	sendDemo as smailSendDemo,
	sendMeet as smailSendMeet,
} from './smail';
import {
	create as tagsCreate,
	list as tagsList,
	remove as tagsRemove,
	update as tagsUpdate,
} from './tags';
import {
	create as tasksCreate,
	get as tasksGet,
	list as tasksList,
	remove as tasksRemove,
	update as tasksUpdate,
} from './tasks';
import {
	bulkEdit as timeEntriesBulkEdit,
	create as timeEntriesCreate,
	get as timeEntriesGet,
	getCurrent as timeEntriesGetCurrent,
	list as timeEntriesList,
	remove as timeEntriesRemove,
	stop as timeEntriesStop,
	update as timeEntriesUpdate,
} from './time-entries';
import {
	deleteSubscription as webhooksDeleteSubscription,
	getEventFilters as webhooksGetEventFilters,
	getStatus as webhooksGetStatus,
	listSubscriptions as webhooksListSubscriptions,
} from './webhook-subscriptions';
import {
	get as workspacesGet,
	getLogo as workspacesGetLogo,
	getPreferences as workspacesGetPreferences,
	getUsers as workspacesGetUsers,
	list as workspacesList,
	update as workspacesUpdate,
} from './workspaces';

export const Me = {
	get: meGet,
	update: meUpdate,
	getPreferences: meGetPreferences,
	updatePreferences: meUpdatePreferences,
	getLogged: meGetLogged,
	getLocation: meGetLocation,
	getQuota: meGetQuota,
	getClients: meGetClients,
	getProjects: meGetProjects,
	getTags: meGetTags,
	getTasks: meGetTasks,
	disableProductEmails: meDisableProductEmails,
	disableWeeklyReport: meDisableWeeklyReport,
};

export const Workspaces = {
	list: workspacesList,
	get: workspacesGet,
	update: workspacesUpdate,
	getUsers: workspacesGetUsers,
	getLogo: workspacesGetLogo,
	getPreferences: workspacesGetPreferences,
};

export const Organizations = {
	get: organizationsGet,
	update: organizationsUpdate,
	getWorkspaces: organizationsGetWorkspaces,
	create: organizationsCreate,
	getGroups: organizationsGetGroups,
	createGroup: organizationsCreateGroup,
	deleteGroup: organizationsDeleteGroup,
	getUsers: organizationsGetUsers,
	createInvitation: organizationsCreateInvitation,
	getPlans: organizationsGetPlans,
	getSubscriptionPlans: organizationsGetSubscriptionPlans,
};

export const Clients = {
	list: clientsList,
	get: clientsGet,
	create: clientsCreate,
	update: clientsUpdate,
	archive: clientsArchive,
	delete: clientsRemove,
};

export const Projects = {
	list: projectsList,
	get: projectsGet,
	create: projectsCreate,
	update: projectsUpdate,
	delete: projectsRemove,
	addUser: projectsAddUser,
	deleteGroup: projectsDeleteGroup,
};

export const Tasks = {
	list: tasksList,
	get: tasksGet,
	create: tasksCreate,
	update: tasksUpdate,
	delete: tasksRemove,
};

export const Tags = {
	list: tagsList,
	create: tagsCreate,
	update: tagsUpdate,
	delete: tagsRemove,
};

export const TimeEntries = {
	list: timeEntriesList,
	getCurrent: timeEntriesGetCurrent,
	get: timeEntriesGet,
	create: timeEntriesCreate,
	update: timeEntriesUpdate,
	stop: timeEntriesStop,
	delete: timeEntriesRemove,
	bulkEdit: timeEntriesBulkEdit,
};

export const Reference = {
	getCountries: referenceGetCountries,
	getCountrySubdivisions: referenceGetCountrySubdivisions,
	getCurrencies: referenceGetCurrencies,
	getTimezones: referenceGetTimezones,
	getTimezoneOffsets: referenceGetTimezoneOffsets,
	getKeys: referenceGetKeys,
};

export const Webhooks = {
	getStatus: webhooksGetStatus,
	getEventFilters: webhooksGetEventFilters,
	listSubscriptions: webhooksListSubscriptions,
	deleteSubscription: webhooksDeleteSubscription,
};

export const Smail = {
	sendDemo: smailSendDemo,
	sendContact: smailSendContact,
	sendMeet: smailSendMeet,
};

export * from './types';
