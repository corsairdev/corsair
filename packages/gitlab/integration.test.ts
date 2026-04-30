import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { GitlabAPIError } from './client';
import { gitlab } from './index';

async function createGitlabClient() {
	const token = process.env.GITLAB_TOKEN;
	const projectId = process.env.TEST_GITLAB_PROJECT_ID;
	if (!token || !projectId) {
		return null;
	}

	const baseUrl = process.env.TEST_GITLAB_BASE_URL;

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'gitlab');

	const corsair = createCorsair({
		plugins: [
			gitlab({
				authType: 'api_key',
				key: token,
				baseUrl,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb, projectId };
}

describe('GitLab plugin integration', () => {
	it('users endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const currentUser = await corsair.gitlab.api.users.getCurrentUser({});

		expect(currentUser).toBeDefined();
		expect(currentUser.id).toBeDefined();
		expect(currentUser.username).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const getCurrentUserEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.users.getCurrentUser' },
		});

		expect(getCurrentUserEvents.length).toBeGreaterThan(0);

		const userFromDb = await corsair.gitlab.db.users.findByEntityId(
			String(currentUser.id),
		);
		expect(userFromDb).not.toBeNull();
		expect(userFromDb?.data.id).toBe(currentUser.id);
		expect(userFromDb?.data.username).toBe(currentUser.username);

		const listInput = {
			per_page: 5,
		};

		const usersList = await corsair.gitlab.api.users.list(listInput);

		expect(usersList).toBeDefined();

		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.users.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		testDb.cleanup();
	});

	it('projects endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const listInput = {
			membership: true,
			per_page: 5,
		};

		const projectsList = await corsair.gitlab.api.projects.list(listInput);

		expect(projectsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.projects.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const getInput = {
			project_id: projectId,
		};

		const project = await corsair.gitlab.api.projects.get(getInput);

		expect(project).toBeDefined();
		expect(project.id).toBeDefined();

		const getEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.projects.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const projectFromDb = await corsair.gitlab.db.projects.findByEntityId(
			String(project.id),
		);
		expect(projectFromDb).not.toBeNull();
		expect(projectFromDb?.data.id).toBe(project.id);
		expect(projectFromDb?.data.name).toBe(project.name);

		testDb.cleanup();
	});

	it('issues endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const listInput = {
			project_id: projectId,
			state: 'all' as const,
			per_page: 10,
		};

		const issuesList = await corsair.gitlab.api.issues.list(listInput);

		const listedIssues = Array.isArray(issuesList) ? issuesList : [];

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const issueTitle = `Corsair test issue ${Date.now()}`;
		const createInput = {
			project_id: projectId,
			title: issueTitle,
			description: 'Created by Corsair integration test suite',
		};

		const createdIssue = await corsair.gitlab.api.issues.create(createInput);

		expect(createdIssue).toBeDefined();
		expect(createdIssue.iid).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const issueFromDb = await corsair.gitlab.db.issues.findByEntityId(
			String(createdIssue.id),
		);
		expect(issueFromDb).not.toBeNull();
		expect(issueFromDb?.data.id).toBe(createdIssue.id);
		expect(issueFromDb?.data.title).toBe(createdIssue.title);

		const updateInput = {
			project_id: projectId,
			issue_iid: createdIssue.iid,
			title: `${issueTitle} updated`,
		};

		const updatedIssue = await corsair.gitlab.api.issues.update(updateInput);

		expect(updatedIssue).toBeDefined();

		const updateEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.update' },
		});

		expect(updateEvents.length).toBeGreaterThan(0);
		const updateEvent = updateEvents[updateEvents.length - 1]!;
		const updateEventPayload =
			typeof updateEvent.payload === 'string'
				? JSON.parse(updateEvent.payload)
				: updateEvent.payload;
		expect(updateEventPayload).toMatchObject(updateInput);

		const updatedIssueFromDb = await corsair.gitlab.db.issues.findByEntityId(
			String(createdIssue.id),
		);
		expect(updatedIssueFromDb).not.toBeNull();
		expect(updatedIssueFromDb?.data.title).toBe(updatedIssue.title);

		const getInput = {
			project_id: projectId,
			issue_iid: createdIssue.iid,
		};

		const fetchedIssue = await corsair.gitlab.api.issues.get(getInput);

		expect(fetchedIssue).toBeDefined();

		const getEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const noteInput = {
			project_id: projectId,
			issue_iid: createdIssue.iid,
			body: `Corsair test comment ${Date.now()}`,
		};

		const createdNote = await corsair.gitlab.api.issues.createNote(noteInput);

		expect(createdNote).toBeDefined();

		const noteEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.createNote' },
		});

		expect(noteEvents.length).toBeGreaterThan(0);
		const noteEvent = noteEvents[noteEvents.length - 1]!;
		const noteEventPayload =
			typeof noteEvent.payload === 'string'
				? JSON.parse(noteEvent.payload)
				: noteEvent.payload;
		expect(noteEventPayload).toMatchObject(noteInput);

		const notesListInput = {
			project_id: projectId,
			issue_iid: createdIssue.iid,
		};

		const notesList = await corsair.gitlab.api.issues.listNotes(notesListInput);

		expect(notesList).toBeDefined();
		expect(Array.isArray(notesList)).toBe(true);

		const notesListEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.issues.listNotes' },
		});

		expect(notesListEvents.length).toBeGreaterThan(0);

		await corsair.gitlab.api.issues.update({
			project_id: projectId,
			issue_iid: createdIssue.iid,
			state_event: 'close',
		});

		const issuesCount = await corsair.gitlab.db.issues.count();
		expect(issuesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('merge request endpoints interact with API and DB when MRs exist', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const listInput = {
			project_id: projectId,
			state: 'all' as const,
			per_page: 10,
		};

		const mrList = await corsair.gitlab.api.mergeRequests.list(listInput);

		const mrsArray = Array.isArray(mrList) ? mrList : [];

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.mergeRequests.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (mrsArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstMr = mrsArray[0]!;

		const getInput = {
			project_id: projectId,
			merge_request_iid: firstMr.iid,
		};

		const mr = await corsair.gitlab.api.mergeRequests.get(getInput);

		expect(mr).toBeDefined();

		const getEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.mergeRequests.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const mrFromDb = await corsair.gitlab.db.mergeRequests.findByEntityId(
			String(firstMr.id),
		);
		expect(mrFromDb).not.toBeNull();
		expect(mrFromDb?.data.id).toBe(firstMr.id);
		expect(mrFromDb?.data.iid).toBe(firstMr.iid);

		const notesInput = {
			project_id: projectId,
			merge_request_iid: firstMr.iid,
			per_page: 5,
		};

		const mrNotes =
			await corsair.gitlab.api.mergeRequests.listNotes(notesInput);

		expect(mrNotes).toBeDefined();

		const notesEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.mergeRequests.listNotes' },
		});

		expect(notesEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('branches and commits endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const branchesListInput = {
			project_id: projectId,
			per_page: 10,
		};

		const branches = await corsair.gitlab.api.branches.list(branchesListInput);

		expect(branches).toBeDefined();
		expect(Array.isArray(branches)).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const branchListEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.branches.list' },
		});

		expect(branchListEvents.length).toBeGreaterThan(0);

		const branchesArray = Array.isArray(branches) ? branches : [];
		if (branchesArray.length > 0) {
			const firstBranch = branchesArray[0]!;

			const branchGetInput = {
				project_id: projectId,
				branch: firstBranch.name,
			};

			const branch = await corsair.gitlab.api.branches.get(branchGetInput);

			expect(branch).toBeDefined();
			expect(branch.name).toBe(firstBranch.name);

			const branchGetEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.branches.get' },
			});

			expect(branchGetEvents.length).toBeGreaterThan(0);
		}

		const commitsListInput = {
			project_id: projectId,
			per_page: 10,
		};

		const commits = await corsair.gitlab.api.commits.list(commitsListInput);

		expect(commits).toBeDefined();

		const commitsListEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.commits.list' },
		});

		expect(commitsListEvents.length).toBeGreaterThan(0);

		const commitsArray = Array.isArray(commits) ? commits : [];
		if (commitsArray.length > 0) {
			const firstCommit = commitsArray[0]!;

			const commitGetInput = {
				project_id: projectId,
				sha: firstCommit.id,
			};

			const commit = await corsair.gitlab.api.commits.get(commitGetInput);

			expect(commit).toBeDefined();
			expect(commit.id).toBe(firstCommit.id);

			const commitGetEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.commits.get' },
			});

			expect(commitGetEvents.length).toBeGreaterThan(0);

			const diffInput = {
				project_id: projectId,
				sha: firstCommit.id,
			};

			const diff = await corsair.gitlab.api.commits.getDiff(diffInput);

			expect(diff).toBeDefined();

			const diffEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.commits.getDiff' },
			});

			expect(diffEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('labels and milestones endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;
		const orm = createCorsairOrm(testDb.database);

		const labelsListInput = {
			project_id: projectId,
			per_page: 10,
		};

		const labelsList = await corsair.gitlab.api.labels.list(labelsListInput);

		expect(labelsList).toBeDefined();

		const labelListEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.labels.list' },
		});

		expect(labelListEvents.length).toBeGreaterThan(0);

		const labelName = `corsair-test-label-${Date.now()}`;
		const labelCreateInput = {
			project_id: projectId,
			name: labelName,
			color: '#428BCA',
			description: 'Created by Corsair integration test suite',
		};

		const createdLabel =
			await corsair.gitlab.api.labels.create(labelCreateInput);

		expect(createdLabel).toBeDefined();
		expect(createdLabel.name).toBe(labelName);

		const labelCreateEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.labels.create' },
		});

		expect(labelCreateEvents.length).toBeGreaterThan(0);
		const labelCreateEvent = labelCreateEvents[labelCreateEvents.length - 1]!;
		const labelCreatePayload =
			typeof labelCreateEvent.payload === 'string'
				? JSON.parse(labelCreateEvent.payload)
				: labelCreateEvent.payload;
		expect(labelCreatePayload).toMatchObject(labelCreateInput);

		try {
			await corsair.gitlab.api.labels.delete({
				project_id: projectId,
				label_id: createdLabel.id,
			});
		} catch {
			// best-effort cleanup
		}

		const milestonesListInput = {
			project_id: projectId,
			per_page: 10,
		};

		const milestonesList =
			await corsair.gitlab.api.milestones.list(milestonesListInput);

		expect(milestonesList).toBeDefined();

		const milestoneListEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.milestones.list' },
		});

		expect(milestoneListEvents.length).toBeGreaterThan(0);

		const milestoneTitle = `corsair-test-milestone-${Date.now()}`;
		const milestoneCreateInput = {
			project_id: projectId,
			title: milestoneTitle,
			description: 'Created by Corsair integration test suite',
		};

		const createdMilestone =
			await corsair.gitlab.api.milestones.create(milestoneCreateInput);

		expect(createdMilestone).toBeDefined();
		expect(createdMilestone.title).toBe(milestoneTitle);

		const milestoneCreateEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.milestones.create' },
		});

		expect(milestoneCreateEvents.length).toBeGreaterThan(0);
		const milestoneCreateEvent =
			milestoneCreateEvents[milestoneCreateEvents.length - 1]!;
		const milestoneCreatePayload =
			typeof milestoneCreateEvent.payload === 'string'
				? JSON.parse(milestoneCreateEvent.payload)
				: milestoneCreateEvent.payload;
		expect(milestoneCreatePayload).toMatchObject(milestoneCreateInput);

		try {
			await corsair.gitlab.api.milestones.update({
				project_id: projectId,
				milestone_id: createdMilestone.id,
				state_event: 'close',
			});
		} catch {
			// best-effort cleanup
		}

		testDb.cleanup();
	});

	it('pipelines endpoints interact with API and DB when pipelines exist', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const listInput = {
			project_id: projectId,
			per_page: 10,
		};

		const pipelinesList = await corsair.gitlab.api.pipelines.list(listInput);

		const pipelinesArray = Array.isArray(pipelinesList) ? pipelinesList : [];

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.pipelines.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (pipelinesArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstPipeline = pipelinesArray[0]!;

		const getInput = {
			project_id: projectId,
			pipeline_id: firstPipeline.id,
		};

		const pipeline = await corsair.gitlab.api.pipelines.get(getInput);

		expect(pipeline).toBeDefined();

		const getEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.pipelines.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const pipelineFromDb = await corsair.gitlab.db.pipelines.findByEntityId(
			String(firstPipeline.id),
		);
		expect(pipelineFromDb).not.toBeNull();
		expect(pipelineFromDb?.data.id).toBe(firstPipeline.id);

		const jobsInput = {
			project_id: projectId,
			pipeline_id: firstPipeline.id,
		};

		const jobs = await corsair.gitlab.api.pipelines.listJobs(jobsInput);

		expect(jobs).toBeDefined();

		const jobsEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.pipelines.listJobs' },
		});

		expect(jobsEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('repository endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const treeInput = {
			project_id: projectId,
			per_page: 10,
		};

		const tree = await corsair.gitlab.api.repository.getTree(treeInput);

		expect(tree).toBeDefined();
		expect(Array.isArray(tree)).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const treeEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.repository.getTree' },
		});

		expect(treeEvents.length).toBeGreaterThan(0);
		const treeEvent = treeEvents[treeEvents.length - 1]!;
		const treeEventPayload =
			typeof treeEvent.payload === 'string'
				? JSON.parse(treeEvent.payload)
				: treeEvent.payload;
		expect(treeEventPayload).toMatchObject(treeInput);

		const treeArray = Array.isArray(tree) ? tree : [];
		const file = treeArray.find((item) => item.type === 'blob');

		if (file) {
			const fileInput = {
				project_id: projectId,
				file_path: file.path,
				ref: 'main',
			};

			try {
				const fileContent =
					await corsair.gitlab.api.repository.getFile(fileInput);

				expect(fileContent).toBeDefined();

				const fileEvents = await orm.events.findMany({
					where: { event_type: 'gitlab.repository.getFile' },
				});

				expect(fileEvents.length).toBeGreaterThan(0);
			} catch (error) {
				if (error instanceof GitlabAPIError && error.status === 404) {
					// ref might not be 'main'
				} else {
					throw error;
				}
			}
		}

		const commits = await corsair.gitlab.api.commits.list({
			project_id: projectId,
			per_page: 2,
		});

		const commitsArray = Array.isArray(commits) ? commits : [];
		if (commitsArray.length >= 2) {
			const compareInput = {
				project_id: projectId,
				from: commitsArray[1]!.id,
				to: commitsArray[0]!.id,
			};

			const compareResult =
				await corsair.gitlab.api.repository.compare(compareInput);

			expect(compareResult).toBeDefined();

			const compareEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.repository.compare' },
			});

			expect(compareEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('groups endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const listInput = {
			per_page: 5,
		};

		const groupsList = await corsair.gitlab.api.groups.list(listInput);

		expect(groupsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.groups.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const groupsArray = Array.isArray(groupsList) ? groupsList : [];
		if (groupsArray.length > 0) {
			const firstGroup = groupsArray[0]!;

			const getInput = {
				group_id: firstGroup.id,
			};

			const group = await corsair.gitlab.api.groups.get(getInput);

			expect(group).toBeDefined();
			expect(group.id).toBe(firstGroup.id);

			const getEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.groups.get' },
			});

			expect(getEvents.length).toBeGreaterThan(0);

			const groupFromDb = await corsair.gitlab.db.groups.findByEntityId(
				String(firstGroup.id),
			);
			expect(groupFromDb).not.toBeNull();
			expect(groupFromDb?.data.id).toBe(firstGroup.id);

			const listProjectsInput = {
				group_id: firstGroup.id,
				per_page: 5,
			};

			const groupProjects =
				await corsair.gitlab.api.groups.listProjects(listProjectsInput);

			expect(groupProjects).toBeDefined();

			const listProjectsEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.groups.listProjects' },
			});

			expect(listProjectsEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('releases endpoints interact with API and DB', async () => {
		const setup = await createGitlabClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const listInput = {
			project_id: projectId,
			per_page: 10,
		};

		const releasesList = await corsair.gitlab.api.releases.list(listInput);

		expect(releasesList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'gitlab.releases.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const releasesArray = Array.isArray(releasesList) ? releasesList : [];

		if (releasesArray.length > 0) {
			const firstRelease = releasesArray[0]!;

			const getInput = {
				project_id: projectId,
				tag_name: firstRelease.tag_name,
			};

			const release = await corsair.gitlab.api.releases.get(getInput);

			expect(release).toBeDefined();
			expect(release.tag_name).toBe(firstRelease.tag_name);

			const getEvents = await orm.events.findMany({
				where: { event_type: 'gitlab.releases.get' },
			});

			expect(getEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});
});
