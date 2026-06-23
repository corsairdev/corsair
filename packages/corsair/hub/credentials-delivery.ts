import type { PluginAuthConfig } from '../core';
import { createAccountKeyManager } from '../core';
import { getCallableProperty } from '../core/utils/callable';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../core/utils/corsair-instance';
import { getAccountFields, getPluginAuthType } from '../core/utils/plugin-auth';
import { ensureCorsairProvisionedForTenant } from './internal/provision';

export type AuthCredentialsDeliveryErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'plugin_not_found'
	| 'invalid_credentials';

export class AuthCredentialsDeliveryError extends Error {
	readonly code: AuthCredentialsDeliveryErrorCode;

	constructor(code: AuthCredentialsDeliveryErrorCode, message: string) {
		super(message);
		this.name = 'AuthCredentialsDeliveryError';
		this.code = code;
	}
}

export type ProcessAuthCredentialsDeliveryOptions = {
	plugin: string;
	tenantId: string;
	credentials: Record<string, string>;
};

export type ProcessAuthCredentialsDeliveryResult = {
	plugin: string;
	tenantId: string;
};

export async function processAuthCredentialsDelivery(
	corsair: unknown,
	options: ProcessAuthCredentialsDeliveryOptions,
): Promise<ProcessAuthCredentialsDeliveryResult> {
	const internal = getCorsairInternal(
		corsair,
		() =>
			new AuthCredentialsDeliveryError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	if (!internal.database) {
		throw new AuthCredentialsDeliveryError(
			'no_database',
			'Database not configured',
		);
	}

	const plugin = requireCorsairPlugin(
		internal,
		options.plugin,
		(message) => new AuthCredentialsDeliveryError('plugin_not_found', message),
	);
	const authType = getPluginAuthType(plugin);
	if (!authType) {
		throw new AuthCredentialsDeliveryError(
			'invalid_credentials',
			`Plugin '${plugin.id}' has no authType configured`,
		);
	}

	if (authType === 'oauth_2' || authType === 'managed') {
		throw new AuthCredentialsDeliveryError(
			'invalid_credentials',
			'OAuth plugins must be connected via sign-in, not credentials delivery',
		);
	}

	await ensureCorsairProvisionedForTenant(corsair, options.tenantId);

	const accountFields = new Set(getAccountFields(plugin, authType));
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const extraAccountFields = authConfig?.[authType]?.account ?? [];

	const accountKeyManager = createAccountKeyManager({
		authType,
		integrationName: options.plugin,
		tenantId: options.tenantId,
		kek: internal.kek,
		database: internal.database,
		extraAccountFields,
	});

	for (const [field, value] of Object.entries(options.credentials)) {
		if (!value.trim()) continue;
		if (!accountFields.has(field)) {
			throw new AuthCredentialsDeliveryError(
				'invalid_credentials',
				`Unknown credential field '${field}' for plugin '${options.plugin}'`,
			);
		}

		const setter = getCallableProperty(accountKeyManager, `set_${field}`);
		if (!setter) {
			throw new AuthCredentialsDeliveryError(
				'invalid_credentials',
				`Cannot set credential field '${field}' for plugin '${options.plugin}'`,
			);
		}

		await setter(value.trim());
	}

	return {
		plugin: options.plugin,
		tenantId: options.tenantId,
	};
}
