import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['messageTemplatesList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.messageTemplatesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesList']
	>('/message-templates', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['messageTemplatesCreate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.messageTemplatesCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesCreate']
	>('/message-templates', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['messageTemplatesGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.messageTemplatesGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesGet']
	>(`/message-templates/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['messageTemplatesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.messageTemplatesUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesUpdate']
	>(`/message-templates/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['messageTemplatesReplace'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.messageTemplatesReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesReplace']
	>(`/message-templates/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['messageTemplatesDelete'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.messageTemplatesDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messageTemplatesDelete']
	>(`/message-templates/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messageTemplatesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.messageTemplates.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
