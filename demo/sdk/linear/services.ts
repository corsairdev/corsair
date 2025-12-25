import { request as __request } from './core/request';
import { OpenAPI } from './core/OpenAPI';
import type {
  Issue,
  IssueConnection,
  Team,
  TeamConnection,
  Project,
  ProjectConnection,
  Comment,
  CommentConnection,
  CreateIssueInput,
  UpdateIssueInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateCommentInput,
  UpdateCommentInput,
} from './models';

export class IssuesService {
  public static async list(
    teamId?: string,
    first: number = 50,
    after?: string
  ): Promise<IssueConnection> {
    const query = teamId ? `
      query Issues($teamId: String!, $first: Int!, $after: String) {
        issues(filter: { team: { id: { eq: $teamId } } }, first: $first, after: $after) {` : `
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

    const variables: any = { first };
    if (teamId) variables.teamId = teamId;
    if (after) variables.after = after;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables },
    });

    return result.data.issues;
  }

  public static async get(id: string): Promise<Issue> {
    const query = `
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables: { id } },
    });

    return result.data.issue;
  }

  public static async create(input: CreateIssueInput): Promise<Issue> {
    const mutation = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            title
            description
            priority
            estimate
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { input } },
    });

    return result.data.issueCreate.issue;
  }

  public static async update(id: string, input: UpdateIssueInput): Promise<Issue> {
    const mutation = `
      mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue {
            id
            title
            description
            priority
            estimate
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id, input } },
    });

    return result.data.issueUpdate.issue;
  }

  public static async delete(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteIssue($id: String!) {
        issueDelete(id: $id) {
          success
        }
      }
    `;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id } },
    });

    return result.data.issueDelete.success;
  }
}

export class TeamsService {
  public static async list(first: number = 50, after?: string): Promise<TeamConnection> {
    const query = `
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

    const variables: any = { first };
    if (after) variables.after = after;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables },
    });

    return result.data.teams;
  }

  public static async get(id: string): Promise<Team> {
    const query = `
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables: { id } },
    });

    return result.data.team;
  }
}

export class ProjectsService {
  public static async list(first: number = 50, after?: string): Promise<ProjectConnection> {
    const query = `
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

    const variables: any = { first };
    if (after) variables.after = after;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables },
    });

    return result.data.projects;
  }

  public static async get(id: string): Promise<Project> {
    const query = `
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables: { id } },
    });

    return result.data.project;
  }

  public static async create(input: CreateProjectInput): Promise<Project> {
    const mutation = `
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { input } },
    });

    return result.data.projectCreate.project;
  }

  public static async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const mutation = `
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id, input } },
    });

    return result.data.projectUpdate.project;
  }

  public static async delete(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteProject($id: String!) {
        projectDelete(id: $id) {
          success
        }
      }
    `;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id } },
    });

    return result.data.projectDelete.success;
  }
}

export class CommentsService {
  public static async list(issueId: string, first: number = 50, after?: string): Promise<CommentConnection> {
    const query = `
      query Comments($issueId: String!, $first: Int!, $after: String) {
        issue(id: $issueId) {
          comments(first: $first, after: $after) {
            nodes {
              id
              body
              user {
                id
                name
                displayName
              }
              editedAt
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
      }
    `;

    const variables: any = { issueId, first };
    if (after) variables.after = after;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query, variables },
    });

    return result.data.issue.comments;
  }

  public static async create(input: CreateCommentInput): Promise<Comment> {
    const mutation = `
      mutation CreateComment($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
          comment {
            id
            body
            user {
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

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { input } },
    });

    return result.data.commentCreate.comment;
  }

  public static async update(id: string, input: UpdateCommentInput): Promise<Comment> {
    const mutation = `
      mutation UpdateComment($id: String!, $input: CommentUpdateInput!) {
        commentUpdate(id: $id, input: $input) {
          success
          comment {
            id
            body
            editedAt
            updatedAt
          }
        }
      }
    `;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id, input } },
    });

    return result.data.commentUpdate.comment;
  }

  public static async delete(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteComment($id: String!) {
        commentDelete(id: $id) {
          success
        }
      }
    `;

    const result = await __request<any>(OpenAPI, {
      method: 'POST',
      url: '',
      body: { query: mutation, variables: { id } },
    });

    return result.data.commentDelete.success;
  }
}

