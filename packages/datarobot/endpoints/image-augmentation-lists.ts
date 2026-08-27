import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Creates a new augmentation list based */
/** Official: POST /api/v2/imageAugmentationLists/ (`imageAugmentationLists_create`) */
export const imageAugmentationListsCreate: DatarobotEndpoints['imageAugmentationListsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/imageAugmentationLists/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an existing augmentation lists by id by augmentation ID */
/** Official: DELETE /api/v2/imageAugmentationLists/{augmentationId}/ (`imageAugmentationLists_delete`) */
export const imageAugmentationListsDelete: DatarobotEndpoints['imageAugmentationListsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/imageAugmentationLists/{augmentationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['augmentationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List of augmentation lists */
/** Official: GET /api/v2/imageAugmentationLists/ (`imageAugmentationLists_list`) */
export const imageAugmentationListsList: DatarobotEndpoints['imageAugmentationListsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/imageAugmentationLists/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['projectId', 'featureName', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an existing augmentation list by augmentation ID */
/** Official: PATCH /api/v2/imageAugmentationLists/{augmentationId}/ (`imageAugmentationLists_patch`) */
export const imageAugmentationListsPatch: DatarobotEndpoints['imageAugmentationListsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/imageAugmentationLists/{augmentationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['augmentationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns a single augmentation list by augmentation ID */
/** Official: GET /api/v2/imageAugmentationLists/{augmentationId}/ (`imageAugmentationLists_retrieve`) */
export const imageAugmentationListsRetrieve: DatarobotEndpoints['imageAugmentationListsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/imageAugmentationLists/{augmentationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['augmentationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Requests the creation of sample augmentations based by augmentation ID */
/** Official: POST /api/v2/imageAugmentationLists/{augmentationId}/samples/ (`imageAugmentationListsSamples_create`) */
export const imageAugmentationListsSamplesCreate: DatarobotEndpoints['imageAugmentationListsSamplesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/imageAugmentationLists/{augmentationId}/samples/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['augmentationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsSamplesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsSamplesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve latest Augmentation Samples generated by augmentation ID */
/** Official: GET /api/v2/imageAugmentationLists/{augmentationId}/samples/ (`imageAugmentationListsSamples_list`) */
export const imageAugmentationListsSamplesList: DatarobotEndpoints['imageAugmentationListsSamplesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/imageAugmentationLists/{augmentationId}/samples/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['augmentationId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.imageAugmentationListsSamplesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.imageAugmentationLists.imageAugmentationListsSamplesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
