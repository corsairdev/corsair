import { createAccountKeyManager } from '../core/auth/key-manager';
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

		const km = createAccountKeyManager({
			authType,
			integrationName: plugin.id,
			tenantId,
			kek: internal.kek,
			database: internal.database,
		}) as unknown as Record<string, () => Promise<unknown>>;

		try {
			const creds: Record<string, string> = {};
			for (const field of BASE_AUTH_FIELDS[authType].account) {
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
		} catch {
			// No account for this tenant + plugin — nothing to collect.
		}
	}

	return { credentialMap, integrationCredentialMap };
}
