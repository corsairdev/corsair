import { logEventFromContext } from 'corsair/core';
import { assertCarboneSuccess, makeCarboneRequest } from '../client';
import type { CarboneEndpoints } from '../index';
import type {
	DeleteTemplateOutput,
	DownloadTemplateOutput,
	ListTemplateCategoriesOutput,
	ListTemplatesOutput,
	ListTemplateTagsOutput,
	UpdateTemplateOutput,
	UploadTemplateOutput,
} from './types';

export const uploadTemplate: CarboneEndpoints['uploadTemplate'] = async (
	ctx,
	input,
) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<UploadTemplateOutput>('/template', {
			apiKey: ctx.key,
			method: 'POST',
			body: {
				template: input.template,
			},
		}),
	);

	const templateId = response.data?.id ?? response.data?.templateId;
	if (ctx.db?.templates && templateId) {
		try {
			await ctx.db.templates.upsertByEntityId(templateId, {
				id: templateId,
				versionId: response.data?.versionId,
				type: response.data?.type ?? response.data?.templateExtension,
				size: response.data?.size,
				createdAt: response.data?.createdAt,
			});
		} catch (error) {
			console.warn(
				'[carbone] Failed to save template to local database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.upload',
		{ id: templateId },
		'completed',
	);

	return response;
};

export const listTemplates: CarboneEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.templateId) query.templateId = input.templateId;
	if (input?.versionId) query.versionId = input.versionId;
	if (input?.category) query.category = input.category;
	if (input?.search) query.search = input.search;
	if (input?.cursor !== undefined) query.cursor = input.cursor;

	const response = assertCarboneSuccess(
		await makeCarboneRequest<ListTemplatesOutput>('/templates', {
			apiKey: ctx.key,
			method: 'GET',
			query,
		}),
	);

	if (ctx.db?.templates && Array.isArray(response.data)) {
		for (const tmpl of response.data) {
			const id = tmpl.versionId ?? tmpl.id;
			if (id) {
				try {
					await ctx.db.templates.upsertByEntityId(id, {
						id: tmpl.id ?? undefined,
						versionId: tmpl.versionId,
						name: tmpl.name,
						category: tmpl.category,
						type: tmpl.type,
						size: tmpl.size,
						comment: tmpl.comment,
						tags: tmpl.tags,
						deployedAt: tmpl.deployedAt,
						createdAt: tmpl.createdAt,
						expireAt: tmpl.expireAt,
						origin: tmpl.origin,
					});
				} catch (error) {
					console.warn(
						'[carbone] Failed to sync template to local database:',
						error,
					);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);

	return response;
};

export const downloadTemplate: CarboneEndpoints['downloadTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const content = await makeCarboneRequest<string>(`/template/${templateId}`, {
		apiKey: ctx.key,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'carbone.templates.download',
		{ templateId: input.templateId },
		'completed',
	);

	return {
		templateId: input.templateId,
		content: typeof content === 'string' ? content : JSON.stringify(content),
		success: true,
	} satisfies DownloadTemplateOutput;
};

export const updateTemplate: CarboneEndpoints['updateTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const { templateId: _, ...patchBody } = input;

	const response = assertCarboneSuccess(
		await makeCarboneRequest<UpdateTemplateOutput>(`/template/${templateId}`, {
			apiKey: ctx.key,
			method: 'PATCH',
			body: patchBody as Record<string, unknown>,
		}),
	);

	if (ctx.db?.templates) {
		try {
			await ctx.db.templates.upsertByEntityId(input.templateId, {
				id: response.data?.id ?? input.templateId,
				versionId: response.data?.versionId,
				name: response.data?.name ?? input.name,
				category: response.data?.category ?? input.category,
				comment: response.data?.comment ?? input.comment,
				tags: response.data?.tags ?? input.tags,
				deployedAt: response.data?.deployedAt ?? input.deployedAt,
			});
		} catch (error) {
			console.warn(
				'[carbone] Failed to update template in local database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.update',
		{ templateId: input.templateId },
		'completed',
	);

	return response;
};

export const deleteTemplate: CarboneEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const response = assertCarboneSuccess(
		await makeCarboneRequest<DeleteTemplateOutput>(`/template/${templateId}`, {
			apiKey: ctx.key,
			method: 'DELETE',
		}),
	);

	if (ctx.db?.templates) {
		try {
			await ctx.db.templates.deleteByEntityId(input.templateId);
		} catch (error) {
			console.warn(
				'[carbone] Failed to remove template from local database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.delete',
		{ templateId: input.templateId },
		'completed',
	);

	return response;
};

export const listCategories: CarboneEndpoints['listCategories'] = async (
	ctx,
) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<ListTemplateCategoriesOutput>(
			'/templates/categories',
			{
				apiKey: ctx.key,
				method: 'GET',
			},
		),
	);

	if (ctx.db?.categories && Array.isArray(response.data)) {
		for (const cat of response.data) {
			if (cat.name) {
				try {
					await ctx.db.categories.upsertByEntityId(cat.name, {
						name: cat.name,
					});
				} catch (error) {
					console.warn(
						'[carbone] Failed to sync category to local database:',
						error,
					);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.listCategories',
		{ count: response.data?.length ?? 0 },
		'completed',
	);

	return response;
};

export const listTags: CarboneEndpoints['listTags'] = async (ctx) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<ListTemplateTagsOutput>('/templates/tags', {
			apiKey: ctx.key,
			method: 'GET',
		}),
	);

	if (ctx.db?.tags && Array.isArray(response.data)) {
		for (const tag of response.data) {
			if (tag.name) {
				try {
					await ctx.db.tags.upsertByEntityId(tag.name, {
						name: tag.name,
					});
				} catch (error) {
					console.warn(
						'[carbone] Failed to sync tag to local database:',
						error,
					);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.listTags',
		{ count: response.data?.length ?? 0 },
		'completed',
	);

	return response;
};
