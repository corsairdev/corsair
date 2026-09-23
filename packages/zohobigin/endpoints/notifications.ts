import { makeZohoBiginRequest } from '../client';
import type {
	ZohoBiginEndpointInputs,
	ZohoBiginEndpointOutputs,
	ZohoBiginEndpoints,
} from '../index';

export const disableNotifications: ZohoBiginEndpoints['disableNotifications'] =
	async (ctx, input: ZohoBiginEndpointInputs['disableNotifications']) => {
		const { channel_ids } = input;
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['disableNotifications']
		>('actions/watch', ctx.key, {
			method: 'DELETE',
			query: { channel_ids: channel_ids.join(',') },
		});
	};

export const enableNotifications: ZohoBiginEndpoints['enableNotifications'] =
	async (ctx, input: ZohoBiginEndpointInputs['enableNotifications']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['enableNotifications']
		>('actions/watch', ctx.key, {
			method: 'POST',
			body: input,
		});
	};

export const getNotificationDetails: ZohoBiginEndpoints['getNotificationDetails'] =
	async (ctx, input: ZohoBiginEndpointInputs['getNotificationDetails']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['getNotificationDetails']
		>('actions/watch', ctx.key, {
			method: 'GET',
			query: input,
		});
	};

export const updateNotificationDetails: ZohoBiginEndpoints['updateNotificationDetails'] =
	async (ctx, input: ZohoBiginEndpointInputs['updateNotificationDetails']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['updateNotificationDetails']
		>('actions/watch', ctx.key, {
			method: 'PUT',
			body: input,
		});
	};

export const updateNotificationInfo: ZohoBiginEndpoints['updateNotificationInfo'] =
	async (ctx, input: ZohoBiginEndpointInputs['updateNotificationInfo']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['updateNotificationInfo']
		>('actions/watch', ctx.key, {
			method: 'PATCH',
			body: input,
		});
	};
