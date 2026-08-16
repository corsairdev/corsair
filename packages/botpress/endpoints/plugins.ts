import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactQuery, resolveWorkspaceId } from './shared';
import type { BotpressPublicPlugin } from './types';

/**
 * Lists plugins installed in the workspace (distinct from the public
 * `hub.listPlugins` catalog). Confirmed live: `GET /v1/admin/plugins`
 * answers 400 without `x-workspace-id`.
 */
export const list: BotpressEndpoints['pluginsList'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{
		plugins?: BotpressPublicPlugin[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/plugins', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			name: input.name,
			version: input.version,
		}),
		workspaceId,
	});

	await logEventFromContext(
		ctx,
		'botpress.plugins.list',
		auditPayload(input, ['name']),
		'completed',
	);
	return { plugins: result.plugins ?? [], nextToken: result.meta?.nextToken };
};
