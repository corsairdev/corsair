import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const batchDeleteTaskRoute = getRoute('batchDeleteTask');
export const batchDeleteTask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, batchDeleteTaskRoute);
};

const completeTaskRoute = getRoute('completeTask');
export const completeTask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, completeTaskRoute);
};

const createTaskRoute = getRoute('createTask');
export const createTask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, createTaskRoute);
};

const deleteATaskRoute = getRoute('deleteATask');
export const deleteATask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteATaskRoute);
};

const getTheTaskDetailsRoute = getRoute('getTheTaskDetails');
export const getTheTaskDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheTaskDetailsRoute);
};

const reopenATaskRoute = getRoute('reopenATask');
export const reopenATask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, reopenATaskRoute);
};

const searchTasksRoute = getRoute('searchTasks');
export const searchTasks: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, searchTasksRoute);
};

const updateTaskRoute = getRoute('updateTask');
export const updateTask: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateTaskRoute);
};

export const TasksEndpoints = {
	batchDeleteTask,
	completeTask,
	createTask,
	deleteATask,
	getTheTaskDetails,
	reopenATask,
	searchTasks,
	updateTask,
} as const;
