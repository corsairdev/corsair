import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	GoalsCreateInput,
	GoalsCreateResponse,
	GoalsDeleteInput,
	GoalsDeleteResponse,
	GoalsGetInput,
	GoalsGetResponse,
	GoalsListInput,
	GoalsListResponse,
	GoalsUpdateInput,
	GoalsUpdateResponse,
	KeyResultsCreateInput,
	KeyResultsCreateResponse,
	KeyResultsDeleteInput,
	KeyResultsDeleteResponse,
	KeyResultsUpdateInput,
	KeyResultsUpdateResponse,
} from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: GoalsListInput,
): Promise<GoalsListResponse> {
	const response = await makeClickupRequest<GoalsListResponse>(
		`team/${input.team_id}/goal`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.list',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: GoalsGetInput,
): Promise<GoalsGetResponse> {
	const response = await makeClickupRequest<GoalsGetResponse>(
		`goal/${input.goal_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.get',
		{ goal_id: input.goal_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: GoalsCreateInput,
): Promise<GoalsCreateResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<GoalsCreateResponse>(
		`team/${team_id}/goal`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.create',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: GoalsUpdateInput,
): Promise<GoalsUpdateResponse> {
	const { goal_id, ...body } = input;
	const response = await makeClickupRequest<GoalsUpdateResponse>(
		`goal/${goal_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.update',
		{ goal_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: GoalsDeleteInput,
): Promise<GoalsDeleteResponse> {
	const response = await makeClickupRequest<GoalsDeleteResponse>(
		`goal/${input.goal_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.delete',
		{ goal_id: input.goal_id },
		'completed',
	);
	return response;
}

export async function keyResultsCreate(
	ctx: ClickupRequestContext,
	input: KeyResultsCreateInput,
): Promise<KeyResultsCreateResponse> {
	const { goal_id, ...body } = input;
	const response = await makeClickupRequest<KeyResultsCreateResponse>(
		`goal/${goal_id}/key_result`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.keyResultsCreate',
		{ goal_id },
		'completed',
	);
	return response;
}

export async function keyResultsUpdate(
	ctx: ClickupRequestContext,
	input: KeyResultsUpdateInput,
): Promise<KeyResultsUpdateResponse> {
	const { key_result_id, ...body } = input;
	const response = await makeClickupRequest<KeyResultsUpdateResponse>(
		`key_result/${key_result_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.keyResultsUpdate',
		{ key_result_id },
		'completed',
	);
	return response;
}

export async function keyResultsDelete(
	ctx: ClickupRequestContext,
	input: KeyResultsDeleteInput,
): Promise<KeyResultsDeleteResponse> {
	const response = await makeClickupRequest<KeyResultsDeleteResponse>(
		`key_result/${input.key_result_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.goals.keyResultsDelete',
		{ key_result_id: input.key_result_id },
		'completed',
	);
	return response;
}
