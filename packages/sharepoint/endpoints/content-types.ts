import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const get: SharepointEndpoints['contentTypesGet'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['contentTypesGet']
	>(
		`/sites/${siteId}/contentTypes/${encodeURIComponent(input.content_type_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAll: SharepointEndpoints['contentTypesGetAll'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['contentTypesGetAll']
	>(`/sites/${siteId}/contentTypes`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.getAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const getForList: SharepointEndpoints['contentTypesGetForList'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['contentTypesGetForList']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/contentTypes`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.getForList',
		{ ...input },
		'completed',
	);
	return result;
};

export const getById: SharepointEndpoints['contentTypesGetById'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['contentTypesGetById']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/contentTypes/${encodeURIComponent(input.content_type_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.getById',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SharepointEndpoints['contentTypesCreate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const body: Record<string, unknown> = {
		name: input.name,
		...(input.description !== undefined && { description: input.description }),
		...(input.group !== undefined && { group: input.group }),
		...(input.id !== undefined && { id: input.id }),
	};

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['contentTypesCreate']
	>(`/sites/${siteId}/contentTypes`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SharepointEndpoints['contentTypesUpdate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const body: Record<string, unknown> = {
		...(input.name !== undefined && { name: input.name }),
		...(input.description !== undefined && { description: input.description }),
		...(input.group !== undefined && { group: input.group }),
	};

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/contentTypes/${encodeURIComponent(input.content_type_id)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.contentTypes.update',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const addFieldLink: SharepointEndpoints['contentTypesAddFieldLink'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

		const result = await makeGraphRequest<
			SharepointEndpointOutputs['contentTypesAddFieldLink']
		>(
			`/sites/${siteId}/contentTypes/${encodeURIComponent(input.contenttypeid)}/columns`,
			ctx.key,
			{
				method: 'POST',
				body: { sourceColumn: { id: input.field_internal_name } },
			},
		);

		await logEventFromContext(
			ctx,
			'sharepoint.contentTypes.addFieldLink',
			{ ...input },
			'completed',
		);
		return {
			field_link: {
				Id: input.field_internal_name,
				Name: input.field_internal_name,
				Hidden: input.hidden,
				Required: input.required,
				FieldInternalName: input.field_internal_name,
				...result,
			},
		};
	};

export const createListField: SharepointEndpoints['contentTypesCreateListField'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

		const body: Record<string, unknown> = {
			name: input.internal_name,
			displayName: input.display_name,
			...(input.required !== undefined && { required: input.required }),
			...(input.default_value !== undefined && {
				defaultValue: input.default_value,
			}),
			...(input.choices?.length && { choice: { choices: input.choices } }),
		};
		// Map field type to Graph column type
		const fieldTypeMap: Record<string, string> = {
			Text: 'text',
			Note: 'text',
			DateTime: 'dateTime',
			Choice: 'choice',
			Number: 'number',
			Currency: 'currency',
			Boolean: 'boolean',
			User: 'personOrGroup',
			URL: 'hyperlinkOrPicture',
			MultiChoice: 'choice',
			Lookup: 'lookup',
		};
		const graphType = fieldTypeMap[input.field_type] ?? 'text';
		body[graphType] = {};

		const result = await makeGraphRequest<
			SharepointEndpointOutputs['contentTypesCreateListField']
		>(
			`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/columns`,
			ctx.key,
			{ method: 'POST', body },
		);

		await logEventFromContext(
			ctx,
			'sharepoint.contentTypes.createListField',
			{ ...input },
			'completed',
		);
		return result;
	};
