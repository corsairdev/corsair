import { logEventFromContext } from 'corsair/core';
import { makeSanityRequest, requireDataset, SanityError } from '../client';
import type { SanityEndpoints } from '../index';
import { resolveProjectId } from './shared';
import {
	SanityEndpointInputSchemas as Inputs,
	SanityEndpointOutputSchemas as Outputs,
} from './types';

export const list: SanityEndpoints['datasetsList'] = async (ctx, rawInput) => {
	Inputs.datasetsList.parse(rawInput ?? {});
	const projectId = await resolveProjectId(ctx);
	// unknown: dataset entries, validated by the output schema below.
	const datasets = await makeSanityRequest<unknown[]>(
		ctx.key,
		{ projectId },
		'/datasets',
	);
	const response = Outputs.datasetsList.parse({ datasets: datasets ?? [] });
	await logEventFromContext(
		ctx,
		'sanity.datasets.list',
		{ count: response.datasets.length },
		'completed',
	);
	return response;
};

export const create: SanityEndpoints['datasetsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.datasetsCreate.parse(rawInput);
	const projectId = await resolveProjectId(ctx);
	const name = requireDataset(input.name);
	const response = Outputs.datasetsCreate.parse(
		await makeSanityRequest(ctx.key, { projectId }, `/datasets/${name}`, {
			method: 'PUT',
			body: input.aclMode ? { aclMode: input.aclMode } : {},
		}),
	);
	await logEventFromContext(
		ctx,
		'sanity.datasets.create',
		{ name, aclMode: response.aclMode },
		'completed',
	);
	return response;
};

export const deleteDataset: SanityEndpoints['datasetsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.datasetsDelete.parse(rawInput);
	if (input.confirmName !== input.name) {
		throw new SanityError(
			'confirmName must equal name. Deleting a dataset deletes every document and asset in it for good.',
			'invalid_input',
		);
	}
	const projectId = await resolveProjectId(ctx);
	const name = requireDataset(input.name);
	const response = Outputs.datasetsDelete.parse(
		await makeSanityRequest(ctx.key, { projectId }, `/datasets/${name}`, {
			method: 'DELETE',
			timeoutMs: 60_000,
		}),
	);
	await logEventFromContext(
		ctx,
		'sanity.datasets.delete',
		{ name },
		'completed',
	);
	return response;
};
