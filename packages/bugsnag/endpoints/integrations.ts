import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Integrations - the third-party services a project can push errors into: Jira, Slack,
 * Asana and around ninety others.
 *
 * **Nothing here is mirrored, and the reason is credentials.** A configured integration
 * holds whatever the caller supplied to authenticate against the other service - the
 * `fields` published by `listSupported` include `password`, `apiToken`,
 * `secretAccessKey` and `oauthToken`. Copying that into a local table would put someone
 * else's secret in this database, and logging it would put it in durable storage. So
 * only ids and the integration key are ever recorded.
 *
 * **The paths are asymmetric.** A configured integration is created under its project
 * but addressed at the top level afterwards:
 *
 * ```
 * GET    projects/{project_id}/configured_integrations
 * POST   projects/{project_id}/configured_integrations
 * GET    configured_integrations/{id}
 * DELETE configured_integrations/{id}
 * POST   integrations/test                     <- before anything is configured
 * ```
 *
 * The two `{id}` routes were confirmed live by their envelope rather than by a success:
 * they answer `{"errors":["Integration not found"]}` for an absent id, which is the
 * resource-missing shape and therefore proof the route exists. The recon account has no
 * integration configured, and configuring one needs real third-party credentials, so
 * the response *shapes* for those operations are documented rather than observed - see
 * `schema/responses.ts`.
 */

/**
 * Lists every integration BugSnag supports.
 *
 * Public product information rather than account data - the catalogue a caller consults
 * to find an integration key and the configuration fields it expects. Verified live.
 */
export const listSupported: BugsnagEndpoints['integrationsListSupported'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['integrationsListSupported']
		>(ctx, withQuery('integrations', listParams(input)));

		await logEventFromContext(
			ctx,
			'bugsnag.integrations.listSupported',
			{
				...auditPayload(input, ['per_page', 'offset']),
				integration_count: countOf(result),
			},
			'completed',
		);
		return result;
	};

/**
 * Lists the integrations configured on a project.
 *
 * `configured_integration_summaries` also answers 200 on this project, but the plain
 * collection is the one that matches the operation's name and is used here. Verified
 * live - an empty array on an account with nothing configured.
 */
export const listConfigured: BugsnagEndpoints['integrationsListConfigured'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['integrationsListConfigured']
		>(
			ctx,
			withQuery(
				`projects/${input.project_id}/configured_integrations`,
				listParams(input),
			),
		);

		await logEventFromContext(
			ctx,
			'bugsnag.integrations.listConfigured',
			{
				...auditPayload(input, ['project_id', 'per_page', 'offset']),
				integration_count: countOf(result),
			},
			'completed',
		);
		return result;
	};

/**
 * Configures an integration on a project.
 *
 * The field is **`integration_key`** here. {@link test} calls the same value `key`, and
 * that asymmetry is the API's own - sending the wrong one produces
 * `{"errors":["Integration key can't be blank"]}`, which reads as though the value were
 * missing rather than misnamed. Route and contract confirmed live with an empty body.
 *
 * `configuration` carries the third-party credential, so it is never logged: the audit
 * payload records the project, the integration key and the *names* of the configuration
 * fields supplied, which is enough to reconstruct what was set up without recording the
 * secret that was used.
 *
 * Non-idempotent - a replay would configure the integration twice.
 */
export const configure: BugsnagEndpoints['integrationsConfigure'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['integrationsConfigure']
	>(ctx, `projects/${input.project_id}/configured_integrations`, {
		method: 'POST',
		body: {
			integration_key: input.integration_key,
			configuration: input.configuration,
		},
	});

	await logEventFromContext(
		ctx,
		'bugsnag.integrations.configure',
		{
			...auditPayload(input, ['project_id', 'integration_key']),
			configured_integration_id: result.id,
			// Field names only. The values are credentials for another service.
			configuration_fields: Object.keys(input.configuration ?? {}),
		},
		'completed',
	);
	return result;
};

/** Retrieves one configured integration by id. Top-level path. */
export const getConfigured: BugsnagEndpoints['integrationsGetConfigured'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['integrationsGetConfigured']
		>(ctx, `configured_integrations/${input.integration_id}`);

		await logEventFromContext(
			ctx,
			'bugsnag.integrations.getConfigured',
			auditPayload(input, ['integration_id']),
			'completed',
		);
		return result;
	};

/**
 * Deletes a configured integration.
 *
 * Marked destructive rather than write: it cannot be undone, and re-creating it requires
 * the third-party credentials again, which the caller may not still have. Errors already
 * pushed into the other service are unaffected.
 *
 * Nothing is evicted because configured integrations are not mirrored.
 */
export const deleteConfigured: BugsnagEndpoints['integrationsDeleteConfigured'] =
	async (ctx, input) =>
		await deleteAndEvict(ctx, {
			path: `configured_integrations/${input.integration_id}`,
			event: 'bugsnag.integrations.deleteConfigured',
			input,
			identifierKeys: ['integration_id'],
			resultId: input.integration_id,
			// No mirror: a configured integration holds a third-party credential.
		});

/**
 * Tests a configuration **before** an integration is created.
 *
 * Hence the top-level path and the absence of a project id: there is nothing configured
 * yet to test. Route and contract confirmed live - an empty body answers
 * `{"errors":["Key can't be blank","Key is not included in the list","Configuration
 * can't be blank"]}`, which also confirms `key` is validated against the supported list.
 *
 * Note this takes `key`, not `integration_key`. See {@link configure}.
 *
 * Safe to repeat - it validates rather than creates - so it is not in the non-idempotent
 * set despite being a POST. As with `configure`, the configuration values are
 * credentials and only their field names are logged.
 */
export const test: BugsnagEndpoints['integrationsTest'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['integrationsTest']>(
		ctx,
		'integrations/test',
		{
			method: 'POST',
			body: { key: input.key, configuration: input.configuration },
		},
	);

	await logEventFromContext(
		ctx,
		'bugsnag.integrations.test',
		{
			...auditPayload(input, ['key']),
			configuration_fields: Object.keys(input.configuration ?? {}),
		},
		'completed',
	);
	return result;
};
