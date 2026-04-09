export declare const KEY_LENGTH = 32;
/**
 * Generates a new random Data Encryption Key (DEK).
 * The DEK is used to encrypt actual secrets (tokens, API keys, etc.)
 * @returns A base64-encoded random DEK
 */
export declare function generateDEK(): string;
/**
 * Encrypts a DEK using the Key Encryption Key (KEK).
 * Uses AES-256-GCM with a derived key from the KEK.
 * Format: salt:iv:authTag:encryptedData (all base64)
 *
 * @param dek - The plaintext DEK to encrypt
 * @param kek - The Key Encryption Key (master key)
 * @returns The encrypted DEK string
 */
export declare function encryptDEK(dek: string, kek: string): Promise<string>;
/**
 * Decrypts a DEK using the Key Encryption Key (KEK).
 *
 * @param encryptedDek - The encrypted DEK string (salt:iv:authTag:data format)
 * @param kek - The Key Encryption Key (master key)
 * @returns The decrypted plaintext DEK
 * @throws Error if decryption fails (wrong KEK or corrupted data)
 */
export declare function decryptDEK(encryptedDek: string, kek: string): Promise<string>;
/**
 * Encrypts data using a DEK.
 * Format: iv:authTag:encryptedData (all base64)
 *
 * @param data - The plaintext data to encrypt
 * @param dek - The Data Encryption Key (base64-encoded)
 * @returns The encrypted data string
 */
export declare function encryptWithDEK(data: string, dek: string): string;
/**
 * Decrypts data using a DEK.
 *
 * @param encryptedData - The encrypted data string (iv:authTag:data format)
 * @param dek - The Data Encryption Key (base64-encoded)
 * @returns The decrypted plaintext data
 * @throws Error if decryption fails
 */
export declare function decryptWithDEK(encryptedData: string, dek: string): string;
/**
 * Encrypts a config object. Each value in the config is encrypted individually.
 *
 * @param config - The config object with string values to encrypt
 * @param dek - The Data Encryption Key
 * @returns A new object with encrypted values
 */
export declare function encryptConfig(config: Record<string, string>, dek: string): Record<string, string>;
/**
 * Decrypts a config object. Each value in the config is decrypted individually.
 *
 * @param encryptedConfig - The config object with encrypted values
 * @param dek - The Data Encryption Key
 * @returns A new object with decrypted values
 */
export declare function decryptConfig(encryptedConfig: Record<string, string>, dek: string): Record<string, string>;
/**
 * Re-encrypts a config from an old DEK to a new DEK.
 * Used during DEK rotation.
 *
 * @param encryptedConfig - The config encrypted with the old DEK
 * @param oldDek - The old Data Encryption Key
 * @param newDek - The new Data Encryption Key
 * @returns A new object with values re-encrypted using the new DEK
 */
export declare function reEncryptConfig(encryptedConfig: Record<string, string>, oldDek: string, newDek: string): Record<string, string>;
//# sourceMappingURL=encryption.d.ts.map