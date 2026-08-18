import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Pipelines, workflows and jobs are transactional and are never mirrored -
 * the same reasoning Loyverse applied to receipts and Habitica applied to a
 * task's `value`/`history`. Every operation here reads or writes live.
 */

/**
 * Lists pipelines, org-wide or restricted to the caller's own.
 *
 * Wrapped in `{items: [...], next_page_token}` per the spec, returned to the
 * caller as that same envelope rather than unwrapped to a bare array, so
 * `next_page_token` is not silently discarded. Pass it back as this
 * operation's `pageToken` input to fetch the next page.
 */
export const list: CircleCIEndpoints['pipelinesList'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['pipelinesList']>(
		ctx,
		'pipeline',
		{
			query: compact({
				'org-slug': input.orgSlug,
				'page-token': input.pageToken,
				mine: input.mine,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.pipelines.list',
		{
			...auditPayload(input, ['orgSlug', 'mine']),
			returned: result.items.length,
		},
		'completed',
	);
	return result;
};

/**
 * Lists a project's pipelines.
 *
 * Same paginated envelope as `list` above - see its doc comment.
 */
export const listForProject: CircleCIEndpoints['pipelinesListForProject'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['pipelinesListForProject']
		>(ctx, `project/${input.projectSlug}/pipeline`, {
			query: compact({ branch: input.branch, 'page-token': input.pageToken }),
		});

		await logEventFromContext(
			ctx,
			'circleci.pipelines.listForProject',
			{
				...auditPayload(input, ['projectSlug', 'branch']),
				returned: result.items.length,
			},
			'completed',
		);
		return result;
	};

/** Fetches a pipeline's config - the source or compiled YAML it ran with. */
export const getConfig: CircleCIEndpoints['pipelinesGetConfig'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['pipelinesGetConfig']
	>(ctx, `pipeline/${input.pipelineId}/config`);

	await logEventFromContext(
		ctx,
		'circleci.pipelines.getConfig',
		auditPayload(input, ['pipelineId']),
		'completed',
	);
	return result;
};

/**
 * Triggers a pipeline on a branch or tag, optionally with parameters.
 *
 * `POST /project/{project-slug}/pipeline`, not `.../pipeline/run` - decided
 * by comparing the two candidate routes' request bodies: this one takes
 * `branch`/`tag`/`parameters` directly, matching the catalog's own
 * description, where `.../pipeline/run` requires a pre-existing
 * `definition_id` the description never mentions.
 *
 * Not idempotent - each call starts another run. Never fired live in this
 * plugin's own recon, to avoid spending build minutes on the shared
 * development project outside of what CircleCI's own project-setup flow
 * already ran.
 */
export const trigger: CircleCIEndpoints['pipelinesTrigger'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['pipelinesTrigger']
	>(ctx, `project/${input.projectSlug}/pipeline`, {
		method: 'POST',
		body: compact({
			branch: input.branch,
			tag: input.tag,
			parameters: input.parameters,
		}),
	});

	await logEventFromContext(
		ctx,
		'circleci.pipelines.trigger',
		auditPayload(input, ['projectSlug', 'branch', 'tag']),
		'completed',
	);
	return result;
};
