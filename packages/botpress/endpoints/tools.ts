import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, resolveWorkspaceId } from './shared';
import type { BotpressEndpointOutputs } from './types';

/**
 * Executes a VRL (Vector Remap Language) script against input data.
 *
 * Needs a scoping header — confirmed live: `POST /v1/admin/helper/vrl`
 * answers 400 `request/headers must have required property
 * 'x-workspace-id'` with only the bearer token, and succeeds with either
 * `x-workspace-id` or `x-bot-id` attached. This resolves and requires the
 * workspace, matching the rest of the `/v1/admin/helper/*` family rather than
 * introducing a bot-scoping requirement this operation does not otherwise
 * need.
 */
export const runVrl: BotpressEndpoints['toolsRunVrl'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<BotpressEndpointOutputs['toolsRunVrl']>(
		ctx,
		'/v1/admin/helper/vrl',
		{
			method: 'POST',
			body: { data: input.data, script: input.script },
			workspaceId,
		},
	);

	await logEventFromContext(
		ctx,
		'botpress.tools.runVrl',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/**
 * Fetches a single row from a table by id.
 *
 * Tables are bot-scoped resources like files and knowledge bases, so this
 * assumes `x-bot-id` scoping by the same pattern confirmed live for those —
 * not independently confirmed live for the tables route itself.
 */
export const getTableRow: BotpressEndpoints['toolsGetTableRow'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		row: BotpressEndpointOutputs['toolsGetTableRow'];
	}>(ctx, `/v1/tables/${encodeURIComponent(input.table)}/row`, {
		method: 'GET',
		query: { id: input.id },
		botId: input.botId,
	});

	await logEventFromContext(
		ctx,
		'botpress.tools.getTableRow',
		auditPayload(input, ['botId', 'table', 'id']),
		'completed',
	);
	return result.row;
};
