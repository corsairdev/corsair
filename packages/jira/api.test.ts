import 'dotenv/config';
import {
	makeJiraAgileRequest,
	makeJiraRequest,
	uploadJiraAttachment,
} from './client';
import type {
	CommentsAddResponse,
	CommentsListResponse,
	IssuesAddAttachmentResponse,
	IssuesCreateResponse,
	IssuesGetResponse,
	IssuesGetTransitionsResponse,
	IssuesSearchResponse,
	ProjectsCreateResponse,
	ProjectsGetResponse,
	ProjectsListResponse,
	SprintsListBoardsResponse,
	UsersFindResponse,
	UsersGetCurrentResponse,
} from './endpoints/types';
import { JiraEndpointOutputSchemas, makeAdf } from './endpoints/types';

const API_KEY = process.env.JIRA_API_KEY!;
const CLOUD_URL = process.env.JIRA_CLOUD_URL!;

describe('Jira API Type Tests', () => {
	describe('users', () => {
		it('usersGetCurrent returns correct type', async () => {
			const result = await makeJiraRequest<UsersGetCurrentResponse>(
				'myself',
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			JiraEndpointOutputSchemas.usersGetCurrent.parse(result);
		});

		it('usersFind returns correct type', async () => {
			const currentUser = await makeJiraRequest<UsersGetCurrentResponse>(
				'myself',
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			const result = await makeJiraRequest<UsersFindResponse>(
				'users/search',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: {
						query: currentUser.displayName ?? '',
						maxResults: 5,
					},
				},
			);

			JiraEndpointOutputSchemas.usersFind.parse(result);
		});
	});

	describe('projects', () => {
		it('projectsList returns correct type', async () => {
			const result = await makeJiraRequest<ProjectsListResponse>(
				'project/search',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 10 },
				},
			);

			JiraEndpointOutputSchemas.projectsList.parse(result);
		});

		it('projectsGet returns correct type', async () => {
			const projectsList = await makeJiraRequest<ProjectsListResponse>(
				'project/search',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 1 },
				},
			);

			const projectKey = projectsList.values?.[0]?.key;
			if (!projectKey) {
				throw new Error('No projects found');
			}

			const result = await makeJiraRequest<ProjectsGetResponse>(
				`project/${projectKey}`,
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			JiraEndpointOutputSchemas.projectsGet.parse(result);
		});
	});

	describe('issues', () => {
		let testProjectKey: string;
		let testIssueKey: string | undefined;

		beforeAll(async () => {
			const projectsList = await makeJiraRequest<ProjectsListResponse>(
				'project/search',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 1 },
				},
			);

			const firstProject = projectsList.values?.[0]?.key;
			if (!firstProject) {
				throw new Error('No projects found — cannot run issue tests');
			}
			testProjectKey = firstProject;
		});

		it('issuesCreate returns correct type', async () => {
			const result = await makeJiraRequest<IssuesCreateResponse>(
				'issue',
				API_KEY,
				CLOUD_URL,
				{
					method: 'POST',
					body: {
						fields: {
							project: { key: testProjectKey },
							summary: `Test issue from API test ${Date.now()}`,
							issuetype: { name: 'Task' },
						},
					},
				},
			);

			if (result.key) {
				testIssueKey = result.key;
			}

			JiraEndpointOutputSchemas.issuesCreate.parse(result);
		});

		it('issuesGet returns correct type', async () => {
			if (!testIssueKey) {
				const searchResult = await makeJiraRequest<IssuesSearchResponse>(
					'search/jql',
					API_KEY,
					CLOUD_URL,
					{
						method: 'GET',
						query: {
							jql: `project = ${testProjectKey} ORDER BY created DESC`,
							maxResults: 1,
						},
					},
				);
				const issueKey = searchResult.issues?.[0]?.key;
				if (!issueKey) {
					throw new Error('No issues found');
				}
				testIssueKey = issueKey;
			}

			const result = await makeJiraRequest<IssuesGetResponse>(
				`issue/${testIssueKey}`,
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			JiraEndpointOutputSchemas.issuesGet.parse(result);
		});

		it('issuesSearch returns correct type', async () => {
			const result = await makeJiraRequest<IssuesSearchResponse>(
				'search/jql',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: {
						jql: `project = ${testProjectKey} ORDER BY created DESC`,
						maxResults: 10,
					},
				},
			);

			JiraEndpointOutputSchemas.issuesSearch.parse(result);
		});

		it('issuesGetTransitions returns correct type', async () => {
			if (!testIssueKey) {
				const searchResult = await makeJiraRequest<IssuesSearchResponse>(
					'search/jql',
					API_KEY,
					CLOUD_URL,
					{
						method: 'GET',
						query: {
							jql: `project = ${testProjectKey} ORDER BY created DESC`,
							maxResults: 1,
						},
					},
				);
				const issueKey = searchResult.issues?.[0]?.key;
				if (!issueKey) {
					throw new Error('No issues found for transitions test');
				}
				testIssueKey = issueKey;
			}

			const result = await makeJiraRequest<IssuesGetTransitionsResponse>(
				`issue/${testIssueKey}/transitions`,
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			JiraEndpointOutputSchemas.issuesGetTransitions.parse(result);
		});

		it('issuesAddAttachment returns correct type', async () => {
			if (!testIssueKey) {
				const searchResult = await makeJiraRequest<IssuesSearchResponse>(
					'search/jql',
					API_KEY,
					CLOUD_URL,
					{
						method: 'GET',
						query: {
							jql: `project = ${testProjectKey} ORDER BY created DESC`,
							maxResults: 1,
						},
					},
				);
				const issueKey = searchResult.issues?.[0]?.key;
				if (!issueKey) {
					throw new Error('No issues found for attachment test');
				}
				testIssueKey = issueKey;
			}

			// Upload via URL — mime type is auto-detected from the response Content-Type header
			const urlResult = await uploadJiraAttachment<IssuesAddAttachmentResponse>(
				testIssueKey,
				API_KEY,
				CLOUD_URL,
				{
					name: 'url-attachment.svg',
					url: 'https://www.w3.org/Icons/w3c_home.png',
				},
			);

			JiraEndpointOutputSchemas.issuesAddAttachment.parse(urlResult);
		});
	});

	describe('comments', () => {
		let testProjectKey: string;
		let testIssueKey: string;

		beforeAll(async () => {
			const projectsList = await makeJiraRequest<ProjectsListResponse>(
				'project/search',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 1 },
				},
			);

			const firstProject = projectsList.values?.[0]?.key;
			if (!firstProject) {
				throw new Error('No projects found — cannot run comment tests');
			}
			testProjectKey = firstProject;

			const searchResult = await makeJiraRequest<IssuesSearchResponse>(
				'search/jql',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: {
						jql: `project = ${testProjectKey} ORDER BY created DESC`,
						maxResults: 1,
					},
				},
			);

			const issueKey = searchResult.issues?.[0]?.key;
			if (!issueKey) {
				const created = await makeJiraRequest<IssuesCreateResponse>(
					'issue',
					API_KEY,
					CLOUD_URL,
					{
						method: 'POST',
						body: {
							fields: {
								project: { key: testProjectKey },
								summary: `Test issue for comment tests ${Date.now()}`,
								issuetype: { name: 'Task' },
							},
						},
					},
				);
				if (!created.key) {
					throw new Error('Failed to create test issue for comments');
				}
				testIssueKey = created.key;
			} else {
				testIssueKey = issueKey;
			}
		});

		it('commentsAdd and commentsList return correct types', async () => {
			const addResult = await makeJiraRequest<CommentsAddResponse>(
				`issue/${testIssueKey}/comment`,
				API_KEY,
				CLOUD_URL,
				{
					method: 'POST',
					body: { body: makeAdf('Test comment from API test') },
				},
			);

			JiraEndpointOutputSchemas.commentsAdd.parse(addResult);

			const listResult = await makeJiraRequest<CommentsListResponse>(
				`issue/${testIssueKey}/comment`,
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 10 },
				},
			);

			JiraEndpointOutputSchemas.commentsList.parse(listResult);
		});
	});

	describe('sprints & boards', () => {
		it('sprintsListBoards returns correct type', async () => {
			const result = await makeJiraAgileRequest<SprintsListBoardsResponse>(
				'board',
				API_KEY,
				CLOUD_URL,
				{
					method: 'GET',
					query: { maxResults: 10 },
				},
			);

			JiraEndpointOutputSchemas.sprintsListBoards.parse(result);
		});
	});

	describe('project creation', () => {
		it('projectsCreate returns correct type', async () => {
			const currentUser = await makeJiraRequest<UsersGetCurrentResponse>(
				'myself',
				API_KEY,
				CLOUD_URL,
				{ method: 'GET' },
			);

			// Jira Cloud requires leadAccountId for company-managed project creation
			const uniqueKey = `TST${Date.now().toString().slice(-5)}`;
			const result = await makeJiraRequest<ProjectsCreateResponse>(
				'project',
				API_KEY,
				CLOUD_URL,
				{
					method: 'POST',
					body: {
						key: uniqueKey,
						name: `Test Project ${Date.now()}`,
						projectTypeKey: 'software',
						projectTemplateKey:
							'com.pyxis.greenhopper.jira:gh-simplified-agility-scrum',
						leadAccountId: currentUser.accountId,
						assigneeType: 'UNASSIGNED',
					},
				},
			);

			JiraEndpointOutputSchemas.projectsCreate.parse(result);
		});
	});
});
