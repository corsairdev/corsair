import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest, resolveDataPlaneUrl } from '../client';
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
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function listConfigurations(
	ctx: HoneyHiveContext,
	input: ConfigurationsListInput,
): Promise<ConfigurationsListResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.configurationsList.parse(input);
	const response = await makeHoneyHiveRequest<ConfigurationsListResponse>(
		'/v1/configurations',
		ctx.key,
		{
			method: 'GET',
			baseUrl: await resolveDataPlaneUrl(ctx),
			query: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.configurationsList.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.list',
		{ count: parsed.configurations?.length },
		'completed',
	);

	return parsed;
}

export async function createConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsCreateInput,
): Promise<ConfigurationsCreateResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.configurationsCreate.parse(input);
	const response = await makeHoneyHiveRequest<ConfigurationsCreateResponse>(
		'/v1/configurations',
		ctx.key,
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.configurationsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.create',
		{ insertedId: parsed.insertedId },
		'completed',
	);

	return parsed;
}

export async function updateConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsUpdateInput,
): Promise<ConfigurationsUpdateResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.configurationsUpdate.parse(input);
	const { configId, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<ConfigurationsUpdateResponse>(
		`/v1/configurations/${encodeURIComponent(configId)}`,
		ctx.key,
		{
			method: 'PUT',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.configurationsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.update',
		{ configId },
		'completed',
	);

	return parsed;
}

export async function deleteConfiguration(
	ctx: HoneyHiveContext,
	input: ConfigurationsDeleteInput,
): Promise<ConfigurationsDeleteResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.configurationsDelete.parse(input);
	const response = await makeHoneyHiveRequest<ConfigurationsDeleteResponse>(
		`/v1/configurations/${encodeURIComponent(parsedInput.configId)}`,
		ctx.key,
		{
			method: 'DELETE',
			baseUrl: await resolveDataPlaneUrl(ctx),
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.configurationsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.configurations.delete',
		{ configId: parsedInput.configId },
		'completed',
	);

	return parsed;
}

export const Configurations = {
	list: listConfigurations,
	create: createConfiguration,
	update: updateConfiguration,
	delete: deleteConfiguration,
};
