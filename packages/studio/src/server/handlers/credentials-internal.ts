import type { AuthTypes, CorsairPlugin, PluginAuthConfig } from 'corsair/core';

const BASE_FIELDS: Record<
	AuthTypes,
	{ integration: readonly string[]; account: readonly string[] }
> = {
	oauth_2: {
		integration: ['client_id', 'client_secret', 'redirect_url'],
		account: ['access_token', 'refresh_token', 'expires_at'],
	},
	api_key: { integration: [], account: ['api_key'] },
	bot_token: { integration: [], account: ['bot_token'] },
} as const;

export type FieldStatus = {
	name: string;
	level: 'integration' | 'account';
	set: boolean;
};

export function getCustomFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): { integration: readonly string[]; account: readonly string[] } {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const entry = authConfig?.[authType];
	return {
		integration: entry?.integration ?? [],
		account: entry?.account ?? [],
	};
}

export async function getAuthFieldStatus(opts: {
	authType: AuthTypes | undefined;
	extraIntegration: readonly string[];
	extraAccount: readonly string[];
	integrationNamespace: Record<string, unknown> | null;
	accountNamespace: Record<string, unknown> | null;
	includeIntegration?: boolean;
	includeAccount?: boolean;
}): Promise<FieldStatus[]> {
	const {
		authType,
		extraIntegration,
		extraAccount,
		integrationNamespace,
		accountNamespace,
		includeIntegration = true,
		includeAccount = true,
	} = opts;
	if (!authType) return [];

	const base = BASE_FIELDS[authType];
	const integrationFields = Array.from(
		new Set([...base.integration, ...extraIntegration]),
	);
	const accountFields = Array.from(new Set([...base.account, ...extraAccount]));

	const result: FieldStatus[] = [];

	if (includeIntegration && integrationFields.length > 0) {
		for (const f of integrationFields) {
			const value = await tryGet(integrationNamespace, f);
			result.push({ name: f, level: 'integration', set: !!value });
		}
	}

	if (includeAccount && accountFields.length > 0) {
		for (const f of accountFields) {
			const value = await tryGet(accountNamespace, f);
			result.push({ name: f, level: 'account', set: !!value });
		}
	}

	return result;
}

async function tryGet(km: unknown, field: string): Promise<string | null> {
	const fn = (km as Record<string, unknown>)[`get_${field}`];
	if (typeof fn !== 'function') return null;
	try {
		return await (fn as () => Promise<string | null>)();
	} catch {
		return null;
	}
}

export function maskValue(value: string | null): string | null {
	if (!value) return null;
	return value.length <= 9
		? '***'
		: `${value.slice(0, 6)}...${value.slice(-3)}`;
}
