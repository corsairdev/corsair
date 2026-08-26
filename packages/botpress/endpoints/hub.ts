import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactQuery } from './shared';
import type {
	BotpressEndpointOutputs,
	BotpressPublicIntegration,
	BotpressPublicInterface,
	BotpressPublicPlugin,
} from './types';

/**
 * Public hub browsing. Confirmed live that none of these need
 * `x-workspace-id`: `GET /v1/admin/hub/integrations` and
 * `GET /v1/admin/hub/plugins` both succeeded with only the bearer token.
 */
export const listIntegrations: BotpressEndpoints['hubListIntegrations'] =
	async (ctx, input) => {
		const result = await botpressCall<{
			integrations?: BotpressPublicIntegration[];
			meta?: { nextToken?: string };
		}>(ctx, '/v1/admin/hub/integrations', {
			method: 'GET',
			query: compactQuery({
				nextToken: input.nextToken,
				pageSize: input.pageSize,
				limit: input.limit,
				name: input.name,
				version: input.version,
				interfaceId: input.interfaceId,
				interfaceName: input.interfaceName,
				installedByBotId: input.installedByBotId,
				verificationStatus: input.verificationStatus,
				search: input.search,
				sortBy: input.sortBy,
				direction: input.direction,
			}),
		});

		await logEventFromContext(
			ctx,
			'botpress.hub.listIntegrations',
			auditPayload(input, ['name', 'search']),
			'completed',
		);
		return {
			integrations: result.integrations ?? [],
			nextToken: result.meta?.nextToken,
		};
	};

/** Gets a public integration by name and version. */
export const getIntegration: BotpressEndpoints['hubGetIntegration'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ integration: BotpressPublicIntegration }>(
		ctx,
		`/v1/admin/hub/integrations/${encodeURIComponent(input.name)}/${encodeURIComponent(input.version)}`,
	);

	await logEventFromContext(
		ctx,
		'botpress.hub.getIntegration',
		auditPayload(input, ['name', 'version']),
		'completed',
	);
	return result.integration;
};

/** Gets a public integration by id. */
export const getIntegrationById: BotpressEndpoints['hubGetIntegrationById'] =
	async (ctx, input) => {
		const result = await botpressCall<{
			integration: BotpressPublicIntegration;
		}>(ctx, `/v1/admin/hub/integrations/${encodeURIComponent(input.id)}`);

		await logEventFromContext(
			ctx,
			'botpress.hub.getIntegrationById',
			auditPayload(input, ['id']),
			'completed',
		);
		return result.integration;
	};

/** Lists public interfaces available in the hub. */
export const listInterfaces: BotpressEndpoints['hubListInterfaces'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		interfaces?: BotpressPublicInterface[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/hub/interfaces', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			name: input.name,
			version: input.version,
		}),
	});

	await logEventFromContext(
		ctx,
		'botpress.hub.listInterfaces',
		auditPayload(input, ['name']),
		'completed',
	);
	return {
		interfaces: result.interfaces ?? [],
		nextToken: result.meta?.nextToken,
	};
};

/** Gets a public interface by name and version. */
export const getInterface: BotpressEndpoints['hubGetInterface'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ interface: BotpressPublicInterface }>(
		ctx,
		`/v1/admin/hub/interfaces/${encodeURIComponent(input.name)}/${encodeURIComponent(input.version)}`,
	);

	await logEventFromContext(
		ctx,
		'botpress.hub.getInterface',
		auditPayload(input, ['name', 'version']),
		'completed',
	);
	return result.interface;
};

/** Gets a public interface by id. */
export const getInterfaceById: BotpressEndpoints['hubGetInterfaceById'] =
	async (ctx, input) => {
		const result = await botpressCall<{ interface: BotpressPublicInterface }>(
			ctx,
			`/v1/admin/hub/interfaces/${encodeURIComponent(input.id)}`,
		);

		await logEventFromContext(
			ctx,
			'botpress.hub.getInterfaceById',
			auditPayload(input, ['id']),
			'completed',
		);
		return result.interface;
	};

/** Lists public plugins available in the hub. */
export const listPlugins: BotpressEndpoints['hubListPlugins'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		plugins?: BotpressPublicPlugin[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/hub/plugins', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			name: input.name,
			version: input.version,
		}),
	});

	await logEventFromContext(
		ctx,
		'botpress.hub.listPlugins',
		auditPayload(input, ['name']),
		'completed',
	);
	return { plugins: result.plugins ?? [], nextToken: result.meta?.nextToken };
};

/** Gets a public plugin by name and version. */
export const getPlugin: BotpressEndpoints['hubGetPlugin'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ plugin: BotpressPublicPlugin }>(
		ctx,
		`/v1/admin/hub/plugins/${encodeURIComponent(input.name)}/${encodeURIComponent(input.version)}`,
	);

	await logEventFromContext(
		ctx,
		'botpress.hub.getPlugin',
		auditPayload(input, ['name', 'version']),
		'completed',
	);
	return result.plugin;
};

/** Gets a public plugin by id. */
export const getPluginById: BotpressEndpoints['hubGetPluginById'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ plugin: BotpressPublicPlugin }>(
		ctx,
		`/v1/admin/hub/plugins/${encodeURIComponent(input.id)}`,
	);

	await logEventFromContext(
		ctx,
		'botpress.hub.getPluginById',
		auditPayload(input, ['id']),
		'completed',
	);
	return result.plugin;
};

/** Gets a public plugin's source code for a target platform. */
export const getPluginCode: BotpressEndpoints['hubGetPluginCode'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<
		BotpressEndpointOutputs['hubGetPluginCode']
	>(
		ctx,
		`/v1/admin/hub/plugins/${encodeURIComponent(input.id)}/code/${encodeURIComponent(input.platform)}`,
	);

	await logEventFromContext(
		ctx,
		'botpress.hub.getPluginCode',
		auditPayload(input, ['id', 'platform']),
		'completed',
	);
	return result;
};

/**
 * Gets a public plugin with its interface entity references resolved against
 * the backing integrations supplied in `interfaces`.
 */
export const getDereferencedPluginById: BotpressEndpoints['hubGetDereferencedPluginById'] =
	async (ctx, input) => {
		const result = await botpressCall<{ plugin: Record<string, unknown> }>(
			ctx,
			`/v1/admin/hub/plugins/${encodeURIComponent(input.id)}/dereferenced`,
			{ method: 'GET', query: compactQuery({ interfaces: input.interfaces }) },
		);

		await logEventFromContext(
			ctx,
			'botpress.hub.getDereferencedPluginById',
			auditPayload(input, ['id']),
			'completed',
		);
		return result.plugin;
	};
