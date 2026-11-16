import { asRecord } from 'corsair/core';
import type { SurveymonkeyEndpoints } from '..';
import { makeSurveymonkeyRequest, segment } from '../client';
import { call, listBody, queryOf, resolveBase, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Drops the fields a caller left out, so a PATCH leaves the rest alone. The
 * values come from the operation's input schema, which already validated them.
 * unknown: the field values are the schema's output, of mixed types.
 */
function bodyOf(fields: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}

export const list: SurveymonkeyEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ page, per_page }) => ({
			method: 'GET',
			path: '/webhooks',
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'webhook list'),
				data: unwrapList(raw, 'webhook list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const create: SurveymonkeyEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({
			name,
			event_type,
			object_type,
			object_ids,
			subscription_url,
			authorization,
		}) => ({
			method: 'POST',
			path: '/webhooks',
			body: bodyOf({
				name,
				event_type,
				object_type,
				object_ids,
				subscription_url,
				authorization,
			}),
		}),
		{
			log: (parsed, result) => ({
				webhookId: result.id,
				eventType: parsed.event_type,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhook_id }) => ({
			method: 'GET',
			path: `/webhooks/${segment(webhook_id)}`,
		}),
		{
			log: (parsed) => ({ webhookId: parsed.webhook_id }),
		},
	);

/**
 * SurveyMonkey's PATCH re-checks `object_ids` and answers 400 "One or more
 * objects ids are not accessible" when they are left out (seen live 11-16), so
 * a patch without them first reads the webhook and sends its current ones.
 */
async function currentObjectIds(
	ctx: Parameters<SurveymonkeyEndpoints['webhooksUpdate']>[0],
	webhookId: string,
): Promise<string[] | undefined> {
	const raw = await makeSurveymonkeyRequest(await resolveBase(ctx), ctx.key, {
		method: 'GET',
		path: `/webhooks/${segment(webhookId)}`,
	});
	const ids = asRecord(raw)?.object_ids;
	return Array.isArray(ids) ? ids.map(String) : undefined;
}

export const update: SurveymonkeyEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = Inputs.webhooksUpdate.parse(input ?? {});
	const objectIds =
		parsed.object_ids ?? (await currentObjectIds(ctx, parsed.webhook_id));
	return call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		{ ...parsed, object_ids: objectIds },
		({
			webhook_id,
			name,
			event_type,
			object_type,
			object_ids,
			subscription_url,
			authorization,
		}) => ({
			method: 'PATCH',
			path: `/webhooks/${segment(webhook_id)}`,
			body: bodyOf({
				name,
				event_type,
				object_type,
				object_ids,
				subscription_url,
				authorization,
			}),
		}),
		{
			log: (parsed) => ({ webhookId: parsed.webhook_id }),
		},
	);
};

export const remove: SurveymonkeyEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhook_id }) => ({
			method: 'DELETE',
			path: `/webhooks/${segment(webhook_id)}`,
		}),
		{
			shape: (_, parsed) => ({
				webhook_id: parsed.webhook_id,
				deleted: true,
			}),
			log: (parsed) => ({ webhookId: parsed.webhook_id }),
		},
	);
