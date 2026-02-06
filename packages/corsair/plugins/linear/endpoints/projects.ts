import { logEventFromContext } from '../../utils/events';
import type { LinearBoundEndpoints, LinearEndpoints } from '..';
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
		ctx.key,
		{
			first: input.first || 50,
			after: input.after,
		},
	);

	const result = response;

	if (result.nodes && ctx.db.projects) {
		try {
			for (const project of result.nodes) {
				await ctx.db.projects.upsertByEntityId(project.id, {
					...project,
					leadId: project.lead?.id,
					createdAt: new Date(project.createdAt),
					updatedAt: new Date(project.updatedAt),
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
		ctx.key,
		{ id: input.id },
	);

	const result = response;

	if (result && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.id, {
				...result,
				leadId: result.lead?.id,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
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
		ctx.key,
		{ input: input as CreateProjectInput },
	);

	const result = response;

	if (result) {
		const endpoints = ctx.endpoints as LinearBoundEndpoints;
		await endpoints.projects.get({ id: result.project.id });
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
		ctx.key,
		{ id: input.id, input: input.input as UpdateProjectInput },
	);

	const result = response;

	if (result) {
		const endpoints = ctx.endpoints as LinearBoundEndpoints;
		await endpoints.projects.get({ id: result.project.id });
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
		ctx.key,
		{ id: input.id },
	);

	const result = response;

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
