import { randomUUID } from 'node:crypto';
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

/** Entity ids are template/image paths without a leading slash, joined onto the listed folder. */
function entityPath(name: string, folder?: string): string {
	const trimmed = name.replace(/^\/+/, '');
	const parent = folder?.replace(/^\/+|\/+$/g, '');
	return parent ? `${parent}/${trimmed}` : trimmed;
}

// Safe: the saved value is discarded; only success or failure matters.
// A narrower type is not practical because each entity client returns a different row type.
async function persist(label: string, save: () => Promise<unknown>) {
	try {
		await save();
	} catch (error) {
		console.warn(`Failed to save ${label} to database:`, error);
	}
}

function boolLikeToBoolean(
	value: boolean | string | undefined,
): boolean | undefined {
	if (value === undefined) return undefined;
	if (typeof value === 'boolean') return value;
	return ['y', 'yes', 'true'].includes(value);
}

export const environmentReady: DocmosisEndpoints['environmentReady'] = async (
	ctx,
) => {
	const raw = await makeDocmosisRequest('environment/ready', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
		formData: {},
	});
	const response = DocmosisEndpointOutputSchemas.environmentReady.parse(raw);

	await logEventFromContext(ctx, 'docmosis.environment.ready', {}, 'completed');
	return response;
};

