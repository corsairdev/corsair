import { stackAIRequest } from '../client';
import type { StackAIContext } from '../index';
import { oncePerWrite } from '../write-guard';
import type { StackAIEndpointInputs } from './types';
import { schemas } from './types';

export async function ioSchema(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['projects.ioSchema'],
) {
	const { project_id, version } = schemas['projects.ioSchema'].input.parse(raw);
	const result = await stackAIRequest(
		ctx.key,
		ctx.options?.baseURL,
		'GET',
		`/v2/projects/${encodeURIComponent(project_id)}/io-schema`,
		{ version },
	);
	return schemas['projects.ioSchema'].output.parse(result.body);
}

export async function start(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['runs.start'],
) {
	return oncePerWrite(ctx, async () => {
		const body = schemas['runs.start'].input.parse(raw);
		const result = await stackAIRequest(
			ctx.key,
			ctx.options?.baseURL,
			'POST',
			'/v2/runs',
			undefined,
			body,
		);
		return schemas['runs.start'].output.parse(result);
	});
}

export async function list(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['runs.list'],
) {
	const query = schemas['runs.list'].input.parse(raw ?? {});
	const result = await stackAIRequest(
		ctx.key,
		ctx.options?.baseURL,
		'GET',
		'/v2/runs',
		query,
	);
	return schemas['runs.list'].output.parse(result.body);
}

export async function get(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['runs.get'],
) {
	const { run_id } = schemas['runs.get'].input.parse(raw);
	const result = await stackAIRequest(
		ctx.key,
		ctx.options?.baseURL,
		'GET',
		`/v2/runs/${encodeURIComponent(run_id)}`,
	);
	return schemas['runs.get'].output.parse(result.body);
}

export async function cancel(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['runs.cancel'],
) {
	return oncePerWrite(ctx, async () => {
		const { run_id } = schemas['runs.cancel'].input.parse(raw);
		const result = await stackAIRequest(
			ctx.key,
			ctx.options?.baseURL,
			'POST',
			`/v2/runs/${encodeURIComponent(run_id)}/cancel`,
		);
		return schemas['runs.cancel'].output.parse(result);
	});
}

export async function resume(
	ctx: StackAIContext,
	raw: StackAIEndpointInputs['runs.resume'],
) {
	return oncePerWrite(ctx, async () => {
		const { run_id, ...body } = schemas['runs.resume'].input.parse(raw);
		const result = await stackAIRequest(
			ctx.key,
			ctx.options?.baseURL,
			'POST',
			`/v2/runs/${encodeURIComponent(run_id)}/resume`,
			undefined,
			body,
		);
		return schemas['runs.resume'].output.parse(result);
	});
}
