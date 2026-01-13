import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type {
	IssueCreateResponse,
	IssueDeleteResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
} from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

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

	const eventId = await logEvent(ctx.database, 'linear.issues.list', {
		teamId: input.teamId,
		first: input.first,
		after: input.after,
	});

	try {
		const response = await makeLinearRequest<IssuesListResponse>(
			query,
			ctx.options.apiKey,
			variables,
		);

		const result = response.issues;

		if (result.nodes && ctx.db.issues) {
			try {
				for (const issue of result.nodes) {
					await ctx.db.issues.upsert(issue.id, {
						id: issue.id,
						title: issue.title,
						description: issue.description,
						priority: issue.priority,
						estimate: issue.estimate ?? undefined,
						sortOrder: issue.sortOrder,
						number: issue.number,
						identifier: issue.identifier,
						url: issue.url,
						stateId: issue.state.id,
						teamId: issue.team.id,
						assigneeId: issue.assignee?.id,
						creatorId: issue.creator.id,
						projectId: issue.project?.id,
						cycleId: issue.cycle?.id,
						parentId: issue.parent?.id,
						dueDate: issue.dueDate,
						startedAt: issue.startedAt,
						completedAt: issue.completedAt,
						canceledAt: issue.canceledAt,
						triagedAt: issue.triagedAt,
						snoozedUntilAt: issue.snoozedUntilAt,
						createdAt: new Date(issue.createdAt),
						updatedAt: new Date(issue.updatedAt),
						archivedAt: issue.archivedAt,
					});
				}
			} catch (error) {
				console.warn('Failed to save issues to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const get: LinearEndpoints['issuesGet'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.issues.get', {
		id: input.id,
	});

	try {
		const response = await makeLinearRequest<IssueGetResponse>(
			ISSUE_GET_QUERY,
			ctx.options.apiKey,
			{ id: input.id },
		);

		const result = response.issue;

		if (result && ctx.db.issues) {
			try {
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id,
					creatorId: result.creator.id,
					projectId: result.project?.id,
					cycleId: result.cycle?.id,
					parentId: result.parent?.id,
					dueDate: result.dueDate,
					startedAt: result.startedAt,
					completedAt: result.completedAt,
					canceledAt: result.canceledAt,
					triagedAt: result.triagedAt,
					snoozedUntilAt: result.snoozedUntilAt,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const create: LinearEndpoints['issuesCreate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.issues.create', {
		title: input.title,
		description: input.description,
		teamId: input.teamId,
		assigneeId: input.assigneeId,
		priority: input.priority,
		estimate: input.estimate,
		stateId: input.stateId,
		projectId: input.projectId,
		cycleId: input.cycleId,
		parentId: input.parentId,
		labelIds: input.labelIds,
		subscriberIds: input.subscriberIds,
		dueDate: input.dueDate,
	});

	try {
		const response = await makeLinearRequest<IssueCreateResponse>(
			ISSUE_CREATE_MUTATION,
			ctx.options.apiKey,
			{ input },
		);

		const result = response.issueCreate.issue;

		if (result && ctx.db.issues) {
			try {
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id,
					creatorId: result.creator.id,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const update: LinearEndpoints['issuesUpdate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.issues.update', {
		id: input.id,
		input: input.input,
	});

	try {
		const response = await makeLinearRequest<IssueUpdateResponse>(
			ISSUE_UPDATE_MUTATION,
			ctx.options.apiKey,
			{ id: input.id, input: input.input },
		);

		const result = response.issueUpdate.issue;

		if (result && ctx.db.issues) {
			try {
				const existing = await ctx.db.issues.findByResourceId(result.id);
				await ctx.db.issues.upsert(result.id, {
					id: result.id,
					title: result.title,
					description: result.description,
					priority: result.priority,
					estimate: result.estimate ?? undefined,
					sortOrder: result.sortOrder,
					number: result.number,
					identifier: result.identifier,
					url: result.url,
					stateId: result.state.id,
					teamId: result.team.id,
					assigneeId: result.assignee?.id,
					creatorId: existing?.data?.creatorId || '',
					projectId: existing?.data?.projectId,
					cycleId: existing?.data?.cycleId,
					parentId: existing?.data?.parentId,
					dueDate: existing?.data?.dueDate,
					startedAt: existing?.data?.startedAt,
					completedAt: existing?.data?.completedAt,
					canceledAt: existing?.data?.canceledAt,
					triagedAt: existing?.data?.triagedAt,
					snoozedUntilAt: existing?.data?.snoozedUntilAt,
					createdAt: existing?.data?.createdAt || new Date(),
					updatedAt: new Date(result.updatedAt),
					archivedAt: existing?.data?.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const deleteIssue: LinearEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'linear.issues.delete', {
		id: input.id,
	});

	try {
		const response = await makeLinearRequest<IssueDeleteResponse>(
			ISSUE_DELETE_MUTATION,
			ctx.options.apiKey,
			{ id: input.id },
		);

		const result = response.issueDelete.success;

		if (result && ctx.db.issues) {
			try {
				await ctx.db.issues.deleteByResourceId(input.id);
			} catch (error) {
				console.warn('Failed to delete issue from database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
