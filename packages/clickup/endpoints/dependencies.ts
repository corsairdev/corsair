import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	DependenciesAddInput,
	DependenciesAddResponse,
	DependenciesDeleteInput,
	DependenciesDeleteResponse,
} from './types';

export async function add(
	ctx: ClickupRequestContext,
	input: DependenciesAddInput,
): Promise<DependenciesAddResponse> {
	const { task_id, custom_task_ids, team_id, ...body } = input;
	const response = await makeClickupRequest<DependenciesAddResponse>(
		`task/${task_id}/dependency`,
		ctx.key,
		{
			method: 'POST',
			body,
			query: { custom_task_ids, team_id },
		},
	);

	await logEventFromContext(
		ctx,
		'clickup.dependencies.add',
		{ task_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: DependenciesDeleteInput,
): Promise<DependenciesDeleteResponse> {
	const { task_id, ...query } = input;
	const response = await makeClickupRequest<DependenciesDeleteResponse>(
		`task/${task_id}/dependency`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.dependencies.delete',
		{ task_id },
		'completed',
	);
	return response;
}
