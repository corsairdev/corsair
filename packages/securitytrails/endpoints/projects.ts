import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import { safely } from './persist';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `GET /v2/projects` — Attack Surface Intelligence projects the key can reach.
 *
 * Supplies the `project_id` the rule endpoints require.
 * https://docs.securitytrails.com/reference/project-list_projects-1
 */
export const list: SecuritytrailsEndpoints['projectsList'] = async (
	ctx,
	input,
) => {
	const parsed = SecuritytrailsEndpointInputSchemas.projectsList.parse(
		input ?? {},
	);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['projectsList']
	>('projects', ctx.key, {
		method: 'GET',
		version: 'v2',
		query: { sort_direction: parsed.sort_direction },
		schema: SecuritytrailsEndpointOutputSchemas.projectsList,
	});

	if (response?.data?.length && ctx.db.projects) {
		for (const project of response.data) {
			await safely(`project ${project.id}`, () =>
				ctx.db.projects.upsertByEntityId(project.id, {
					id: project.id,
					title: project.title,
					scanning_enabled: project.scanning_enabled ?? null,
					last_scanned_at: project.last_scanned_at
						? new Date(project.last_scanned_at)
						: null,
					inserted_at: project.inserted_at
						? new Date(project.inserted_at)
						: null,
					max_exposure_score: project.max_exposure_score ?? null,
				}),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'securitytrails.projects.list',
		{ ...parsed },
		'completed',
	);

	return response;
};

/**
 * `POST /v2/projects/{project_id}/rules/_bulk_static_assets` — add and remove
 * static asset rules in one call.
 *
 * Asynchronous: the provider waits up to two seconds, then returns `task_ids`
 * to poll when the work has not finished. The 1000-rule ceiling is enforced by
 * the input schema so an oversized batch fails before it costs a request.
 * https://docs.securitytrails.com/reference/rules-add_static_assets
 */
export const bulkStaticAssetRules: SecuritytrailsEndpoints['projectsBulkStaticAssetRules'] =
	async (ctx, input) => {
		const parsed =
			SecuritytrailsEndpointInputSchemas.projectsBulkStaticAssetRules.parse(
				input,
			);

		const staticAssets: Record<string, unknown> = {};
		if (parsed.add_rules) staticAssets.add_rules = parsed.add_rules;
		if (parsed.remove_rules) staticAssets.remove_rules = parsed.remove_rules;

		const response = await makeSecuritytrailsRequest<
			SecuritytrailsEndpointOutputs['projectsBulkStaticAssetRules']
		>(
			`projects/${encodeURIComponent(parsed.project_id)}/rules/_bulk_static_assets`,
			ctx.key,
			{
				method: 'POST',
				version: 'v2',
				body: { static_assets: staticAssets },
				schema:
					SecuritytrailsEndpointOutputSchemas.projectsBulkStaticAssetRules,
			},
		);

		await logEventFromContext(
			ctx,
			'securitytrails.projects.bulkStaticAssetRules',
			{
				project_id: parsed.project_id,
				add_rules: parsed.add_rules?.length ?? 0,
				remove_rules: parsed.remove_rules?.length ?? 0,
			},
			'completed',
		);

		return response;
	};
