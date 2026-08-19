import {
	create as recordsCreate,
	get as recordsGet,
	list as recordsList,
} from './records';
import { list as workspaceMembersList } from './workspace-members';

export const WorkspaceMembers = {
	list: workspaceMembersList,
};

export const Records = {
	list: recordsList,
	get: recordsGet,
	create: recordsCreate,
};

export * from './types';
