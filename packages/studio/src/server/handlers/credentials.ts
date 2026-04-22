import type { AuthTypes } from 'corsair/core';
import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';
import { getCustomFields, maskValue } from './credentials-internal';

type PluginAuthState = {
	authType: AuthTypes | null;
	integration: Record<string, string | null>;
	account: Record<string, string | null>;
};

const BASE: Record<AuthTypes, { integration: string[]; account: string[] }> = {
	oauth_2: {
		integration: ['client_id', 'client_secret', 'redirect_url'],
		account: [
			'access_token',
			'refresh_token',
			'expires_at',
			'webhook_signature',
		],
	},
	api_key: { integration: [], account: ['api_key', 'webhook_signature'] },
	bot_token: { integration: [], account: ['bot_token', 'webhook_signature'] },
};

export const getCredentials: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const pluginId = String(body.pluginId ?? '');
	const tenantId = String(body.tenantId ?? 'default');
	const scope = body.scope === 'main' ? 'main' : 'tenant';
	const showRaw = body.showRaw === true;

	const { internal, instance, resolveClient } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');

	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Plugin '${pluginId}' not found.`);

	const authType = (plugin.options as Record<string, unknown> | undefined)
		?.authType as AuthTypes | undefined;

	const state: PluginAuthState = {
		authType: authType ?? null,
		integration: {},
		account: {},
	};

	if (!authType) return state;

	const custom = getCustomFields(plugin, authType);
	const base = BASE[authType];
	const integrationFields = Array.from(
		new Set([...base.integration, ...custom.integration]),
	);
	const accountFields = Array.from(
		new Set([...base.account, ...custom.account]),
	);
	const rootKeys = ((instance as Record<string, unknown>).keys ??
		null) as Record<string, unknown> | null;
	const integrationNamespace = (rootKeys?.[pluginId] ?? null) as Record<
		string,
		unknown
	> | null;
	const client = resolveClient(tenantId);
	const pluginNamespace = (client[pluginId] ?? null) as Record<
		string,
		unknown
	> | null;
	const accountNamespace =
		scope === 'tenant'
			? ((pluginNamespace?.keys ?? null) as Record<string, unknown> | null)
			: null;

	if (integrationFields.length > 0) {
		for (const f of integrationFields) {
			const fn = integrationNamespace?.[`get_${f}`];
			const v =
				typeof fn === 'function'
					? await (fn as () => Promise<string | null>)()
					: null;
			state.integration[f] = showRaw ? v : maskValue(v);
		}
	}

	if (scope === 'tenant' && accountFields.length > 0) {
		for (const f of accountFields) {
			const fn = accountNamespace?.[`get_${f}`];
			const v =
				typeof fn === 'function'
					? await (fn as () => Promise<string | null>)()
					: null;
			state.account[f] = showRaw ? v : maskValue(v);
		}
	}

	return state;
};

export const setCredentials: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const pluginId = String(body.pluginId ?? '');
	const tenantId = String(body.tenantId ?? 'default');
	const scope = body.scope === 'main' ? 'main' : 'tenant';
	const fields = (body.fields ?? {}) as Record<string, string>;

	const { internal, instance, resolveClient } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');

	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Plugin '${pluginId}' not found.`);

	const authType = (plugin.options as Record<string, unknown> | undefined)
		?.authType as AuthTypes | undefined;
	if (!authType) {
		throw new Error(`Plugin '${pluginId}' does not require credentials.`);
	}

	const custom = getCustomFields(plugin, authType);
	const base = BASE[authType];
	const integrationFields = new Set([
		...base.integration,
		...custom.integration,
	]);
	const accountFields = new Set([...base.account, ...custom.account]);
	const rootKeys = ((instance as Record<string, unknown>).keys ??
		null) as Record<string, unknown> | null;
	const integrationNamespace = (rootKeys?.[pluginId] ?? null) as Record<
		string,
		unknown
	> | null;
	const client = resolveClient(tenantId);
	const pluginNamespace = (client[pluginId] ?? null) as Record<
		string,
		unknown
	> | null;
	const accountNamespace =
		scope === 'tenant'
			? ((pluginNamespace?.keys ?? null) as Record<string, unknown> | null)
			: null;

	const updated: string[] = [];

	for (const [field, value] of Object.entries(fields)) {
		if (value === undefined || value === null || value === '') continue;

		if (integrationFields.has(field)) {
			const setter = integrationNamespace?.[`set_${field}`];
			if (typeof setter === 'function') {
				await (setter as (v: string) => Promise<void>)(value);
				updated.push(`integration:${field}`);
				continue;
			}
		}
		if (scope === 'tenant' && accountFields.has(field)) {
			const setter = accountNamespace?.[`set_${field}`];
			if (typeof setter === 'function') {
				await (setter as (v: string) => Promise<void>)(value);
				updated.push(`account:${field}`);
				continue;
			}
		}
		throw new Error(`Unknown field '${field}' for plugin '${pluginId}'.`);
	}

	return { ok: true, updated };
};
