// Encryption utilities
export {
	decryptConfig,
	decryptDEK,
	decryptWithDEK,
	encryptConfig,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
	reEncryptConfig,
} from './encryption';
// Auth error utilities
export { AuthMissingError, createMissingConfigProxy } from './errors';
export type { TokenResponse } from './exchange';
// Token exchange utility
export { exchangeCodeForTokens } from './exchange';
// Key manager factory and utilities
export {
	type AccountKeyManagerOptions,
	createAccountKeyManager,
	createIntegrationKeyManager,
	type IntegrationKeyManagerOptions,
	initializeAccountDEK,
	initializeIntegrationDEK,
} from './key-manager';
export {
	type AuthFieldLevel,
	type AuthFieldStatus,
	getPluginAuthStatus,
	getPluginAuthStatusForTenant,
	isOptionalAuthField,
	mapPluginAuthStatusToConnectionState,
	type PluginAuthStatus,
	type PluginAuthStatusLevel,
} from './plugin-auth-status';
// Types
export type {
	AccountFieldNames,
	AccountKeyContext,
	AccountKeyManagerFor,
	BaseAuthFieldConfig,
	BaseKeyManager,
	IntegrationFieldNames,
	IntegrationKeyContext,
	IntegrationKeyManagerFor,
	KeyManagerContext,
	OAuth2IntegrationCredentials,
	PluginAuthConfig,
} from './types';
export { BASE_AUTH_FIELDS } from './types';
