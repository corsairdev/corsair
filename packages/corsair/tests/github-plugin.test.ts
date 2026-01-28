import { createCorsair } from '../core';
import { github } from '../plugins/github';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { GithubAPIError } from '../plugins/github/client';
import dotenv from 'dotenv';
dotenv.config();  

async function createGithubClient() {
	const token = process.env.GITHUB_TOKEN;
	const owner = process.env.TEST_GITHUB_OWNER;
	const repo = process.env.TEST_GITHUB_REPO;
	if (!token || !owner || !repo) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'github');

	const corsair = createCorsair({
		plugins: [
			github({
				authType: 'oauth_2',
				credentials: {
					token,
				} as any,
			}),
		],
		database: testDb.adapter,
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

		const listResult = await corsair.github.api.issues.list({
			owner,
			repo,
			state: 'all',
			perPage: 10,
		});

        const listedIssues = Array.isArray(listResult) ? listResult : [];
        

		const eventsList = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.issues.list' }],
		});

		expect(eventsList.length).toBeGreaterThan(0);

		const issueTitle = `Corsair test issue ${Date.now()}`;

		const createdIssue = await corsair.github.api.issues.create({
			owner,
			repo,
			title: issueTitle,
        });
        

		expect(createdIssue).toBeDefined();

		const eventsCreate = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.issues.create' }],
		});

		expect(eventsCreate.length).toBeGreaterThan(0);

		const issueFromDb = await corsair.github.db.issues.findByEntityId(
			String(createdIssue.id),
		);

		expect(issueFromDb).not.toBeNull();

		const updatedIssue = await corsair.github.api.issues.update({
			owner,
			repo,
			issueNumber: createdIssue.number,
			title: `${issueTitle} updated`,
		});

		expect(updatedIssue).toBeDefined();

		const eventsUpdate = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.issues.update' }],
		});

		expect(eventsUpdate.length).toBeGreaterThan(0);

		const commentBody = `Corsair test comment ${Date.now()}`;

		const createdComment = await corsair.github.api.issues.createComment({
			owner,
			repo,
			issueNumber: createdIssue.number,
			body: commentBody,
		});

		expect(createdComment).toBeDefined();

		const eventsComment = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'github.issues.createComment' },
			],
		});

		expect(eventsComment.length).toBeGreaterThan(0);

		const fetchedIssue = await corsair.github.api.issues.get({
			owner,
			repo,
			issueNumber: createdIssue.number,
		});

		expect(fetchedIssue).toBeDefined();

		const eventsGet = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.issues.get' }],
		});

		expect(eventsGet.length).toBeGreaterThan(0);

		const issueFromDbAfterUpdate = await corsair.github.db.issues.findByEntityId(
			String(createdIssue.id),
		);

		expect(issueFromDbAfterUpdate).not.toBeNull();

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

		const reposList = await corsair.github.api.repositories.list({
			owner,
			type: 'all',
			perPage: 10,
		});

		const eventsList = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.repositories.list' }],
		});

		expect(eventsList.length).toBeGreaterThan(0);

		const reposCount = await corsair.github.db.repositories.count();

		expect(reposCount).toBeGreaterThan(0);

		const repoGet = await corsair.github.api.repositories.get({
			owner,
			repo,
		});

		expect(repoGet).toBeDefined();

		const eventsGet = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.repositories.get' }],
		});

		expect(eventsGet.length).toBeGreaterThan(0);

		const repoFromDb = await corsair.github.db.repositories.findByEntityId(
			String(repoGet.id),
		);

		expect(repoFromDb).not.toBeNull();

		const branches = await corsair.github.api.repositories.listBranches({
			owner,
			repo,
		});

		expect(branches).toBeDefined();

		const eventsBranches = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'github.repositories.listBranches' },
			],
		});

		expect(eventsBranches.length).toBeGreaterThan(0);

		const commits = await corsair.github.api.repositories.listCommits({
			owner,
			repo,
		});

		expect(commits).toBeDefined();

		const eventsCommits = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'github.repositories.listCommits' },
			],
		});

		expect(eventsCommits.length).toBeGreaterThan(0);

		const path = 'README.md';

		const content = await corsair.github.api.repositories.getContent({
			owner,
			repo,
			path,
		});

		expect(content).toBeDefined();

		const eventsContent = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'github.repositories.getContent' },
			],
		});

		expect(eventsContent.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('releases endpoints interact with API and DB', async () => {
		const setup = await createGithubClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, owner, repo } = setup;

		const releasesList = await corsair.github.api.releases.list({
			owner,
			repo,
			perPage: 10,
		});

		expect(releasesList).toBeDefined();

		const eventsList = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.releases.list' }],
		});

		expect(eventsList.length).toBeGreaterThan(0);

		const tagName = `corsair-test-tag-${Date.now()}`;

		const createdRelease = await corsair.github.api.releases.create({
			owner,
			repo,
			tagName,
			name: tagName,
		});

		expect(createdRelease).toBeDefined();

		const eventsCreate = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.releases.create' }],
		});

		expect(eventsCreate.length).toBeGreaterThan(0);

		const releaseFromDb = await corsair.github.db.releases.findByEntityId(
			String(createdRelease.id),
		);

		expect(releaseFromDb).not.toBeNull();

		const fetchedRelease = await corsair.github.api.releases.get({
			owner,
			repo,
			releaseId: createdRelease.id,
		});

		expect(fetchedRelease).toBeDefined();

		const eventsGet = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.releases.get' }],
		});

		expect(eventsGet.length).toBeGreaterThan(0);

		const updatedRelease = await corsair.github.api.releases.update({
			owner,
			repo,
			releaseId: createdRelease.id,
			name: `${tagName}-updated`,
		});

		expect(updatedRelease).toBeDefined();

		const eventsUpdate = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.releases.update' }],
		});

		expect(eventsUpdate.length).toBeGreaterThan(0);

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

		const pullRequests = await corsair.github.api.pullRequests.list({
			owner,
			repo,
			state: 'all',
			perPage: 10,
		});

		const prsArray = Array.isArray(pullRequests) ? pullRequests : [];

		const eventsList = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.pullRequests.list' }],
		});

		expect(eventsList.length).toBeGreaterThan(0);

		if (prsArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstPr = prsArray[0]!;

		const prFromDb = await corsair.github.db.pullRequests.findByEntityId(
			String(firstPr.id),
		);

		expect(prFromDb).not.toBeNull();

		const pr = await corsair.github.api.pullRequests.get({
			owner,
			repo,
			pullNumber: firstPr.number,
		});

		expect(pr).toBeDefined();

		const eventsGet = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.pullRequests.get' }],
		});

		expect(eventsGet.length).toBeGreaterThan(0);

		const reviews = await corsair.github.api.pullRequests.listReviews({
			owner,
			repo,
			pullNumber: firstPr.number,
		});

		expect(reviews).toBeDefined();

		const eventsListReviews = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'github.pullRequests.listReviews' },
			],
		});

		expect(eventsListReviews.length).toBeGreaterThan(0);

		try {
			const createdReview =
				await corsair.github.api.pullRequests.createReview({
					owner,
					repo,
					pullNumber: firstPr.number,
					body: 'Corsair test review',
					event: 'COMMENT',
				});

			expect(createdReview).toBeDefined();

			const eventsCreateReview = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [
					{
						field: 'event_type',
						value: 'github.pullRequests.createReview',
					},
				],
			});

			expect(eventsCreateReview.length).toBeGreaterThan(0);
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

		const workflows = await corsair.github.api.workflows.list({
			owner,
			repo,
			perPage: 10,
		});

		const workflowsArray = workflows.workflows || [];

		const eventsList = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.workflows.list' }],
		});

		expect(eventsList.length).toBeGreaterThan(0);

		if (workflowsArray.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstWorkflow = workflowsArray[0]!;

		const workflowFromDb = await corsair.github.db.workflows.findByEntityId(
			String(firstWorkflow.id),
		);

		expect(workflowFromDb).not.toBeNull();

		const workflow = await corsair.github.api.workflows.get({
			owner,
			repo,
			workflowId: firstWorkflow.id,
		});

		expect(workflow).toBeDefined();

		const eventsGet = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.workflows.get' }],
		});

		expect(eventsGet.length).toBeGreaterThan(0);

		const runs = await corsair.github.api.workflows.listRuns({
			owner,
			repo,
			perPage: 10,
		});

		expect(runs).toBeDefined();

		const eventsRuns = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'github.workflows.listRuns' }],
		});

		expect(eventsRuns.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
