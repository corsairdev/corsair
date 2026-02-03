import { makeGithubRequest } from './client';
import type {
	GithubEndpointOutputs,
	IssueCommentCreateResponse,
	IssueCreateResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
	PullRequestGetResponse,
	PullRequestReviewCreateResponse,
	PullRequestReviewListResponse,
	PullRequestsListResponse,
	ReleaseCreateResponse,
	ReleaseGetResponse,
	ReleasesListResponse,
	ReleaseUpdateResponse,
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
	RepositoriesListResponse,
	WorkflowGetResponse,
	WorkflowsListResponse,
	WorkflowRunsListResponse,
} from './endpoints/types';
import { GithubEndpointOutputSchemas } from './endpoints/types';
import dotenv from 'dotenv';
dotenv.config();

type AssertExactType<T, U> = T extends U ? (U extends T ? true : never) : never;

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
			
			const validated = GithubEndpointOutputSchemas.repositoriesList.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['repositoriesList']
			>;
			const _assert: _Check = true;
		});


		it('repositoriesGet returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.repositoriesGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['repositoriesGet']
			>;
			const _assert: _Check = true;
		});

		it('repositoriesListBranches returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryBranchesListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/branches`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.repositoriesListBranches.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['repositoriesListBranches']
			>;
			const _assert: _Check = true;
		});

		it('repositoriesListCommits returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryCommitsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/commits`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.repositoriesListCommits.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['repositoriesListCommits']
			>;
			const _assert: _Check = true;
		});

		it('repositoriesGetContent returns correct type', async () => {
			const response = await makeGithubRequest<RepositoryContentGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/contents/README.md`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.repositoriesGetContent.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['repositoriesGetContent']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.issuesList.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['issuesList']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.issuesGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['issuesGet']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.issuesCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['issuesCreate']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.issuesUpdate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['issuesUpdate']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.issuesCreateComment.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['issuesCreateComment']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.pullRequestsList.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['pullRequestsList']
			>;
			const _assert: _Check = true;
		});

		it('pullRequestsGet returns correct type', async () => {
			const pullRequestsListResponse = await makeGithubRequest<PullRequestsListResponse>(
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
			
			const validated = GithubEndpointOutputSchemas.pullRequestsGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['pullRequestsGet']
			>;
			const _assert: _Check = true;
		});

		it('pullRequestsCreateReview returns correct type', async () => {
			const pullRequestsListResponse = await makeGithubRequest<PullRequestsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/pulls`,
				TEST_TOKEN,
				{ query: { per_page: 1, page: 1, state: 'open' } },
			);
			const pullNumber = pullRequestsListResponse[0]?.number;
			if (!pullNumber) {
				return;
			}

			try {
				const response = await makeGithubRequest<PullRequestReviewCreateResponse>(
					`/repos/${TEST_OWNER}/${TEST_REPO}/pulls/${pullNumber}/reviews`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							body: 'Test review comment from API test',
							event: 'COMMENT',
						},
					},
				);
				const result = response;
				
				const validated = GithubEndpointOutputSchemas.pullRequestsCreateReview.parse(result);
				
				type _Check = AssertExactType<
					typeof result,
					GithubEndpointOutputs['pullRequestsCreateReview']
				>;
				const _assert: _Check = true;
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('Unprocessable Entity') ||
						error.message.includes('422'))
				) {
					return;
				}
				throw error;
			}
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
			
			const validated = GithubEndpointOutputSchemas.releasesList.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['releasesList']
			>;
			const _assert: _Check = true;
		});

		it('releasesGet returns correct type', async () => {
			const releasesListResponse = await makeGithubRequest<ReleasesListResponse>(
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
			
			const validated = GithubEndpointOutputSchemas.releasesGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['releasesGet']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.releasesCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['releasesCreate']
			>;
			const _assert: _Check = true;
		});

		it('releasesUpdate returns correct type', async () => {
			const releasesListResponse = await makeGithubRequest<ReleasesListResponse>(
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
			
			const validated = GithubEndpointOutputSchemas.releasesUpdate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['releasesUpdate']
			>;
			const _assert: _Check = true;
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
			
			const validated = GithubEndpointOutputSchemas.workflowsList.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['workflowsList']
			>;
			const _assert: _Check = true;
		});

		it('workflowsGet returns correct type', async () => {
			const workflowsListResponse = await makeGithubRequest<WorkflowsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/workflows`,
				TEST_TOKEN,
				{ query: { per_page: 1, page: 1 } },
			);
			const workflowId = workflowsListResponse.workflows[0]?.id;
			if (!workflowId) {
				throw new Error('No workflows found');
			}

			const response = await makeGithubRequest<WorkflowGetResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/workflows/${workflowId}`,
				TEST_TOKEN,
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.workflowsGet.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['workflowsGet']
			>;
			const _assert: _Check = true;
		});

		it('workflowsListRuns returns correct type', async () => {
			const response = await makeGithubRequest<WorkflowRunsListResponse>(
				`/repos/${TEST_OWNER}/${TEST_REPO}/actions/runs`,
				TEST_TOKEN,
				{ query: { per_page: 10, page: 1 } },
			);
			const result = response;
			
			const validated = GithubEndpointOutputSchemas.workflowsListRuns.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				GithubEndpointOutputs['workflowsListRuns']
			>;
			const _assert: _Check = true;
		});
	});
});
