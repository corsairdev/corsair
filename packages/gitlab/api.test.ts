import 'dotenv/config';
import { makeGitlabRequest } from './client';
import { GitlabEndpointOutputSchemas } from './endpoints/types';
import type {
	BranchesGetResponse,
	BranchesListResponse,
	CommitsGetResponse,
	CommitsListResponse,
	GroupsListResponse,
	IssuesCreateResponse,
	IssuesGetResponse,
	IssuesListResponse,
	IssuesUpdateResponse,
	LabelsCreateResponse,
	LabelsListResponse,
	MergeRequestsGetResponse,
	MergeRequestsListResponse,
	MilestonesCreateResponse,
	MilestonesListResponse,
	PipelinesGetResponse,
	PipelinesListResponse,
	ProjectsGetResponse,
	ProjectsListResponse,
	ReleasesListResponse,
	RepositoryGetTreeResponse,
	UsersGetCurrentUserResponse,
	UsersListResponse,
} from './endpoints/types';

const TEST_TOKEN = process.env.GITLAB_TOKEN!;
const TEST_PROJECT_ID = process.env.TEST_GITLAB_PROJECT_ID!;
const TEST_BASE_URL = process.env.TEST_GITLAB_BASE_URL;

const enc = (id: string | number) => encodeURIComponent(String(id));

