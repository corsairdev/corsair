import type { PluginAuthConfig } from '../core';
import { createIntegrationKeyManager } from '../core';
import { getCallableProperty } from '../core/utils/callable';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../core/utils/corsair-instance';
import { getIntegrationFields, getPluginAuthType } from '../core/utils/plugin-auth';
import { ensureCorsairProvisionedForTenant } from './internal/provision';

export type IntegrationCredentialsDeliveryErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'plugin_not_found'
	| 'invalid_credentials';

export class IntegrationCredentialsDeliveryError extends Error {
	readonly code: IntegrationCredentialsDeliveryErrorCode;

	constructor(code: IntegrationCredentialsDeliveryErrorCode, message: string) {
		super(message);
		this.name = 'IntegrationCredentialsDeliveryError';
		this.code = code;
	}
}

export type ProcessIntegrationCredentialsDeliveryOptions = {
	plugin: string;
	credentials: Record<string, string>;
};

export type ProcessIntegrationCredentialsDeliveryResult = {
	plugin: string;
};

export async function processIntegrationCredentialsDelivery(
	corsair: unknown,
	options: ProcessIntegrationCredentialsDeliveryOptions,
): Promise<ProcessIntegrationCredentialsDeliveryResult> {
	const internal = getCorsairInternal(
		corsair,
		() =>
			new IntegrationCredentialsDeliveryError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	if (!internal.database) {
		throw new IntegrationCredentialsDeliveryError(
			'no_database',
			'Database not configured',
		);
	}

	const plugin = requireCorsairPlugin(
		internal,
		options.plugin,
		(message) =>
			new IntegrationCredentialsDeliveryError('plugin_not_found', message),
	);
	const authType = getPluginAuthType(plugin);
	if (!authType) {
		throw new IntegrationCredentialsDeliveryError(
			'invalid_credentials',
			`Plugin '${plugin.id}' has no authType configured`,
		);
	}

	await ensureCorsairProvisionedForTenant(corsair, 'default');

	const integrationFields = new Set(getIntegrationFields(plugin, authType));
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const extraIntegrationFields = authConfig?.[authType]?.integration ?? [];

	const integrationKeyManager = createIntegrationKeyManager({
		authType,
		integrationName: options.plugin,
		kek: internal.kek,
		database: internal.database,
		extraIntegrationFields,
	});

	let fieldsUpdated = 0;

	for (const [field, value] of Object.entries(options.credentials)) {
		if (!value.trim()) continue;
		if (!integrationFields.has(field)) {
			throw new IntegrationCredentialsDeliveryError(
				'invalid_credentials',
				`Unknown integration credential field '${field}' for plugin '${options.plugin}'`,
			);
		}

		const setter = getCallableProperty(integrationKeyManager, `set_${field}`);
		if (!setter) {
			throw new IntegrationCredentialsDeliveryError(
				'invalid_credentials',
				`Cannot set integration field '${field}' for plugin '${options.plugin}'`,
			);
		}

		await setter(value.trim());
		fieldsUpdated += 1;
	}

	if (fieldsUpdated === 0) {
		throw new IntegrationCredentialsDeliveryError(
			'invalid_credentials',
			'Provide at least one integration credential field to save',
		);
	}

	return {
		plugin: options.plugin,
	};
}
