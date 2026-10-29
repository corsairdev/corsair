import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const listEmailTemplates: InstantlyEndpoints['emailTemplatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailTemplatesList',
		'emailTemplates.list',
		input,
		(query) => ({ method: 'GET', path: '/email-templates', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const createEmailTemplate: InstantlyEndpoints['emailTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailTemplatesCreate',
		'emailTemplates.create',
		input,
		(body) => ({ method: 'POST', path: '/email-templates', body }),
		{},
	);

export const deleteEmailTemplate: InstantlyEndpoints['emailTemplatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailTemplatesDelete',
		'emailTemplates.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/email-templates/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const listPromptTemplates: InstantlyEndpoints['customPromptTemplatesList'] =
	(ctx, input) =>
		call(
			ctx,
			'customPromptTemplatesList',
			'customPromptTemplates.list',
			input,
			(query) => ({ method: 'GET', path: '/custom-prompt-templates', query }),
			{ log: (_, result) => ({ count: result.items.length }) },
		);

export const getPromptTemplate: InstantlyEndpoints['customPromptTemplatesGet'] =
	(ctx, input) =>
		call(
			ctx,
			'customPromptTemplatesGet',
			'customPromptTemplates.get',
			input,
			({ id }) => ({
				method: 'GET',
				path: `/custom-prompt-templates/${segment(id)}`,
			}),
			{ log: ({ id }) => ({ id }) },
		);

export const createPromptTemplate: InstantlyEndpoints['customPromptTemplatesCreate'] =
	(ctx, input) =>
		call(
			ctx,
			'customPromptTemplatesCreate',
			'customPromptTemplates.create',
			input,
			(body) => ({ method: 'POST', path: '/custom-prompt-templates', body }),
			{},
		);

export const updatePromptTemplate: InstantlyEndpoints['customPromptTemplatesUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			'customPromptTemplatesUpdate',
			'customPromptTemplates.update',
			input,
			({ id, ...body }) => ({
				method: 'PATCH',
				path: `/custom-prompt-templates/${segment(id)}`,
				body,
			}),
			{ log: ({ id }) => ({ id }) },
		);

export const deletePromptTemplate: InstantlyEndpoints['customPromptTemplatesDelete'] =
	(ctx, input) =>
		call(
			ctx,
			'customPromptTemplatesDelete',
			'customPromptTemplates.delete',
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/custom-prompt-templates/${segment(id)}`,
			}),
			{ log: ({ id }) => ({ id }) },
		);
