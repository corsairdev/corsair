import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

export const get: UnioneEndpoints['suppression']['get'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['suppressionGet']
	>('suppression/get.json', ctx.key, {
		body: { email: input.email, all_projects: input.all_projects },
	});

	for (const item of response.suppressions ?? []) {
		await maybeUpsert(ctx.db.suppressions, input.email, {
			email: input.email,
			cause: item.cause,
			source: item.source,
			is_deletable: item.is_deletable,
			created: item.created,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.suppression.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: UnioneEndpoints['suppression']['list'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['suppressionList']
	>('suppression/list.json', ctx.key, { body: { ...input } });

	for (const item of response.suppressions ?? []) {
		if (item.email) {
			await maybeUpsert(ctx.db.suppressions, item.email, {
				email: item.email,
				cause: item.cause,
				source: item.source,
				is_deletable: item.is_deletable,
				created: item.created,
			});
		}
	}
	await logEventFromContext(
		ctx,
		'unione.suppression.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: UnioneEndpoints['suppression']['delete'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['suppressionDelete']
	>('suppression/delete.json', ctx.key, { body: { email: input.email } });

	await logEventFromContext(
		ctx,
		'unione.suppression.delete',
		{ ...input },
		'completed',
	);
	return response;
};
