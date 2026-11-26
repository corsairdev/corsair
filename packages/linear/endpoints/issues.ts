import { logEventFromContext } from 'corsair/core';
import { makeLinearRequest } from '../client';
import type { LinearBoundEndpoints, LinearEndpoints } from '../index';
import type {
	IssueCreateResponse,
	IssueDeleteResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
} from './types';
import { buildLinearIssueFilter, LinearEndpointInputSchemas } from './types';

// Single selection for every query that upserts issues: upsertByEntityId replaces the
// stored row, so a thinner query would drop fields another path stored.
const ISSUE_FIELDS = `
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
  dueDate
  startedAt
  completedAt
  canceledAt
  createdAt
  updatedAt
`;

const ISSUES_LIST_QUERY = `
  query Issues($filter: IssueFilter, $orderBy: PaginationOrderBy, $first: Int!, $after: String) {
    issues(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      nodes {
        ${ISSUE_FIELDS}
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
      ${ISSUE_FIELDS}
      subscribers {
        nodes {
          id
          name
          displayName
        }
      }
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

export const list: LinearEndpoints['issuesList'] = async (ctx, rawInput) => {
	// Core doesn't apply input schemas to direct calls; parse so a bad filter or orderBy
	// fails here instead of reaching Linear.
	const input = LinearEndpointInputSchemas.issuesList.parse(rawInput);
	const filter = buildLinearIssueFilter(input);
	const variables: Record<string, unknown> = {
		first: input.first || 50,
	};
	if (filter) {
		variables.filter = filter;
	}
	if (input.orderBy) {
		variables.orderBy = input.orderBy;
	}
	if (input.after) {
		variables.after = input.after;
	}

	const response = await makeLinearRequest<IssuesListResponse>(
		ISSUES_LIST_QUERY,
		ctx.key,
		variables,
	);

	const result = response.issues;

	if (result.nodes && ctx.db.issues) {
		try {
			for (const issue of result.nodes) {
				await ctx.db.issues.upsertByEntityId(issue.id, {
					...issue,
					stateId: issue.state?.id,
					teamId: issue.team?.id,
					assigneeId: issue.assignee?.id,
					creatorId: issue.creator?.id,
					projectId: issue.project?.id,
					cycleId: issue.cycle?.id,
					createdAt: new Date(issue.createdAt ?? ''),
					updatedAt: new Date(issue.updatedAt ?? ''),
				});
			}
		} catch (error) {
			console.warn('Failed to save issues to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.issues.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: LinearEndpoints['issuesGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueGetResponse>(
		ISSUE_GET_QUERY,
		ctx.key,
		{ id: input.id },
	);

	const result = response.issue;

	if (result && ctx.db.issues) {
		try {
			await ctx.db.issues.upsertByEntityId(result.id, {
				...result,
				stateId: result.state?.id,
				teamId: result.team?.id,
				assigneeId: result.assignee?.id,
				creatorId: result.creator?.id,
				projectId: result.project?.id,
				cycleId: result.cycle?.id,
				createdAt: new Date(result.createdAt ?? ''),
				updatedAt: new Date(result.updatedAt ?? ''),
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

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

	const result = response.issueCreate.issue;

	if (result) {
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

	const result = response.issueUpdate.issue;

	if (result) {
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

	const result = response.issueDelete.success;

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
