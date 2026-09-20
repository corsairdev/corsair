import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { FormbricksWebhookEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, formbricksCall, listParams, withQuery } from './shared';
import type { FormbricksEndpointOutputs } from './types';

const LABEL = 'webhook';

/**
 * Webhooks - outbound subscriptions Formbricks calls when a response arrives.
 *
 * These are **management operations over a resource**, not Corsair webhook triggers. The catalog
 * lists zero triggers and its Webhooks section reads "No webhooks", so this plugin registers no
 * webhook handlers; these five operations are ordinary endpoints that happen to manage
 * subscriptions.
 *
 * **v1 and v2 are the same resource, not two.** Confirmed by effect: a webhook created through
 * `POST v1/webhooks` is returned by `GET v2/management/webhooks`. Two surfaces over one store.
 * This plugin uses **v2** throughout, because that is the version the OpenAPI document describes -
 * and because v2 requires more fields, so a caller who satisfies v2 would also satisfy v1 while
 * the reverse is not true.
 *
 * **A create returns a signing `secret` that no later read shows.** That is a credential in a
 * response body: it is never logged, and `persist.ts` strips it before the row is mirrored. A
 * caller who needs it must take it from the create's return value, which is the only place it
 * exists.
 */

/** Lists the webhooks on the workspace. */
export const list: FormbricksEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['webhooksList']
	>(
		ctx,
		'v2',
		// `skip` on the wire. `meta` in the response reports an `offset` field, which is not the
		// parameter this route honours - see `PageStyle` in `shared.ts`.
		withQuery('management/webhooks', listParams('skip', input)),
	);

	await cacheEntities(ctx.db.webhooks, FormbricksWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.webhooks.list',
		{
			...auditPayload(input, ['limit', 'offset']),
			webhook_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/** Retrieves one webhook. The list projection omits `secret`, so this response carries none. */
export const get: FormbricksEndpoints['webhooksGet'] = async (ctx, input) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['webhooksGet']>(
		ctx,
		'v2',
		`management/webhooks/${input.webhookId}`,
	);

	await cacheEntity(ctx.db.webhooks, FormbricksWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.webhooks.get',
		auditPayload(input, ['webhookId']),
		'completed',
	);
	return result;
};

/**
 * Creates a webhook.
 *
 * v2 requires more than v1: `name`, `source` and **`surveyIds` as an array**, on top of `url` and
 * `triggers`. Each was found from a 422 rather than from documentation. An empty `surveyIds` means
 * "all surveys", so it is required but may be empty.
 *
 * **The response carries `secret`.** It is returned to the caller - that is the only chance to
 * capture it - but it is stripped before mirroring and never logged. The audit records the URL's
 * presence and the trigger names, not the secret.
 *
 * Non-idempotent: a replay creates a second subscription, so the same event would be delivered
 * twice to the same URL.
 */
export const create: FormbricksEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['webhooksCreate']
	>(ctx, 'v2', 'management/webhooks', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			name: input.name,
			url: input.url,
			source: input.source,
			triggers: input.triggers,
			surveyIds: input.surveyIds,
		}),
	});

	await cacheEntity(ctx.db.webhooks, FormbricksWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.webhooks.create',
		{
			...auditPayload(input, ['workspaceId', 'name', 'source']),
			webhook_id: result.id,
			triggers: input.triggers,
			survey_count: input.surveyIds.length,
			// Recorded so an operator can tell a create returned one, without the value.
			secret_returned: typeof result.secret === 'string',
		},
		'completed',
	);
	return result;
};

/**
 * Replaces a webhook's configuration.
 *
 * **A full replace, not a partial update.** `PUT` re-validates the whole body, so every field is
 * required and every field is sent. An earlier version of this function sent
 * `{name, url, triggers, surveyIds}` and left `source` out entirely - not in the body, not in the
 * input schema - so the route answered
 * `422 'source: Invalid option: expected one of "user"|"zapier"|"make"|"n8n"'` **every time**. The
 * operation was impossible to call successfully, and nothing in the plugin noticed: no unit test
 * asserted the body's shape against the API's requirements, and the live suite never updated a
 * webhook.
 *
 * `workspaceId` is accepted and is sent for consistency with the create; the route works without it,
 * so it is not the field that was missing.
 *
 * Changing `url` does **not** rotate the signing secret - the secret is issued once at create and no
 * read returns it - so a receiver keeps verifying with the secret it already has.
 */
export const update: FormbricksEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['webhooksUpdate']
	>(ctx, 'v2', `management/webhooks/${input.webhookId}`, {
		method: 'PUT',
		body: compactBody({
			workspaceId: input.workspaceId,
			name: input.name,
			url: input.url,
			source: input.source,
			triggers: input.triggers,
			surveyIds: input.surveyIds,
		}),
	});

	await cacheEntity(ctx.db.webhooks, FormbricksWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.webhooks.update',
		auditPayload(input, ['webhookId']),
		'completed',
	);
	return result;
};

/**
 * Deletes a webhook.
 *
 * Marked `destructive`: re-creating it issues a **new** signing secret, so every receiver verifying
 * signatures has to be updated. That is a larger blast radius than the record itself.
 *
 * The eviction is **required** rather than best-effort. A surviving mirrored row describes an
 * integration the account believes it removed, including its target URL - so a caller reading the
 * mirror would think events were still being delivered somewhere they are not.
 */
export const remove: FormbricksEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		version: 'v2',
		path: `management/webhooks/${input.webhookId}`,
		event: 'formbricks.webhooks.delete',
		input,
		identifierKeys: ['webhookId'],
		resultId: input.webhookId,
		mirror: {
			store: ctx.db.webhooks,
			entityId: input.webhookId,
			label: LABEL,
			required: true,
		},
	});
