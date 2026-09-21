import { logEventFromContext } from 'corsair/core';
import type { DocmosisEndpoints } from '..';
import { makeDocmosisRequest } from '../client';
import type { DocmosisEndpointInputs } from './types';
import { DocmosisEndpointOutputSchemas } from './types';

function asArray(value: string | string[]): string[] {
	return Array.isArray(value) ? value : [value];
}

function boolLikeToString(
	value: boolean | string | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	return value;
}

export const environmentReady: DocmosisEndpoints['environmentReady'] = async (
	ctx,
) => {
	const raw = await makeDocmosisRequest<unknown>('environment/ready', ctx.key, {
		method: 'POST',
		formData: {},
	});
	const response = DocmosisEndpointOutputSchemas.environmentReady.parse(raw);

	await logEventFromContext(ctx, 'docmosis.environment.ready', {}, 'completed');
	return response;
};

export const environmentSummary: DocmosisEndpoints['environmentSummary'] =
	async (ctx) => {
		const raw = await makeDocmosisRequest<unknown>(
			'environment/summary',
			ctx.key,
			{
				method: 'POST',
				formData: {},
			},
		);
		const response =
			DocmosisEndpointOutputSchemas.environmentSummary.parse(raw);

		await logEventFromContext(
			ctx,
			'docmosis.environment.summary',
			{},
			'completed',
		);
		return response;
	};

export const ping: DocmosisEndpoints['ping'] = async (ctx) => {
	const raw = await makeDocmosisRequest<unknown>('ping', ctx.key, {
		method: 'GET',
	});
	const response = DocmosisEndpointOutputSchemas.ping.parse(raw);

	await logEventFromContext(ctx, 'docmosis.ping', {}, 'completed');
	return response;
};

export const pingService: DocmosisEndpoints['pingService'] = async (ctx) => {
	const raw = await makeDocmosisRequest<unknown>('ping', ctx.key, {
		method: 'GET',
	});
	const response = DocmosisEndpointOutputSchemas.pingService.parse(raw);

	await logEventFromContext(ctx, 'docmosis.pingService', {}, 'completed');
	return response;
};

export const deleteImage: DocmosisEndpoints['deleteImage'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('deleteImage', ctx.key, {
		method: 'POST',
		formData: { imageName: asArray(input.imageName) },
	});
	const response = DocmosisEndpointOutputSchemas.deleteImage.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.images.delete',
		{ imageNames: asArray(input.imageName) },
		'completed',
	);
	return response;
};

export const deleteTemplate: DocmosisEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('deleteTemplate', ctx.key, {
		method: 'POST',
		formData: { templateName: asArray(input.templateName) },
	});
	const response = DocmosisEndpointOutputSchemas.deleteTemplate.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.templates.delete',
		{ templateNames: asArray(input.templateName) },
		'completed',
	);
	return response;
};

export const listImages: DocmosisEndpoints['listImages'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('listImages', ctx.key, {
		method: 'POST',
		formData: {
			folder: input.folder,
			includeSubFolders: boolLikeToString(input.includeSubFolders),
		},
	});
	const response = DocmosisEndpointOutputSchemas.listImages.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.images.list',
		{ folder: input.folder },
		'completed',
	);
	return response;
};

export const listTemplates: DocmosisEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('listTemplates', ctx.key, {
		method: 'POST',
		formData: {
			includeDetail: boolLikeToString(input.includeDetail),
			folder: input.folder,
			includeSubFolders: boolLikeToString(input.includeSubFolders),
			paging: boolLikeToString(input.paging),
			pageToken: input.pageToken,
			pageSize: input.pageSize,
		},
	});
	const response = DocmosisEndpointOutputSchemas.listTemplates.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.templates.list',
		{ folder: input.folder, pageToken: input.pageToken },
		'completed',
	);
	return response;
};

export const getImage: DocmosisEndpoints['getImage'] = async (ctx, input) => {
	const raw = await makeDocmosisRequest<unknown>('getImage', ctx.key, {
		method: 'POST',
		formData: { imageName: asArray(input.imageName) },
		responseType: 'arrayBuffer',
	});
	const response = DocmosisEndpointOutputSchemas.getImage.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.images.get',
		{ imageNames: asArray(input.imageName) },
		'completed',
	);
	return response;
};

