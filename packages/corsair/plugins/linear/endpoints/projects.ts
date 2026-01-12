import type { LinearEndpoints } from '..';
import type {
	CreateProjectInput,
	Project,
	ProjectConnection,
	ProjectCreateResponse,
	ProjectDeleteResponse,
	ProjectGetResponse,
	ProjectsListResponse,
	ProjectUpdateResponse,
	UpdateProjectInput,
} from '../types';
import { makeLinearRequest } from '../client';

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
		ctx.options.apiKey,
		{
			first: input.first || 50,
			after: input.after,
		},
	);

	const result = response.projects;

	if (result.nodes && ctx.projects) {
		try {
			for (const project of result.nodes) {
				await ctx.projects.upsert(project.id, {
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

	return result;
};

export const get: LinearEndpoints['projectsGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<ProjectGetResponse>(
		PROJECT_GET_QUERY,
		ctx.options.apiKey,
		{ id: input.id },
	);

	const result = response.project;

	if (result && ctx.projects) {
		try {
			await ctx.projects.upsert(result.id, {
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

	return result;
};

export const create: LinearEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<ProjectCreateResponse>(
		PROJECT_CREATE_MUTATION,
		ctx.options.apiKey,
		{ input: input as CreateProjectInput },
	);

	const result = response.projectCreate.project;

	if (result && ctx.projects) {
		try {
			await ctx.projects.upsert(result.id, {
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

	return result;
};

export const update: LinearEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<ProjectUpdateResponse>(
		PROJECT_UPDATE_MUTATION,
		ctx.options.apiKey,
		{ id: input.id, input: input.input as UpdateProjectInput },
	);

	const result = response.projectUpdate.project;

	if (result && ctx.projects) {
		try {
			const existing = await ctx.projects.findByResourceId(result.id);
			await ctx.projects.upsert(result.id, {
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

	return result;
};

export const deleteProject: LinearEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<ProjectDeleteResponse>(
		PROJECT_DELETE_MUTATION,
		ctx.options.apiKey,
		{ id: input.id },
	);

	const result = response.projectDelete.success;

	if (result && ctx.projects) {
		try {
			await ctx.projects.deleteByResourceId(input.id);
		} catch (error) {
			console.warn('Failed to delete project from database:', error);
		}
	}

	return result;
};
