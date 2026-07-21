import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createIngestionTaskRoute = getRoute('createIngestionTask');
export const createIngestionTask: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, createIngestionTaskRoute);
};

const disableTaskV1Route = getRoute('disableTaskV1');
export const disableTaskV1: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, disableTaskV1Route);
};

const enableTaskV1Route = getRoute('enableTaskV1');
export const enableTaskV1: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, enableTaskV1Route);
};

const getAppTaskRoute = getRoute('getAppTask');
export const getAppTask: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getAppTaskRoute);
};

const getTaskV1Route = getRoute('getTaskV1');
export const getTaskV1: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTaskV1Route);
};

const listIngestionTasksRoute = getRoute('listIngestionTasks');
export const listIngestionTasks: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listIngestionTasksRoute);
};

const pushTaskRoute = getRoute('pushTask');
export const pushTask: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, pushTaskRoute);
};

const replaceTaskRoute = getRoute('replaceTask');
export const replaceTask: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, replaceTaskRoute);
};

const runTaskV1Route = getRoute('runTaskV1');
export const runTaskV1: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, runTaskV1Route);
};

const searchTasksV1Route = getRoute('searchTasksV1');
export const searchTasksV1: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchTasksV1Route);
};

const updateTaskRoute = getRoute('updateTask');
export const updateTask: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, updateTaskRoute);
};

export const TasksEndpoints = {
	createIngestionTask,
	disableTaskV1,
	enableTaskV1,
	getAppTask,
	getTaskV1,
	listIngestionTasks,
	pushTask,
	replaceTask,
	runTaskV1,
	searchTasksV1,
	updateTask,
} as const;
