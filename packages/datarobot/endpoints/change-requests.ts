import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create Change Request. */
/** Official: POST /api/v2/changeRequests/ (`changeRequests_create`) */
export const changeRequestsCreate: DatarobotEndpoints['changeRequestsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/changeRequests/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Change Requests. */
/** Official: GET /api/v2/changeRequests/ (`changeRequests_list`) */
export const changeRequestsList: DatarobotEndpoints['changeRequestsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/changeRequests/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'entityType',
				'entityId',
				'myRequests',
				'showApproved',
				'showCancelled',
				'status',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update Change Request by change request ID */
/** Official: PATCH /api/v2/changeRequests/{changeRequestId}/ (`changeRequests_patch`) */
export const changeRequestsPatch: DatarobotEndpoints['changeRequestsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['changeRequestId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request Change Request Review by change request ID */
/** Official: POST /api/v2/changeRequests/{changeRequestId}/requestReview/ (`changeRequestsRequestReview_create`) */
export const changeRequestsRequestReviewCreate: DatarobotEndpoints['changeRequestsRequestReviewCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/requestReview/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['changeRequestId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsRequestReviewCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsRequestReviewCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Change Request by change request ID */
/** Official: GET /api/v2/changeRequests/{changeRequestId}/ (`changeRequests_retrieve`) */
export const changeRequestsRetrieve: DatarobotEndpoints['changeRequestsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['changeRequestId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create review by change request ID */
/** Official: POST /api/v2/changeRequests/{changeRequestId}/reviews/ (`changeRequestsReviews_create`) */
export const changeRequestsReviewsCreate: DatarobotEndpoints['changeRequestsReviewsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/reviews/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['changeRequestId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsReviewsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsReviewsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Change Request reviews by change request ID */
/** Official: GET /api/v2/changeRequests/{changeRequestId}/reviews/ (`changeRequestsReviews_list`) */
export const changeRequestsReviewsList: DatarobotEndpoints['changeRequestsReviewsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/reviews/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['changeRequestId'],
			['offset', 'limit', 'status', 'changeVersionId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsReviewsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsReviewsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve review by change request ID */
/** Official: GET /api/v2/changeRequests/{changeRequestId}/reviews/{reviewId}/ (`changeRequestsReviews_retrieve`) */
export const changeRequestsReviewsRetrieve: DatarobotEndpoints['changeRequestsReviewsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/reviews/{reviewId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['changeRequestId', 'reviewId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsReviewsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsReviewsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Resolve by change request ID */
/** Official: PATCH /api/v2/changeRequests/{changeRequestId}/status/ (`changeRequestsStatus_patchMany`) */
export const changeRequestsStatusPatchMany: DatarobotEndpoints['changeRequestsStatusPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/status/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['changeRequestId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsStatusPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsStatusPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List suggested reviewers by change request ID */
/** Official: GET /api/v2/changeRequests/{changeRequestId}/suggestedReviewers/ (`changeRequestsSuggestedReviewers_list`) */
export const changeRequestsSuggestedReviewersList: DatarobotEndpoints['changeRequestsSuggestedReviewersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/changeRequests/{changeRequestId}/suggestedReviewers/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['changeRequestId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.changeRequestsSuggestedReviewersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.changeRequests.changeRequestsSuggestedReviewersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
