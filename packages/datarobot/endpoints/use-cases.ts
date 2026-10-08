import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const useCasesCreate: DatarobotEndpoints['useCasesCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const useCasesDatasetsList: DatarobotEndpoints['useCasesDatasetsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/datasets/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'sort', 'orderBy', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesDatasetsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesDatasetsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const useCasesDelete: DatarobotEndpoints['useCasesDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const useCasesDeploymentsList: DatarobotEndpoints['useCasesDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/deployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'orderBy', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesDeploymentsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const useCasesList: DatarobotEndpoints['useCasesList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'search',
			'projectId',
			'applicationId',
			'entityId',
			'entityType',
			'sort',
			'orderBy',
			'usecaseType',
			'riskLevel',
			'stage',
			'createdBy',
			'showOrgUseCases',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const useCasesPatch: DatarobotEndpoints['useCasesPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const useCasesProjectsList: DatarobotEndpoints['useCasesProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/projects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'search', 'sort', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesProjectsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const useCasesRetrieve: DatarobotEndpoints['useCasesRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.useCasesRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
