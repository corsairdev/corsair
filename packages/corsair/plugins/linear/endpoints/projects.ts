import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type {
	CreateProjectInput,
	ProjectCreateResponse,
	ProjectDeleteResponse,
	ProjectGetResponse,
	ProjectsListResponse,
	ProjectUpdateResponse,
	UpdateProjectInput,
} from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

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

export const list: LinearEndpoints['projectsList'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.projects.list', {
		first: input.first,
		after: input.after,
	});

	try {
		const response = await makeLinearRequest<ProjectsListResponse>(
			PROJECTS_LIST_QUERY,
			ctx.options.apiKey,
			{
				first: input.first || 50,
				after: input.after,
			},
		);

		const result = response.projects;

		if (result.nodes && ctx.db.projects) {
			try {
				for (const project of result.nodes) {
					await ctx.db.projects.upsert(project.id, {
						id: project.id,
						name: project.name,
						description: project.description,
						icon: project.icon,
						color: project.color,
						state: project.state,
						priority: project.priority,
						sortOrder: project.sortOrder,
						startDate: project.startDate,
						targetDate: project.targetDate,
						completedAt: project.completedAt,
						canceledAt: project.canceledAt,
						leadId: project.lead?.id,
						createdAt: new Date(project.createdAt),
						updatedAt: new Date(project.updatedAt),
						archivedAt: project.archivedAt,
					});
				}
			} catch (error) {
				console.warn('Failed to save projects to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const get: LinearEndpoints['projectsGet'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.projects.get', {
		id: input.id,
	});

	try {
		const response = await makeLinearRequest<ProjectGetResponse>(
			PROJECT_GET_QUERY,
			ctx.options.apiKey,
			{ id: input.id },
		);

		const result = response.project;

		if (result && ctx.db.projects) {
			try {
				await ctx.db.projects.upsert(result.id, {
					id: result.id,
					name: result.name,
					description: result.description,
					icon: result.icon,
					color: result.color,
					state: result.state,
					priority: result.priority,
					sortOrder: result.sortOrder,
					startDate: result.startDate,
					targetDate: result.targetDate,
					completedAt: result.completedAt,
					canceledAt: result.canceledAt,
					leadId: result.lead?.id,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const create: LinearEndpoints['projectsCreate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.projects.create', {
		name: input.name,
		description: input.description,
		icon: input.icon,
		color: input.color,
		teamIds: input.teamIds,
		leadId: input.leadId,
		state: input.state,
		priority: input.priority,
		startDate: input.startDate,
		targetDate: input.targetDate,
	});

	try {
		const response = await makeLinearRequest<ProjectCreateResponse>(
			PROJECT_CREATE_MUTATION,
			ctx.options.apiKey,
			{ input: input as CreateProjectInput },
		);

		const result = response.projectCreate.project;

		if (result && ctx.db.projects) {
			try {
				await ctx.db.projects.upsert(result.id, {
					id: result.id,
					name: result.name,
					description: result.description,
					icon: result.icon,
					color: result.color,
					state: result.state,
					priority: result.priority,
					sortOrder: result.sortOrder,
					startDate: result.startDate,
					targetDate: result.targetDate,
					completedAt: result.completedAt,
					canceledAt: result.canceledAt,
					leadId: result.lead?.id,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const update: LinearEndpoints['projectsUpdate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.projects.update', {
		id: input.id,
		input: input.input,
	});

	try {
		const response = await makeLinearRequest<ProjectUpdateResponse>(
			PROJECT_UPDATE_MUTATION,
			ctx.options.apiKey,
			{ id: input.id, input: input.input as UpdateProjectInput },
		);

		const result = response.projectUpdate.project;

		if (result && ctx.db.projects) {
			try {
				const existing = await ctx.db.projects.findByResourceId(result.id);
				await ctx.db.projects.upsert(result.id, {
					id: result.id,
					name: result.name,
					description: result.description,
					icon: result.icon,
					color: result.color,
					state: result.state,
					priority: result.priority,
					sortOrder: result.sortOrder,
					startDate: result.startDate,
					targetDate: result.targetDate,
					completedAt: existing?.data?.completedAt,
					canceledAt: existing?.data?.canceledAt,
					leadId: existing?.data?.leadId,
					createdAt: existing?.data?.createdAt || new Date(),
					updatedAt: new Date(result.updatedAt),
					archivedAt: existing?.data?.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const deleteProject: LinearEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'linear.projects.delete', {
		id: input.id,
	});

	try {
		const response = await makeLinearRequest<ProjectDeleteResponse>(
			PROJECT_DELETE_MUTATION,
			ctx.options.apiKey,
			{ id: input.id },
		);

		const result = response.projectDelete.success;

		if (result && ctx.db.projects) {
			try {
				await ctx.db.projects.deleteByResourceId(input.id);
			} catch (error) {
				console.warn('Failed to delete project from database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