export const environmentSummary: DocmosisEndpoints['environmentSummary'] =
	async (ctx) => {
		const raw = await makeDocmosisRequest('environment/summary', ctx.key, {
			method: 'POST',
			region: ctx.options.region,
			formData: {},
		});
		const response =
			DocmosisEndpointOutputSchemas.environmentSummary.parse(raw);

		const summary = response.accountEnvironmentSummary;
		const envName = summary?.accountEnvDetails?.name;
		if (ctx.db.environments && summary && envName) {
			await persist('environment', () =>
				ctx.db.environments.upsertByEntityId(envName, {
					id: envName,
					name: envName,
					description: summary.accountEnvDetails?.description,
					ready: summary.ready,
					isActivated: summary.accountEnvDetails?.isActivated,
					isDisabled: summary.accountEnvDetails?.isDisabled,
					isDeleted: summary.accountEnvDetails?.isDeleted,
					pageQuota: summary.pageQuota,
					planName: summary.plan?.name,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'docmosis.environment.summary',
			{},
			'completed',
		);
		return response;
	};

export const getApiKey: DocmosisEndpoints['getApiKey'] = async (ctx) => {
	const keyPreview =
		ctx.key.length > 4 ? ctx.key.slice(-4) : '*'.repeat(ctx.key.length);

	await logEventFromContext(ctx, 'docmosis.auth.getApiKey', {}, 'completed');

	return { configured: true, keyPreview };
};

export const ping: DocmosisEndpoints['ping'] = async (ctx) => {
	const raw = await makeDocmosisRequest('ping', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
	});
	const response = DocmosisEndpointOutputSchemas.ping.parse(raw);

	await logEventFromContext(ctx, 'docmosis.ping', {}, 'completed');
	return response;
};

export const pingService: DocmosisEndpoints['pingService'] = async (ctx) => {
	const raw = await makeDocmosisRequest('ping', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
	});
	const response = DocmosisEndpointOutputSchemas.pingService.parse(raw);

	await logEventFromContext(ctx, 'docmosis.pingService', {}, 'completed');
	return response;
};

export const deleteImage: DocmosisEndpoints['deleteImage'] = async (
	ctx,
	input,
) => {
	const raw = await makeDocmosisRequest('deleteImage', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
		formData: { imageName: asArray(input.imageName) },
	});
	const response = DocmosisEndpointOutputSchemas.deleteImage.parse(raw);

	if (response.succeeded && ctx.db.images) {
		for (const name of asArray(input.imageName)) {
			await persist('image', () =>
				ctx.db.images.deleteByEntityId(entityPath(name)),
			);
		}
	}

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
	const raw = await makeDocmosisRequest('deleteTemplate', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
		formData: { templateName: asArray(input.templateName) },
	});
	const response = DocmosisEndpointOutputSchemas.deleteTemplate.parse(raw);

	if (response.succeeded && ctx.db.templates) {
		for (const name of asArray(input.templateName)) {
			await persist('template', () =>
				ctx.db.templates.deleteByEntityId(entityPath(name)),
			);
		}
	}

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
	const raw = await makeDocmosisRequest('listImages', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
		formData: {
			folder: input.folder,
			includeSubFolders: boolLikeToString(input.includeSubFolders),
		},
	});
	const response = DocmosisEndpointOutputSchemas.listImages.parse(raw);

	if (ctx.db.images) {
		for (const image of response.imageList ?? []) {
			const name = image.name;
			if (!name) continue;
			const id = entityPath(name, input.folder);
			await persist('image', () =>
				ctx.db.images.upsertByEntityId(id, { ...image, id, name }),
			);
		}
	}

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
	const raw = await makeDocmosisRequest('listTemplates', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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

	if (ctx.db.templates) {
		for (const template of response.templateList ?? []) {
			const name = template.name;
			if (!name) continue;
			const id = entityPath(name, input.folder);
			await persist('template', () =>
				ctx.db.templates.upsertByEntityId(id, {
					...template,
					id,
					name,
				}),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'docmosis.templates.list',
		{ folder: input.folder, pageToken: input.pageToken },
		'completed',
	);
	return response;
};

export const getImage: DocmosisEndpoints['getImage'] = async (ctx, input) => {
	const raw = await makeDocmosisRequest('getImage', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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
	const raw = await makeDocmosisRequest('getTemplate', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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
		const raw = await makeDocmosisRequest(
			'uploadTemplateBatchStatus',
			ctx.key,
			{
				method: 'POST',
				region: ctx.options.region,
				formData: { userJobId: input.userJobId },
			},
		);
		const response =
			DocmosisEndpointOutputSchemas.getBatchUploadStatus.parse(raw);

		const job = response.jobStatus;
		if (job && ctx.db.batchUploadJobs) {
			const id = job.userJobId ?? input.userJobId;
			const { userJobId: _userJobId, ...fields } = job;
			await persist('batch upload job', () =>
				ctx.db.batchUploadJobs.upsertByEntityId(id, { ...fields, id }),
			);
		}

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
	const raw = await makeDocmosisRequest('getRenderQueue', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
		formData: {},
	});
	const response = DocmosisEndpointOutputSchemas.getRenderQueue.parse(raw);

	await logEventFromContext(ctx, 'docmosis.renderQueue.get', {}, 'completed');
	return response;
};

export const getTemplateDetails: DocmosisEndpoints['getTemplateDetails'] =
	async (ctx, input) => {
		const raw = await makeDocmosisRequest('getTemplateDetails', ctx.key, {
			method: 'POST',
			region: ctx.options.region,
			formData: {
				templateName: input.templateName,
				stringify: boolLikeToString(input.stringify),
			},
		});
		const response =
			DocmosisEndpointOutputSchemas.getTemplateDetails.parse(raw);

		const details = response.templateDetails;
		if (details && ctx.db.templates) {
			const id = entityPath(input.templateName);
			await persist('template', () =>
				ctx.db.templates.upsertByEntityId(id, {
					...details,
					id,
					name: details.name ?? input.templateName,
				}),
			);
		}

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
		const raw = await makeDocmosisRequest('getTemplateStructure', ctx.key, {
			method: 'POST',
			region: ctx.options.region,
			formData: {
				templateName: input.templateName,
				stringify: boolLikeToString(input.stringify),
			},
		});
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
	const raw = await makeDocmosisRequest('getRenderTags', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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
	const raw = await makeDocmosisRequest('getSampleData', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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
	const raw = await makeDocmosisRequest('render', ctx.key, {
		method: 'POST',
		region: ctx.options.region,
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

	if (ctx.db.renders) {
		const id = randomUUID();
		await persist('render', () =>
			ctx.db.renders.upsertByEntityId(id, {
				id,
				templateName: input.templateName,
				outputName: input.outputName,
				outputFormat: input.outputFormat,
				contentType: response.contentType,
				byteLength: response.byteLength,
				devMode: boolLikeToBoolean(input.devMode),
				tags: input.tags,
				createdAt: new Date(),
			}),
		);
	}

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
