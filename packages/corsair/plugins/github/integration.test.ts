import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { GithubAPIError } from './client';
import { github } from './index';

dotenv.config();

async function createGithubClient() {
	const token = process.env.GITHUB_TOKEN;
	const owner = process.env.TEST_GITHUB_OWNER;
	const repo = process.env.TEST_GITHUB_REPO;
	if (!token || !owner || !repo) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'github');

	const corsair = createCorsair({
		plugins: [
			github({
				authType: 'api_key',
				credentials: {
					token,
				},
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb, owner, repo };
}

describe('GitHub plugin integration', () => {
	it('issues endpoints interact with API and DB', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const listInput = {
			owner,
			repo,
			state: 'all' as const,
			perPage: 10,
		};

		const listResult = await corsair.github.api.issues.list(listInput);

		const listedIssues = Array.isArray(listResult) ? listResult : [];

		const orm = createCorsairOrm(testDb.database);
		const eventsList = await orm.events.findMany({
			where: { event_type: 'github.issues.list' },
		});

		expect(eventsList.length).toBeGreaterThan(0);
		const listEvent = eventsList[eventsList.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (listedIssues.length > 0) {
			for (const issue of listedIssues.slice(0, 5)) {
				const issueFromDb = await corsair.github.db.issues.findByEntityId(
					String(issue.id),
				);
				expect(issueFromDb).not.toBeNull();
				expect(issueFromDb?.data.id).toBe(issue.id);
			}
		}

		const issueTitle = `Corsair test issue ${Date.now()}`;
		const createInput = {
			owner,
			repo,
			title: issueTitle,
		};

		const createdIssue = await corsair.github.api.issues.create(createInput);

		expect(createdIssue).toBeDefined();

		const eventsCreate = await orm.events.findMany({
			where: { event_type: 'github.issues.create' },
		});

		expect(eventsCreate.length).toBeGreaterThan(0);
		const createEvent = eventsCreate[eventsCreate.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const issueFromDb = await corsair.github.db.issues.findByEntityId(
			String(createdIssue.id),
		);

		expect(issueFromDb).not.toBeNull();
		expect(issueFromDb?.data.id).toBe(createdIssue.id);
		expect(issueFromDb?.data.title).toBe(createdIssue.title);
		expect(issueFromDb?.data.number).toBe(createdIssue.number);

		const updateInput = {
			owner,
			repo,
			issueNumber: createdIssue.number,
			title: `${issueTitle} updated`,
		};

		const updatedIssue = await corsair.github.api.issues.update(updateInput);

		expect(updatedIssue).toBeDefined();

		const eventsUpdate = await orm.events.findMany({
			where: { event_type: 'github.issues.update' },
		});

		expect(eventsUpdate.length).toBeGreaterThan(0);
		const updateEvent = eventsUpdate[eventsUpdate.length - 1]!;
		const updateEventPayload =
			typeof updateEvent.payload === 'string'
				? JSON.parse(updateEvent.payload)
				: updateEvent.payload;
		expect(updateEventPayload).toMatchObject(updateInput);

		const updatedIssueFromDb = await corsair.github.db.issues.findByEntityId(
			String(createdIssue.id),
		);
		expect(updatedIssueFromDb).not.toBeNull();
		expect(updatedIssueFromDb?.data.title).toBe(updatedIssue.title);

		const commentBody = `Corsair test comment ${Date.now()}`;
		const commentInput = {
			owner,
			repo,
			issueNumber: createdIssue.number,
			body: commentBody,
		};

		const createdComment =
			await corsair.github.api.issues.createComment(commentInput);

		expect(createdComment).toBeDefined();

		const eventsComment = await orm.events.findMany({
			where: { event_type: 'github.issues.createComment' },
		});

		expect(eventsComment.length).toBeGreaterThan(0);
		const commentEvent = eventsComment[eventsComment.length - 1]!;
		const commentEventPayload =
			typeof commentEvent.payload === 'string'
				? JSON.parse(commentEvent.payload)
				: commentEvent.payload;
		expect(commentEventPayload).toMatchObject(commentInput);

		const issueAfterComment = await corsair.github.db.issues.findByEntityId(
			String(createdIssue.id),
		);
		expect(issueAfterComment).not.toBeNull();

		const getInput = {
			owner,
			repo,
			issueNumber: createdIssue.number,
		};

		const fetchedIssue = await corsair.github.api.issues.get(getInput);

		expect(fetchedIssue).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'github.issues.get' },
		});

		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const issueFromDbAfterUpdate =
			await corsair.github.db.issues.findByEntityId(String(createdIssue.id));

		expect(issueFromDbAfterUpdate).not.toBeNull();
		expect(issueFromDbAfterUpdate?.data.id).toBe(fetchedIssue.id);
		expect(issueFromDbAfterUpdate?.data.title).toBe(fetchedIssue.title);

		const issuesCount = await corsair.github.db.issues.count();

		expect(issuesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('repositories endpoints interact with API and DB', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const listInput = {
			owner,
			type: 'all' as const,
			perPage: 10,
		};

		const reposList = await corsair.github.api.repositories.list(listInput);

		const reposArray = Array.isArray(reposList) ? reposList : [];

		const orm = createCorsairOrm(testDb.database);
		const eventsList = await orm.events.findMany({
			where: { event_type: 'github.repositories.list' },
		});

		expect(eventsList.length).toBeGreaterThan(0);
		const listEvent = eventsList[eventsList.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const reposCount = await corsair.github.db.repositories.count();

		expect(reposCount).toBeGreaterThan(0);

		if (reposArray.length > 0) {
			for (const repository of reposArray.slice(0, 5)) {
				const repoFromDb = await corsair.github.db.repositories.findByEntityId(
					String(repository.id),
				);
				expect(repoFromDb).not.toBeNull();
				expect(repoFromDb?.data.id).toBe(repository.id);
			}
		}

		const getInput = {
			owner,
			repo,
		};

		const repoGet = await corsair.github.api.repositories.get(getInput);

		expect(repoGet).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'github.repositories.get' },
		});

		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const repoFromDb = await corsair.github.db.repositories.findByEntityId(
			String(repoGet.id),
		);

		expect(repoFromDb).not.toBeNull();
		expect(repoFromDb?.data.id).toBe(repoGet.id);
		expect(repoFromDb?.data.name).toBe(repoGet.name);
		expect(repoFromDb?.data.fullName).toBe(repoGet.fullName);

		const branchesInput = {
			owner,
			repo,
		};

		const branches =
			await corsair.github.api.repositories.listBranches(branchesInput);

		expect(branches).toBeDefined();

		const eventsBranches = await orm.events.findMany({
			where: { event_type: 'github.repositories.listBranches' },
		});

		expect(eventsBranches.length).toBeGreaterThan(0);
		const branchesEvent = eventsBranches[eventsBranches.length - 1]!;
		const branchesEventPayload =
			typeof branchesEvent.payload === 'string'
				? JSON.parse(branchesEvent.payload)
				: branchesEvent.payload;
		expect(branchesEventPayload).toMatchObject(branchesInput);

		const repoAfterBranches =
			await corsair.github.db.repositories.findByEntityId(String(repoGet.id));
		expect(repoAfterBranches).not.toBeNull();

		const commitsInput = {
			owner,
			repo,
		};

		const commits =
			await corsair.github.api.repositories.listCommits(commitsInput);

		expect(commits).toBeDefined();

		const eventsCommits = await orm.events.findMany({
			where: { event_type: 'github.repositories.listCommits' },
		});

		expect(eventsCommits.length).toBeGreaterThan(0);
		const commitsEvent = eventsCommits[eventsCommits.length - 1]!;
		const commitsEventPayload =
			typeof commitsEvent.payload === 'string'
				? JSON.parse(commitsEvent.payload)
				: commitsEvent.payload;
		expect(commitsEventPayload).toMatchObject(commitsInput);

		const repoAfterCommits =
			await corsair.github.db.repositories.findByEntityId(String(repoGet.id));
		expect(repoAfterCommits).not.toBeNull();

		const path = 'README.md';
		const contentInput = {
			owner,
			repo,
			path,
		};

		const content =
			await corsair.github.api.repositories.getContent(contentInput);

		expect(content).toBeDefined();

		const eventsContent = await orm.events.findMany({
			where: { event_type: 'github.repositories.getContent' },
		});

		expect(eventsContent.length).toBeGreaterThan(0);
		const contentEvent = eventsContent[eventsContent.length - 1]!;
		const contentEventPayload =
			typeof contentEvent.payload === 'string'
				? JSON.parse(contentEvent.payload)
				: contentEvent.payload;
		expect(contentEventPayload).toMatchObject(contentInput);

		const repoAfterContent =
			await corsair.github.db.repositories.findByEntityId(String(repoGet.id));
		expect(repoAfterContent).not.toBeNull();

		testDb.cleanup();
	});

	it('releases endpoints interact with API and DB', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const listInput = {
			owner,
			repo,
			perPage: 10,
		};

		const releasesList = await corsair.github.api.releases.list(listInput);

		expect(releasesList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const eventsList = await orm.events.findMany({
			where: { event_type: 'github.releases.list' },
		});

		expect(eventsList.length).toBeGreaterThan(0);
		const listEvent = eventsList[eventsList.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const tagName = `corsair-test-tag-${Date.now()}`;
		const createInput = {
			owner,
			repo,
			tagName,
			name: tagName,
		};

		const createdRelease =
			await corsair.github.api.releases.create(createInput);

		expect(createdRelease).toBeDefined();

		const eventsCreate = await orm.events.findMany({
			where: { event_type: 'github.releases.create' },
		});

		expect(eventsCreate.length).toBeGreaterThan(0);
		const createEvent = eventsCreate[eventsCreate.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const releaseFromDb = await corsair.github.db.releases.findByEntityId(
			String(createdRelease.id),
		);

		expect(releaseFromDb).not.toBeNull();
		expect(releaseFromDb?.data.id).toBe(createdRelease.id);
		expect(releaseFromDb?.data.tagName).toBe(createdRelease.tagName);
		expect(releaseFromDb?.data.name).toBe(createdRelease.name);

		const getInput = {
			owner,
			repo,
			releaseId: createdRelease.id,
		};

		const fetchedRelease = await corsair.github.api.releases.get(getInput);

		expect(fetchedRelease).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'github.releases.get' },
		});

		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const fetchedReleaseFromDb =
			await corsair.github.db.releases.findByEntityId(
				String(createdRelease.id),
			);
		expect(fetchedReleaseFromDb).not.toBeNull();
		expect(fetchedReleaseFromDb?.data.id).toBe(fetchedRelease.id);
		expect(fetchedReleaseFromDb?.data.name).toBe(fetchedRelease.name);

		const updateInput = {
			owner,
			repo,
			releaseId: createdRelease.id,
			name: `${tagName}-updated`,
		};

		const updatedRelease =
			await corsair.github.api.releases.update(updateInput);

		expect(updatedRelease).toBeDefined();

		const eventsUpdate = await orm.events.findMany({
			where: { event_type: 'github.releases.update' },
		});

		expect(eventsUpdate.length).toBeGreaterThan(0);
		const updateEvent = eventsUpdate[eventsUpdate.length - 1]!;
		const updateEventPayload =
			typeof updateEvent.payload === 'string'
				? JSON.parse(updateEvent.payload)
				: updateEvent.payload;
		expect(updateEventPayload).toMatchObject(updateInput);

		const updatedReleaseFromDb =
			await corsair.github.db.releases.findByEntityId(
				String(createdRelease.id),
			);
		expect(updatedReleaseFromDb).not.toBeNull();
		expect(updatedReleaseFromDb?.data.name).toBe(updatedRelease.name);

		const releasesCount = await corsair.github.db.releases.count();

		expect(releasesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('pull request endpoints interact with API and DB when PRs exist', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const listInput = {
			owner,
			repo,
			state: 'all' as const,
			perPage: 10,
		};

		const pullRequests = await corsair.github.api.pullRequests.list(listInput);

		const prsArray = Array.isArray(pullRequests) ? pullRequests : [];

		const orm = createCorsairOrm(testDb.database);
		const eventsList = await orm.events.findMany({
			where: { event_type: 'github.pullRequests.list' },
		});

		expect(eventsList.length).toBeGreaterThan(0);
		const listEvent = eventsList[eventsList.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (prsArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstPr = prsArray[0]!;

		const prFromDb = await corsair.github.db.pullRequests.findByEntityId(
			String(firstPr.id),
		);

		expect(prFromDb).not.toBeNull();
		expect(prFromDb?.data.id).toBe(firstPr.id);
		expect(prFromDb?.data.number).toBe(firstPr.number);

		const getInput = {
			owner,
			repo,
			pullNumber: firstPr.number,
		};

		const pr = await corsair.github.api.pullRequests.get(getInput);

		expect(pr).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'github.pullRequests.get' },
		});

		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const prAfterGet = await corsair.github.db.pullRequests.findByEntityId(
			String(firstPr.id),
		);
		expect(prAfterGet).not.toBeNull();
		expect(prAfterGet?.data.id).toBe(pr.id);
		expect(prAfterGet?.data.title).toBe(pr.title);

		const reviewsInput = {
			owner,
			repo,
			pullNumber: firstPr.number,
		};

		const reviews =
			await corsair.github.api.pullRequests.listReviews(reviewsInput);

		expect(reviews).toBeDefined();

		const eventsListReviews = await orm.events.findMany({
			where: { event_type: 'github.pullRequests.listReviews' },
		});

		expect(eventsListReviews.length).toBeGreaterThan(0);
		const reviewsEvent = eventsListReviews[eventsListReviews.length - 1]!;
		const reviewsEventPayload =
			typeof reviewsEvent.payload === 'string'
				? JSON.parse(reviewsEvent.payload)
				: reviewsEvent.payload;
		expect(reviewsEventPayload).toMatchObject(reviewsInput);

		const prAfterReviews = await corsair.github.db.pullRequests.findByEntityId(
			String(firstPr.id),
		);
		expect(prAfterReviews).not.toBeNull();

		try {
			const createReviewInput = {
				owner,
				repo,
				pullNumber: firstPr.number,
				body: 'Corsair test review',
				event: 'COMMENT' as const,
			};

			const createdReview =
				await corsair.github.api.pullRequests.createReview(createReviewInput);

			expect(createdReview).toBeDefined();

			const eventsCreateReview = await orm.events.findMany({
				where: { event_type: 'github.pullRequests.createReview' },
			});

			expect(eventsCreateReview.length).toBeGreaterThan(0);
			const createReviewEvent =
				eventsCreateReview[eventsCreateReview.length - 1]!;
			const createReviewEventPayload =
				typeof createReviewEvent.payload === 'string'
					? JSON.parse(createReviewEvent.payload)
					: createReviewEvent.payload;
			expect(createReviewEventPayload).toMatchObject(createReviewInput);

			const prAfterReview = await corsair.github.db.pullRequests.findByEntityId(
				String(firstPr.id),
			);
			expect(prAfterReview).not.toBeNull();
		} catch (error) {
			if (
				error instanceof GithubAPIError &&
				(error.code === 422 || error.code === 403)
			) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		testDb.cleanup();
	});

	it('workflow endpoints interact with API and DB when workflows exist', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const listInput = {
			owner,
			repo,
			perPage: 10,
		};

		const workflows = await corsair.github.api.workflows.list(listInput);

		const workflowsArray = workflows.workflows || [];

		const orm = createCorsairOrm(testDb.database);
		const eventsList = await orm.events.findMany({
			where: { event_type: 'github.workflows.list' },
		});

		expect(eventsList.length).toBeGreaterThan(0);
		const listEvent = eventsList[eventsList.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (workflowsArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstWorkflow = workflowsArray[0]!;

		const workflowFromDb = await corsair.github.db.workflows.findByEntityId(
			String(firstWorkflow.id),
		);

		expect(workflowFromDb).not.toBeNull();
		expect(workflowFromDb?.data.id).toBe(firstWorkflow.id);
		expect(workflowFromDb?.data.name).toBe(firstWorkflow.name);

		const getInput = {
			owner,
			repo,
			workflowId: firstWorkflow.id,
		};

		const workflow = await corsair.github.api.workflows.get(getInput);

		expect(workflow).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'github.workflows.get' },
		});

		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const workflowAfterGet = await corsair.github.db.workflows.findByEntityId(
			String(firstWorkflow.id),
		);
		expect(workflowAfterGet).not.toBeNull();
		expect(workflowAfterGet?.data.id).toBe(workflow.id);
		expect(workflowAfterGet?.data.name).toBe(workflow.name);

		const runsInput = {
			owner,
			repo,
			perPage: 10,
		};

		const runs = await corsair.github.api.workflows.listRuns(runsInput);

		expect(runs).toBeDefined();

		const eventsRuns = await orm.events.findMany({
			where: { event_type: 'github.workflows.listRuns' },
		});

		expect(eventsRuns.length).toBeGreaterThan(0);
		const runsEvent = eventsRuns[eventsRuns.length - 1]!;
		const runsEventPayload =
			typeof runsEvent.payload === 'string'
				? JSON.parse(runsEvent.payload)
				: runsEvent.payload;
		expect(runsEventPayload).toMatchObject(runsInput);

		testDb.cleanup();
	});
});
