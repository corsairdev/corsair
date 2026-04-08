import { logEventFromContext } from 'corsair/core';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getProjects: AhrefsEndpoints['siteAuditProjects'] = async (ctx, input) => {
	const result = await makeAhrefsRequest<AhrefsEndpointOutputs['siteAuditProjects']>(
		'/v3/site-audit/projects',
		ctx.key,
		{ query: { ...input } },
	);

	if (result.successful && result.data?.projects && ctx.db.siteAuditProjects) {
		try {
			for (const project of result.data.projects) {
				if (project.project_id) {
					await ctx.db.siteAuditProjects.upsertByEntityId(project.project_id, {
						id: project.project_id,
						project_id: project.project_id,
						...project,
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save site audit projects:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteAudit.getProjects', { ...input }, 'completed');
	return result;
};
