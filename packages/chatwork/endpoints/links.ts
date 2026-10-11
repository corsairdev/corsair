import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const get: ChatworkEndpoints['linksGet'] = async (ctx, input) => {
	const { room_id } = ChatworkEndpointInputSchemas.linksGet.parse(input);
	const result = await makeChatworkRequest<ChatworkEndpointOutputs['linksGet']>(
		`rooms/${room_id}/link`,
		ctx.key,
		{ method: 'GET', authType: ctx.options?.authType },
	);
	const validatedResult = ChatworkEndpointOutputSchemas.linksGet.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.links.get',
		{ room_id },
		'completed',
	);

	return validatedResult;
};

export const create: ChatworkEndpoints['linksCreate'] = async (ctx, input) => {
	const { room_id, ...form } =
		ChatworkEndpointInputSchemas.linksCreate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['linksCreate']
	>(`rooms/${room_id}/link`, ctx.key, {
		method: 'POST',
		form,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.linksCreate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.links.create',
		{ room_id, ...form },
		'completed',
	);

	return validatedResult;
};

export const update: ChatworkEndpoints['linksUpdate'] = async (ctx, input) => {
	const { room_id, ...form } =
		ChatworkEndpointInputSchemas.linksUpdate.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['linksUpdate']
	>(`rooms/${room_id}/link`, ctx.key, {
		method: 'PUT',
		form,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.linksUpdate.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.links.update',
		{ room_id, ...form },
		'completed',
	);

	return validatedResult;
};

export const deleteLink: ChatworkEndpoints['linksDelete'] = async (
	ctx,
	input,
) => {
	const { room_id } = ChatworkEndpointInputSchemas.linksDelete.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['linksDelete']
	>(`rooms/${room_id}/link`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.linksDelete.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.links.delete',
		{ room_id },
		'completed',
	);

	return validatedResult;
};
