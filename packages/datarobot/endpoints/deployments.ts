import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const deploymentsAccuracyList: DatarobotEndpoints['deploymentsAccuracyList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracy/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelId',
				'batchId',
				'segmentAttribute',
				'segmentValue',
				'targetClass',
				'metric',
				'baselineModelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsAccuracyOverTimeList: DatarobotEndpoints['deploymentsAccuracyOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'metric',
				'segmentAttribute',
				'segmentValue',
				'targetClass',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsCapabilitiesList: DatarobotEndpoints['deploymentsCapabilitiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/capabilities/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCapabilitiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCapabilitiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsDelete: DatarobotEndpoints['deploymentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['ignoreManagementAgent'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsFeaturesList: DatarobotEndpoints['deploymentsFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/features/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'offset',
				'limit',
				'includeNonPredictionFeatures',
				'forSegmentedAnalysis',
				'search',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsFromLearningModelCreate: DatarobotEndpoints['deploymentsFromLearningModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/fromLearningModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFromLearningModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFromLearningModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsFromModelPackageCreate: DatarobotEndpoints['deploymentsFromModelPackageCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/fromModelPackage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFromModelPackageCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFromModelPackageCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsList: DatarobotEndpoints['deploymentsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/deployments/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'orderBy',
			'search',
			'serviceHealth',
			'modelHealth',
			'accuracyHealth',
			'role',
			'status',
			'importance',
			'lastPredictionTimestampStart',
			'lastPredictionTimestampEnd',
			'predictionUsageDailyAvgGreaterThan',
			'predictionUsageDailyAvgLessThan',
			'defaultPredictionServerId',
			'buildEnvironmentType',
			'executionEnvironmentType',
			'predictionEnvironmentPlatform',
			'createdByMe',
			'createdBy',
			'championModelExecutionType',
			'championModelTargetType',
			'tagKeys',
			'tagValues',
			'isA2AAgent',
			'predictionEnvironmentTagKeys',
			'predictionEnvironmentTagValues',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.deploymentsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.deployments.deploymentsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const deploymentsModelHistoryList: DatarobotEndpoints['deploymentsModelHistoryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/modelHistory/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelHistoryList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelHistoryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsModelPatchMany: DatarobotEndpoints['deploymentsModelPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsPatch: DatarobotEndpoints['deploymentsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/deployments/{deploymentId}/', input);
	const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.deploymentsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.deployments.deploymentsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const deploymentsPredictionsOverTimeList: DatarobotEndpoints['deploymentsPredictionsOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'segmentAttribute',
				'segmentValue',
				'modelId',
				'targetClass',
				'includePercentiles',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsRetrieve: DatarobotEndpoints['deploymentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsServiceStatsList: DatarobotEndpoints['deploymentsServiceStatsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/serviceStats/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'executionTimeQuantile',
				'responseTimeQuantile',
				'slowRequestsThreshold',
				'segmentAttribute',
				'segmentValue',
				'modelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsServiceStatsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsServiceStatsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsSettingsList: DatarobotEndpoints['deploymentsSettingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/settings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSettingsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSettingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsSettingsPatchMany: DatarobotEndpoints['deploymentsSettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/settings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSettingsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const deploymentsSharedRolesList: DatarobotEndpoints['deploymentsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
