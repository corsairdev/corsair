import type { TeamcampEndpoints } from '..';
import { segment } from '../client';
import { asArray, call } from './call';
import {
	TeamcampEndpointInputSchemas as Inputs,
	TeamcampEndpointOutputSchemas as Outputs,
	TEAMCAMP_PRIORITY_VALUES,
} from './types';

export const accountVerify: TeamcampEndpoints['accountVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.verify',
			input: Inputs.accountVerify,
			output: Outputs.accountVerify,
		},
		input,
		() => ({ method: 'GET', path: '/verify' }),
		{ log: (_, result) => ({ workspaceId: result.workspaceId }) },
	);

export const usersList: TeamcampEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.list', input: Inputs.usersList, output: Outputs.usersList },
		input,
		() => ({ method: 'GET', path: '/company/users' }),
		{
			shape: (raw) => ({ users: asArray(raw, '/company/users') }),
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const customersList: TeamcampEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		() => ({ method: 'GET', path: '/company/customers' }),
		{
			shape: (raw) => ({ customers: asArray(raw, '/company/customers') }),
			log: (_, result) => ({ count: result.customers.length }),
		},
	);

export const projectsList: TeamcampEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({ method: 'GET', path: '/project' }),
		{
			shape: (raw) => ({ projects: asArray(raw, '/project') }),
			log: (_, result) => ({ count: result.projects.length }),
		},
	);

export const projectsGet: TeamcampEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/project/${segment(parsed.projectId)}`,
			resourceScoped: true,
		}),
		{
			log: (_, result) => ({
				projectId: result.projectId,
				statuses: result.status?.length,
				archived: result.archived ?? undefined,
			}),
		},
	);

export const projectsCreate: TeamcampEndpoints['projectsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/project',
			body: {
				projectName: parsed.projectName,
				customerId: parsed.customerId,
				startDate: parsed.startDate,
				dueDate: parsed.dueDate,
				templateId: parsed.templateId,
			},
		}),
		{
			log: (parsed, result) => ({
				projectId: result.projectId,
				templateId: parsed.templateId,
			}),
		},
	);

export const projectsUpdate: TeamcampEndpoints['projectsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/project/${segment(parsed.projectId)}`,
			resourceScoped: true,
			body: {
				projectName: parsed.projectName,
				description: parsed.description,
				startDate: parsed.startDate,
				dueDate: parsed.dueDate,
				customerId: parsed.customerId,
			},
		}),
		{
			log: (_, result) => ({
				projectId: result.projectId,
				projectName: result.projectName ?? undefined,
			}),
		},
	);

export const projectsDelete: TeamcampEndpoints['projectsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/project/${segment(parsed.projectId)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw, parsed) => ({
				archived: true,
				projectId: parsed.projectId,
				message: typeof raw === 'string' ? raw : String(raw),
			}),
			log: (parsed) => ({ projectId: parsed.projectId }),
		},
	);

export const groupsList: TeamcampEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/project/${segment(parsed.projectId)}/group`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => ({ groups: asArray(raw, '/project/{id}/group') }),
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				count: result.groups.length,
			}),
		},
	);

export const tasksList: TeamcampEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.list', input: Inputs.tasksList, output: Outputs.tasksList },
		input,
		(parsed) => ({
			method: 'GET',
			path: '/task',
			query: { projectId: parsed.projectId, complete: parsed.complete },
			resourceScoped: true,
		}),
		{
			shape: (raw) => ({ tasks: asArray(raw, '/task') }),
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				count: result.tasks.length,
			}),
		},
	);

export const tasksGet: TeamcampEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.get', input: Inputs.tasksGet, output: Outputs.tasksGet },
		input,
		(parsed) => ({
			method: 'GET',
			path: `/task/${segment(parsed.taskId)}`,
			resourceScoped: true,
		}),
		{
			log: (_, result) => ({
				taskId: result.taskId,
				status: result.status ?? undefined,
				comments: result.comments?.length,
			}),
		},
	);

export const tasksCreate: TeamcampEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/task',
			resourceScoped: true,
			body: {
				projectId: parsed.projectId,
				taskName: parsed.taskName,
				description: parsed.description,
				priority:
					parsed.priority === undefined
						? undefined
						: TEAMCAMP_PRIORITY_VALUES[parsed.priority],
				dueDate: parsed.dueDate,
				groupId: parsed.groupId,
				taskUsers: parsed.taskUsers,
				statusId: parsed.statusId,
				milestoneId: parsed.milestoneId,
				estimateTime: parsed.estimateTime,
				files: parsed.files,
			},
		}),
		{
			log: (parsed, result) => ({
				taskId: result.taskId,
				projectId: parsed.projectId,
				priority: parsed.priority,
			}),
		},
	);
