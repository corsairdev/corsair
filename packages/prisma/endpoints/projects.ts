import { projectsOperations } from '../operations/projects';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const createProjectDefinition = findOperation(projectsOperations, 'create');
export const createProject: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		createProjectDefinition,
	);
	await syncPrismaOperationResult(ctx, createProjectDefinition, input, result);
	await logPrismaOperation(ctx, input, createProjectDefinition);
	return result;
};

const getProjectDefinition = findOperation(projectsOperations, 'get');
export const getProject: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(ctx, input, getProjectDefinition);
	await syncPrismaOperationResult(ctx, getProjectDefinition, input, result);
	await logPrismaOperation(ctx, input, getProjectDefinition);
	return result;
};

const listProjectsDefinition = findOperation(projectsOperations, 'list');
export const listProjects: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listProjectsDefinition,
	);
	await syncPrismaOperationResult(ctx, listProjectsDefinition, input, result);
	await logPrismaOperation(ctx, input, listProjectsDefinition);
	return result;
};

const deleteProjectDefinition = findOperation(projectsOperations, 'delete');
export const deleteProject: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		deleteProjectDefinition,
	);
	await syncPrismaOperationResult(ctx, deleteProjectDefinition, input, result);
	await logPrismaOperation(ctx, input, deleteProjectDefinition);
	return result;
};

const transferProjectDefinition = findOperation(projectsOperations, 'transfer');
export const transferProject: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		transferProjectDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		transferProjectDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, transferProjectDefinition);
	return result;
};

export const ProjectsEndpoints = {
	create: createProject,
	get: getProject,
	list: listProjects,
	delete: deleteProject,
	transfer: transferProject,
} as const;
