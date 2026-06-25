import type { PluginAuthConfig } from '../auth/types';
import { BASE_AUTH_FIELDS } from '../auth/types';
import type { AuthTypes } from '../constants';
import type { CorsairPlugin } from '../plugins';

export function isAuthType(value: unknown): value is AuthTypes {
	return (
		value === 'oauth_2' ||
		value === 'api_key' ||
		value === 'bot_token' ||
		value === 'managed'
	);
}

export function getPluginAuthType(
	plugin: CorsairPlugin,
): AuthTypes | undefined {
	const authType = plugin.options?.authType;
	return isAuthType(authType) ? authType : undefined;
}

export function getAccountFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const baseFields = BASE_AUTH_FIELDS[authType].account;
	const extraFields = authConfig?.[authType]?.account ?? [];
	return [...baseFields, ...extraFields];
}
