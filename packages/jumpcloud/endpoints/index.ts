import { applicationsGet, applicationsList } from './applications';
import {
	commandsCreate,
	commandsGet,
	commandsList,
	commandsRun,
} from './commands';
import { organizationsGet, organizationsList } from './organizations';
import {
	policiesCreate,
	policiesDelete,
	policiesGet,
	policiesList,
	policiesListStatuses,
	policiesUpdate,
} from './policies';
import { searchSystems, searchSystemUsers } from './search';
import {
	systemGroupsCreate,
	systemGroupsDelete,
	systemGroupsGet,
	systemGroupsList,
	systemGroupsManageMembers,
	systemGroupsUpdate,
} from './system-groups';
import {
	systemsDelete,
	systemsGet,
	systemsList,
	systemsListAssociations,
	systemsListPolicyStatuses,
	systemsListUsers,
} from './systems';
import {
	userGroupsCreate,
	userGroupsDelete,
	userGroupsGet,
	userGroupsList,
	userGroupsListMembers,
	userGroupsListMembership,
	userGroupsManageMembers,
	userGroupsUpdate,
} from './user-groups';
import {
	usersCreate,
	usersDelete,
	usersEnforceMfa,
	usersExpirePassword,
	usersGet,
	usersList,
	usersListSshKeys,
	usersResetMfa,
	usersSetPassword,
	usersSyncMfa,
	usersUnlock,
	usersUpdate,
} from './users';

export const jumpCloudEndpointsNested = {
	users: {
		list: usersList,
		create: usersCreate,
		get: usersGet,
		update: usersUpdate,
		delete: usersDelete,
		setPassword: usersSetPassword,
		unlock: usersUnlock,
		expirePassword: usersExpirePassword,
		resetMfa: usersResetMfa,
		enforceMfa: usersEnforceMfa,
		syncMfa: usersSyncMfa,
		listSshKeys: usersListSshKeys,
	},
	systems: {
		list: systemsList,
		get: systemsGet,
		delete: systemsDelete,
		listUsers: systemsListUsers,
		listPolicyStatuses: systemsListPolicyStatuses,
		listAssociations: systemsListAssociations,
	},
	search: {
		systemUsers: searchSystemUsers,
		systems: searchSystems,
	},
	commands: {
		list: commandsList,
		create: commandsCreate,
		get: commandsGet,
		run: commandsRun,
	},
	applications: {
		list: applicationsList,
		get: applicationsGet,
	},
	organizations: {
		list: organizationsList,
		get: organizationsGet,
	},
	userGroups: {
		list: userGroupsList,
		create: userGroupsCreate,
		get: userGroupsGet,
		update: userGroupsUpdate,
		delete: userGroupsDelete,
		listMembers: userGroupsListMembers,
		manageMembers: userGroupsManageMembers,
		listMembership: userGroupsListMembership,
	},
	systemGroups: {
		list: systemGroupsList,
		create: systemGroupsCreate,
		get: systemGroupsGet,
		update: systemGroupsUpdate,
		delete: systemGroupsDelete,
		manageMembers: systemGroupsManageMembers,
	},
	policies: {
		list: policiesList,
		create: policiesCreate,
		get: policiesGet,
		update: policiesUpdate,
		delete: policiesDelete,
		listStatuses: policiesListStatuses,
	},
} as const;

export * from './types';
