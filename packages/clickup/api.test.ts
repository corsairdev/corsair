/**
 * Live ClickUp API tests. These run against the real API with a personal
 * API token and are skipped in CI when CLICKUP_API_KEY
 * is unset. Setup provisions an isolated `corsair-test-*` Space/Folder/List/
 * Task chain (deleted in afterAll); all assertions validate responses with
 * the zod output schemas.
 */
import { ApiError } from 'corsair/http';
import { makeClickupRequest } from './client';
import type {
	ChatChannelsListResponse,
	CustomFieldsAccessibleResponse,
	DocsSearchResponse,
	FoldersCreateResponse,
	GoalsListResponse,
	ListsCreateResponse,
	SpacesCreateResponse,
	SpacesListResponse,
	TaskCommentsGetResponse,
	TasksCreateResponse,
	TasksFilteredTeamResponse,
	TasksGetResponse,
	TasksListResponse,
	TasksTemplatesResponse,
	TeamsListResponse,
	TimeEntriesRangeResponse,
	TimeEntriesRunningResponse,
	TimeEntryTagsGetAllResponse,
	ViewsTasksResponse,
	WorkspacesAuthorizedUserResponse,
	WorkspacesCustomRolesResponse,
	WorkspacesEverythingViewsGetResponse,
	WorkspacesGetResponse,
	WorkspacesPlanResponse,
	WorkspacesSharedHierarchyResponse,
	WorkspacesTeamFieldsResponse,
} from './endpoints/types';
import { ClickupEndpointOutputSchemas } from './endpoints/types';

const LIVE_TOKEN: string | undefined = process.env.CLICKUP_API_KEY;