describe('GitLab API Type Tests', () => {
	describe('users', () => {
		it('usersGetCurrentUser returns correct type', async () => {
			const response = await makeGitlabRequest<UsersGetCurrentUserResponse>(
				'/user',
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.usersGetCurrentUser.parse(response);
		});

		it('usersList returns correct type', async () => {
			const response = await makeGitlabRequest<UsersListResponse>(
				'/users',
				TEST_TOKEN,
				{
					query: { per_page: 5 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.usersList.parse(response);
		});
	});

	describe('projects', () => {
		it('projectsList returns correct type', async () => {
			const response = await makeGitlabRequest<ProjectsListResponse>(
				'/projects',
				TEST_TOKEN,
				{
					query: { membership: true, per_page: 5 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.projectsList.parse(response);
		});

		it('projectsGet returns correct type', async () => {
			const response = await makeGitlabRequest<ProjectsGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.projectsGet.parse(response);
		});
	});

	describe('issues', () => {
		it('issuesList returns correct type', async () => {
			const response = await makeGitlabRequest<IssuesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues`,
				TEST_TOKEN,
				{
					query: { per_page: 10, state: 'all' },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.issuesList.parse(response);
		});

		it('issuesGet returns correct type', async () => {
			const issuesList = await makeGitlabRequest<IssuesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues`,
				TEST_TOKEN,
				{
					query: { per_page: 1, state: 'all' },
					baseUrl: TEST_BASE_URL,
				},
			);
			const issueIid = issuesList[0]?.iid;
			if (!issueIid) {
				throw new Error('No issues found');
			}

			const response = await makeGitlabRequest<IssuesGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues/${issueIid}`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.issuesGet.parse(response);
		});

		it('issuesCreate returns correct type', async () => {
			const response = await makeGitlabRequest<IssuesCreateResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						title: `Test issue from API test ${Date.now()}`,
						description:
							'This is a test issue created by the API test suite',
					},
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.issuesCreate.parse(response);

			if (response.iid) {
				await makeGitlabRequest(
					`/projects/${enc(TEST_PROJECT_ID)}/issues/${response.iid}`,
					TEST_TOKEN,
					{
						method: 'PUT',
						body: { state_event: 'close' },
						baseUrl: TEST_BASE_URL,
					},
				);
			}
		});

		it('issuesUpdate returns correct type', async () => {
			const issuesList = await makeGitlabRequest<IssuesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues`,
				TEST_TOKEN,
				{
					query: { per_page: 1, state: 'all' },
					baseUrl: TEST_BASE_URL,
				},
			);
			const issueIid = issuesList[0]?.iid;
			if (!issueIid) {
				throw new Error('No issues found');
			}

			const response = await makeGitlabRequest<IssuesUpdateResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/issues/${issueIid}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						title: `Updated issue from API test ${Date.now()}`,
					},
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.issuesUpdate.parse(response);
		});
	});

	describe('mergeRequests', () => {
		it('mergeRequestsList returns correct type', async () => {
			const response = await makeGitlabRequest<MergeRequestsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/merge_requests`,
				TEST_TOKEN,
				{
					query: { per_page: 10, state: 'all' },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.mergeRequestsList.parse(response);
		});

		it('mergeRequestsGet returns correct type', async () => {
			const mrList = await makeGitlabRequest<MergeRequestsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/merge_requests`,
				TEST_TOKEN,
				{
					query: { per_page: 1, state: 'all' },
					baseUrl: TEST_BASE_URL,
				},
			);
			const mrIid = mrList[0]?.iid;
			if (!mrIid) {
				throw new Error('No merge requests found');
			}

			const response = await makeGitlabRequest<MergeRequestsGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/merge_requests/${mrIid}`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.mergeRequestsGet.parse(response);
		});
	});

	describe('branches', () => {
		it('branchesList returns correct type', async () => {
			const response = await makeGitlabRequest<BranchesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/branches`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.branchesList.parse(response);
		});

		it('branchesGet returns correct type', async () => {
			const branchesList = await makeGitlabRequest<BranchesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/branches`,
				TEST_TOKEN,
				{
					query: { per_page: 1 },
					baseUrl: TEST_BASE_URL,
				},
			);
			const branchName = branchesList[0]?.name;
			if (!branchName) {
				throw new Error('No branches found');
			}

			const response = await makeGitlabRequest<BranchesGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/branches/${enc(branchName)}`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.branchesGet.parse(response);
		});
	});

	describe('commits', () => {
		it('commitsList returns correct type', async () => {
			const response = await makeGitlabRequest<CommitsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.commitsList.parse(response);
		});

		it('commitsGet returns correct type', async () => {
			const commitsList = await makeGitlabRequest<CommitsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits`,
				TEST_TOKEN,
				{
					query: { per_page: 1 },
					baseUrl: TEST_BASE_URL,
				},
			);
			const sha = commitsList[0]?.id;
			if (!sha) {
				throw new Error('No commits found');
			}

			const response = await makeGitlabRequest<CommitsGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits/${sha}`,
				TEST_TOKEN,
				{
					query: { stats: true },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.commitsGet.parse(response);
		});

		it('commitsGetDiff returns correct type', async () => {
			const commitsList = await makeGitlabRequest<CommitsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits`,
				TEST_TOKEN,
				{
					query: { per_page: 1 },
					baseUrl: TEST_BASE_URL,
				},
			);
			const sha = commitsList[0]?.id;
			if (!sha) {
				throw new Error('No commits found');
			}

			const response = await makeGitlabRequest(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits/${sha}/diff`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.commitsGetDiff.parse(response);
		});
	});

	describe('pipelines', () => {
		it('pipelinesList returns correct type', async () => {
			const response = await makeGitlabRequest<PipelinesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/pipelines`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.pipelinesList.parse(response);
		});

		it('pipelinesGet returns correct type', async () => {
			const pipelinesList = await makeGitlabRequest<PipelinesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/pipelines`,
				TEST_TOKEN,
				{
					query: { per_page: 1 },
					baseUrl: TEST_BASE_URL,
				},
			);
			const pipelineId = pipelinesList[0]?.id;
			if (!pipelineId) {
				throw new Error('No pipelines found');
			}

			const response = await makeGitlabRequest<PipelinesGetResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/pipelines/${pipelineId}`,
				TEST_TOKEN,
				{ baseUrl: TEST_BASE_URL },
			);

			GitlabEndpointOutputSchemas.pipelinesGet.parse(response);
		});
	});

	describe('groups', () => {
		it('groupsList returns correct type', async () => {
			const response = await makeGitlabRequest<GroupsListResponse>(
				'/groups',
				TEST_TOKEN,
				{
					query: { per_page: 5 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.groupsList.parse(response);
		});
	});

	describe('labels', () => {
		it('labelsList returns correct type', async () => {
			const response = await makeGitlabRequest<LabelsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/labels`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.labelsList.parse(response);
		});

		it('labelsCreate returns correct type', async () => {
			const labelName = `test-label-${Date.now()}`;
			const response = await makeGitlabRequest<LabelsCreateResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/labels`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: labelName,
						color: '#428BCA',
					},
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.labelsCreate.parse(response);

			if (response.id) {
				await makeGitlabRequest(
					`/projects/${enc(TEST_PROJECT_ID)}/labels/${response.id}`,
					TEST_TOKEN,
					{
						method: 'DELETE',
						baseUrl: TEST_BASE_URL,
					},
				);
			}
		});
	});

	describe('milestones', () => {
		it('milestonesList returns correct type', async () => {
			const response = await makeGitlabRequest<MilestonesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/milestones`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.milestonesList.parse(response);
		});

		it('milestonesCreate returns correct type', async () => {
			const milestoneTitle = `test-milestone-${Date.now()}`;
			const response = await makeGitlabRequest<MilestonesCreateResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/milestones`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						title: milestoneTitle,
						description: 'Test milestone created by the API test suite',
					},
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.milestonesCreate.parse(response);

			if (response.id) {
				await makeGitlabRequest(
					`/projects/${enc(TEST_PROJECT_ID)}/milestones/${response.id}`,
					TEST_TOKEN,
					{
						method: 'PUT',
						body: { state_event: 'close' },
						baseUrl: TEST_BASE_URL,
					},
				);
			}
		});
	});

	describe('releases', () => {
		it('releasesList returns correct type', async () => {
			const response = await makeGitlabRequest<ReleasesListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/releases`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.releasesList.parse(response);
		});
	});

	describe('repository', () => {
		it('repositoryGetTree returns correct type', async () => {
			const response = await makeGitlabRequest<RepositoryGetTreeResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/tree`,
				TEST_TOKEN,
				{
					query: { per_page: 10 },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.repositoryGetTree.parse(response);
		});

		it('repositoryGetFile returns correct type', async () => {
			const treeItems = await makeGitlabRequest<RepositoryGetTreeResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/tree`,
				TEST_TOKEN,
				{
					query: { per_page: 20 },
					baseUrl: TEST_BASE_URL,
				},
			);
			const file = treeItems.find((item) => item.type === 'blob');
			if (!file) {
				throw new Error('No files found in repository tree');
			}

			const response = await makeGitlabRequest(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/files/${enc(file.path)}`,
				TEST_TOKEN,
				{
					query: { ref: 'main' },
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.repositoryGetFile.parse(response);
		});

		it('repositoryCompare returns correct type', async () => {
			const commitsList = await makeGitlabRequest<CommitsListResponse>(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/commits`,
				TEST_TOKEN,
				{
					query: { per_page: 2 },
					baseUrl: TEST_BASE_URL,
				},
			);
			if (commitsList.length < 2) {
				throw new Error('Not enough commits to compare');
			}

			const response = await makeGitlabRequest(
				`/projects/${enc(TEST_PROJECT_ID)}/repository/compare`,
				TEST_TOKEN,
				{
					query: {
						from: commitsList[1]!.id,
						to: commitsList[0]!.id,
					},
					baseUrl: TEST_BASE_URL,
				},
			);

			GitlabEndpointOutputSchemas.repositoryCompare.parse(response);
		});
	});
});
