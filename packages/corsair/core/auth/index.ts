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
export { createMissingConfigProxy } from './errors';

// Key manager factory and utilities
export {
	type AccountKeyManagerOptions,
	createAccountKeyManager,
	createIntegrationKeyManager,
	type IntegrationKeyManagerOptions,
	initializeAccountDEK,
	initializeIntegrationDEK,
} from './key-manager';

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
