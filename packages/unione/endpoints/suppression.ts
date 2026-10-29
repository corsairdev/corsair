import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, redactEmail } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

/**
 * One address can be suppressed separately per project, and `all_projects`
 * returns every such row at once. Keying on the address alone makes each row in
 * that response overwrite the previous one, so the project qualifies the key.
 */
function suppressionKey(email: string, projectId?: string | null): string {
	return projectId ? `${email}:${projectId}` : email;
}

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
		await maybeUpsert(
			ctx.db.suppressions,
			suppressionKey(input.email, item.project_id),
			{
				email: input.email,
				project_id: item.project_id,
				cause: item.cause,
				source: item.source,
				is_deletable: item.is_deletable,
				created: item.created,
				created_at: item.created,
			},
		);
	}
	await logEventFromContext(
		ctx,
		'unione.suppression.get',
		{ ...input, email: redactEmail(input.email) },
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
			await maybeUpsert(
				ctx.db.suppressions,
				suppressionKey(item.email, item.project_id),
				{
					email: item.email,
					project_id: item.project_id,
					cause: item.cause,
					source: item.source,
					is_deletable: item.is_deletable,
					created: item.created,
					created_at: item.created,
				},
			);
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
		{ ...input, email: redactEmail(input.email) },
		'completed',
	);
	return response;
};
