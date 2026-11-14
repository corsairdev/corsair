import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
import type {
	ConfigurationsCreateInput,
	ConfigurationsCreateResponse,
	ConfigurationsDeleteInput,
	ConfigurationsDeleteResponse,
	ConfigurationsListInput,
	ConfigurationsListResponse,
	ConfigurationsUpdateInput,
	ConfigurationsUpdateResponse,
} from './types';

export async function listConfigurations(
	ctx: HoneyHiveContext,
	input: ConfigurationsListInput,
): Promise<ConfigurationsListResponse> {
	const response = await makeHoneyHiveRequest<ConfigurationsListResponse>(
		'/v1/configurations',
		ctx.key,
		{ method: 'GET', query: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.list',
		{ count: response.configurations?.length },
		'completed',
	);

	return response;
}

export async function createConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsCreateInput,
): Promise<ConfigurationsCreateResponse> {
	const response = await makeHoneyHiveRequest<ConfigurationsCreateResponse>(
		'/v1/configurations',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.create',
		{ insertedId: response.insertedId },
		'completed',
	);

	return response;
}

export async function updateConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsUpdateInput,
): Promise<ConfigurationsUpdateResponse> {
	const { configId, ...body } = input;
	const response = await makeHoneyHiveRequest<ConfigurationsUpdateResponse>(
		`/v1/configurations/${encodeURIComponent(configId)}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.update',
		{ configId },
		'completed',
	);

	return response;
}

export async function deleteConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsDeleteInput,
): Promise<ConfigurationsDeleteResponse> {
	const response = await makeHoneyHiveRequest<ConfigurationsDeleteResponse>(
		`/v1/configurations/${encodeURIComponent(input.configId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.delete',
		{ configId: input.configId },
		'completed',
	);

	return response;
}

export const Configurations = {
	list: listConfigurations,
	create: createConfiguration,
	update: updateConfiguration,
	delete: deleteConfiguration,
};
