import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create an entity notification channel. */
/** Official: POST /api/v2/entityNotificationChannels/ (`entityNotificationChannels_create`) */
export const entityNotificationChannelsCreate: DatarobotEndpoints['entityNotificationChannelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationChannels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationChannelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationChannels.entityNotificationChannelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an entity notification channel by relatedentitytype */
/** Official: DELETE /api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/ (`entityNotificationChannels_delete`) */
export const entityNotificationChannelsDelete: DatarobotEndpoints['entityNotificationChannelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'channelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationChannelsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationChannels.entityNotificationChannelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List notification channels related by relatedentitytype */
/** Official: GET /api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/ (`entityNotificationChannels_list`) */
export const entityNotificationChannelsList: DatarobotEndpoints['entityNotificationChannelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId'],
			['offset', 'limit', 'namePart'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationChannelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationChannels.entityNotificationChannelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an entity notification channel by relatedentitytype */
/** Official: PUT /api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/ (`entityNotificationChannels_put`) */
export const entityNotificationChannelsPut: DatarobotEndpoints['entityNotificationChannelsPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'channelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationChannelsPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationChannels.entityNotificationChannelsPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an entity notification channel by relatedentitytype */
/** Official: GET /api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/ (`entityNotificationChannels_retrieve`) */
export const entityNotificationChannelsRetrieve: DatarobotEndpoints['entityNotificationChannelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationChannels/{relatedEntityType}/{relatedEntityId}/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'channelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationChannelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationChannels.entityNotificationChannelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