if (LIVE_TOKEN === undefined) {
	describe.skip('ClickUp live API (set CLICKUP_API_KEY to run)', () => {
		it('placeholder', () => {
			expect(true).toBe(true);
		});
	});
} else {
	const token: string = LIVE_TOKEN;

	describe('ClickUp live API', () => {
		let teamId = '';
		let spaceId = '';
		let folderId = '';
		let listId = '';
		let taskId = '';
		let workspaceId = '';

		beforeAll(async () => {
			const teams = await makeClickupRequest<WorkspacesGetResponse>(
				'team',
				token,
				{ method: 'GET' },
			);
			const parsedTeams =
				ClickupEndpointOutputSchemas.workspacesGet.parse(teams);
			const firstTeam = parsedTeams.teams?.[0];
			if (firstTeam === undefined) {
				throw new Error('Live tests need at least one accessible Workspace');
			}
			teamId = firstTeam.id;
			workspaceId = firstTeam.id;

			const stamp = Date.now();
			const space = await makeClickupRequest<SpacesCreateResponse>(
				`team/${teamId}/space`,
				token,
				{ method: 'POST', body: { name: `corsair-test-space-${stamp}` } },
			);
			spaceId = ClickupEndpointOutputSchemas.spacesCreate.parse(space).id;

			const folder = await makeClickupRequest<FoldersCreateResponse>(
				`space/${spaceId}/folder`,
				token,
				{ method: 'POST', body: { name: `corsair-test-folder-${stamp}` } },
			);
			folderId = ClickupEndpointOutputSchemas.foldersCreate.parse(folder).id;

			const list = await makeClickupRequest<ListsCreateResponse>(
				`folder/${folderId}/list`,
				token,
				{ method: 'POST', body: { name: `corsair-test-list-${stamp}` } },
			);
			listId = ClickupEndpointOutputSchemas.listsCreate.parse(list).id;

			const task = await makeClickupRequest<TasksCreateResponse>(
				`list/${listId}/task`,
				token,
				{ method: 'POST', body: { name: `corsair-test-task-${stamp}` } },
			);
			taskId = ClickupEndpointOutputSchemas.tasksCreate.parse(task).id;
		});

		afterAll(async () => {
			if (taskId !== '') {
				try {
					await makeClickupRequest(`task/${taskId}`, token, {
						method: 'DELETE',
					});
				} catch (error) {
					console.warn('Cleanup: failed to delete test task', error);
				}
			}
			if (listId !== '') {
				try {
					await makeClickupRequest(`list/${listId}`, token, {
						method: 'DELETE',
					});
				} catch (error) {
					console.warn('Cleanup: failed to delete test list', error);
				}
			}
			if (folderId !== '') {
				try {
					await makeClickupRequest(`folder/${folderId}`, token, {
						method: 'DELETE',
					});
				} catch (error) {
					console.warn('Cleanup: failed to delete test folder', error);
				}
			}
			if (spaceId !== '') {
				try {
					await makeClickupRequest(`space/${spaceId}`, token, {
						method: 'DELETE',
					});
				} catch (error) {
					console.warn('Cleanup: failed to delete test space', error);
				}
			}
		});

		it('workspacesGet returns workspaces', async () => {
			const response = await makeClickupRequest<WorkspacesGetResponse>(
				'team',
				token,
				{ method: 'GET' },
			);

			const parsed = ClickupEndpointOutputSchemas.workspacesGet.parse(response);
			expect(parsed.teams?.length).toBeGreaterThan(0);
		});

		it('workspacesAuthorizedUser returns the caller', async () => {
			const response =
				await makeClickupRequest<WorkspacesAuthorizedUserResponse>(
					'user',
					token,
					{ method: 'GET' },
				);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesAuthorizedUser.parse(response);
			expect(parsed).toBeDefined();
		});

		it('workspacesPlan returns the workspace plan', async () => {
			const response = await makeClickupRequest<WorkspacesPlanResponse>(
				`team/${teamId}/plan`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesPlan.parse(response);
			expect(parsed).toBeDefined();
		});

		it('workspacesSharedHierarchy returns shared items', async () => {
			const response =
				await makeClickupRequest<WorkspacesSharedHierarchyResponse>(
					`team/${teamId}/shared`,
					token,
					{ method: 'GET' },
				);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesSharedHierarchy.parse(response);
			expect(parsed).toBeDefined();
		});

		it('workspacesCustomRoles returns roles', async () => {
			const response = await makeClickupRequest<WorkspacesCustomRolesResponse>(
				`team/${teamId}/customroles`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesCustomRoles.parse(response);
			expect(parsed).toBeDefined();
		});

		it('workspacesTeamFields returns team fields', async () => {
			const response = await makeClickupRequest<WorkspacesTeamFieldsResponse>(
				`team/${teamId}/field`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesTeamFields.parse(response);
			expect(parsed).toBeDefined();
		});

		it('workspacesEverythingViewsGet returns views', async () => {
			const response =
				await makeClickupRequest<WorkspacesEverythingViewsGetResponse>(
					`team/${teamId}/view`,
					token,
					{ method: 'GET' },
				);

			const parsed =
				ClickupEndpointOutputSchemas.workspacesEverythingViewsGet.parse(
					response,
				);
			expect(parsed).toBeDefined();
		});

		it('spacesList and spacesGet return spaces', async () => {
			const listed = await makeClickupRequest<SpacesListResponse>(
				`team/${teamId}/space`,
				token,
				{ method: 'GET' },
			);
			const parsedList = ClickupEndpointOutputSchemas.spacesList.parse(listed);
			expect(parsedList.spaces?.length).toBeGreaterThan(0);

			const single = await makeClickupRequest<SpacesListResponse>(
				`space/${spaceId}`,
				token,
				{ method: 'GET' },
			);
			ClickupEndpointOutputSchemas.spacesGet.parse(single);
			expect(single).toBeDefined();
		});

		it('tasksList pages through list tasks', async () => {
			const response = await makeClickupRequest<TasksListResponse>(
				`list/${listId}/task`,
				token,
				{ method: 'GET', query: { page: 0 } },
			);

			const parsed = ClickupEndpointOutputSchemas.tasksList.parse(response);
			expect(parsed.tasks?.length).toBeGreaterThan(0);
		});

		it('tasksFilteredTeam filters workspace tasks', async () => {
			const response = await makeClickupRequest<TasksFilteredTeamResponse>(
				`team/${teamId}/task`,
				token,
				{ method: 'GET', query: { page: 0, 'list_ids[]': [listId] } },
			);

			const parsed =
				ClickupEndpointOutputSchemas.tasksFilteredTeam.parse(response);
			expect(parsed).toBeDefined();
		});

		it('tasksGet returns the discovered task', async () => {
			const response = await makeClickupRequest<TasksGetResponse>(
				`task/${taskId}`,
				token,
				{ method: 'GET' },
			);

			const parsed = ClickupEndpointOutputSchemas.tasksGet.parse(response);
			expect(parsed.id).toBe(taskId);
		});

		it('tasksMembers returns explicit task members', async () => {
			const response = await makeClickupRequest<TasksGetResponse>(
				`task/${taskId}/member`,
				token,
				{ method: 'GET' },
			);

			const parsed = ClickupEndpointOutputSchemas.tasksMembers.parse(response);
			expect(parsed).toBeDefined();
		});

		it('tasksTimeInStatus returns status durations', async () => {
			try {
				const response = await makeClickupRequest<TasksGetResponse>(
					`task/${taskId}/time_in_status`,
					token,
					{ method: 'GET' },
				);

				const parsed =
					ClickupEndpointOutputSchemas.tasksTimeInStatus.parse(response);
				expect(parsed).toBeDefined();
			} catch (error) {
				if (error instanceof ApiError && error.status === 403) {
					console.warn('Skipped: Total time in Status ClickApp is not enabled');
					return;
				}
				throw error;
			}
		});

		it('tasksTemplates returns workspace templates', async () => {
			const response = await makeClickupRequest<TasksTemplatesResponse>(
				`team/${teamId}/taskTemplate`,
				token,
				{ method: 'GET', query: { page: 0 } },
			);

			const parsed =
				ClickupEndpointOutputSchemas.tasksTemplates.parse(response);
			expect(parsed).toBeDefined();
		});

		it('taskCommentsGet returns task comments', async () => {
			const response = await makeClickupRequest<TaskCommentsGetResponse>(
				`task/${taskId}/comment`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.taskCommentsGet.parse(response);
			expect(parsed).toBeDefined();
		});

		it('customFieldsAccessible returns list fields', async () => {
			const response = await makeClickupRequest<CustomFieldsAccessibleResponse>(
				`list/${listId}/field`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.customFieldsAccessible.parse(response);
			expect(parsed).toBeDefined();
		});

		it('spacesTagsGet returns space tags', async () => {
			const response = await makeClickupRequest<SpacesListResponse>(
				`space/${spaceId}/tag`,
				token,
				{ method: 'GET' },
			);

			const parsed = ClickupEndpointOutputSchemas.spacesTagsGet.parse(response);
			expect(parsed).toBeDefined();
		});

		it('goalsList returns workspace goals', async () => {
			const response = await makeClickupRequest<GoalsListResponse>(
				`team/${teamId}/goal`,
				token,
				{ method: 'GET' },
			);

			const parsed = ClickupEndpointOutputSchemas.goalsList.parse(response);
			expect(parsed).toBeDefined();
		});

		it('timeEntriesRange returns recent entries', async () => {
			const response = await makeClickupRequest<TimeEntriesRangeResponse>(
				`team/${teamId}/time_entries`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.timeEntriesRange.parse(response);
			expect(parsed).toBeDefined();
		});

		it('timeEntriesRunning returns the current timer state', async () => {
			const response = await makeClickupRequest<TimeEntriesRunningResponse>(
				`team/${teamId}/time_entries/current`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.timeEntriesRunning.parse(response);
			expect(parsed).toBeDefined();
		});

		it('timeEntryTagsGetAll returns entry tags', async () => {
			const response = await makeClickupRequest<TimeEntryTagsGetAllResponse>(
				`team/${teamId}/time_entries/tags`,
				token,
				{ method: 'GET' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.timeEntryTagsGetAll.parse(response);
			expect(parsed).toBeDefined();
		});

		it('docsSearch returns workspace docs', async () => {
			const response = await makeClickupRequest<DocsSearchResponse>(
				`workspaces/${workspaceId}/docs`,
				token,
				{ method: 'GET', version: 'v3' },
			);

			const parsed = ClickupEndpointOutputSchemas.docsSearch.parse(response);
			expect(parsed).toBeDefined();
		});

		it('chatChannelsList returns workspace channels', async () => {
			const response = await makeClickupRequest<ChatChannelsListResponse>(
				`workspaces/${workspaceId}/chat/channels`,
				token,
				{ method: 'GET', version: 'v3' },
			);

			const parsed =
				ClickupEndpointOutputSchemas.chatChannelsList.parse(response);
			expect(parsed).toBeDefined();
		});

		it('teamsList returns user groups', async () => {
			const response = await makeClickupRequest<TeamsListResponse>(
				'group',
				token,
				{ method: 'GET', query: { team_id: teamId } },
			);

			const parsed = ClickupEndpointOutputSchemas.teamsList.parse(response);
			expect(parsed).toBeDefined();
		});

		it('viewsTasks pages through an everything-level view when present', async () => {
			const views =
				await makeClickupRequest<WorkspacesEverythingViewsGetResponse>(
					`team/${teamId}/view`,
					token,
					{ method: 'GET' },
				);
			const parsedViews =
				ClickupEndpointOutputSchemas.workspacesEverythingViewsGet.parse(views);
			const candidates = parsedViews.views ?? [];
			for (const candidate of candidates) {
				try {
					const tasks = await makeClickupRequest<ViewsTasksResponse>(
						`view/${candidate.id}/task`,
						token,
						{ method: 'GET', query: { page: 0 } },
					);
					const parsed = ClickupEndpointOutputSchemas.viewsTasks.parse(tasks);
					expect(parsed).toBeDefined();
					return;
				} catch (error) {
					if (
						error instanceof ApiError &&
						(error.status === 400 || error.status === 404)
					) {
						continue;
					}
					throw error;
				}
			}
		});
	});
}
