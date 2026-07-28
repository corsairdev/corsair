import type { NeonOperation } from '../endpoints/operation-types';

export const dataApiOperations = [
	{
		key: 'createProjectBranchDataAPI',
		group: 'dataApi',
		name: 'createProjectBranchDataAPI',
		method: 'POST',
		path: '/projects/{project_id}/branches/{branch_id}/data-api/{database_name}',
		pathParams: ['project_id', 'branch_id', 'database_name'],
		riskLevel: 'write',
		description: 'Create Neon Data API',
	},
	{
		key: 'getProjectBranchDataAPI',
		group: 'dataApi',
		name: 'getProjectBranchDataAPI',
		method: 'GET',
		path: '/projects/{project_id}/branches/{branch_id}/data-api/{database_name}',
		pathParams: ['project_id', 'branch_id', 'database_name'],
		riskLevel: 'read',
		description: 'Retrieve Neon Data API configuration',
	},
	{
		key: 'updateProjectBranchDataAPI',
		group: 'dataApi',
		name: 'updateProjectBranchDataAPI',
		method: 'PATCH',
		path: '/projects/{project_id}/branches/{branch_id}/data-api/{database_name}',
		pathParams: ['project_id', 'branch_id', 'database_name'],
		riskLevel: 'write',
		description: 'Update Neon Data API',
	},
	{
		key: 'deleteProjectBranchDataAPI',
		group: 'dataApi',
		name: 'deleteProjectBranchDataAPI',
		method: 'DELETE',
		path: '/projects/{project_id}/branches/{branch_id}/data-api/{database_name}',
		pathParams: ['project_id', 'branch_id', 'database_name'],
		riskLevel: 'destructive',
		description: 'Delete Neon Data API',
	},
] as const satisfies readonly NeonOperation[];
