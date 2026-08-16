import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheIntegration } from './persist';
import {
	botpressCall,
	compactBody,
	compactQuery,
	resolveWorkspaceId,
} from './shared';
import type { BotpressEndpointOutputs, BotpressIntegration } from './types';

/**
 * Creates an integration in a workspace.
 *
 * No workspace id in the path (confirmed live: `GET /v1/admin/integrations`
 * answers 400 without `x-workspace-id`, and `POST` shares the same route
 * family), so the acting workspace is resolved and required here.
 */
export const create: BotpressEndpoints['integrationsCreate'] = async (
	ctx,
	input,
) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{ integration: BotpressIntegration }>(
		ctx,
		'/v1/admin/integrations',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				version: input.version,
				title: input.title,
				description: input.description,
				url: input.url,
				code: input.code,
				configuration: input.configuration,
				configurations: input.configurations,
				states: input.states,
				events: input.events,
				actions: input.actions,
				entities: input.entities,
				channels: input.channels,
				user: input.user,
				interfaces: input.interfaces,
				identifier: input.identifier,
				extraOperations: input.extraOperations,
				sdkVersion: input.sdkVersion,
				secrets: input.secrets,
				icon: input.icon,
				readme: input.readme,
				public: input.public,
				visibility: input.visibility,
				layers: input.layers,
				attributes: input.attributes,
			}),
			workspaceId,
		},
	);

	await cacheIntegration(ctx.db?.integrations, result.integration);

	await logEventFromContext(
		ctx,
		'botpress.integrations.create',
		auditPayload(input, ['name', 'version']),
		'completed',
	);
	return result.integration;
};

/**
 * Gets an integration by name and version (`"latest"` resolves to the newest
 * version). Confirmed live: `GET /v1/admin/integrations/{name}/{version}`
 * needs `x-workspace-id` — unlike a by-id lookup, a name is only unambiguous
 * within a workspace.
 */
export const get: BotpressEndpoints['integrationsGet'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{ integration: BotpressIntegration }>(
		ctx,
		`/v1/admin/integrations/${encodeURIComponent(input.name)}/${encodeURIComponent(input.version)}`,
		{ workspaceId },
	);

	await cacheIntegration(ctx.db?.integrations, result.integration);

	await logEventFromContext(
		ctx,
		'botpress.integrations.get',
		auditPayload(input, ['name', 'version']),
		'completed',
	);
	return result.integration;
};

/** Lists integrations owned by the workspace. */
export const list: BotpressEndpoints['integrationsList'] = async (
	ctx,
	input,
) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{
		integrations?: BotpressIntegration[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/integrations', {
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
			visibility: input.visibility,
			dev: input.dev,
		}),
		workspaceId,
	});

	const integrations = result.integrations ?? [];
	await Promise.all(
		integrations.map((integration) =>
			cacheIntegration(ctx.db?.integrations, integration),
		),
	);

	await logEventFromContext(
		ctx,
		'botpress.integrations.list',
		auditPayload(input, ['name']),
		'completed',
	);
	return { integrations, nextToken: result.meta?.nextToken };
};

/** Validates that an integration update would succeed, without applying it. */
export const validateUpdate: BotpressEndpoints['integrationsValidateUpdate'] =
	async (ctx, input) => {
		await botpressCall(
			ctx,
			`/v1/admin/integrations/${encodeURIComponent(input.id)}/validate`,
			{
				method: 'PUT',
				body: compactBody({
					configuration: input.configuration,
					configurations: input.configurations,
					states: input.states,
					events: input.events,
					actions: input.actions,
					entities: input.entities,
					channels: input.channels,
					user: input.user,
					interfaces: input.interfaces,
					identifier: input.identifier,
					extraOperations: input.extraOperations,
					sdkVersion: input.sdkVersion,
					maxExecutionTime: input.maxExecutionTime,
					secrets: input.secrets,
					icon: input.icon,
					readme: input.readme,
					title: input.title,
					description: input.description,
					url: input.url,
					public: input.public,
					visibility: input.visibility,
					layers: input.layers,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'botpress.integrations.validateUpdate',
			auditPayload(input, ['id']),
			'completed',
		);
		return {};
	};

/**
 * Submits an integration for verification.
 *
 * No id in the path — the target integration is named entirely by the body's
 * `integrationId` — so the acting workspace is resolved and required here.
 */
export const requestVerification: BotpressEndpoints['integrationsRequestVerification'] =
	async (ctx, input) => {
		const workspaceId = await resolveWorkspaceId(ctx);

		await botpressCall(ctx, '/v1/admin/integrations/request-verification', {
			method: 'POST',
			body: { integrationId: input.integrationId },
			workspaceId,
		});

		await logEventFromContext(
			ctx,
			'botpress.integrations.requestVerification',
			auditPayload(input, ['integrationId']),
			'completed',
		);
		return {};
	};

/**
 * Lists Integration API Keys (IAKs) for an integration.
 *
 * Confirmed live: `GET /v1/admin/integrations/iaks` answers 400 requiring
 * both the `integrationId` query param and `x-workspace-id`.
 */
export const listApiKeys: BotpressEndpoints['integrationsListApiKeys'] = async (
	ctx,
	input,
) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{
		iaks: BotpressEndpointOutputs['integrationsListApiKeys'];
	}>(ctx, '/v1/admin/integrations/iaks', {
		method: 'GET',
		query: { integrationId: input.integrationId },
		workspaceId,
	});

	await logEventFromContext(
		ctx,
		'botpress.integrations.listApiKeys',
		auditPayload(input, ['integrationId']),
		'completed',
	);
	return result.iaks ?? [];
};

/** Deletes the shareable id for a bot-integration pair (sandbox feature). */
export const deleteShareableId: BotpressEndpoints['integrationsDeleteShareableId'] =
	async (ctx, input) => {
		await botpressCall(
			ctx,
			`/v1/admin/bots/${encodeURIComponent(input.botId)}/integrations/${encodeURIComponent(input.integrationId)}/shareable-id`,
			{
				method: 'DELETE',
				query: compactQuery({
					integrationInstanceAlias: input.integrationInstanceAlias,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'botpress.integrations.deleteShareableId',
			auditPayload(input, ['botId', 'integrationId']),
			'completed',
		);
		return {};
	};
