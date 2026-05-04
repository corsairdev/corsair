import {
	list as formsList,
	create as formsCreate,
	get as formsGet,
	update as formsUpdate,
	deleteForm as formsDelete,
} from './forms';
import { list as questionsList } from './questions';
import {
	list as submissionsList,
	get as submissionsGet,
	deleteSubmission as submissionsDelete,
} from './submissions';
import { getMe as usersGetMe } from './users';
import {
	listUsers as organizationsListUsers,
	removeUser as organizationsRemoveUser,
	listInvites as organizationsListInvites,
	createInvite as organizationsCreateInvite,
	cancelInvite as organizationsCancelInvite,
} from './organizations';
import {
	list as workspacesList,
	create as workspacesCreate,
	get as workspacesGet,
	update as workspacesUpdate,
	deleteWorkspace as workspacesDelete,
} from './workspaces';
import {
	list as webhookManagementList,
	create as webhookManagementCreate,
	update as webhookManagementUpdate,
	deleteWebhook as webhookManagementDelete,
	listEvents as webhookManagementListEvents,
	retryEvent as webhookManagementRetryEvent,
} from './webhook-subscriptions';

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
