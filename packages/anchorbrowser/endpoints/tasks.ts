import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const createOrUpdateTaskDraftRoute = getRoute('createOrUpdateTaskDraft');
export const createOrUpdateTaskDraft: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(
		ctx,
		input,
		createOrUpdateTaskDraftRoute,
	);
};

const createTaskRoute = getRoute('createTask');
export const createTask: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, createTaskRoute);
};

const deleteTaskRoute = getRoute('deleteTask');
export const deleteTask: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, deleteTaskRoute);
};

const deleteTaskVersionRoute = getRoute('deleteTaskVersion');
export const deleteTaskVersion: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, deleteTaskVersionRoute);
};

const deployTaskRoute = getRoute('deployTask');
export const deployTask: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, deployTaskRoute);
};

const getLatestTaskVersionRoute = getRoute('getLatestTaskVersion');
export const getLatestTaskVersion: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getLatestTaskVersionRoute);
};

const getTaskDraftRoute = getRoute('getTaskDraft');
export const getTaskDraft: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, getTaskDraftRoute);
};

const getTaskExecutionResultRoute = getRoute('getTaskExecutionResult');
export const getTaskExecutionResult: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getTaskExecutionResultRoute);
};

const getTaskMetadataRoute = getRoute('getTaskMetadata');
export const getTaskMetadata: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getTaskMetadataRoute);
};

const getTaskVersionRoute = getRoute('getTaskVersion');
export const getTaskVersion: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getTaskVersionRoute);
};

const listTaskExecutionsRoute = getRoute('listTaskExecutions');
export const listTaskExecutions: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listTaskExecutionsRoute);
};

const listTasksRoute = getRoute('listTasks');
export const listTasks: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, listTasksRoute);
};

const listTaskVersionsRoute = getRoute('listTaskVersions');
export const listTaskVersions: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listTaskVersionsRoute);
};

const publishTaskVersionRoute = getRoute('publishTaskVersion');
export const publishTaskVersion: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, publishTaskVersionRoute);
};

const runTaskRoute = getRoute('runTask');
export const runTask: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, runTaskRoute);
};

const runTaskByNameRoute = getRoute('runTaskByName');
export const runTaskByName: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, runTaskByNameRoute);
};

const updateTaskMetadataRoute = getRoute('updateTaskMetadata');
export const updateTaskMetadata: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, updateTaskMetadataRoute);
};

export const TasksEndpoints = {
	createOrUpdateTaskDraft,
	createTask,
	deleteTask,
	deleteTaskVersion,
	deployTask,
	getLatestTaskVersion,
	getTaskDraft,
	getTaskExecutionResult,
	getTaskMetadata,
	getTaskVersion,
	listTaskExecutions,
	listTasks,
	listTaskVersions,
	publishTaskVersion,
	runTask,
	runTaskByName,
	updateTaskMetadata,
} as const;
