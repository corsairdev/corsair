import type { HubConfig } from '../../hub';
import {
	attachManagedRefreshAuth,
	getManagedAccessToken,
} from '../../hub/managed-auth';
import { AuthMissingError } from './errors/auth-missing';

type KeyBuilderLike = (
	ctx: Record<string, unknown>,
	kind: 'endpoint' | 'webhook',
) => Promise<string | undefined> | string | undefined;

export type ManagedCapablePlugin = {
	id: string;
	managed?: boolean;
	keyBuilder?: KeyBuilderLike;
};

type BindingCtx = {
	authType?: string;
	keys: unknown;
	hub?: HubConfig;
	tenantId?: string;
} & Record<string, unknown>;

/** A plugin is managed-capable unless it explicitly opts out. */
export function isManagedEnabled(plugin: { managed?: boolean }): boolean {
	return plugin.managed !== false;
}

/**
 * Resolves the access key for a bound endpoint/webhook call. In managed mode
 * the tenant's token is fetched from Hub (the app never runs the OAuth
 * exchange); otherwise the plugin's own keyBuilder runs. This is the single
 * place managed auth is wired — no per-plugin code.
 */
export async function resolveBindingKey(
	ctx: BindingCtx,
	plugin: ManagedCapablePlugin,
	kind: 'endpoint' | 'webhook',
): Promise<string | undefined> {
	if (ctx.authType === 'managed' && isManagedEnabled(plugin)) {
		if (!ctx.hub || !ctx.keys) {
			throw new AuthMissingError(plugin.id, 'managed');
		}
		const managedCtx = {
			keys: ctx.keys,
			hub: ctx.hub,
			plugin: plugin.id,
			tenantId: (ctx.tenantId as string) ?? 'default',
		};
		const { accessToken } = await getManagedAccessToken(
			managedCtx as Parameters<typeof getManagedAccessToken>[0],
		);
		await attachManagedRefreshAuth(
			ctx as Record<string, unknown>,
			managedCtx as Parameters<typeof attachManagedRefreshAuth>[1],
		);
		return accessToken;
	}
	return plugin.keyBuilder ? plugin.keyBuilder(ctx, kind) : undefined;
}
