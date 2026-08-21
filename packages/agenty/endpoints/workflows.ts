import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const createWorkflowRoute = getRoute('createWorkflow');
export const createWorkflow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, createWorkflowRoute);
};

const deleteWorkflowRoute = getRoute('deleteWorkflow');
export const deleteWorkflow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, deleteWorkflowRoute);
};

const downloadWorkflowsRoute = getRoute('downloadWorkflows');
export const downloadWorkflows: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, downloadWorkflowsRoute);
};

const getWorkflowByIdRoute = getRoute('getWorkflowById');
export const getWorkflowById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getWorkflowByIdRoute);
};

const patchWorkflowRoute = getRoute('patchWorkflow');
export const patchWorkflow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, patchWorkflowRoute);
};

const updateWorkflowRoute = getRoute('updateWorkflow');
export const updateWorkflow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, updateWorkflowRoute);
};

export const WorkflowsEndpoints = {
	createWorkflow,
	deleteWorkflow,
	downloadWorkflows,
	getWorkflowById,
	patchWorkflow,
	updateWorkflow,
} as const;
