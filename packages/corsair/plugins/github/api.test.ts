import dotenv from 'dotenv';
import { makeGithubRequest } from './client';
import type {
	IssueCommentCreateResponse,
	IssueCreateResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
	PullRequestGetResponse,
	PullRequestsListResponse,
	ReleaseCreateResponse,
	ReleaseGetResponse,
	ReleasesListResponse,
	ReleaseUpdateResponse,
	RepositoriesListResponse,
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
	WorkflowGetResponse,
	WorkflowRunsListResponse,
	WorkflowsListResponse,
} from './endpoints/types';
import { GithubEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_TOKEN = process.env.GITHUB_TOKEN!;
const TEST_OWNER = process.env.TEST_GITHUB_OWNER || 'octocat';
const TEST_REPO = process.env.TEST_GITHUB_REPO || 'Hello-World';

describe('GitHub API Type Tests', () => {
	describe('repositories', () => {
		it('repositoriesList returns correct type', async () => {
			const response = await makeGithubRequest<RepositoriesListResponse>(
				'/user/repos',
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.repositoriesList.parse(result);
		});

		it('repositoriesGet returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.repositoriesGet.parse(result);
		});

		it('repositoriesListBranches returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryBranchesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/branches`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.repositoriesListBranches.parse(result);
		});

		it('repositoriesListCommits returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryCommitsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/commits`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.repositoriesListCommits.parse(result);
		});

		it('repositoriesGetContent returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryContentGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/contents/README.md`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.repositoriesGetContent.parse(result);
		});
	});

	describe('issues', () => {
		it('issuesList returns correct type', async () => {
			const response = await makeGithubRequest<IssuesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1, state: 'all' } },
			);
			const result = response;

			GithubEndpointOutputSchemas.issuesList.parse(result);
		});

		it('issuesGet returns correct type', async () => {
			const issuesListResponse = await makeGithubRequest<IssuesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues`,
				TEST_TOKEN,
				{ query: { per_page: 1, page: 1, state: 'all' } },
			);
			const issueNumber = issuesListResponse[0]?.number;
			if (!issueNumber) {
				throw new Error('No issues found');
			}

			const response = await makeGithubRequest<IssueGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues/${issueNumber}`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.issuesGet.parse(result);
		});

		it('issuesCreate returns correct type', async () => {
			const response = await makeGithubRequest<IssueCreateResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						title: 'Test issue from API test',
						body: 'This is a test issue created by the API test suite',
					},
				},
			);
			const result = response;

			GithubEndpointOutputSchemas.issuesCreate.parse(result);
		});

		it('issuesUpdate returns correct type', async () => {
			const issuesListResponse = await makeGithubRequest<IssuesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues`,
				TEST_TOKEN,
				{ query: { per_page: 1, page: 1, state: 'all' } },
			);
			const issueNumber = issuesListResponse[0]?.number;
			if (!issueNumber) {
				throw new Error('No issues found');
			}

			const response = await makeGithubRequest<IssueUpdateResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues/${issueNumber}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						title: 'Updated issue from API test',
					},
				},
			);
			const result = response;

			GithubEndpointOutputSchemas.issuesUpdate.parse(result);
		});

		it('issuesCreateComment returns correct type', async () => {
			const issuesListResponse = await makeGithubRequest<IssuesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues`,
				TEST_TOKEN,
				{ query: { per_page: 1, page: 1, state: 'all' } },
			);
			const issueNumber = issuesListResponse[0]?.number;
			if (!issueNumber) {
				throw new Error('No issues found');
			}

			const response = await makeGithubRequest<IssueCommentCreateResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/issues/${issueNumber}/comments`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						body: 'Test comment from API test',
					},
				},
			);
			const result = response;

			GithubEndpointOutputSchemas.issuesCreateComment.parse(result);
		});
	});

	describe('pullRequests', () => {
		it('pullRequestsList returns correct type', async () => {
			const response = await makeGithubRequest<PullRequestsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/pulls`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1, state: 'all' } },
			);
			const result = response;

			GithubEndpointOutputSchemas.pullRequestsList.parse(result);
		});

		it('pullRequestsGet returns correct type', async () => {
			const pullRequestsListResponse =
				await makeGithubRequest<PullRequestsListResponse>(
					`/repos/${TEST_OWNER}/${TEST_REPO}/pulls`,
					TEST_TOKEN,
					{ query: { per_page: 1, page: 1, state: 'all' } },
				);
			const pullNumber = pullRequestsListResponse[0]?.number;
			if (!pullNumber) {
				throw new Error('No pull requests found');
			}

			const response = await makeGithubRequest<PullRequestGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/pulls/${pullNumber}`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.pullRequestsGet.parse(result);
		});
	});

	describe('releases', () => {
		it('releasesList returns correct type', async () => {
			const response = await makeGithubRequest<ReleasesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/releases`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.releasesList.parse(result);
		});

		it('releasesGet returns correct type', async () => {
			const releasesListResponse =
				await makeGithubRequest<ReleasesListResponse>(
					`/repos/${TEST_OWNER}/${TEST_REPO}/releases`,
					TEST_TOKEN,
					{ query: { per_page: 1, page: 1 } },
				);
			const releaseId = releasesListResponse[0]?.id;
			if (!releaseId) {
				throw new Error('No releases found');
			}

			const response = await makeGithubRequest<ReleaseGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/releases/${releaseId}`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.releasesGet.parse(result);
		});

		it('releasesCreate returns correct type', async () => {
			const tagName = `test-release-${Date.now()}`;
			const response = await makeGithubRequest<ReleaseCreateResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/releases`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						tag_name: tagName,
						name: 'Test Release from API test',
						body: 'This is a test release created by the API test suite',
						draft: true,
					},
				},
			);
			const result = response;

			GithubEndpointOutputSchemas.releasesCreate.parse(result);
		});

		it('releasesUpdate returns correct type', async () => {
			const releasesListResponse =
				await makeGithubRequest<ReleasesListResponse>(
					`/repos/${TEST_OWNER}/${TEST_REPO}/releases`,
					TEST_TOKEN,
					{ query: { per_page: 1, page: 1 } },
				);
			const releaseId = releasesListResponse[0]?.id;
			if (!releaseId) {
				throw new Error('No releases found');
			}

			const response = await makeGithubRequest<ReleaseUpdateResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/releases/${releaseId}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						name: 'Updated Release from API test',
					},
				},
			);
			const result = response;

			GithubEndpointOutputSchemas.releasesUpdate.parse(result);
		});
	});

	describe('workflows', () => {
		it('workflowsList returns correct type', async () => {
			const response = await makeGithubRequest<WorkflowsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/workflows`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.workflowsList.parse(result);
		});

		it('workflowsGet returns correct type', async () => {
			const workflowsListResponse =
				await makeGithubRequest<WorkflowsListResponse>(
					`/repos/${TEST_OWNER}/${TEST_REPO}/actions/workflows`,
					TEST_TOKEN,
					{ query: { per_page: 1, page: 1 } },
				);
			if (!workflowsListResponse.workflows) {
				throw new Error('No workflows found');
			}
			const workflowId = workflowsListResponse.workflows[0]?.id;
			if (!workflowId) {
				throw new Error('No workflows found');
			}

			const response = await makeGithubRequest<WorkflowGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/workflows/${workflowId}`,
				TEST_TOKEN,
			);
			const result = response;

			GithubEndpointOutputSchemas.workflowsGet.parse(result);
		});

		it('workflowsListRuns returns correct type', async () => {
			const response = await makeGithubRequest<WorkflowRunsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/runs`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;

			GithubEndpointOutputSchemas.workflowsListRuns.parse(result);
		});
	});
});
