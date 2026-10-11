/**
 * Exercises every endpoint wrapper: HTTP method, versioned path, auth
 * header, and request bodies. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	ChatEndpoints,
	ChecklistsEndpoints,
	CustomFieldsEndpoints,
	DependenciesEndpoints,
	DocsEndpoints,
	FoldersEndpoints,
	GoalsEndpoints,
	GuestsEndpoints,
	ListsEndpoints,
	SpacesEndpoints,
	TaskCommentsEndpoints,
	TaskLinksEndpoints,
	TaskListsEndpoints,
	TasksEndpoints,
	TeamsEndpoints,
	TimeEntriesEndpoints,
	UsersEndpoints,
	ViewsEndpoints,
	WorkspaceAclEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import type { ClickupRequestContext } from './endpoints/context';
import { clickupEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = jest.mocked(logEventFromContext);

const TOKEN = 'test-token-not-a-secret';

function makeCtx(): ClickupRequestContext {
	return {
		key: TOKEN,
		$getAccountId: () => Promise.resolve('test-account'),
	};
}

const RESPONSE_BODY = {
	id: 'resource1',
	name: 'Resource',
	teams: [{ id: 'team1', name: 'Team' }],
	spaces: [{ id: 'space1', name: 'Space' }],
	folders: [{ id: 'folder1', name: 'Folder' }],
	lists: [{ id: 'list1', name: 'List' }],
	tasks: [{ id: 'task1', name: 'Test Task' }],
	views: [{ id: 'view1', name: 'View' }],
	goals: [{ id: 'goal1', name: 'Goal' }],
	comments: [{ id: 'comment1' }],
};

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastAuth: string | undefined;

function readAuthHeader(headers: RequestInit['headers']): string | undefined {
	if (headers instanceof Headers) {
		return headers.get('Authorization') ?? undefined;
	}
	if (headers !== undefined && Array.isArray(headers)) {
		for (const pair of headers) {
			const name = pair[0];
			const value = pair[1];
			if (name === 'Authorization') {
				return value;
			}
		}
		return undefined;
	}
	if (headers !== undefined) {
		return headers.Authorization;
	}
	return undefined;
}

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	lastAuth = undefined;
	global.fetch = async (
		input: string | URL | Request,
		init?: RequestInit,
	): Promise<Response> => {
		if (typeof input === 'string') {
			lastUrl = input;
		} else if (input instanceof URL) {
			lastUrl = input.href;
		} else {
			lastUrl = input.url;
		}
		lastMethod = init?.method ?? 'GET';
		const body = init?.body;
		lastBody = typeof body === 'string' ? body : undefined;
		lastAuth = readAuthHeader(init?.headers);
		return new Response(JSON.stringify(RESPONSE_BODY), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	};
});

type OperationCase = {
	path: string;
	// unknown: operations return heterogeneous responses; routing asserts HTTP only.
	invoke: (ctx: ClickupRequestContext) => Promise<unknown>;
	method: string;
	suffix: string;
};

/** [registry path, invocation, method, expected versioned path suffix] */
const OPERATIONS: OperationCase[] = [
	{
		path: 'workspaces.get',
		invoke: (c) => WorkspacesEndpoints.get(c, {}),
		method: 'GET',
		suffix: '/api/v2/team',
	},
	{
		path: 'workspaces.authorizedUser',
		invoke: (c) => WorkspacesEndpoints.authorizedUser(c, {}),
		method: 'GET',
		suffix: '/api/v2/user',
	},
	{
		path: 'workspaces.plan',
		invoke: (c) => WorkspacesEndpoints.plan(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/plan',
	},
	{
		path: 'workspaces.seats',
		invoke: (c) => WorkspacesEndpoints.seats(c, { workspace_id: 'ws1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/seats',
	},
	{
		path: 'workspaces.sharedHierarchy',
		invoke: (c) => WorkspacesEndpoints.sharedHierarchy(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/shared',
	},
	{
		path: 'workspaces.customRoles',
		invoke: (c) => WorkspacesEndpoints.customRoles(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/customroles',
	},
	{
		path: 'workspaces.customTaskTypes',
		invoke: (c) => WorkspacesEndpoints.customTaskTypes(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/custom_item',
	},
	{
		path: 'workspaces.teamFields',
		invoke: (c) => WorkspacesEndpoints.teamFields(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/field',
	},
	{
		path: 'workspaces.everythingViewsGet',
		invoke: (c) =>
			WorkspacesEndpoints.everythingViewsGet(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/view',
	},
	{
		path: 'workspaces.everythingViewsCreate',
		invoke: (c) =>
			WorkspacesEndpoints.everythingViewsCreate(c, {
				team_id: 'team1',
				name: 'View',
				type: 'list',
			}),
		method: 'POST',
		suffix: '/api/v2/team/team1/view',
	},
	{
		path: 'spaces.list',
		invoke: (c) => SpacesEndpoints.list(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/space',
	},
	{
		path: 'spaces.get',
		invoke: (c) => SpacesEndpoints.get(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1',
	},
	{
		path: 'spaces.create',
		invoke: (c) =>
			SpacesEndpoints.create(c, { team_id: 'team1', name: 'Space' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/space',
	},
	{
		path: 'spaces.update',
		invoke: (c) =>
			SpacesEndpoints.update(c, { space_id: 'space1', name: 'Space 2' }),
		method: 'PUT',
		suffix: '/api/v2/space/space1',
	},
	{
		path: 'spaces.delete',
		invoke: (c) => SpacesEndpoints.delete(c, { space_id: 'space1' }),
		method: 'DELETE',
		suffix: '/api/v2/space/space1',
	},
	{
		path: 'spaces.availableFields',
		invoke: (c) => SpacesEndpoints.availableFields(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1/field',
	},
	{
		path: 'spaces.tagsGet',
		invoke: (c) => SpacesEndpoints.tagsGet(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1/tag',
	},
	{
		path: 'spaces.tagsCreate',
		invoke: (c) =>
			SpacesEndpoints.tagsCreate(c, { space_id: 'space1', name: 'tag' }),
		method: 'POST',
		suffix: '/api/v2/space/space1/tag',
	},
	{
		path: 'spaces.tagsUpdate',
		invoke: (c) =>
			SpacesEndpoints.tagsUpdate(c, {
				space_id: 'space1',
				tag_name: 'tag',
				name: 'tag2',
				tag_fg: '#fff',
				tag_bg: '#000',
			}),
		method: 'PUT',
		suffix: '/api/v2/space/space1/tag/tag',
	},
	{
		path: 'spaces.tagsDelete',
		invoke: (c) =>
			SpacesEndpoints.tagsDelete(c, { space_id: 'space1', tag_name: 'tag' }),
		method: 'DELETE',
		suffix: '/api/v2/space/space1/tag/tag',
	},
	{
		path: 'spaces.viewsGet',
		invoke: (c) => SpacesEndpoints.viewsGet(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1/view',
	},
	{
		path: 'spaces.viewsCreate',
		invoke: (c) =>
			SpacesEndpoints.viewsCreate(c, {
				space_id: 'space1',
				name: 'View',
				type: 'board',
			}),
		method: 'POST',
		suffix: '/api/v2/space/space1/view',
	},
	{
		path: 'folders.list',
		invoke: (c) => FoldersEndpoints.list(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1/folder',
	},
	{
		path: 'folders.get',
		invoke: (c) => FoldersEndpoints.get(c, { folder_id: 'folder1' }),
		method: 'GET',
		suffix: '/api/v2/folder/folder1',
	},
	{
		path: 'folders.create',
		invoke: (c) =>
			FoldersEndpoints.create(c, { space_id: 'space1', name: 'Folder' }),
		method: 'POST',
		suffix: '/api/v2/space/space1/folder',
	},
	{
		path: 'folders.update',
		invoke: (c) =>
			FoldersEndpoints.update(c, { folder_id: 'folder1', name: 'Folder 2' }),
		method: 'PUT',
		suffix: '/api/v2/folder/folder1',
	},
	{
		path: 'folders.delete',
		invoke: (c) => FoldersEndpoints.delete(c, { folder_id: 'folder1' }),
		method: 'DELETE',
		suffix: '/api/v2/folder/folder1',
	},
	{
		path: 'folders.viewsGet',
		invoke: (c) => FoldersEndpoints.viewsGet(c, { folder_id: 'folder1' }),
		method: 'GET',
		suffix: '/api/v2/folder/folder1/view',
	},
	{
		path: 'folders.viewsCreate',
		invoke: (c) =>
			FoldersEndpoints.viewsCreate(c, {
				folder_id: 'folder1',
				name: 'View',
				type: 'list',
			}),
		method: 'POST',
		suffix: '/api/v2/folder/folder1/view',
	},
	{
		path: 'lists.list',
		invoke: (c) => ListsEndpoints.list(c, { folder_id: 'folder1' }),
		method: 'GET',
		suffix: '/api/v2/folder/folder1/list',
	},
	{
		path: 'lists.folderless',
		invoke: (c) => ListsEndpoints.folderless(c, { space_id: 'space1' }),
		method: 'GET',
		suffix: '/api/v2/space/space1/list',
	},
	{
		path: 'lists.get',
		invoke: (c) => ListsEndpoints.get(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1',
	},
	{
		path: 'lists.create',
		invoke: (c) =>
			ListsEndpoints.create(c, { folder_id: 'folder1', name: 'List' }),
		method: 'POST',
		suffix: '/api/v2/folder/folder1/list',
	},
	{
		path: 'lists.createFolderless',
		invoke: (c) =>
			ListsEndpoints.createFolderless(c, { space_id: 'space1', name: 'List' }),
		method: 'POST',
		suffix: '/api/v2/space/space1/list',
	},
	{
		path: 'lists.createFromTemplate',
		invoke: (c) =>
			ListsEndpoints.createFromTemplate(c, {
				folder_id: 'folder1',
				template_id: 't-1',
			}),
		method: 'POST',
		suffix: '/api/v2/folder/folder1/list_template/t-1',
	},
	{
		path: 'lists.update',
		invoke: (c) =>
			ListsEndpoints.update(c, { list_id: 'list1', name: 'List 2' }),
		method: 'PUT',
		suffix: '/api/v2/list/list1',
	},
	{
		path: 'lists.delete',
		invoke: (c) => ListsEndpoints.delete(c, { list_id: 'list1' }),
		method: 'DELETE',
		suffix: '/api/v2/list/list1',
	},
	{
		path: 'lists.members',
		invoke: (c) => ListsEndpoints.members(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1/member',
	},
	{
		path: 'lists.commentsGet',
		invoke: (c) => ListsEndpoints.commentsGet(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1/comment',
	},
	{
		path: 'lists.commentsCreate',
		invoke: (c) =>
			ListsEndpoints.commentsCreate(c, {
				list_id: 'list1',
				comment_text: 'hi',
			}),
		method: 'POST',
		suffix: '/api/v2/list/list1/comment',
	},
	{
		path: 'lists.viewsGet',
		invoke: (c) => ListsEndpoints.viewsGet(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1/view',
	},
	{
		path: 'lists.viewsCreate',
		invoke: (c) =>
			ListsEndpoints.viewsCreate(c, {
				list_id: 'list1',
				name: 'View',
				type: 'calendar',
			}),
		method: 'POST',
		suffix: '/api/v2/list/list1/view',
	},
	{
		path: 'tasks.list',
		invoke: (c) => TasksEndpoints.list(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1/task',
	},
	{
		path: 'tasks.filteredTeam',
		invoke: (c) => TasksEndpoints.filteredTeam(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/task',
	},
	{
		path: 'tasks.get',
		invoke: (c) => TasksEndpoints.get(c, { task_id: 'task1' }),
		method: 'GET',
		suffix: '/api/v2/task/task1',
	},
	{
		path: 'tasks.create',
		invoke: (c) =>
			TasksEndpoints.create(c, { list_id: 'list1', name: 'New Task' }),
		method: 'POST',
		suffix: '/api/v2/list/list1/task',
	},
	{
		path: 'tasks.update',
		invoke: (c) =>
			TasksEndpoints.update(c, { task_id: 'task1', name: 'Renamed' }),
		method: 'PUT',
		suffix: '/api/v2/task/task1',
	},
	{
		path: 'tasks.delete',
		invoke: (c) => TasksEndpoints.delete(c, { task_id: 'task1' }),
		method: 'DELETE',
		suffix: '/api/v2/task/task1',
	},
	{
		path: 'tasks.createFromTemplate',
		invoke: (c) =>
			TasksEndpoints.createFromTemplate(c, {
				list_id: 'list1',
				template_id: 'tpl1',
				name: 'Task',
			}),
		method: 'POST',
		suffix: '/api/v2/list/list1/taskTemplate/tpl1',
	},
	{
		path: 'tasks.moveToHomeList',
		invoke: (c) =>
			TasksEndpoints.moveToHomeList(c, {
				workspace_id: 'ws1',
				task_id: 'task1',
				list_id: 'list1',
			}),
		method: 'PUT',
		suffix: '/api/v3/workspaces/ws1/tasks/task1/home_list/list1',
	},
	{
		path: 'tasks.members',
		invoke: (c) => TasksEndpoints.members(c, { task_id: 'task1' }),
		method: 'GET',
		suffix: '/api/v2/task/task1/member',
	},
	{
		path: 'tasks.timeInStatus',
		invoke: (c) => TasksEndpoints.timeInStatus(c, { task_id: 'task1' }),
		method: 'GET',
		suffix: '/api/v2/task/task1/time_in_status',
	},
	{
		path: 'tasks.bulkTimeInStatus',
		invoke: (c) => TasksEndpoints.bulkTimeInStatus(c, { task_ids: ['task1'] }),
		method: 'GET',
		suffix: '/api/v2/task/bulk_time_in_status/task_ids',
	},
	{
		path: 'tasks.templates',
		invoke: (c) => TasksEndpoints.templates(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/taskTemplate',
	},
	{
		path: 'tasks.trackedTimeGet',
		invoke: (c) => TasksEndpoints.trackedTimeGet(c, { task_id: 'task1' }),
		method: 'GET',
		suffix: '/api/v2/task/task1/time',
	},
	{
		path: 'tasks.trackedTimeCreate',
		invoke: (c) => TasksEndpoints.trackedTimeCreate(c, { task_id: 'task1' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/time',
	},
	{
		path: 'tasks.trackedTimeUpdate',
		invoke: (c) =>
			TasksEndpoints.trackedTimeUpdate(c, {
				task_id: 'task1',
				interval_id: 'int1',
			}),
		method: 'PUT',
		suffix: '/api/v2/task/task1/time/int1',
	},
	{
		path: 'tasks.trackedTimeDelete',
		invoke: (c) =>
			TasksEndpoints.trackedTimeDelete(c, {
				task_id: 'task1',
				interval_id: 'int1',
			}),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/time/int1',
	},
	{
		path: 'tasks.tagsAdd',
		invoke: (c) =>
			TasksEndpoints.tagsAdd(c, { task_id: 'task1', tag_name: 'tag' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/tag/tag',
	},
	{
		path: 'tasks.tagsRemove',
		invoke: (c) =>
			TasksEndpoints.tagsRemove(c, { task_id: 'task1', tag_name: 'tag' }),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/tag/tag',
	},
	{
		path: 'tasks.attachmentsCreate',
		invoke: (c) =>
			TasksEndpoints.attachmentsCreate(c, {
				task_id: 'task1',
				filename: 'a.txt',
				file_base64: 'aGk=',
			}),
		method: 'POST',
		suffix: '/api/v2/task/task1/attachment',
	},
	{
		path: 'dependencies.add',
		invoke: (c) =>
			DependenciesEndpoints.add(c, { task_id: 'task1', depends_on: 'task2' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/dependency',
	},
	{
		path: 'dependencies.delete',
		invoke: (c) =>
			DependenciesEndpoints.delete(c, {
				task_id: 'task1',
				depends_on: 'task2',
			}),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/dependency',
	},
	{
		path: 'taskLinks.add',
		invoke: (c) =>
			TaskLinksEndpoints.add(c, { task_id: 'task1', links_to: 'task2' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/link/task2',
	},
	{
		path: 'taskLinks.delete',
		invoke: (c) =>
			TaskLinksEndpoints.delete(c, { task_id: 'task1', links_to: 'task2' }),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/link/task2',
	},
	{
		path: 'taskLists.add',
		invoke: (c) =>
			TaskListsEndpoints.add(c, { list_id: 'list1', task_id: 'task1' }),
		method: 'POST',
		suffix: '/api/v2/list/list1/task/task1',
	},
	{
		path: 'taskLists.remove',
		invoke: (c) =>
			TaskListsEndpoints.remove(c, { list_id: 'list1', task_id: 'task1' }),
		method: 'DELETE',
		suffix: '/api/v2/list/list1/task/task1',
	},
	{
		path: 'checklists.create',
		invoke: (c) =>
			ChecklistsEndpoints.create(c, { task_id: 'task1', name: 'Checklist' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/checklist',
	},
	{
		path: 'checklists.update',
		invoke: (c) =>
			ChecklistsEndpoints.update(c, {
				checklist_id: 'cl1',
				name: 'Checklist 2',
			}),
		method: 'PUT',
		suffix: '/api/v2/checklist/cl1',
	},
	{
		path: 'checklists.delete',
		invoke: (c) => ChecklistsEndpoints.delete(c, { checklist_id: 'cl1' }),
		method: 'DELETE',
		suffix: '/api/v2/checklist/cl1',
	},
	{
		path: 'checklists.itemsCreate',
		invoke: (c) =>
			ChecklistsEndpoints.itemsCreate(c, { checklist_id: 'cl1', name: 'Item' }),
		method: 'POST',
		suffix: '/api/v2/checklist/cl1/checklist_item',
	},
	{
		path: 'checklists.itemsUpdate',
		invoke: (c) =>
			ChecklistsEndpoints.itemsUpdate(c, {
				checklist_id: 'cl1',
				checklist_item_id: 'ci1',
				name: 'Item 2',
			}),
		method: 'PUT',
		suffix: '/api/v2/checklist/cl1/checklist_item/ci1',
	},
	{
		path: 'checklists.itemsDelete',
		invoke: (c) =>
			ChecklistsEndpoints.itemsDelete(c, {
				checklist_id: 'cl1',
				checklist_item_id: 'ci1',
			}),
		method: 'DELETE',
		suffix: '/api/v2/checklist/cl1/checklist_item/ci1',
	},
	{
		path: 'taskComments.get',
		invoke: (c) => TaskCommentsEndpoints.get(c, { task_id: 'task1' }),
		method: 'GET',
		suffix: '/api/v2/task/task1/comment',
	},
	{
		path: 'taskComments.create',
		invoke: (c) =>
			TaskCommentsEndpoints.create(c, { task_id: 'task1', comment_text: 'hi' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/comment',
	},
	{
		path: 'taskComments.update',
		invoke: (c) =>
			TaskCommentsEndpoints.update(c, {
				comment_id: 'c1',
				comment_text: 'hi again',
			}),
		method: 'PUT',
		suffix: '/api/v2/comment/c1',
	},
	{
		path: 'taskComments.delete',
		invoke: (c) => TaskCommentsEndpoints.delete(c, { comment_id: 'c1' }),
		method: 'DELETE',
		suffix: '/api/v2/comment/c1',
	},
	{
		path: 'taskComments.threadedCreate',
		invoke: (c) =>
			TaskCommentsEndpoints.threadedCreate(c, {
				comment_id: 'c1',
				comment_text: 'reply',
			}),
		method: 'POST',
		suffix: '/api/v2/comment/c1/reply',
	},
	{
		path: 'taskComments.threadedGet',
		invoke: (c) => TaskCommentsEndpoints.threadedGet(c, { comment_id: 'c1' }),
		method: 'GET',
		suffix: '/api/v2/comment/c1/reply',
	},
	{
		path: 'customFields.accessible',
		invoke: (c) => CustomFieldsEndpoints.accessible(c, { list_id: 'list1' }),
		method: 'GET',
		suffix: '/api/v2/list/list1/field',
	},
	{
		path: 'customFields.folderFields',
		invoke: (c) =>
			CustomFieldsEndpoints.folderFields(c, { folder_id: 'folder1' }),
		method: 'GET',
		suffix: '/api/v2/folder/folder1/field',
	},
	{
		path: 'customFields.setValue',
		invoke: (c) =>
			CustomFieldsEndpoints.setValue(c, {
				task_id: 'task1',
				field_id: 'f1',
				value: 'x',
			}),
		method: 'POST',
		suffix: '/api/v2/task/task1/field/f1',
	},
	{
		path: 'customFields.removeValue',
		invoke: (c) =>
			CustomFieldsEndpoints.removeValue(c, {
				task_id: 'task1',
				field_id: 'f1',
			}),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/field/f1',
	},
	{
		path: 'views.get',
		invoke: (c) => ViewsEndpoints.get(c, { view_id: 'view1' }),
		method: 'GET',
		suffix: '/api/v2/view/view1',
	},
	{
		path: 'views.update',
		invoke: (c) =>
			ViewsEndpoints.update(c, { view_id: 'view1', name: 'View 2' }),
		method: 'PUT',
		suffix: '/api/v2/view/view1',
	},
	{
		path: 'views.delete',
		invoke: (c) => ViewsEndpoints.delete(c, { view_id: 'view1' }),
		method: 'DELETE',
		suffix: '/api/v2/view/view1',
	},
	{
		path: 'views.tasks',
		invoke: (c) => ViewsEndpoints.tasks(c, { view_id: 'view1' }),
		method: 'GET',
		suffix: '/api/v2/view/view1/task',
	},
	{
		path: 'views.chatCommentsGet',
		invoke: (c) => ViewsEndpoints.chatCommentsGet(c, { view_id: 'view1' }),
		method: 'GET',
		suffix: '/api/v2/view/view1/comment',
	},
	{
		path: 'views.chatCommentsCreate',
		invoke: (c) =>
			ViewsEndpoints.chatCommentsCreate(c, {
				view_id: 'view1',
				comment_text: 'hi',
			}),
		method: 'POST',
		suffix: '/api/v2/view/view1/comment',
	},
	{
		path: 'goals.list',
		invoke: (c) => GoalsEndpoints.list(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/goal',
	},
	{
		path: 'goals.get',
		invoke: (c) => GoalsEndpoints.get(c, { goal_id: 'goal1' }),
		method: 'GET',
		suffix: '/api/v2/goal/goal1',
	},
	{
		path: 'goals.create',
		invoke: (c) => GoalsEndpoints.create(c, { team_id: 'team1', name: 'Goal' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/goal',
	},
	{
		path: 'goals.update',
		invoke: (c) =>
			GoalsEndpoints.update(c, { goal_id: 'goal1', name: 'Goal 2' }),
		method: 'PUT',
		suffix: '/api/v2/goal/goal1',
	},
	{
		path: 'goals.delete',
		invoke: (c) => GoalsEndpoints.delete(c, { goal_id: 'goal1' }),
		method: 'DELETE',
		suffix: '/api/v2/goal/goal1',
	},
	{
		path: 'goals.keyResultsCreate',
		invoke: (c) =>
			GoalsEndpoints.keyResultsCreate(c, {
				goal_id: 'goal1',
				name: 'KR',
				owners: [1],
				type: 'number',
			}),
		method: 'POST',
		suffix: '/api/v2/goal/goal1/key_result',
	},
	{
		path: 'goals.keyResultsUpdate',
		invoke: (c) =>
			GoalsEndpoints.keyResultsUpdate(c, {
				key_result_id: 'kr1',
				note: 'note',
			}),
		method: 'PUT',
		suffix: '/api/v2/key_result/kr1',
	},
	{
		path: 'goals.keyResultsDelete',
		invoke: (c) => GoalsEndpoints.keyResultsDelete(c, { key_result_id: 'kr1' }),
		method: 'DELETE',
		suffix: '/api/v2/key_result/kr1',
	},
	{
		path: 'timeEntries.range',
		invoke: (c) => TimeEntriesEndpoints.range(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/time_entries',
	},
	{
		path: 'timeEntries.get',
		invoke: (c) =>
			TimeEntriesEndpoints.get(c, { team_id: 'team1', timer_id: 'tm1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/time_entries/tm1',
	},
	{
		path: 'timeEntries.create',
		invoke: (c) => TimeEntriesEndpoints.create(c, { team_id: 'team1' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/time_entries',
	},
	{
		path: 'timeEntries.update',
		invoke: (c) =>
			TimeEntriesEndpoints.update(c, { team_id: 'team1', timer_id: 'tm1' }),
		method: 'PUT',
		suffix: '/api/v2/team/team1/time_entries/tm1',
	},
	{
		path: 'timeEntries.delete',
		invoke: (c) =>
			TimeEntriesEndpoints.delete(c, { team_id: 'team1', timer_id: 'tm1' }),
		method: 'DELETE',
		suffix: '/api/v2/team/team1/time_entries/tm1',
	},
	{
		path: 'timeEntries.running',
		invoke: (c) => TimeEntriesEndpoints.running(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/time_entries/current',
	},
	{
		path: 'timeEntries.start',
		invoke: (c) => TimeEntriesEndpoints.start(c, { team_id: 'team1' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/time_entries/start',
	},
	{
		path: 'timeEntries.stop',
		invoke: (c) => TimeEntriesEndpoints.stop(c, { team_id: 'team1' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/time_entries/stop',
	},
	{
		path: 'timeEntries.history',
		invoke: (c) =>
			TimeEntriesEndpoints.history(c, { team_id: 'team1', timer_id: 'tm1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/time_entries/tm1/history',
	},
	{
		path: 'timeEntries.tagsGetAll',
		invoke: (c) => TimeEntriesEndpoints.tagsGetAll(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/time_entries/tags',
	},
	{
		path: 'timeEntries.tagsAdd',
		invoke: (c) =>
			TimeEntriesEndpoints.tagsAdd(c, {
				team_id: 'team1',
				tags: ['a'],
				timer_ids: ['tm1'],
			}),
		method: 'POST',
		suffix: '/api/v2/team/team1/time_entries/tags',
	},
	{
		path: 'timeEntries.tagsRemove',
		invoke: (c) =>
			TimeEntriesEndpoints.tagsRemove(c, {
				team_id: 'team1',
				tags: ['a'],
				timer_ids: ['tm1'],
			}),
		method: 'DELETE',
		suffix: '/api/v2/team/team1/time_entries/tags',
	},
	{
		path: 'timeEntries.tagsUpdate',
		invoke: (c) =>
			TimeEntriesEndpoints.tagsUpdate(c, {
				team_id: 'team1',
				name: 'a',
				new_name: 'b',
			}),
		method: 'PUT',
		suffix: '/api/v2/team/team1/time_entries/tags',
	},
	{
		path: 'docs.search',
		invoke: (c) => DocsEndpoints.search(c, { workspace_id: 'ws1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/docs',
	},
	{
		path: 'docs.create',
		invoke: (c) =>
			DocsEndpoints.create(c, { workspace_id: 'ws1', name: 'Doc' }),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/docs',
	},
	{
		path: 'docs.content',
		invoke: (c) =>
			DocsEndpoints.content(c, { workspace_id: 'ws1', doc_id: 'doc1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/docs/doc1',
	},
	{
		path: 'docs.pages',
		invoke: (c) =>
			DocsEndpoints.pages(c, { workspace_id: 'ws1', doc_id: 'doc1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/docs/doc1/pages',
	},
	{
		path: 'docs.pageListing',
		invoke: (c) =>
			DocsEndpoints.pageListing(c, { workspace_id: 'ws1', doc_id: 'doc1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/docs/doc1/page_listing',
	},
	{
		path: 'docs.pageContent',
		invoke: (c) =>
			DocsEndpoints.pageContent(c, {
				workspace_id: 'ws1',
				doc_id: 'doc1',
				page_id: 'p1',
			}),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/docs/doc1/pages/p1',
	},
	{
		path: 'docs.createPage',
		invoke: (c) =>
			DocsEndpoints.createPage(c, {
				workspace_id: 'ws1',
				doc_id: 'doc1',
				name: 'Page',
			}),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/docs/doc1/pages',
	},
	{
		path: 'docs.updatePage',
		invoke: (c) =>
			DocsEndpoints.updatePage(c, {
				workspace_id: 'ws1',
				doc_id: 'doc1',
				page_id: 'p1',
				name: 'Page 2',
			}),
		method: 'PUT',
		suffix: '/api/v3/workspaces/ws1/docs/doc1/pages/p1',
	},
	{
		path: 'chat.channelsList',
		invoke: (c) => ChatEndpoints.channelsList(c, { workspace_id: 'ws1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/channels',
	},
	{
		path: 'chat.channelsGet',
		invoke: (c) =>
			ChatEndpoints.channelsGet(c, { workspace_id: 'ws1', channel_id: 'ch1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1',
	},
	{
		path: 'chat.channelsCreate',
		invoke: (c) =>
			ChatEndpoints.channelsCreate(c, { workspace_id: 'ws1', name: 'Channel' }),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/channels',
	},
	{
		path: 'chat.channelsCreateLocation',
		invoke: (c) =>
			ChatEndpoints.channelsCreateLocation(c, {
				workspace_id: 'ws1',
				space_id: 'space1',
			}),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/channels/location',
	},
	{
		path: 'chat.channelsCreateDm',
		invoke: (c) => ChatEndpoints.channelsCreateDm(c, { workspace_id: 'ws1' }),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/channels/direct_message',
	},
	{
		path: 'chat.channelsUpdate',
		invoke: (c) =>
			ChatEndpoints.channelsUpdate(c, {
				workspace_id: 'ws1',
				channel_id: 'ch1',
				name: 'Channel 2',
			}),
		method: 'PATCH',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1',
	},
	{
		path: 'chat.channelsDelete',
		invoke: (c) =>
			ChatEndpoints.channelsDelete(c, {
				workspace_id: 'ws1',
				channel_id: 'ch1',
			}),
		method: 'DELETE',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1',
	},
	{
		path: 'chat.channelsMembers',
		invoke: (c) =>
			ChatEndpoints.channelsMembers(c, {
				workspace_id: 'ws1',
				channel_id: 'ch1',
			}),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1/members',
	},
	{
		path: 'chat.channelsFollowers',
		invoke: (c) =>
			ChatEndpoints.channelsFollowers(c, {
				workspace_id: 'ws1',
				channel_id: 'ch1',
			}),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1/followers',
	},
	{
		path: 'chat.messagesList',
		invoke: (c) =>
			ChatEndpoints.messagesList(c, { workspace_id: 'ws1', channel_id: 'ch1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1/messages',
	},
	{
		path: 'chat.messagesCreate',
		invoke: (c) =>
			ChatEndpoints.messagesCreate(c, {
				workspace_id: 'ws1',
				channel_id: 'ch1',
				type: 'message',
				content: 'hi',
			}),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/channels/ch1/messages',
	},
	{
		path: 'chat.messagesUpdate',
		invoke: (c) =>
			ChatEndpoints.messagesUpdate(c, {
				workspace_id: 'ws1',
				message_id: 'm1',
				content: 'hi again',
			}),
		method: 'PATCH',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1',
	},
	{
		path: 'chat.messagesDelete',
		invoke: (c) =>
			ChatEndpoints.messagesDelete(c, {
				workspace_id: 'ws1',
				message_id: 'm1',
			}),
		method: 'DELETE',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1',
	},
	{
		path: 'chat.repliesGet',
		invoke: (c) =>
			ChatEndpoints.repliesGet(c, { workspace_id: 'ws1', message_id: 'm1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/replies',
	},
	{
		path: 'chat.repliesCreate',
		invoke: (c) =>
			ChatEndpoints.repliesCreate(c, {
				workspace_id: 'ws1',
				message_id: 'm1',
				content: 'reply',
			}),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/replies',
	},
	{
		path: 'chat.reactionsGet',
		invoke: (c) =>
			ChatEndpoints.reactionsGet(c, { workspace_id: 'ws1', message_id: 'm1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/reactions',
	},
	{
		path: 'chat.reactionsCreate',
		invoke: (c) =>
			ChatEndpoints.reactionsCreate(c, {
				workspace_id: 'ws1',
				message_id: 'm1',
				reaction: 'thumbsup',
			}),
		method: 'POST',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/reactions',
	},
	{
		path: 'chat.reactionsDelete',
		invoke: (c) =>
			ChatEndpoints.reactionsDelete(c, {
				workspace_id: 'ws1',
				message_id: 'm1',
				reaction: 'thumbsup',
			}),
		method: 'DELETE',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/reactions/thumbsup',
	},
	{
		path: 'chat.taggedUsers',
		invoke: (c) =>
			ChatEndpoints.taggedUsers(c, { workspace_id: 'ws1', message_id: 'm1' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/chat/messages/m1/tagged_users',
	},
	{
		path: 'chat.subtypes',
		invoke: (c) =>
			ChatEndpoints.subtypes(c, { workspace_id: 'ws1', comment_type: 'post' }),
		method: 'GET',
		suffix: '/api/v3/workspaces/ws1/comments/types/post/subtypes',
	},
	{
		path: 'users.get',
		invoke: (c) => UsersEndpoints.get(c, { team_id: 'team1', user_id: 'u1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/user/u1',
	},
	{
		path: 'users.invite',
		invoke: (c) =>
			UsersEndpoints.invite(c, { team_id: 'team1', email: 'user@example.com' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/user',
	},
	{
		path: 'users.update',
		invoke: (c) =>
			UsersEndpoints.update(c, {
				team_id: 'team1',
				user_id: 'u1',
				username: 'name',
			}),
		method: 'PUT',
		suffix: '/api/v2/team/team1/user/u1',
	},
	{
		path: 'users.remove',
		invoke: (c) =>
			UsersEndpoints.remove(c, { team_id: 'team1', user_id: 'u1' }),
		method: 'DELETE',
		suffix: '/api/v2/team/team1/user/u1',
	},
	{
		path: 'guests.get',
		invoke: (c) => GuestsEndpoints.get(c, { team_id: 'team1', guest_id: 'g1' }),
		method: 'GET',
		suffix: '/api/v2/team/team1/guest/g1',
	},
	{
		path: 'guests.invite',
		invoke: (c) =>
			GuestsEndpoints.invite(c, {
				team_id: 'team1',
				email: 'guest@example.com',
			}),
		method: 'POST',
		suffix: '/api/v2/team/team1/guest',
	},
	{
		path: 'guests.update',
		invoke: (c) =>
			GuestsEndpoints.update(c, { team_id: 'team1', guest_id: 'g1' }),
		method: 'PUT',
		suffix: '/api/v2/team/team1/guest/g1',
	},
	{
		path: 'guests.remove',
		invoke: (c) =>
			GuestsEndpoints.remove(c, { team_id: 'team1', guest_id: 'g1' }),
		method: 'DELETE',
		suffix: '/api/v2/team/team1/guest/g1',
	},
	{
		path: 'guests.addToTask',
		invoke: (c) =>
			GuestsEndpoints.addToTask(c, { task_id: 'task1', guest_id: 'g1' }),
		method: 'POST',
		suffix: '/api/v2/task/task1/guest/g1',
	},
	{
		path: 'guests.removeFromTask',
		invoke: (c) =>
			GuestsEndpoints.removeFromTask(c, { task_id: 'task1', guest_id: 'g1' }),
		method: 'DELETE',
		suffix: '/api/v2/task/task1/guest/g1',
	},
	{
		path: 'guests.addToList',
		invoke: (c) =>
			GuestsEndpoints.addToList(c, { list_id: 'list1', guest_id: 'g1' }),
		method: 'POST',
		suffix: '/api/v2/list/list1/guest/g1',
	},
	{
		path: 'guests.removeFromList',
		invoke: (c) =>
			GuestsEndpoints.removeFromList(c, { list_id: 'list1', guest_id: 'g1' }),
		method: 'DELETE',
		suffix: '/api/v2/list/list1/guest/g1',
	},
	{
		path: 'guests.addToFolder',
		invoke: (c) =>
			GuestsEndpoints.addToFolder(c, { folder_id: 'folder1', guest_id: 'g1' }),
		method: 'POST',
		suffix: '/api/v2/folder/folder1/guest/g1',
	},
	{
		path: 'guests.removeFromFolder',
		invoke: (c) =>
			GuestsEndpoints.removeFromFolder(c, {
				folder_id: 'folder1',
				guest_id: 'g1',
			}),
		method: 'DELETE',
		suffix: '/api/v2/folder/folder1/guest/g1',
	},
	{
		path: 'teams.list',
		invoke: (c) => TeamsEndpoints.list(c, { team_id: 'team1' }),
		method: 'GET',
		suffix: '/api/v2/group',
	},
	{
		path: 'teams.create',
		invoke: (c) =>
			TeamsEndpoints.create(c, { team_id: 'team1', name: 'Group' }),
		method: 'POST',
		suffix: '/api/v2/team/team1/group',
	},
	{
		path: 'teams.update',
		invoke: (c) =>
			TeamsEndpoints.update(c, { group_id: 'gr1', name: 'Group 2' }),
		method: 'PUT',
		suffix: '/api/v2/group/gr1',
	},
	{
		path: 'teams.delete',
		invoke: (c) => TeamsEndpoints.delete(c, { group_id: 'gr1' }),
		method: 'DELETE',
		suffix: '/api/v2/group/gr1',
	},
	{
		path: 'workspaceAcl.update',
		invoke: (c) =>
			WorkspaceAclEndpoints.update(c, {
				workspace_id: 'ws1',
				object_type: 'list',
				object_id: 'list1',
			}),
		method: 'PATCH',
		suffix: '/api/v3/workspaces/ws1/list/list1/acls',
	},
];

describe('operation routing', () => {
	for (const entry of OPERATIONS) {
		it(`${entry.path} issues ${entry.method} ${entry.suffix}`, async () => {
			const ctx = makeCtx();
			await entry.invoke(ctx);

			expect(lastMethod).toBe(entry.method);
			expect(new URL(lastUrl).pathname).toBe(entry.suffix);
			expect(lastAuth).toBe(TOKEN);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(clickupEndpointSchemas).sort();
		const exercised = OPERATIONS.map((entry) => entry.path).sort();

		expect(exercised).toEqual(registered);
		expect(registered.length).toBe(157);
	});
});

describe('request bodies', () => {
	it('strips list_id from the task create body', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.create(ctx, { list_id: 'list1', name: 'New Task' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'New Task' });
		expect(body).not.toHaveProperty('list_id');
	});

	it('strips task_id from the task update body', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.update(ctx, { task_id: 'task1', name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
		expect(body).not.toHaveProperty('task_id');
	});

	it('sends no body on task get', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.get(ctx, { task_id: 'task1' });

		expect(lastBody).toBeUndefined();
	});

	it('wraps space tag creation in a tag object', async () => {
		const ctx = makeCtx();
		await SpacesEndpoints.tagsCreate(ctx, { space_id: 'space1', name: 'tag' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body.tag.name).toBe('tag');
	});

	it('sends dependency bodies with exactly one link side', async () => {
		const ctx = makeCtx();
		await DependenciesEndpoints.add(ctx, {
			task_id: 'task1',
			depends_on: 'task2',
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ depends_on: 'task2' });
	});
});

describe('pagination', () => {
	it('passes zero-based page through on tasks.list', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.list(ctx, { list_id: 'list1', page: 2 });

		const url = new URL(lastUrl);
		expect(url.searchParams.get('page')).toBe('2');
	});

	it('passes cursor pagination through on chat message lists', async () => {
		const ctx = makeCtx();
		await ChatEndpoints.messagesList(ctx, {
			workspace_id: 'ws1',
			channel_id: 'ch1',
			cursor: 'cursor1',
			limit: 50,
		});

		const url = new URL(lastUrl);
		expect(url.searchParams.get('cursor')).toBe('cursor1');
		expect(url.searchParams.get('limit')).toBe('50');
	});
});

describe('event log', () => {
	it('logs clickup.tasks.create with list_id only', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.create(ctx, {
			list_id: 'list1',
			name: 'Secret task title',
			description: 'Sensitive details',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'clickup.tasks.create',
			{ list_id: 'list1' },
			'completed',
		);
	});

	it('logs chat writes with workspace scope only', async () => {
		const ctx = makeCtx();
		await ChatEndpoints.messagesCreate(ctx, {
			workspace_id: 'ws1',
			channel_id: 'ch1',
			type: 'message',
			content: 'Secret content',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'clickup.chat.messagesCreate',
			{ workspace_id: 'ws1' },
			'completed',
		);
	});
});
