/**
 * Creates a proxy that throws helpful errors when accessing keys without proper configuration.
 * Used when database or KEK is not configured in createCorsair().
 *
 * @param hasDatabase - Whether a database adapter is configured
 * @param hasKek - Whether a KEK (Key Encryption Key) is configured
 * @returns A proxy that throws an error when any property is accessed
 */
export declare function createMissingConfigProxy<T>(hasDatabase: boolean, hasKek: boolean): T;
//# sourceMappingURL=missing-config.d.ts.map