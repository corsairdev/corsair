import { defineOp } from './factory';

export const deleteProject = defineOp('deleteProject');
export const deleteProjectItem = defineOp('deleteProjectItem');

export const PortfolioEndpoints = {
	deleteProject,
	deleteProjectItem,
} as const;
