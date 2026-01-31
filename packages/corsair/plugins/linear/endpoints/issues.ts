import { logEventFromContext } from '../../utils/events';
import type { LinearEndpoints } from '..';
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
	const variables: Record<string, unknown> = {
		first: input.first || 50,
	};
	if (input.after) {
		variables.after = input.after;
	}

	const response = await makeLinearRequest<IssuesListResponse>(
		ISSUES_LIST_QUERY_NO_FILTER,
		ctx.options.credentials.apiKey,
		variables,
	);

	const allIssues = response.issues;

	if (allIssues.nodes && ctx.db.issues) {
		try {
			for (const issue of allIssues.nodes) {
				await ctx.db.issues.upsert(issue.id, {
					id: issue.id,
					title: issue.title,
					description: issue.description ?? undefined,
					priority: issue.priority,
					estimate: issue.estimate ?? undefined,
					sortOrder: issue.sortOrder,
					number: issue.number,
					identifier: issue.identifier,
					url: issue.url,
					stateId: issue.state.id,
					teamId: issue.team.id,
					assigneeId: issue.assignee?.id ?? undefined,
					creatorId: issue.creator.id,
					projectId: issue.project?.id ?? undefined,
					cycleId: issue.cycle?.id ?? undefined,
					parentId: issue.parent?.id ?? undefined,
					dueDate: issue.dueDate ?? undefined,
					startedAt: issue.startedAt ?? undefined,
					completedAt: issue.completedAt ?? undefined,
					canceledAt: issue.canceledAt ?? undefined,
					triagedAt: issue.triagedAt ?? undefined,
					snoozedUntilAt: issue.snoozedUntilAt ?? undefined,
					createdAt: new Date(issue.createdAt),
					updatedAt: new Date(issue.updatedAt),
					archivedAt: issue.archivedAt ?? undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save issues to database:', error);
		}
	}

	let result = allIssues;

	if (input.teamId && result.nodes) {
		result = {
			...result,
			nodes: result.nodes.filter((issue) => issue.team.id === input.teamId),
		};
	}

	await logEventFromContext(ctx, 'linear.issues.list', { ...input }, 'completed');
	return result;
};

export const get: LinearEndpoints['issuesGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueGetResponse>(
		ISSUE_GET_QUERY,
		ctx.options.credentials.apiKey,
		{ id: input.id },
	);

	const result = response.issue;

		if (result && ctx.db.issues) {
			try {
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description ?? undefined,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id ?? undefined,
					creatorId: result.creator.id,
					projectId: result.project?.id ?? undefined,
					cycleId: result.cycle?.id ?? undefined,
					parentId: result.parent?.id ?? undefined,
					dueDate: result.dueDate ?? undefined,
					startedAt: result.startedAt ?? undefined,
					completedAt: result.completedAt ?? undefined,
					canceledAt: result.canceledAt ?? undefined,
					triagedAt: result.triagedAt ?? undefined,
					snoozedUntilAt: result.snoozedUntilAt ?? undefined,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt ?? undefined,
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

	await logEventFromContext(ctx, 'linear.issues.get', { ...input }, 'completed');
	return result;
};

export const create: LinearEndpoints['issuesCreate'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueCreateResponse>(
		ISSUE_CREATE_MUTATION,
		ctx.options.credentials.apiKey,
		{ input },
	);

	const result = response.issueCreate.issue;

		if (result && ctx.db.issues) {
			try {
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description ?? undefined,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id ?? undefined,
					creatorId: result.creator.id,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

	await logEventFromContext(ctx, 'linear.issues.create', { ...input }, 'completed');
	return result;
};

export const update: LinearEndpoints['issuesUpdate'] = async (ctx, input) => {
	const response = await makeLinearRequest<IssueUpdateResponse>(
		ISSUE_UPDATE_MUTATION,
		ctx.options.credentials.apiKey,
		{ id: input.id, input: input.input },
	);

	const result = response.issueUpdate.issue;

		if (result && ctx.db.issues) {
			try {
				const existing = await ctx.db.issues.findByEntityId(result.id);
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description ?? undefined,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id ?? undefined,
					creatorId: existing?.data?.creatorId || '',
					projectId: existing?.data?.projectId ?? undefined,
					cycleId: existing?.data?.cycleId ?? undefined,
					parentId: existing?.data?.parentId ?? undefined,
					dueDate: existing?.data?.dueDate ?? undefined,
					startedAt: existing?.data?.startedAt ?? undefined,
					completedAt: existing?.data?.completedAt ?? undefined,
					canceledAt: existing?.data?.canceledAt ?? undefined,
					triagedAt: existing?.data?.triagedAt ?? undefined,
					snoozedUntilAt: existing?.data?.snoozedUntilAt ?? undefined,
					createdAt: existing?.data?.createdAt || new Date(),
					updatedAt: new Date(result.updatedAt),
					archivedAt: existing?.data?.archivedAt ?? undefined,
				});
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

	await logEventFromContext(ctx, 'linear.issues.update', { ...input }, 'completed');
	return result;
};

export const deleteIssue: LinearEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<IssueDeleteResponse>(
		ISSUE_DELETE_MUTATION,
		ctx.options.credentials.apiKey,
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

	await logEventFromContext(ctx, 'linear.issues.delete', { ...input }, 'completed');
	return result;
};
