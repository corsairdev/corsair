import { makeSendbirdRequest } from '../client';
import type { SendbirdContext, SendbirdEndpoints } from '../index';
import {
	SendbirdEndpointInputSchemas as inputs,
	SendbirdEndpointOutputSchemas as outputs,
} from './types';

async function call(
	ctx: SendbirdContext,
	path: string,
	options: Parameters<typeof makeSendbirdRequest>[3],
) {
	// A registration-level application ID is only used with its registration key.
	const applicationId = ctx.options.key?.trim()
		? ctx.options.applicationId
		: await ctx.keys.get_applicationId();
	return makeSendbirdRequest(applicationId ?? '', ctx.key, path, options);
}
const encode = encodeURIComponent;
const messagesPath = (type: string, url: string) =>
	`/${type}/${encode(url)}/messages`;

export const usersList: SendbirdEndpoints['usersList'] = async (ctx, raw) =>
	outputs.usersList.parse(
		await call(ctx, '/users', {
			method: 'GET',
			query: inputs.usersList.parse(raw),
		}),
	);
export const usersGet: SendbirdEndpoints['usersGet'] = async (ctx, raw) => {
	const { user_id, ...query } = inputs.usersGet.parse(raw);
	return outputs.usersGet.parse(
		await call(ctx, `/users/${encode(user_id)}`, { method: 'GET', query }),
	);
};
export const usersCreate: SendbirdEndpoints['usersCreate'] = async (ctx, raw) =>
	outputs.usersCreate.parse(
		await call(ctx, '/users', {
			method: 'POST',
			body: inputs.usersCreate.parse(raw),
		}),
	);
export const usersUpdate: SendbirdEndpoints['usersUpdate'] = async (
	ctx,
	raw,
) => {
	const { user_id, body } = inputs.usersUpdate.parse(raw);
	return outputs.usersUpdate.parse(
		await call(ctx, `/users/${encode(user_id)}`, { method: 'PUT', body }),
	);
};
export const usersDelete: SendbirdEndpoints['usersDelete'] = async (
	ctx,
	raw,
) => {
	const { user_id } = inputs.usersDelete.parse(raw);
	return outputs.usersDelete.parse(
		await call(ctx, `/users/${encode(user_id)}`, { method: 'DELETE' }),
	);
};
export const channelsList: SendbirdEndpoints['channelsList'] = async (
	ctx,
	raw,
) =>
	outputs.channelsList.parse(
		await call(ctx, '/group_channels', {
			method: 'GET',
			query: inputs.channelsList.parse(raw),
		}),
	);
export const channelsGet: SendbirdEndpoints['channelsGet'] = async (
	ctx,
	raw,
) => {
	const { channel_url, ...query } = inputs.channelsGet.parse(raw);
	return outputs.channelsGet.parse(
		await call(ctx, `/group_channels/${encode(channel_url)}`, {
			method: 'GET',
			query,
		}),
	);
};
export const channelsCreate: SendbirdEndpoints['channelsCreate'] = async (
	ctx,
	raw,
) =>
	outputs.channelsCreate.parse(
		await call(ctx, '/group_channels', {
			method: 'POST',
			body: inputs.channelsCreate.parse(raw),
		}),
	);
export const channelsUpdate: SendbirdEndpoints['channelsUpdate'] = async (
	ctx,
	raw,
) => {
	const { channel_url, body } = inputs.channelsUpdate.parse(raw);
	return outputs.channelsUpdate.parse(
		await call(ctx, `/group_channels/${encode(channel_url)}`, {
			method: 'PUT',
			body,
		}),
	);
};
export const channelsDelete: SendbirdEndpoints['channelsDelete'] = async (
	ctx,
	raw,
) => {
	const { channel_url } = inputs.channelsDelete.parse(raw);
	return outputs.channelsDelete.parse(
		await call(ctx, `/group_channels/${encode(channel_url)}`, {
			method: 'DELETE',
		}),
	);
};
export const messagesList: SendbirdEndpoints['messagesList'] = async (
	ctx,
	raw,
) => {
	const { channel_type, channel_url, ...query } =
		inputs.messagesList.parse(raw);
	return outputs.messagesList.parse(
		await call(ctx, messagesPath(channel_type, channel_url), {
			method: 'GET',
			query,
		}),
	);
};
export const messagesGet: SendbirdEndpoints['messagesGet'] = async (
	ctx,
	raw,
) => {
	const { channel_type, channel_url, message_id, ...query } =
		inputs.messagesGet.parse(raw);
	return outputs.messagesGet.parse(
		await call(
			ctx,
			`${messagesPath(channel_type, channel_url)}/${message_id}`,
			{ method: 'GET', query },
		),
	);
};
export const messagesSend: SendbirdEndpoints['messagesSend'] = async (
	ctx,
	raw,
) => {
	const { channel_type, channel_url, body } = inputs.messagesSend.parse(raw);
	return outputs.messagesSend.parse(
		await call(ctx, messagesPath(channel_type, channel_url), {
			method: 'POST',
			body,
		}),
	);
};
export const messagesUpdate: SendbirdEndpoints['messagesUpdate'] = async (
	ctx,
	raw,
) => {
	const { channel_type, channel_url, message_id, body } =
		inputs.messagesUpdate.parse(raw);
	return outputs.messagesUpdate.parse(
		await call(
			ctx,
			`${messagesPath(channel_type, channel_url)}/${message_id}`,
			{ method: 'PUT', body },
		),
	);
};
export const messagesDelete: SendbirdEndpoints['messagesDelete'] = async (
	ctx,
	raw,
) => {
	const { channel_type, channel_url, message_id, ...query } =
		inputs.messagesDelete.parse(raw);
	return outputs.messagesDelete.parse(
		await call(
			ctx,
			`${messagesPath(channel_type, channel_url)}/${message_id}`,
			{ method: 'DELETE', query },
		),
	);
};