export const getTemplate: DocmosisEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('getTemplate', ctx.key, {
		method: 'POST',
		formData: { templateName: asArray(input.templateName) },
		responseType: 'arrayBuffer',
	});
	const response = DocmosisEndpointOutputSchemas.getTemplate.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.templates.get',
		{ templateNames: asArray(input.templateName) },
		'completed',
	);
	return response;
};

export const getBatchUploadStatus: DocmosisEndpoints['getBatchUploadStatus'] =
	async (ctx, input) => {
		const raw = await makeDocmosisRequest<unknown>(
			'uploadTemplateBatchStatus',
			ctx.key,
			{
				method: 'POST',
				formData: { userJobId: input.userJobId },
			},
		);
		const response =
			DocmosisEndpointOutputSchemas.getBatchUploadStatus.parse(raw);

		await logEventFromContext(
			ctx,
			'docmosis.templates.batchStatus',
			{ userJobId: input.userJobId },
			'completed',
		);
		return response;
	};

export const getRenderQueue: DocmosisEndpoints['getRenderQueue'] = async (
	ctx,
) => {
	const raw = await makeDocmosisRequest<unknown>('getRenderQueue', ctx.key, {
		method: 'POST',
		formData: {},
	});
	const response = DocmosisEndpointOutputSchemas.getRenderQueue.parse(raw);

	await logEventFromContext(ctx, 'docmosis.renderQueue.get', {}, 'completed');
	return response;
};

export const getTemplateDetails: DocmosisEndpoints['getTemplateDetails'] =
	async (ctx, input) => {
		const raw = await makeDocmosisRequest<unknown>(
			'getTemplateDetails',
			ctx.key,
			{
				method: 'POST',
				formData: {
					templateName: input.templateName,
					stringify: boolLikeToString(input.stringify),
				},
			},
		);
		const response =
			DocmosisEndpointOutputSchemas.getTemplateDetails.parse(raw);

		await logEventFromContext(
			ctx,
			'docmosis.templates.details',
			{ templateName: input.templateName },
			'completed',
		);
		return response;
	};

export const getTemplateStructure: DocmosisEndpoints['getTemplateStructure'] =
	async (ctx, input) => {
		const raw = await makeDocmosisRequest<unknown>(
			'getTemplateStructure',
			ctx.key,
			{
				method: 'POST',
				formData: {
					templateName: input.templateName,
					stringify: boolLikeToString(input.stringify),
				},
			},
		);
		const response =
			DocmosisEndpointOutputSchemas.getTemplateStructure.parse(raw);

		await logEventFromContext(
			ctx,
			'docmosis.templates.structure',
			{ templateName: input.templateName },
			'completed',
		);
		return response;
	};

export const getRenderTags: DocmosisEndpoints['getRenderTags'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('getRenderTags', ctx.key, {
		method: 'POST',
		formData: {
			tags: input.tags,
			year: input.year,
			month: input.month,
			nMonths: input.nMonths,
			padBlanks: boolLikeToString(input.padBlanks),
		},
	});
	const response = DocmosisEndpointOutputSchemas.getRenderTags.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.renderTags.get',
		{ tags: input.tags },
		'completed',
	);
	return response;
};

export const getSampleData: DocmosisEndpoints['getSampleData'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest<unknown>('getSampleData', ctx.key, {
		method: 'POST',
		formData: {
			templateName: input.templateName,
			stringify: boolLikeToString(input.stringify),
			format: input.format,
		},
	});
	const response = DocmosisEndpointOutputSchemas.getSampleData.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.sampleData.get',
		{ templateName: input.templateName, format: input.format },
		'completed',
	);
	return response;
};

function renderDataToString(
	data: DocmosisEndpointInputs['render']['data'],
): string {
	if (typeof data === 'string') {
		return data;
	}

	return JSON.stringify(data);
}

export const render: DocmosisEndpoints['render'] = async (ctx, input) => {
	const raw = await makeDocmosisRequest<unknown>('render', ctx.key, {
		method: 'POST',
		formData: {
			templateName: input.templateName,
			data: renderDataToString(input.data),
			outputName: input.outputName,
			outputFormat: input.outputFormat,
			devMode: boolLikeToString(input.devMode),
			tags: input.tags,
		},
		responseType: 'arrayBuffer',
	});
	const response = DocmosisEndpointOutputSchemas.render.parse(raw);

	await logEventFromContext(
		ctx,
		'docmosis.templates.render',
		{
			templateName: input.templateName,
			outputName: input.outputName,
			outputFormat: input.outputFormat,
			devMode: input.devMode,
			tags: input.tags,
		},
		'completed',
	);
	return response;
};
