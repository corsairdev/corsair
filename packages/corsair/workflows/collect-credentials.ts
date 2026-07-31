import { createAccountKeyManager } from '../core/auth/key-manager';
import type { PluginAuthConfig } from '../core/auth/types';
import { BASE_AUTH_FIELDS } from '../core/auth/types';
import type { AuthTypes } from '../core/constants';
import { getCorsairInternal } from '../core/utils/corsair-instance';

export type ScopedCredentials = {
	credentialMap: Record<string, Record<string, string>>;
	integrationCredentialMap: Record<string, Record<string, string>>;
};

/**
 * Decrypts every credential the given tenant has connected, into plain maps the
 * KEK-less child client can consume. Runs in the PARENT (needs KEK + DB); the
 * result is the only credential material that crosses into the child. A plugin
 * the tenant has not connected is simply skipped.
 */
export async function collectTenantCredentials(
	corsair: unknown,
	tenantId: string,
): Promise<ScopedCredentials> {
	const internal = getCorsairInternal(corsair);
	const credentialMap: Record<string, Record<string, string>> = {};
	const integrationCredentialMap: Record<string, Record<string, string>> = {};

	if (!internal.database || !internal.kek) {
		return { credentialMap, integrationCredentialMap };
	}

	for (const plugin of internal.plugins) {
		const authType = (plugin.options as { authType?: AuthTypes } | undefined)
			?.authType;
		if (!authType) continue;

		// Plugin-specific account fields (e.g. zendesk `subdomain`, twilio
		// `account_sid`) live in authConfig, not BASE_AUTH_FIELDS. Collect both, or
		// the child's key manager resolves them to null and the op fails auth.
		const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
		const extraAccountFields = authConfig?.[authType]?.account ?? [];
		const accountFields = [
			...BASE_AUTH_FIELDS[authType].account,
			...extraAccountFields,
		];

		const km = createAccountKeyManager({
			authType,
			integrationName: plugin.id,
			tenantId,
			kek: internal.kek,
			database: internal.database,
			extraAccountFields,
		}) as unknown as Record<string, () => Promise<unknown>>;

		try {
			const creds: Record<string, string> = {};
			for (const field of accountFields) {
				const value = await km[`get_${field}`]!();
				if (typeof value === 'string' && value.length > 0) creds[field] = value;
			}
			if (Object.keys(creds).length > 0) credentialMap[plugin.id] = creds;

			if (authType === 'oauth_2') {
				const integration = (await km.get_integration_credentials!()) as Record<
					string,
					string | null
				>;
				const filtered: Record<string, string> = {};
				for (const [key, value] of Object.entries(integration)) {
					if (typeof value === 'string' && value.length > 0)
						filtered[key] = value;
				}
				if (Object.keys(filtered).length > 0)
					integrationCredentialMap[plugin.id] = filtered;
			}
		} catch (error) {
			// A missing/uninitialized integration or account means the tenant hasn't
			// (fully) connected this plugin — expected, skip it. Both "not found" and
			// "No DEK found" are that state. Anything else (decrypt/DB failure) is
			// real and must not masquerade as "not connected", so surface it.
			const message = error instanceof Error ? error.message : String(error);
			if (!/not found|no dek found/i.test(message)) {
				console.warn(
					`[corsair] failed to collect credentials for "${plugin.id}": ${message}`,
				);
			}
		}
	}

	return { credentialMap, integrationCredentialMap };
}
