import { projectsOperations } from '../operations/projects';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof projectsOperations)[number]['name']) {
	const operation = projectsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const createProjectDefinition = getOperation('create');
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

const getProjectDefinition = getOperation('get');
export const getProject: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(ctx, input, getProjectDefinition);
	await syncPrismaOperationResult(ctx, getProjectDefinition, input, result);
	await logPrismaOperation(ctx, input, getProjectDefinition);
	return result;
};

const listProjectsDefinition = getOperation('list');
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

const deleteProjectDefinition = getOperation('delete');
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

const transferProjectDefinition = getOperation('transfer');
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
