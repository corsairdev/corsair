import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16;
export const KEY_LENGTH = 32; // 256 bits for AES-256

// ─────────────────────────────────────────────────────────────────────────────
// Data Encryption Key (DEK) Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a new random Data Encryption Key (DEK).
 * The DEK is used to encrypt actual secrets (tokens, API keys, etc.)
 * @returns A base64-encoded random DEK
 */
export function generateDEK(): string {
	return randomBytes(KEY_LENGTH).toString('base64');
}

// ─────────────────────────────────────────────────────────────────────────────
// KEK-based DEK Encryption (Envelope Encryption)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encrypts a DEK using the Key Encryption Key (KEK).
 * Uses AES-256-GCM with a derived key from the KEK.
 * Format: salt:iv:authTag:encryptedData (all base64)
 *
 * @param dek - The plaintext DEK to encrypt
 * @param kek - The Key Encryption Key (master key)
 * @returns The encrypted DEK string
 */
export async function encryptDEK(dek: string, kek: string): Promise<string> {
	const salt = randomBytes(SALT_LENGTH);
	const derivedKey = (await scryptAsync(kek, salt, KEY_LENGTH)) as Buffer;

	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, derivedKey, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});

	const encrypted = Buffer.concat([cipher.update(dek, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();

	return [
		salt.toString('base64'),
		iv.toString('base64'),
		authTag.toString('base64'),
		encrypted.toString('base64'),
	].join(':');
}

/**
 * Decrypts a DEK using the Key Encryption Key (KEK).
 *
 * @param encryptedDek - The encrypted DEK string (salt:iv:authTag:data format)
 * @param kek - The Key Encryption Key (master key)
 * @returns The decrypted plaintext DEK
 * @throws Error if decryption fails (wrong KEK or corrupted data)
 */
export async function decryptDEK(
	encryptedDek: string,
	kek: string,
): Promise<string> {
	const [saltB64, ivB64, authTagB64, encryptedB64] = encryptedDek.split(':');

	if (!saltB64 || !ivB64 || !authTagB64 || !encryptedB64) {
		throw new Error('Invalid encrypted DEK format');
	}

	const salt = Buffer.from(saltB64, 'base64');
	const iv = Buffer.from(ivB64, 'base64');
	const authTag = Buffer.from(authTagB64, 'base64');
	const encrypted = Buffer.from(encryptedB64, 'base64');

	const derivedKey = (await scryptAsync(kek, salt, KEY_LENGTH)) as Buffer;

	const decipher = createDecipheriv(ALGORITHM, derivedKey, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]);

	return decrypted.toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// DEK-based Data Encryption (for secrets in config)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encrypts data using a DEK.
 * Format: iv:authTag:encryptedData (all base64)
 *
 * @param data - The plaintext data to encrypt
 * @param dek - The Data Encryption Key (base64-encoded)
 * @returns The encrypted data string
 */
export function encryptWithDEK(data: string, dek: string): string {
	const key = Buffer.from(dek, 'base64');
	const iv = randomBytes(IV_LENGTH);

	const cipher = createCipheriv(ALGORITHM, key, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});

	const encrypted = Buffer.concat([
		cipher.update(data, 'utf8'),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	return [
		iv.toString('base64'),
		authTag.toString('base64'),
		encrypted.toString('base64'),
	].join(':');
}

/**
 * Decrypts data using a DEK.
 *
 * @param encryptedData - The encrypted data string (iv:authTag:data format)
 * @param dek - The Data Encryption Key (base64-encoded)
 * @returns The decrypted plaintext data
 * @throws Error if decryption fails
 */
export function decryptWithDEK(encryptedData: string, dek: string): string {
	const [ivB64, authTagB64, encryptedB64] = encryptedData.split(':');

	if (!ivB64 || !authTagB64 || !encryptedB64) {
		throw new Error('Invalid encrypted data format');
	}

	const key = Buffer.from(dek, 'base64');
	const iv = Buffer.from(ivB64, 'base64');
	const authTag = Buffer.from(authTagB64, 'base64');
	const encrypted = Buffer.from(encryptedB64, 'base64');

	const decipher = createDecipheriv(ALGORITHM, key, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]);

	return decrypted.toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON Config Encryption Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encrypts a config object. Each value in the config is encrypted individually.
 *
 * @param config - The config object with string values to encrypt
 * @param dek - The Data Encryption Key
 * @returns A new object with encrypted values
 */
export function encryptConfig(
	config: Record<string, string>,
	dek: string,
): Record<string, string> {
	const encrypted: Record<string, string> = {};
	for (const [key, value] of Object.entries(config)) {
		encrypted[key] = encryptWithDEK(value, dek);
	}
	return encrypted;
}

/**
 * Decrypts a config object. Each value in the config is decrypted individually.
 *
 * @param encryptedConfig - The config object with encrypted values
 * @param dek - The Data Encryption Key
 * @returns A new object with decrypted values
 */
export function decryptConfig(
	encryptedConfig: Record<string, string>,
	dek: string,
): Record<string, string> {
	const decrypted: Record<string, string> = {};
	for (const [key, value] of Object.entries(encryptedConfig)) {
		decrypted[key] = decryptWithDEK(value, dek);
	}
	return decrypted;
}

/**
 * Re-encrypts a config from an old DEK to a new DEK.
 * Used during DEK rotation.
 *
 * @param encryptedConfig - The config encrypted with the old DEK
 * @param oldDek - The old Data Encryption Key
 * @param newDek - The new Data Encryption Key
 * @returns A new object with values re-encrypted using the new DEK
 */
export function reEncryptConfig(
	encryptedConfig: Record<string, string>,
	oldDek: string,
	newDek: string,
): Record<string, string> {
	const decrypted = decryptConfig(encryptedConfig, oldDek);
	return encryptConfig(decrypted, newDek);
}
