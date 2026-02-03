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

// Auth method factories
export {
	createApiKeyAccountKeyManager,
	createApiKeyIntegrationKeyManager,
	createBotTokenAccountKeyManager,
	createBotTokenIntegrationKeyManager,
	createOAuth2AccountKeyManager,
	createOAuth2IntegrationKeyManager,
} from './methods';

// Types
export type {
	AccountConfigFor,
	AccountConfigMap,
	AccountKeyContext,
	AccountKeyManagerFor,
	AccountKeyManagerMap,
	ApiKeyAccountConfig,
	ApiKeyAccountKeyManager,
	ApiKeyIntegrationConfig,
	ApiKeyIntegrationKeyManager,
	BaseKeyManager,
	BotTokenAccountConfig,
	BotTokenAccountKeyManager,
	BotTokenIntegrationConfig,
	BotTokenIntegrationKeyManager,
	IntegrationConfigFor,
	IntegrationConfigMap,
	IntegrationKeyContext,
	IntegrationKeyManagerFor,
	IntegrationKeyManagerMap,
	KeyManagerContext,
	OAuth2AccountConfig,
	OAuth2AccountKeyManager,
	OAuth2IntegrationConfig,
	OAuth2IntegrationKeyManager,
} from './types';
