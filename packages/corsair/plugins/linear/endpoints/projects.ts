import { logEventFromContext } from '../../utils/events';
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
} from './types';

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
	const response = await makeLinearRequest<ProjectsListResponse>(
		PROJECTS_LIST_QUERY,
		ctx.options.credentials.apiKey,
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
					description: project.description ?? undefined,
					icon: project.icon ?? undefined,
					color: project.color ?? undefined,
					state: (project.state as string) === 'backlog' ? 'planned' : project.state,
					priority: project.priority,
					sortOrder: project.sortOrder ?? 0,
					startDate: project.startDate ?? undefined,
					targetDate: project.targetDate ?? undefined,
					completedAt: project.completedAt ?? undefined,
					canceledAt: project.canceledAt ?? undefined,
					leadId: project.lead?.id ?? undefined,
					createdAt: new Date(project.createdAt),
					updatedAt: new Date(project.updatedAt),
					archivedAt: project.archivedAt ?? undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save projects to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.projects.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: LinearEndpoints['projectsGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<ProjectGetResponse>(
		PROJECT_GET_QUERY,
		ctx.options.credentials.apiKey,
		{ id: input.id },
	);

	const result = response.project;

	if (result && ctx.db.projects) {
		try {
			await ctx.db.projects.upsert(result.id, {
				id: result.id,
				name: result.name,
				description: result.description ?? undefined,
				icon: result.icon ?? undefined,
				color: result.color ?? undefined,
				state: (result.state as string) === 'backlog' ? 'planned' : result.state,
				priority: result.priority,
				sortOrder: result.sortOrder ?? 0,
				startDate: result.startDate ?? undefined,
				targetDate: result.targetDate ?? undefined,
				completedAt: result.completedAt ?? undefined,
				canceledAt: result.canceledAt ?? undefined,
				leadId: result.lead?.id ?? undefined,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archivedAt: result.archivedAt ?? undefined,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.projects.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: LinearEndpoints['projectsCreate'] = async (ctx, input) => {
	const response = await makeLinearRequest<ProjectCreateResponse>(
		PROJECT_CREATE_MUTATION,
		ctx.options.credentials.apiKey,
		{ input: input as CreateProjectInput },
	);

	const result = response.projectCreate.project;

		if (result && ctx.db.projects) {
			try {
				await ctx.db.projects.upsert(result.id, {
					id: result.id,
					name: result.name,
					description: result.description ?? undefined,
					icon: result.icon ?? undefined,
					color: result.color ?? undefined,
					state: (result.state as string) === 'backlog' ? 'planned' : result.state,
					priority: result.priority,
					sortOrder: result.sortOrder ?? 0,
					startDate: result.startDate ?? undefined,
					targetDate: result.targetDate ?? undefined,
					completedAt: result.completedAt ?? undefined,
					canceledAt: result.canceledAt ?? undefined,
					leadId: result.lead?.id ?? undefined,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt ?? undefined,
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.projects.create',
			{ ...input },
			'completed',
		);
	return result;
};

export const update: LinearEndpoints['projectsUpdate'] = async (ctx, input) => {
	const response = await makeLinearRequest<ProjectUpdateResponse>(
		PROJECT_UPDATE_MUTATION,
		ctx.options.credentials.apiKey,
		{ id: input.id, input: input.input as UpdateProjectInput },
	);

	const result = response.projectUpdate.project;

		if (result && ctx.db.projects) {
			try {
				const existing = await ctx.db.projects.findByEntityId(result.id);
				await ctx.db.projects.upsert(result.id, {
					id: result.id,
					name: result.name,
					description: result.description ?? undefined,
					icon: result.icon ?? undefined,
					color: result.color ?? undefined,
					state: (result.state as string) === 'backlog' ? 'planned' : result.state,
					priority: result.priority,
					sortOrder: result.sortOrder ?? existing?.data?.sortOrder ?? 0,
					startDate: result.startDate ?? undefined,
					targetDate: result.targetDate ?? undefined,
					completedAt: existing?.data?.completedAt ?? undefined,
					canceledAt: existing?.data?.canceledAt ?? undefined,
					leadId: existing?.data?.leadId ?? undefined,
					createdAt: existing?.data?.createdAt || new Date(),
					updatedAt: new Date(result.updatedAt),
					archivedAt: existing?.data?.archivedAt ?? undefined,
				});
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

	await logEventFromContext(
		ctx,
		'linear.projects.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteProject: LinearEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<ProjectDeleteResponse>(
		PROJECT_DELETE_MUTATION,
		ctx.options.credentials.apiKey,
		{ id: input.id },
	);

	const result = response.projectDelete.success;

	if (result && ctx.db.projects) {
		try {
			await ctx.db.projects.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete project from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.projects.delete',
		{ ...input },
		'completed',
	);
	return result;
};
