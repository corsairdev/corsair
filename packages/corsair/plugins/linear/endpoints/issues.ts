import { logEventFromContext } from '../../utils/events';
import type { LinearBoundEndpoints, LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type {
	IssueCreateResponse,
	IssueDeleteResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
} from './types';

const ISSUES_LIST_QUERY = `
  query Issues($teamId: String!, $first: Int!, $after: String) {
    issues(filter: { team: { id: { eq: $teamId } } }, first: $first, after: $after) {
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

const ISSUES_LIST_QUERY_NO_FILTER = `
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

export const list: LinearEndpoints['issuesList'] = async (ctx, input) => {
	const query = input.teamId ? ISSUES_LIST_QUERY : ISSUES_LIST_QUERY_NO_FILTER;
	const variables: Record<string, unknown> = {
		first: input.first || 50,
	};
	if (input.teamId) {
		variables.teamId = input.teamId;
	}
	if (input.after) {
		variables.after = input.after;
	}

	const result = await makeLinearRequest<IssuesListResponse>(
		query,
		ctx.key,
		variables,
	);


	await logEventFromContext(
		ctx,
		'linear.issues.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: LinearEndpoints['issuesGet'] = async (ctx, input) => {
	const result = await makeLinearRequest<IssueGetResponse>(
		ISSUE_GET_QUERY,
		ctx.key,
		{ id: input.id },
	);

	await logEventFromContext(
		ctx,
		'linear.issues.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: LinearEndpoints['issuesCreate'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueCreateResponse>(
		ISSUE_CREATE_MUTATION,
		ctx.key,
		{ input },
	);

	const result = response;

	if (result && result) {
		const endpoints = ctx.endpoints as LinearBoundEndpoints;
		await endpoints.issues.get({ id: result.id });
	}

	await logEventFromContext(
		ctx,
		'linear.issues.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: LinearEndpoints['issuesUpdate'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueUpdateResponse>(
		ISSUE_UPDATE_MUTATION,
		ctx.key,
		{ id: input.id, input: input.input },
	);

	const result = response;

	if (result && result) {
		const endpoints = ctx.endpoints as LinearBoundEndpoints;
		await endpoints.issues.get({ id: result.id });
	}

	await logEventFromContext(
		ctx,
		'linear.issues.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteIssue: LinearEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<IssueDeleteResponse>(
		ISSUE_DELETE_MUTATION,
		ctx.key,
		{ id: input.id },
	);

	const result = response;

	if (result && ctx.db.issues) {
		try {
			await ctx.db.issues.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete issue from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.issues.delete',
		{ ...input },
		'completed',
	);
	return result;
};
