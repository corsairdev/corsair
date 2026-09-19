import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

export const set: UnioneEndpoints['template']['set'] = async (ctx, input) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['templateSet']
	>('template/set.json', ctx.key, { body: { template: input.template } });

	const template = response.template;
	if (template?.id) {
		await maybeUpsert(ctx.db.templates, template.id, {
			id: template.id,
			name: template.name,
			subject: template.subject,
			from_email: template.from_email,
			editor_type: template.editor_type,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.template.set',
		{ id: input.template.id },
		'completed',
	);
	return response;
};

export const get: UnioneEndpoints['template']['get'] = async (ctx, input) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['templateGet']
	>('template/get.json', ctx.key, { body: { id: input.id } });

	const template = response.template;
	if (template?.id) {
		await maybeUpsert(ctx.db.templates, template.id, {
			id: template.id,
			name: template.name,
			subject: template.subject,
			from_email: template.from_email,
			editor_type: template.editor_type,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.template.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: UnioneEndpoints['template']['list'] = async (ctx, input) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['templateList']
	>('template/list.json', ctx.key, {
		body: { limit: input.limit, offset: input.offset },
	});

	for (const template of response.templates ?? []) {
		if (template.id) {
			await maybeUpsert(ctx.db.templates, template.id, {
				id: template.id,
				name: template.name,
				subject: template.subject,
				from_email: template.from_email,
				editor_type: template.editor_type,
			});
		}
	}
	await logEventFromContext(
		ctx,
		'unione.template.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: UnioneEndpoints['template']['delete'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['templateDelete']
	>('template/delete.json', ctx.key, { body: { id: input.id } });

	await logEventFromContext(
		ctx,
		'unione.template.delete',
		{ ...input },
		'completed',
	);
	return response;
};
