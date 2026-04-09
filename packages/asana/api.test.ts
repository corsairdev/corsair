import 'dotenv/config';
import { makeAsanaRequest } from './client';
import { AsanaEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.ASANA_ACCESS_TOKEN!;
let TEST_WORKSPACE_GID: string | undefined;
let TEST_PROJECT_GID: string | undefined;
let TEST_TASK_GID: string | undefined;
let TEST_SECTION_GID: string | undefined;
let TEST_USER_GID: string | undefined;
let TEST_TEAM_GID: string | undefined;
let TEST_TAG_GID: string | undefined;
let TEST_STORY_GID: string | undefined;

beforeAll(async () => {
	const meResult = await makeAsanaRequest<{
		data: { gid: string; workspaces: Array<{ gid: string }> };
	}>('users/me', TEST_TOKEN, { method: 'GET' });
	TEST_USER_GID = meResult.data?.gid;
	TEST_WORKSPACE_GID = meResult.data?.workspaces?.[0]?.gid;

	if (TEST_WORKSPACE_GID) {
		const projectsResult = await makeAsanaRequest<{
			data: Array<{ gid: string }>;
		}>(`workspaces/${TEST_WORKSPACE_GID}/projects`, TEST_TOKEN, {
			method: 'GET',
			query: { limit: 1 },
		});
		TEST_PROJECT_GID = projectsResult.data?.[0]?.gid;
	}

	if (TEST_PROJECT_GID) {
		const tasksResult = await makeAsanaRequest<{
			data: Array<{ gid: string }>;
		}>(`projects/${TEST_PROJECT_GID}/tasks`, TEST_TOKEN, {
			method: 'GET',
			query: { limit: 1 },
		});
		TEST_TASK_GID = tasksResult.data?.[0]?.gid;

		const sectionsResult = await makeAsanaRequest<{
			data: Array<{ gid: string }>;
		}>(`projects/${TEST_PROJECT_GID}/sections`, TEST_TOKEN, {
			method: 'GET',
			query: { limit: 1 },
		});
		TEST_SECTION_GID = sectionsResult.data?.[0]?.gid;
	}

	if (TEST_WORKSPACE_GID) {
		const teamsResult = await makeAsanaRequest<{
			data: Array<{ gid: string }>;
		}>(`workspaces/${TEST_WORKSPACE_GID}/teams`, TEST_TOKEN, {
			method: 'GET',
			query: { limit: 1 },
		});
		TEST_TEAM_GID = teamsResult.data?.[0]?.gid;

		const tagsResult = await makeAsanaRequest<{ data: Array<{ gid: string }> }>(
			`workspaces/${TEST_WORKSPACE_GID}/tags`,
			TEST_TOKEN,
			{ method: 'GET', query: { limit: 1 } },
		);
		TEST_TAG_GID = tagsResult.data?.[0]?.gid;
	}

	if (TEST_TASK_GID) {
		const storiesResult = await makeAsanaRequest<{
			data: Array<{ gid: string }>;
		}>(`tasks/${TEST_TASK_GID}/stories`, TEST_TOKEN, {
			method: 'GET',
			query: { limit: 1 },
		});
		TEST_STORY_GID = storiesResult.data?.[0]?.gid;
	}
});

describe('Asana API Type Tests', () => {
	describe('users', () => {
		it('usersGetCurrent returns correct type', async () => {
			const response = await makeAsanaRequest<unknown>('users/me', TEST_TOKEN, {
				method: 'GET',
			});
			AsanaEndpointOutputSchemas.usersGetCurrent.parse(response);
		});

		it('usersGet returns correct type', async () => {
			if (!TEST_USER_GID) {
				return console.warn('Skipping usersGet — no user GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`users/${TEST_USER_GID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.usersGet.parse(response);
		});

		it('usersList returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping usersList — no workspace GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`workspaces/${TEST_WORKSPACE_GID}/users`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.usersListForWorkspace.parse(response);
		});
	});

	describe('workspaces', () => {
		it('workspacesList returns correct type', async () => {
			const response = await makeAsanaRequest<unknown>(
				'workspaces',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.workspacesList.parse(response);
		});

		it('workspacesGet returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping workspacesGet — no workspace GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`workspaces/${TEST_WORKSPACE_GID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.workspacesGet.parse(response);
		});
	});

	describe('projects', () => {
		let createdProjectGid: string | undefined;

		it('workspaceProjectsList returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn(
					'Skipping workspaceProjectsList — no workspace GID',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`workspaces/${TEST_WORKSPACE_GID}/projects`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.workspaceProjectsList.parse(response);
		});

		it('projectsCreate returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping projectsCreate — no workspace GID');
			}
			const bodyData: Record<string, unknown> = {
				name: `test-project-${Date.now()}`,
				workspace: TEST_WORKSPACE_GID,
			};
			if (TEST_TEAM_GID) {
				bodyData.team = TEST_TEAM_GID;
			}
			const response = await makeAsanaRequest<{ data: { gid: string } }>(
				`projects`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { data: bodyData },
				},
			);
			AsanaEndpointOutputSchemas.projectsCreate.parse(response);
			createdProjectGid = response.data?.gid;
		});

		it('projectsGet returns correct type', async () => {
			if (!TEST_PROJECT_GID) {
				return console.warn('Skipping projectsGet — no project GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${TEST_PROJECT_GID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.projectsGet.parse(response);
		});

		it('projectsUpdate returns correct type', async () => {
			const gid = createdProjectGid ?? TEST_PROJECT_GID;
			if (!gid) {
				return console.warn('Skipping projectsUpdate — no project GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${gid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { data: { notes: 'Updated by api.test.ts' } },
				},
			);
			AsanaEndpointOutputSchemas.projectsUpdate.parse(response);
		});

		it('projectsGetTaskCounts returns correct type', async () => {
			if (!TEST_PROJECT_GID) {
				return console.warn('Skipping projectsGetTaskCounts — no project GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${TEST_PROJECT_GID}/task_counts`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.projectsGetTaskCounts.parse(response);
		});

		it('projectsDelete returns correct type', async () => {
			if (!createdProjectGid) {
				return console.warn(
					'Skipping projectsDelete — no created project to clean up',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${createdProjectGid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			AsanaEndpointOutputSchemas.projectsDelete.parse(response);
		});
	});

	describe('sections', () => {
		let createdSectionGid: string | undefined;

		it('sectionsList returns correct type', async () => {
			if (!TEST_PROJECT_GID) {
				return console.warn('Skipping sectionsList — no project GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${TEST_PROJECT_GID}/sections`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.sectionsList.parse(response);
		});

		it('sectionsCreate returns correct type', async () => {
			if (!TEST_PROJECT_GID) {
				return console.warn('Skipping sectionsCreate — no project GID');
			}
			const response = await makeAsanaRequest<{ data: { gid: string } }>(
				`projects/${TEST_PROJECT_GID}/sections`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { data: { name: `test-section-${Date.now()}` } },
				},
			);
			AsanaEndpointOutputSchemas.sectionsCreate.parse(response);
			createdSectionGid = response.data?.gid;
		});

		it('sectionsGet returns correct type', async () => {
			const gid = createdSectionGid ?? TEST_SECTION_GID;
			if (!gid) {
				return console.warn('Skipping sectionsGet — no section GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`sections/${gid}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.sectionsGet.parse(response);
		});

		it('sectionsUpdate returns correct type', async () => {
			if (!createdSectionGid) {
				return console.warn(
					'Skipping sectionsUpdate — no created section to update',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`sections/${createdSectionGid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { data: { name: `test-section-updated-${Date.now()}` } },
				},
			);
			AsanaEndpointOutputSchemas.sectionsUpdate.parse(response);
		});

		it('sectionsDelete returns correct type', async () => {
			if (!createdSectionGid) {
				return console.warn(
					'Skipping sectionsDelete — no created section to clean up',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`sections/${createdSectionGid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			AsanaEndpointOutputSchemas.sectionsDelete.parse(response);
		});
	});

	describe('tasks', () => {
		let createdTaskGid: string | undefined;

		it('tasksList returns correct type', async () => {
			if (!TEST_PROJECT_GID) {
				return console.warn('Skipping tasksList — no project GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`projects/${TEST_PROJECT_GID}/tasks`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.projectsGetTasks.parse(response);
		});

		it('tasksCreate returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping tasksCreate — no workspace GID');
			}
			const body: Record<string, unknown> = {
				data: {
					name: `test-task-${Date.now()}`,
					workspace: TEST_WORKSPACE_GID,
				},
			};
			if (TEST_PROJECT_GID) {
				// any/unknown cast: body.data is typed as a specific shape, but we need to add an optional field dynamically
				(body.data as Record<string, unknown>).projects = [TEST_PROJECT_GID];
			}
			const response = await makeAsanaRequest<{ data: { gid: string } }>(
				'tasks',
				TEST_TOKEN,
				{ method: 'POST', body },
			);
			AsanaEndpointOutputSchemas.tasksCreate.parse(response);
			createdTaskGid = response.data?.gid;
		});

		it('tasksGet returns correct type', async () => {
			const gid = createdTaskGid ?? TEST_TASK_GID;
			if (!gid) {
				return console.warn('Skipping tasksGet — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${gid}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.tasksGet.parse(response);
		});

		it('tasksUpdate returns correct type', async () => {
			const gid = createdTaskGid ?? TEST_TASK_GID;
			if (!gid) {
				return console.warn('Skipping tasksUpdate — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${gid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { data: { notes: 'Updated by api.test.ts' } },
				},
			);
			AsanaEndpointOutputSchemas.tasksUpdate.parse(response);
		});

		it('tasksGetSubtasks returns correct type', async () => {
			const gid = createdTaskGid ?? TEST_TASK_GID;
			if (!gid) {
				return console.warn('Skipping tasksGetSubtasks — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${gid}/subtasks`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.tasksGetSubtasks.parse(response);
		});

		it('tasksGetStories returns correct type', async () => {
			const gid = createdTaskGid ?? TEST_TASK_GID;
			if (!gid) {
				return console.warn('Skipping tasksGetStories — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${gid}/stories`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.tasksGetStories.parse(response);
		});

		it('tasksGetAttachments returns correct type', async () => {
			const gid = createdTaskGid ?? TEST_TASK_GID;
			if (!gid) {
				return console.warn('Skipping tasksGetAttachments — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${gid}/attachments`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.tasksGetAttachments.parse(response);
		});

		it('tasksDelete returns correct type', async () => {
			if (!createdTaskGid) {
				return console.warn(
					'Skipping tasksDelete — no created task to clean up',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${createdTaskGid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			AsanaEndpointOutputSchemas.tasksDelete.parse(response);
		});
	});

	describe('teams', () => {
		it('teamsListForWorkspace returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn(
					'Skipping teamsListForWorkspace — no workspace GID',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`workspaces/${TEST_WORKSPACE_GID}/teams`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.teamsListForWorkspace.parse(response);
		});

		it('teamsGet returns correct type', async () => {
			if (!TEST_TEAM_GID) {
				return console.warn('Skipping teamsGet — no team GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`teams/${TEST_TEAM_GID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.teamsGet.parse(response);
		});

		it('teamsListForUser returns correct type', async () => {
			if (!TEST_USER_GID || !TEST_WORKSPACE_GID) {
				return console.warn(
					'Skipping teamsListForUser — missing user or workspace GID',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`users/${TEST_USER_GID}/teams`,
				TEST_TOKEN,
				{ method: 'GET', query: { organization: TEST_WORKSPACE_GID } },
			);
			AsanaEndpointOutputSchemas.teamsListForUser.parse(response);
		});

		it('teamMembershipsListForTeam returns correct type', async () => {
			if (!TEST_TEAM_GID) {
				return console.warn(
					'Skipping teamMembershipsListForTeam — no team GID',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`teams/${TEST_TEAM_GID}/team_memberships`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.teamMembershipsListForTeam.parse(response);
		});
	});

	describe('tags', () => {
		let createdTagGid: string | undefined;

		it('tagsListForWorkspace returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping tagsListForWorkspace — no workspace GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`workspaces/${TEST_WORKSPACE_GID}/tags`,
				TEST_TOKEN,
				{ method: 'GET', query: { limit: 5 } },
			);
			AsanaEndpointOutputSchemas.tagsListForWorkspace.parse(response);
		});

		it('tagsCreate returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping tagsCreate — no workspace GID');
			}
			const response = await makeAsanaRequest<{ data: { gid: string } }>(
				`workspaces/${TEST_WORKSPACE_GID}/tags`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { data: { name: `test-tag-${Date.now()}` } },
				},
			);
			AsanaEndpointOutputSchemas.tagsCreate.parse(response);
			createdTagGid = response.data?.gid;
		});

		it('tagsGet returns correct type', async () => {
			const gid = createdTagGid ?? TEST_TAG_GID;
			if (!gid) {
				return console.warn('Skipping tagsGet — no tag GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tags/${gid}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.tagsGet.parse(response);
		});

		it('tagsUpdate returns correct type', async () => {
			if (!createdTagGid) {
				return console.warn('Skipping tagsUpdate — no created tag to update');
			}
			const response = await makeAsanaRequest<unknown>(
				`tags/${createdTagGid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { data: { notes: 'Updated by api.test.ts' } },
				},
			);
			AsanaEndpointOutputSchemas.tagsUpdate.parse(response);
		});

		it('tagsDelete returns correct type', async () => {
			if (!createdTagGid) {
				return console.warn('Skipping tagsDelete — no created tag to clean up');
			}
			const response = await makeAsanaRequest<unknown>(
				`tags/${createdTagGid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			AsanaEndpointOutputSchemas.tagsDelete.parse(response);
		});
	});

	describe('stories', () => {
		let createdCommentGid: string | undefined;

		it('storiesListForTask returns correct type', async () => {
			if (!TEST_TASK_GID) {
				return console.warn('Skipping storiesListForTask — no task GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`tasks/${TEST_TASK_GID}/stories`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.storiesListForTask.parse(response);
		});

		it('storiesCreateComment returns correct type', async () => {
			if (!TEST_TASK_GID) {
				return console.warn('Skipping storiesCreateComment — no task GID');
			}
			const response = await makeAsanaRequest<{ data: { gid: string } }>(
				`tasks/${TEST_TASK_GID}/stories`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { data: { text: 'Test comment from api.test.ts' } },
				},
			);
			AsanaEndpointOutputSchemas.storiesCreateComment.parse(response);
			createdCommentGid = response.data?.gid;
		});

		it('storiesGet returns correct type', async () => {
			const gid = createdCommentGid ?? TEST_STORY_GID;
			if (!gid) {
				return console.warn('Skipping storiesGet — no story GID');
			}
			const response = await makeAsanaRequest<unknown>(
				`stories/${gid}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			AsanaEndpointOutputSchemas.storiesGet.parse(response);
		});

		it('storiesUpdate returns correct type', async () => {
			if (!createdCommentGid) {
				return console.warn(
					'Skipping storiesUpdate — no created comment to update',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`stories/${createdCommentGid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { data: { text: 'Updated comment from api.test.ts' } },
				},
			);
			AsanaEndpointOutputSchemas.storiesUpdate.parse(response);
		});

		it('storiesDelete returns correct type', async () => {
			if (!createdCommentGid) {
				return console.warn(
					'Skipping storiesDelete — no created comment to clean up',
				);
			}
			const response = await makeAsanaRequest<unknown>(
				`stories/${createdCommentGid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			AsanaEndpointOutputSchemas.storiesDelete.parse(response);
		});
	});

	describe('webhooks management', () => {
		it('webhooksGetList returns correct type', async () => {
			if (!TEST_WORKSPACE_GID) {
				return console.warn('Skipping webhooksGetList — no workspace GID');
			}
			const response = await makeAsanaRequest<unknown>('webhooks', TEST_TOKEN, {
				method: 'GET',
				query: { workspace: TEST_WORKSPACE_GID },
			});
			AsanaEndpointOutputSchemas.webhooksGetList.parse(response);
		});
	});
});
