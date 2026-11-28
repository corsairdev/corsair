import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';

/**
 * Azure DevOps Services. A personal access token belongs to one organization
 * (`dev.azure.com/<organization>`), so the organization is account config
 * beside the token. Routes live on several hosts (dev.azure.com,
 * vsrm.dev.azure.com, vssps.dev.azure.com, ...): each operation names its own.
 */
export const azuredevopsAccountFields = ['organization'] as const;

export type AzureDevopsAuthOptions = {
	/**
	 * The organization the token belongs to: its name (`fabrikam`) or URL
	 * (`https://dev.azure.com/fabrikam`, `https://fabrikam.visualstudio.com`).
	 * Overrides the account's stored `organization`.
	 */
	organization?: string;
};

export type AzureDevopsStoredKeys = {
	get_organization?: () => Promise<string | null | undefined>;
};

export type AzureDevopsTarget = {
	base: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	secrets: string[];
};

/** Hosts whose routes are not under an organization. */
const ORGLESS_HOSTS = new Set([
	'app.vssps.visualstudio.com',
	'status.dev.azure.com',
]);

/** Every host an operation in this plugin may name. */
const KNOWN_HOST =
	/^([a-z]+\.)?dev\.azure\.com$|^app\.vssps\.visualstudio\.com$/;

/**
 * The organization name from a name or an organization URL. Names are 1-50
 * letters, digits and hyphens (Azure DevOps' rule), so nothing in one can
 * change the host or path.
 */
export function normalizeAzureDevopsOrganization(
	raw: string | undefined,
): string {
	let value = (raw ?? '').trim();
	if (!value) throw new Error('[azuredevops] organization is required');
	if (/^https?:\/\//i.test(value)) {
		let url: URL;
		try {
			url = new URL(value);
		} catch {
			throw new Error('[azuredevops] organization URL is not a valid URL');
		}
		const host = url.hostname.toLowerCase();
		if (host === 'dev.azure.com') {
			value = url.pathname.split('/').filter(Boolean)[0] ?? '';
		} else if (host.endsWith('.visualstudio.com')) {
			value = host.slice(0, -'.visualstudio.com'.length);
		} else {
			throw new Error(
				'[azuredevops] organization URL must be https://dev.azure.com/<organization> or https://<organization>.visualstudio.com',
			);
		}
	}
	if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,49}$/.test(value)) {
		throw new Error(
			'[azuredevops] organization must be 1-50 letters, digits and hyphens',
		);
	}
	return value;
}

async function storedOrganization(
	keys?: AzureDevopsStoredKeys,
): Promise<string> {
	const getter = keys?.get_organization;
	return getter ? ((await tryGetStoredKey(getter))?.trim() ?? '') : '';
}

/**
 * Where a call goes and how it signs in: `https://<host>/<organization>`
 * (the operation's host, dev.azure.com by default) with the token as HTTP
 * Basic auth and an empty user name. A token that looks like a JWT (an Entra
 * access token) goes as a bearer token instead.
 */
export async function resolveAzureDevopsTarget(
	ctx: {
		key: string;
		options: AzureDevopsAuthOptions;
		keys?: AzureDevopsStoredKeys;
	},
	host?: string,
): Promise<AzureDevopsTarget> {
	const raw =
		ctx.options?.organization?.trim() || (await storedOrganization(ctx.keys));
	if (!raw) {
		throw new AuthMissingError(
			'azuredevops',
			'api_key',
			'[azuredevops] organization is not set: connect the account with the organization name from dev.azure.com/<organization>',
		);
	}
	const organization = normalizeAzureDevopsOrganization(raw);
	const apiHost = host ?? 'dev.azure.com';
	if (!KNOWN_HOST.test(apiHost)) {
		throw new Error('[azuredevops] unknown API host');
	}
	const base = ORGLESS_HOSTS.has(apiHost)
		? `https://${apiHost}`
		: `https://${apiHost}/${organization}`;
	const isJwt = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(ctx.key);
	return {
		base,
		headers: {
			Authorization: isJwt
				? `Bearer ${ctx.key}`
				: `Basic ${Buffer.from(`:${ctx.key}`, 'utf8').toString('base64')}`,
		},
		query: {},
		secrets: [],
	};
}

/**
 * A stored token belongs to the stored organization. An `organization`
 * option that names another one would send the token there.
 */
export async function checkAzureDevopsStoredPairing(
	options: AzureDevopsAuthOptions,
	keys?: AzureDevopsStoredKeys,
): Promise<void> {
	if (!options.organization?.trim()) return;
	const stored = await storedOrganization(keys);
	if (
		!stored ||
		normalizeAzureDevopsOrganization(stored).toLowerCase() !==
			normalizeAzureDevopsOrganization(options.organization).toLowerCase()
	) {
		throw new AuthMissingError(
			'azuredevops',
			'api_key',
			'[azuredevops] the stored token belongs to another organization than the organization option: pass key with organization, or connect an account for that organization',
		);
	}
}
