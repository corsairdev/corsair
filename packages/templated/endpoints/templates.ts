import type { TemplatedEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	DeleteResultSchema,
	TemplatesAddTagsInputSchema,
	TemplatesCreateInputSchema,
	TemplatesCreateResponseSchema,
	TemplatesGetInputSchema,
	TemplatesGetResponseSchema,
	TemplatesLayersInputSchema,
	TemplatesLayersResponseSchema,
	TemplatesListInputSchema,
	TemplatesListResponseSchema,
	TemplatesRemoveInputSchema,
	TemplatesRemoveTagsInputSchema,
	TemplateTagsResponseSchema,
} from './types';

export const templatesList: TemplatedEndpoints['templatesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'templates.list',
			input: TemplatesListInputSchema,
			output: TemplatesListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/templates',
			query: {
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				width: parsed.width,
				height: parsed.height,
			},
		}),
	);
};

export const templatesGet: TemplatedEndpoints['templatesGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'templates.get',
			input: TemplatesGetInputSchema,
			output: TemplatesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/template/${segment(parsed.templateId)}`,
			query: {
				includeLayers: parsed.includeLayers,
				includePages: parsed.includePages,
			},
		}),
	);
};

export const templatesLayers: TemplatedEndpoints['templatesLayers'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'templates.layers',
			input: TemplatesLayersInputSchema,
			output: TemplatesLayersResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/template/${segment(parsed.templateId)}/layers`,
			query: { includeLockedLayers: parsed.includeLockedLayers },
		}),
	);
};

export const templatesCreate: TemplatedEndpoints['templatesCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'templates.create',
			input: TemplatesCreateInputSchema,
			output: TemplatesCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/template',
			body: parsed,
		}),
	);
};

export const templatesRemove: TemplatedEndpoints['templatesRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'templates.remove',
			input: TemplatesRemoveInputSchema,
			output: DeleteResultSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/template/${segment(parsed.templateId)}`,
		}),
	);
};

export const templatesAddTags: TemplatedEndpoints['templatesAddTags'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'templates.addTags',
			input: TemplatesAddTagsInputSchema,
			output: TemplateTagsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/template/${segment(parsed.templateId)}/tags`,
			// The route takes a bare array of strings, not an object.
			body: parsed.tags,
		}),
	);
};

export const templatesRemoveTags: TemplatedEndpoints['templatesRemoveTags'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'templates.removeTags',
				input: TemplatesRemoveTagsInputSchema,
				output: TemplateTagsResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/template/${segment(parsed.templateId)}/tags`,
				body: parsed.tags,
			}),
		);
	};
