import dotenv from 'dotenv';
import { makeLinearRequest } from './client';
import type {
	CommentCreateResponse,
	CommentDeleteResponse,
	CommentsListResponse,
	CommentUpdateResponse,
	IssueCreateResponse,
	IssueDeleteResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
	LinearEndpointOutputs,
	ProjectCreateResponse,
	ProjectDeleteResponse,
	ProjectGetResponse,
	ProjectsListResponse,
	ProjectUpdateResponse,
	TeamGetResponse,
	TeamsListResponse,
} from './endpoints/types';
import { LinearEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

type AssertExactType<T, U> = T extends U ? (U extends T ? true : never) : never;

const TEST_TOKEN = process.env.LINEAR_API_KEY!;

const TEAMS_LIST_QUERY = `
  query Teams($first: Int!, $after: String) {
    teams(first: $first, after: $after) {
      nodes {
        id
        name
        key
        description
        icon
        color
        private
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const TEAM_GET_QUERY = `
  query Team($id: String!) {
    team(id: $id) {
      id
      name
      key
      description
      icon
      color
      private
      createdAt
      updatedAt
    }
  }
`;

const ISSUES_LIST_QUERY = `
  query Issues($first: Int!, $after: String) {
    issues(first: $first, after: $after) {
      nodes {
        id
        title
        description
        priority
        estimate
        sortOrder
        number
        identifier
        url
        state {
          id
          name
          type
          color
          position
        }
        team {
          id
          name
          key
        }
        assignee {
          id
          name
          displayName
          email
          avatarUrl
        }
        creator {
          id
          name
          displayName
          email
          avatarUrl
        }
        labels {
          nodes {
            id
            name
            color
          }
        }
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const ISSUE_GET_QUERY = `
  query Issue($id: String!) {
    issue(id: $id) {
      id
      title
      description
      priority
      estimate
      sortOrder
      number
      identifier
      url
      state {
        id
        name
        type
        color
        position
      }
      team {
        id
        name
        key
      }
      assignee {
        id
        name
        displayName
        email
        avatarUrl
      }
      creator {
        id
        name
        displayName
        email
        avatarUrl
      }
      project {
        id
        name
        state
      }
      cycle {
        id
        number
        name
      }
      labels {
        nodes {
          id
          name
          color
        }
      }
      subscribers {
        nodes {
          id
          name
          displayName
        }
      }
      dueDate
      startedAt
      completedAt
      canceledAt
      createdAt
      updatedAt
    }
  }
`;

const ISSUE_CREATE_MUTATION = `
  mutation CreateIssue($input: IssueCreateInput!) {
    issueCreate(input: $input) {
      success
      issue {
        id
        title
        description
        priority
        estimate
        sortOrder
        number
        identifier
        url
        state {
          id
          name
          type
        }
        team {
          id
          name
          key
        }
        assignee {
          id
          name
          displayName
        }
        creator {
          id
          name
          displayName
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const ISSUE_UPDATE_MUTATION = `
  mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
    issueUpdate(id: $id, input: $input) {
      success
      issue {
        id
        title
        description
        priority
        estimate
        sortOrder
        number
        identifier
        url
        state {
          id
          name
          type
        }
        team {
          id
          name
          key
        }
        assignee {
          id
          name
          displayName
        }
        updatedAt
      }
    }
  }
`;

const ISSUE_DELETE_MUTATION = `
  mutation DeleteIssue($id: String!) {
    issueDelete(id: $id) {
      success
    }
  }
`;

const PROJECTS_LIST_QUERY = `
  query Projects($first: Int!, $after: String) {
    projects(first: $first, after: $after) {
      nodes {
        id
        name
        description
        icon
        color
        state
        priority
        sortOrder
        startDate
        targetDate
        completedAt
        canceledAt
        lead {
          id
          name
          displayName
        }
        teams {
          nodes {
            id
            name
            key
          }
        }
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const PROJECT_GET_QUERY = `
  query Project($id: String!) {
    project(id: $id) {
      id
      name
      description
      icon
      color
      state
      priority
      sortOrder
      startDate
      targetDate
      completedAt
      canceledAt
      lead {
        id
        name
        displayName
        email
      }
      teams {
        nodes {
          id
          name
          key
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const PROJECT_CREATE_MUTATION = `
  mutation CreateProject($input: ProjectCreateInput!) {
    projectCreate(input: $input) {
      success
      project {
        id
        name
        description
        icon
        color
        state
        priority
        startDate
        targetDate
        lead {
          id
          name
          displayName
        }
        teams {
          nodes {
            id
            name
            key
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const PROJECT_UPDATE_MUTATION = `
  mutation UpdateProject($id: String!, $input: ProjectUpdateInput!) {
    projectUpdate(id: $id, input: $input) {
      success
      project {
        id
        name
        description
        icon
        color
        state
        priority
        startDate
        targetDate
        updatedAt
      }
    }
  }
`;

const PROJECT_DELETE_MUTATION = `
  mutation DeleteProject($id: String!) {
    projectDelete(id: $id) {
      success
    }
  }
`;

const COMMENTS_LIST_QUERY = `
  query Comments($issueId: String!, $first: Int!, $after: String) {
    issue(id: $issueId) {
      comments(first: $first, after: $after) {
        nodes {
          id
          body
          issue {
            id
          }
          user {
            id
            name
            displayName
          }
          parent {
            id
          }
          editedAt
          createdAt
          updatedAt
          archivedAt
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const COMMENT_CREATE_MUTATION = `
  mutation CreateComment($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      success
      comment {
        id
        body
        issue {
          id
        }
        user {
          id
          name
          displayName
        }
        parent {
          id
        }
        createdAt
        updatedAt
        archivedAt
      }
    }
  }
`;

const COMMENT_UPDATE_MUTATION = `
  mutation UpdateComment($id: String!, $input: CommentUpdateInput!) {
    commentUpdate(id: $id, input: $input) {
      success
      comment {
        id
        body
        issue {
          id
        }
        user {
          id
          name
          displayName
        }
        parent {
          id
        }
        editedAt
        createdAt
        updatedAt
        archivedAt
      }
    }
  }
`;

const COMMENT_DELETE_MUTATION = `
  mutation DeleteComment($id: String!) {
    commentDelete(id: $id) {
      success
    }
  }
`;

describe('Linear API Type Tests', () => {
	describe('teams', () => {
		it('teamsList returns correct type', async () => {
			const response = await makeLinearRequest<TeamsListResponse>(
				TEAMS_LIST_QUERY,
				TEST_TOKEN,
				{ first: 50 },
			);
			const result = response.teams;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.teamsList.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['teamsList']
			>;
			const _assert: _Check = true;
		});

		it('teamsGet returns correct type', async () => {
			const teamsListResponse = await makeLinearRequest<TeamsListResponse>(
				TEAMS_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const teamId = teamsListResponse.teams.nodes[0]?.id;
			if (!teamId) {
				throw new Error('No teams found');
			}

			const response = await makeLinearRequest<TeamGetResponse>(
				TEAM_GET_QUERY,
				TEST_TOKEN,
				{ id: teamId },
			);
			const result = response.team;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.teamsGet.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['teamsGet']
			>;
			const _assert: _Check = true;
		});
	});

	describe('issues', () => {
		it('issuesList returns correct type', async () => {
			const response = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 50 },
			);
			const result = response.issues;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.issuesList.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['issuesList']
			>;
			const _assert: _Check = true;
		});

		it('issuesGet returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeLinearRequest<IssueGetResponse>(
				ISSUE_GET_QUERY,
				TEST_TOKEN,
				{ id: issueId },
			);
			const result = response.issue;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.issuesGet.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['issuesGet']
			>;
			const _assert: _Check = true;
		});

		it('issuesCreate returns correct type', async () => {
			const teamsListResponse = await makeLinearRequest<TeamsListResponse>(
				TEAMS_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const teamId = teamsListResponse.teams.nodes[0]?.id;
			if (!teamId) {
				throw new Error('No teams found');
			}

			const response = await makeLinearRequest<IssueCreateResponse>(
				ISSUE_CREATE_MUTATION,
				TEST_TOKEN,
				{ input: { title: 'Test issue', teamId } },
			);
			const result = response.issueCreate.issue;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.issuesCreate.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['issuesCreate']
			>;
			const _assert: _Check = true;
		});

		it('issuesUpdate returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeLinearRequest<IssueUpdateResponse>(
				ISSUE_UPDATE_MUTATION,
				TEST_TOKEN,
				{ id: issueId, input: { title: 'Updated issue' } },
			);
			const result = response.issueUpdate.issue;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.issuesUpdate.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['issuesUpdate']
			>;
			const _assert: _Check = true;
		});

		it('issuesDelete returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeLinearRequest<IssueDeleteResponse>(
				ISSUE_DELETE_MUTATION,
				TEST_TOKEN,
				{ id: issueId },
			);
			const result = response.issueDelete.success;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.issuesDelete.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['issuesDelete']
			>;
			const _assert: _Check = true;
		});
	});

	describe('projects', () => {
		it('projectsList returns correct type', async () => {
			const response = await makeLinearRequest<ProjectsListResponse>(
				PROJECTS_LIST_QUERY,
				TEST_TOKEN,
				{ first: 50 },
			);
			const result = response.projects;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.projectsList.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['projectsList']
			>;
			const _assert: _Check = true;
		});

		it('projectsGet returns correct type', async () => {
			const projectsListResponse =
				await makeLinearRequest<ProjectsListResponse>(
					PROJECTS_LIST_QUERY,
					TEST_TOKEN,
					{ first: 1 },
				);
			const projectId = projectsListResponse.projects.nodes[0]?.id;
			if (!projectId) {
				throw new Error('No projects found');
			}

			const response = await makeLinearRequest<ProjectGetResponse>(
				PROJECT_GET_QUERY,
				TEST_TOKEN,
				{ id: projectId },
			);
			const result = response.project;

			// Runtime validation with Zod
			const validated = LinearEndpointOutputSchemas.projectsGet.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['projectsGet']
			>;
			const _assert: _Check = true;
		});

		it('projectsCreate returns correct type', async () => {
			const teamsListResponse = await makeLinearRequest<TeamsListResponse>(
				TEAMS_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const teamId = teamsListResponse.teams.nodes[0]?.id;
			if (!teamId) {
				throw new Error('No teams found');
			}

			const response = await makeLinearRequest<ProjectCreateResponse>(
				PROJECT_CREATE_MUTATION,
				TEST_TOKEN,
				{ input: { name: 'Test project', teamIds: [teamId] } },
			);
			const result = response.projectCreate.project;

			// Runtime validation with Zod
			const validated =
				LinearEndpointOutputSchemas.projectsCreate.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['projectsCreate']
			>;
			const _assert: _Check = true;
		});

		it('projectsUpdate returns correct type', async () => {
			const projectsListResponse =
				await makeLinearRequest<ProjectsListResponse>(
					PROJECTS_LIST_QUERY,
					TEST_TOKEN,
					{ first: 1 },
				);
			const projectId = projectsListResponse.projects.nodes[0]?.id;
			if (!projectId) {
				throw new Error('No projects found');
			}

			const response = await makeLinearRequest<ProjectUpdateResponse>(
				PROJECT_UPDATE_MUTATION,
				TEST_TOKEN,
				{ id: projectId, input: { name: 'Updated project' } },
			);
			const result = response.projectUpdate.project;

			// Runtime validation with Zod
			const validated =
				LinearEndpointOutputSchemas.projectsUpdate.parse(result);

			// Compile-time type check
			type _Check = AssertExactType<
				typeof result,
				LinearEndpointOutputs['projectsUpdate']
			>;
			const _assert: _Check = true;
		});

		it('projectsDelete returns correct type', async () => {
			const projectsListResponse =
				await makeLinearRequest<ProjectsListResponse>(
					PROJECTS_LIST_QUERY,
					TEST_TOKEN,
					{ first: 1 },
				);
			const projectId = projectsListResponse.projects.nodes[0]?.id;
			if (!projectId) {
				throw new Error('No projects found');
			}

			const response = await makeLinearRequest<ProjectDeleteResponse>(
				PROJECT_DELETE_MUTATION,
				TEST_TOKEN,
				{ id: projectId },
			);
			const result = response.projectDelete.success;

			// Runtime validation with Zod
			LinearEndpointOutputSchemas.projectsDelete.parse(result);
		});
	});

	describe('comments', () => {
		it('commentsList returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeLinearRequest<CommentsListResponse>(
				COMMENTS_LIST_QUERY,
				TEST_TOKEN,
				{ issueId, first: 50 },
			);
			const result = response.issue.comments;

			// Runtime validation with Zod
			LinearEndpointOutputSchemas.commentsList.parse(result);
		});

		it('commentsCreate returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeLinearRequest<CommentCreateResponse>(
				COMMENT_CREATE_MUTATION,
				TEST_TOKEN,
				{ input: { issueId, body: 'Test comment' } },
			);
			const result = response.commentCreate.comment;

			// Runtime validation with Zod
			LinearEndpointOutputSchemas.commentsCreate.parse(result);
		});

		it('commentsUpdate returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const commentsListResponse =
				await makeLinearRequest<CommentsListResponse>(
					COMMENTS_LIST_QUERY,
					TEST_TOKEN,
					{ issueId, first: 1 },
				);
			const commentId = commentsListResponse.issue.comments.nodes[0]?.id;
			if (!commentId) {
				throw new Error('No comments found');
			}

			const response = await makeLinearRequest<CommentUpdateResponse>(
				COMMENT_UPDATE_MUTATION,
				TEST_TOKEN,
				{ id: commentId, input: { body: 'Updated comment' } },
			);
			const result = response.commentUpdate.comment;

			// Runtime validation with Zod
			LinearEndpointOutputSchemas.commentsUpdate.parse(result);
		});

		it('commentsDelete returns correct type', async () => {
			const issuesListResponse = await makeLinearRequest<IssuesListResponse>(
				ISSUES_LIST_QUERY,
				TEST_TOKEN,
				{ first: 1 },
			);
			const issueId = issuesListResponse.issues.nodes[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const commentsListResponse =
				await makeLinearRequest<CommentsListResponse>(
					COMMENTS_LIST_QUERY,
					TEST_TOKEN,
					{ issueId, first: 1 },
				);
			const commentId = commentsListResponse.issue.comments.nodes[0]?.id;
			if (!commentId) {
				throw new Error('No comments found');
			}

			const response = await makeLinearRequest<CommentDeleteResponse>(
				COMMENT_DELETE_MUTATION,
				TEST_TOKEN,
				{ id: commentId },
			);
			const result = response.commentDelete.success;

			// Runtime validation with Zod
			LinearEndpointOutputSchemas.commentsDelete.parse(result);
		});
	});
});
