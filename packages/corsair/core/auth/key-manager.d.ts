import type { CorsairDatabase } from '../../db/kysely/database';
import type { AuthTypes } from '../constants';
import type { AccountKeyManagerFor, IntegrationKeyManagerFor } from './types';
export type IntegrationKeyManagerOptions<T extends AuthTypes> = {
    authType: T;
    integrationName: string;
    kek: string;
    database: CorsairDatabase;
    /** Extra integration-level fields from plugin authConfig */
    extraIntegrationFields?: readonly string[];
};
/**
 * Creates an integration-level key manager for the given auth type.
 * The returned manager has auto-generated getters/setters for all fields
 * (base fields for the auth type + any extra fields from plugin authConfig).
 */
export declare function createIntegrationKeyManager<T extends AuthTypes>(options: IntegrationKeyManagerOptions<T>): IntegrationKeyManagerFor<T>;
export type AccountKeyManagerOptions<T extends AuthTypes> = {
    authType: T;
    integrationName: string;
    tenantId: string;
    kek: string;
    database: CorsairDatabase;
    /** Extra account-level fields from plugin authConfig */
    extraAccountFields?: readonly string[];
};
/**
 * Creates an account-level key manager for the given auth type.
 * The returned manager has auto-generated getters/setters for all fields
 * (base fields for the auth type + any extra fields from plugin authConfig).
 * OAuth2 account managers also include `get_integration_credentials`.
 */
export declare function createAccountKeyManager<T extends AuthTypes>(options: AccountKeyManagerOptions<T>): AccountKeyManagerFor<T>;
/**
 * Initializes an integration with a new DEK.
 * Call this when creating a new integration or when setting up encryption for the first time.
 */
export declare function initializeIntegrationDEK(database: CorsairDatabase, integrationName: string, kek: string): Promise<string>;
/**
 * Initializes an account with a new DEK.
 * Call this when creating a new account or when setting up encryption for the first time.
 */
export declare function initializeAccountDEK(database: CorsairDatabase, integrationName: string, tenantId: string, kek: string): Promise<string>;
//# sourceMappingURL=key-manager.d.ts.map