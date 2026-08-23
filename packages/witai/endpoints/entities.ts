import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listEntities: WitAiEndpoints['entitiesListEntities'] = async (
	ctx,
	_input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesListEntities']
	>('entities', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'witai.entities.listEntities',
		{},
		'completed',
	);
	return result;
};

export const getEntity: WitAiEndpoints['entitiesGetEntity'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesGetEntity']
	>(`entities/${input.entity}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'witai.entities.getEntity',
		{ entity: input.entity },
		'completed',
	);
	return result;
};

export const createEntity: WitAiEndpoints['entitiesCreateEntity'] = async (
	ctx,
	input,
) => {
	const { name, roles } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesCreateEntity']
	>('entities', ctx.key, {
		method: 'POST',
		body: { name, roles: roles?.map((r) => ({ name: r })) } as Record<
			string,
			unknown
		>,
	});
	await logEventFromContext(
		ctx,
		'witai.entities.createEntity',
		{ name },
		'completed',
	);
	return result;
};

export const deleteEntity: WitAiEndpoints['entitiesDeleteEntity'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesDeleteEntity']
	>(`entities/${input.entity}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'witai.entities.deleteEntity',
		{ entity: input.entity },
		'completed',
	);
	return result;
};

export const addKeyword: WitAiEndpoints['entitiesAddKeyword'] = async (
	ctx,
	input,
) => {
	const { entity, keyword, synonyms } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesAddKeyword']
	>(`entities/${entity}/keywords`, ctx.key, {
		method: 'POST',
		body: { keyword, synonyms } as Record<string, unknown>,
	});
	await logEventFromContext(
		ctx,
		'witai.entities.addKeyword',
		{ entity, keyword },
		'completed',
	);
	return result;
};

export const deleteKeyword: WitAiEndpoints['entitiesDeleteKeyword'] = async (
	ctx,
	input,
) => {
	const { entity, keyword } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesDeleteKeyword']
	>(`entities/${entity}/keywords/${keyword}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'witai.entities.deleteKeyword',
		{ entity, keyword },
		'completed',
	);
	return result;
};

export const addSynonym: WitAiEndpoints['entitiesAddSynonym'] = async (
	ctx,
	input,
) => {
	const { entity, keyword, synonym } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesAddSynonym']
	>(`entities/${entity}/keywords/${keyword}/synonyms`, ctx.key, {
		method: 'POST',
		body: { synonym },
	});
	await logEventFromContext(
		ctx,
		'witai.entities.addSynonym',
		{ entity, keyword, synonym },
		'completed',
	);
	return result;
};

export const deleteSynonym: WitAiEndpoints['entitiesDeleteSynonym'] = async (
	ctx,
	input,
) => {
	const { entity, keyword, synonym } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesDeleteSynonym']
	>(`entities/${entity}/keywords/${keyword}/synonyms/${synonym}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'witai.entities.deleteSynonym',
		{ entity, keyword, synonym },
		'completed',
	);
	return result;
};

export const deleteRole: WitAiEndpoints['entitiesDeleteRole'] = async (
	ctx,
	input,
) => {
	const { entity, role } = input;
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['entitiesDeleteRole']
	>(`entities/${entity}/roles/${role}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'witai.entities.deleteRole',
		{ entity, role },
		'completed',
	);
	return result;
};
