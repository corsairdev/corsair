import { logEventFromContext } from 'corsair/core';
import { makeReplicateRequest } from '../client';
import type { ReplicateEndpoints } from '../index';
import {
	ReplicateEndpointInputSchemas,
	ReplicateEndpointOutputSchemas,
} from './types';

function encodePath(...parts: string[]): string {
	return parts.map((part) => encodeURIComponent(part)).join('/');
}

export const accountGet: ReplicateEndpoints['accountGet'] = async (
	ctx,
	rawInput,
) => {
	ReplicateEndpointInputSchemas.accountGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.accountGet.parse(
		await makeReplicateRequest('/account', ctx.key, { method: 'GET' }),
	);
	await logEventFromContext(ctx, 'replicate.account.get', {}, 'completed');
	return response;
};

export const collectionsList: ReplicateEndpoints['collectionsList'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.collectionsList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.collectionsList.parse(
		await makeReplicateRequest('/collections', ctx.key, {
			method: 'GET',
			query: {
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.collections.list',
		{ cursor: input.cursor },
		'completed',
	);
	return response;
};

export const collectionsGet: ReplicateEndpoints['collectionsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.collectionsGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.collectionsGet.parse(
		await makeReplicateRequest(
			`/collections/${encodePath(input.collectionSlug)}`,
			ctx.key,
			{ method: 'GET' },
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.collections.get',
		{ collectionSlug: input.collectionSlug },
		'completed',
	);
	return response;
};

export const deploymentsList: ReplicateEndpoints['deploymentsList'] = async (
	ctx,
	rawInput,
) => {
	ReplicateEndpointInputSchemas.deploymentsList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.deploymentsList.parse(
		await makeReplicateRequest('/deployments', ctx.key, { method: 'GET' }),
	);
	await logEventFromContext(ctx, 'replicate.deployments.list', {}, 'completed');
	return response;
};

export const deploymentsCreate: ReplicateEndpoints['deploymentsCreate'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.deploymentsCreate.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.deploymentsCreate.parse(
			await makeReplicateRequest('/deployments', ctx.key, {
				method: 'POST',
				body: input,
			}),
		);
		await logEventFromContext(
			ctx,
			'replicate.deployments.create',
			{ name: input.name, model: input.model },
			'completed',
		);
		return response;
	};

export const deploymentsDelete: ReplicateEndpoints['deploymentsDelete'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.deploymentsDelete.parse(rawInput);
		await makeReplicateRequest(
			`/deployments/${encodePath(input.owner, input.name)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const response = ReplicateEndpointOutputSchemas.deploymentsDelete.parse({
			success: true,
		});
		await logEventFromContext(
			ctx,
			'replicate.deployments.delete',
			{ owner: input.owner, name: input.name },
			'completed',
		);
		return response;
	};

export const deploymentsGet: ReplicateEndpoints['deploymentsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.deploymentsGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.deploymentsGet.parse(
		await makeReplicateRequest(
			`/deployments/${encodePath(input.owner, input.name)}`,
			ctx.key,
			{ method: 'GET' },
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.deployments.get',
		{ owner: input.owner, name: input.name },
		'completed',
	);
	return response;
};

export const deploymentsPredictionsCreate: ReplicateEndpoints['deploymentsPredictionsCreate'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.deploymentsPredictionsCreate.parse(
				rawInput,
			);
		const response =
			ReplicateEndpointOutputSchemas.deploymentsPredictionsCreate.parse(
				await makeReplicateRequest(
					`/deployments/${encodePath(input.owner, input.name)}/predictions`,
					ctx.key,
					{
						method: 'POST',
						headers: {
							Prefer: input.prefer,
							'Cancel-After': input.cancelAfter,
						},
						body: {
							input: input.input,
							stream: input.stream,
							webhook: input.webhook,
							webhook_events_filter: input.webhook_events_filter,
						},
					},
				),
			);
		await logEventFromContext(
			ctx,
			'replicate.deployments.predictions_create',
			{ owner: input.owner, name: input.name },
			'completed',
		);
		return response;
	};

export const filesList: ReplicateEndpoints['filesList'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.filesList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.filesList.parse(
		await makeReplicateRequest('/files', ctx.key, {
			method: 'GET',
			query: {
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.files.list',
		{ cursor: input.cursor },
		'completed',
	);
	return response;
};

export const filesCreate: ReplicateEndpoints['filesCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.filesCreate.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.filesCreate.parse(
		await makeReplicateRequest('/files', ctx.key, {
			method: 'POST',
			formData: {
				content: input.content,
				filename: input.filename,
				type: input.type,
				metadata:
					input.metadata === undefined
						? undefined
						: JSON.stringify(input.metadata),
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.files.create',
		{ filename: input.filename },
		'completed',
	);
	return response;
};

export const filesDelete: ReplicateEndpoints['filesDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.filesDelete.parse(rawInput);
	await makeReplicateRequest(`/files/${encodePath(input.fileId)}`, ctx.key, {
		method: 'DELETE',
	});
	const response = ReplicateEndpointOutputSchemas.filesDelete.parse({
		success: true,
	});
	await logEventFromContext(
		ctx,
		'replicate.files.delete',
		{ fileId: input.fileId },
		'completed',
	);
	return response;
};

export const filesGet: ReplicateEndpoints['filesGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.filesGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.filesGet.parse(
		await makeReplicateRequest(`/files/${encodePath(input.fileId)}`, ctx.key, {
			method: 'GET',
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.files.get',
		{ fileId: input.fileId },
		'completed',
	);
	return response;
};

export const hardwareList: ReplicateEndpoints['hardwareList'] = async (
	ctx,
	rawInput,
) => {
	ReplicateEndpointInputSchemas.hardwareList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.hardwareList.parse(
		await makeReplicateRequest('/hardware', ctx.key, { method: 'GET' }),
	);
	await logEventFromContext(ctx, 'replicate.hardware.list', {}, 'completed');
	return response;
};

export const modelsList: ReplicateEndpoints['modelsList'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.modelsList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.modelsList.parse(
		await makeReplicateRequest('/models', ctx.key, {
			method: 'GET',
			query: {
				cursor: input.cursor,
				sort_by: input.sort_by,
				sort_direction: input.sort_direction,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.models.list',
		{
			cursor: input.cursor,
			sortBy: input.sort_by,
			sortDirection: input.sort_direction,
		},
		'completed',
	);
	return response;
};

export const modelsGet: ReplicateEndpoints['modelsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.modelsGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.modelsGet.parse(
		await makeReplicateRequest(
			`/models/${encodePath(input.owner, input.name)}`,
			ctx.key,
			{
				method: 'GET',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.models.get',
		{ owner: input.owner, name: input.name },
		'completed',
	);
	return response;
};

export const modelsUpdate: ReplicateEndpoints['modelsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.modelsUpdate.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.modelsUpdate.parse(
		await makeReplicateRequest(
			`/models/${encodePath(input.owner, input.name)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					description: input.description,
					readme: input.readme,
					github_url: input.github_url,
					paper_url: input.paper_url,
					weights_url: input.weights_url,
					license_url: input.license_url,
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.models.update',
		{ owner: input.owner, name: input.name },
		'completed',
	);
	return response;
};

export const modelsExamplesList: ReplicateEndpoints['modelsExamplesList'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.modelsExamplesList.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.modelsExamplesList.parse(
			await makeReplicateRequest(
				`/models/${encodePath(input.owner, input.name)}/examples`,
				ctx.key,
				{ method: 'GET' },
			),
		);
		await logEventFromContext(
			ctx,
			'replicate.models.examples_list',
			{ owner: input.owner, name: input.name },
			'completed',
		);
		return response;
	};

export const modelsPredictionsCreate: ReplicateEndpoints['modelsPredictionsCreate'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.modelsPredictionsCreate.parse(rawInput);
		const response =
			ReplicateEndpointOutputSchemas.modelsPredictionsCreate.parse(
				await makeReplicateRequest(
					`/models/${encodePath(input.owner, input.name)}/predictions`,
					ctx.key,
					{
						method: 'POST',
						headers: {
							Prefer: input.prefer,
							'Cancel-After': input.cancelAfter,
						},
						body: {
							input: input.input,
							stream: input.stream,
							webhook: input.webhook,
							webhook_events_filter: input.webhook_events_filter,
						},
					},
				),
			);
		await logEventFromContext(
			ctx,
			'replicate.models.predictions_create',
			{ owner: input.owner, name: input.name },
			'completed',
		);
		return response;
	};

export const modelsReadmeGet: ReplicateEndpoints['modelsReadmeGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.modelsReadmeGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.modelsReadmeGet.parse(
		await makeReplicateRequest(
			`/models/${encodePath(input.owner, input.name)}/readme`,
			ctx.key,
			{
				method: 'GET',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.models.readme_get',
		{ owner: input.owner, name: input.name },
		'completed',
	);
	return response;
};

export const modelsVersionsGet: ReplicateEndpoints['modelsVersionsGet'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.modelsVersionsGet.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.modelsVersionsGet.parse(
			await makeReplicateRequest(
				`/models/${encodePath(input.owner, input.name)}/versions/${encodePath(input.versionId)}`,
				ctx.key,
				{ method: 'GET' },
			),
		);
		await logEventFromContext(
			ctx,
			'replicate.models.versions_get',
			{ owner: input.owner, name: input.name, versionId: input.versionId },
			'completed',
		);
		return response;
	};

export const modelsVersionsList: ReplicateEndpoints['modelsVersionsList'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.modelsVersionsList.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.modelsVersionsList.parse(
			await makeReplicateRequest(
				`/models/${encodePath(input.owner, input.name)}/versions`,
				ctx.key,
				{
					method: 'GET',
					query: {
						cursor: input.cursor,
					},
				},
			),
		);
		await logEventFromContext(
			ctx,
			'replicate.models.versions_list',
			{ owner: input.owner, name: input.name, cursor: input.cursor },
			'completed',
		);
		return response;
	};

export const predictionsList: ReplicateEndpoints['predictionsList'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.predictionsList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.predictionsList.parse(
		await makeReplicateRequest('/predictions', ctx.key, {
			method: 'GET',
			query: {
				cursor: input.cursor,
				created_after: input.created_after,
				created_before: input.created_before,
				source: input.source,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.predictions.list',
		input,
		'completed',
	);
	return response;
};

export const predictionsCreate: ReplicateEndpoints['predictionsCreate'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.predictionsCreate.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.predictionsCreate.parse(
			await makeReplicateRequest('/predictions', ctx.key, {
				method: 'POST',
				headers: {
					Prefer: input.prefer,
					'Cancel-After': input.cancelAfter,
				},
				body: {
					version: input.version,
					input: input.input,
					stream: input.stream,
					webhook: input.webhook,
					webhook_events_filter: input.webhook_events_filter,
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'replicate.predictions.create',
			{ version: input.version },
			'completed',
		);
		return response;
	};

export const predictionsGet: ReplicateEndpoints['predictionsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.predictionsGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.predictionsGet.parse(
		await makeReplicateRequest(
			`/predictions/${encodePath(input.predictionId)}`,
			ctx.key,
			{
				method: 'GET',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.predictions.get',
		{ predictionId: input.predictionId },
		'completed',
	);
	return response;
};

export const predictionsCancel: ReplicateEndpoints['predictionsCancel'] =
	async (ctx, rawInput) => {
		const input =
			ReplicateEndpointInputSchemas.predictionsCancel.parse(rawInput);
		const response = ReplicateEndpointOutputSchemas.predictionsCancel.parse(
			await makeReplicateRequest(
				`/predictions/${encodePath(input.predictionId)}/cancel`,
				ctx.key,
				{ method: 'POST' },
			),
		);
		await logEventFromContext(
			ctx,
			'replicate.predictions.cancel',
			{ predictionId: input.predictionId },
			'completed',
		);
		return response;
	};

export const search: ReplicateEndpoints['search'] = async (ctx, rawInput) => {
	const input = ReplicateEndpointInputSchemas.search.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.search.parse(
		await makeReplicateRequest('/search', ctx.key, {
			method: 'GET',
			query: {
				query: input.query,
				limit: input.limit,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.search.search',
		{ query: input.query, limit: input.limit },
		'completed',
	);
	return response;
};

export const trainingsCreate: ReplicateEndpoints['trainingsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.trainingsCreate.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.trainingsCreate.parse(
		await makeReplicateRequest(
			`/models/${encodePath(input.owner, input.name)}/versions/${encodePath(input.versionId)}/trainings`,
			ctx.key,
			{
				method: 'POST',
				body: {
					destination: input.destination,
					input: input.input,
					webhook: input.webhook,
					webhook_events_filter: input.webhook_events_filter,
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.trainings.create',
		{ owner: input.owner, name: input.name, versionId: input.versionId },
		'completed',
	);
	return response;
};

export const trainingsGet: ReplicateEndpoints['trainingsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.trainingsGet.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.trainingsGet.parse(
		await makeReplicateRequest(
			`/trainings/${encodePath(input.trainingId)}`,
			ctx.key,
			{
				method: 'GET',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.trainings.get',
		{ trainingId: input.trainingId },
		'completed',
	);
	return response;
};

export const trainingsList: ReplicateEndpoints['trainingsList'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.trainingsList.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.trainingsList.parse(
		await makeReplicateRequest('/trainings', ctx.key, {
			method: 'GET',
			query: {
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'replicate.trainings.list',
		{ cursor: input.cursor },
		'completed',
	);
	return response;
};

export const trainingsCancel: ReplicateEndpoints['trainingsCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = ReplicateEndpointInputSchemas.trainingsCancel.parse(rawInput);
	const response = ReplicateEndpointOutputSchemas.trainingsCancel.parse(
		await makeReplicateRequest(
			`/trainings/${encodePath(input.trainingId)}/cancel`,
			ctx.key,
			{ method: 'POST' },
		),
	);
	await logEventFromContext(
		ctx,
		'replicate.trainings.cancel',
		{ trainingId: input.trainingId },
		'completed',
	);
	return response;
};

export const webhooksDefaultSecretGet: ReplicateEndpoints['webhooksDefaultSecretGet'] =
	async (ctx, rawInput) => {
		ReplicateEndpointInputSchemas.webhooksDefaultSecretGet.parse(rawInput);
		const response =
			ReplicateEndpointOutputSchemas.webhooksDefaultSecretGet.parse(
				await makeReplicateRequest('/webhooks/default/secret', ctx.key, {
					method: 'GET',
				}),
			);
		await logEventFromContext(
			ctx,
			'replicate.webhooks.default_secret_get',
			{},
			'completed',
		);
		return response;
	};
