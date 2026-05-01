import {
	create as formsCreate,
	deleteForm as formsDelete,
	get as formsGet,
	list as formsList,
	update as formsUpdate,
} from './forms';
import {
	cancelInvite as organizationsCancelInvite,
	createInvite as organizationsCreateInvite,
	listInvites as organizationsListInvites,
	listUsers as organizationsListUsers,
	removeUser as organizationsRemoveUser,
} from './organizations';
import { list as questionsList } from './questions';
import {
	deleteSubmission as submissionsDelete,
	get as submissionsGet,
	list as submissionsList,
} from './submissions';
import { getMe as usersGetMe } from './users';
import {
	create as webhookManagementCreate,
	deleteWebhook as webhookManagementDelete,
	list as webhookManagementList,
	listEvents as webhookManagementListEvents,
	retryEvent as webhookManagementRetryEvent,
	update as webhookManagementUpdate,
} from './webhook-subscriptions';
import {
	create as workspacesCreate,
	deleteWorkspace as workspacesDelete,
	get as workspacesGet,
	list as workspacesList,
	update as workspacesUpdate,
} from './workspaces';

export const Forms = {
	list: formsList,
	create: formsCreate,
	get: formsGet,
	update: formsUpdate,
	delete: formsDelete,
};

export const Questions = {
	list: questionsList,
};

export const Submissions = {
	list: submissionsList,
	get: submissionsGet,
	delete: submissionsDelete,
};

export const Users = {
	getMe: usersGetMe,
};

export const Organizations = {
	listUsers: organizationsListUsers,
	removeUser: organizationsRemoveUser,
	listInvites: organizationsListInvites,
	createInvite: organizationsCreateInvite,
	cancelInvite: organizationsCancelInvite,
};

export const Workspaces = {
	list: workspacesList,
	create: workspacesCreate,
	get: workspacesGet,
	update: workspacesUpdate,
	delete: workspacesDelete,
};

export const WebhookManagement = {
	list: webhookManagementList,
	create: webhookManagementCreate,
	update: webhookManagementUpdate,
	delete: webhookManagementDelete,
	listEvents: webhookManagementListEvents,
	retryEvent: webhookManagementRetryEvent,
};

export * from './types';
