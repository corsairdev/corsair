import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const deleteProjectRoute = getRoute('deleteProject');
export const deleteProject: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, deleteProjectRoute);
};

const getProjectByIdRoute = getRoute('getProjectById');
export const getProjectById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getProjectByIdRoute);
};

const projectsAddAgentsRoute = getRoute('projectsAddAgents');
export const projectsAddAgents: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, projectsAddAgentsRoute);
};

const projectsControllerCreateProjectRoute = getRoute(
	'projectsControllerCreateProject',
);
export const projectsControllerCreateProject: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(
		ctx,
		input,
		projectsControllerCreateProjectRoute,
	);
};

const projectsGetAllRoute = getRoute('projectsGetAll');
export const projectsGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, projectsGetAllRoute);
};

const removeAgentFromProjectRoute = getRoute('removeAgentFromProject');
export const removeAgentFromProject: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, removeAgentFromProjectRoute);
};

const updateProjectRoute = getRoute('updateProject');
export const updateProject: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, updateProjectRoute);
};

export const ProjectsEndpoints = {
	deleteProject,
	getProjectById,
	projectsAddAgents,
	projectsControllerCreateProject,
	projectsGetAll,
	removeAgentFromProject,
	updateProject,
} as const;
