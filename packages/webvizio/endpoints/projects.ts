import { logEventFromContext } from 'corsair/core';
import { makeWebvizioRequest, unwrapWebvizioList } from '../client';
import type { WebvizioContext, WebvizioEndpoints } from '../index';
import { WebvizioEndpointOutputSchemas } from './types';

export const list: WebvizioEndpoints['projectsList'] = async (
	ctx: WebvizioContext,
	input,
) => {
	const result = await makeWebvizioRequest<unknown>('/projects', ctx.key);
	const parsed = WebvizioEndpointOutputSchemas.projectsList.parse(
		unwrapWebvizioList(result),
	);

	try {
		await Promise.all(
			parsed.map((project) =>
				ctx.db.projects.upsertByEntityId(project.uuid, {
					uuid: project.uuid,
					name: project.name,
					id: project.id,
					externalId: project.externalId,
					screenshot: project.screenshot,
					url: project.url,
					createdAt: project.createdAt,
					updatedAt: project.updatedAt,
				}),
			),
		);
	} catch (error) {
		console.warn('[webvizio] Failed to cache projects:', error);
	}

	await logEventFromContext(
		ctx,
		'webvizio.projects.list',
		{ ...input },
		'completed',
	);

	return parsed;
};
