import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scryptSync,
} from 'node:crypto';
import { parseSyncFromDeliveryBody } from './signing/envelope';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

export type ConnectionsSyncPlugin = {
	id: string;
	authType: string | null;
	configured: boolean;
	missingFields: string[];
};

export type ConnectionsSyncManifest = {
	tenants: Array<{ id: string }>;
	plugins: ConnectionsSyncPlugin[];
	syncedAt: string;
};

export type EncryptedSyncPayload = {
	encrypted: string;
};

function deriveKey(signingSecret: string, salt: Buffer): Buffer {
	return scryptSync(signingSecret.trim(), salt, KEY_LENGTH);
}

export function encryptSyncManifest(
	manifest: ConnectionsSyncManifest,
	signingSecret: string,
): string {
	const secret = signingSecret.trim();
	if (!secret) {
		throw new Error('Signing secret is required to encrypt sync manifest');
	}

	const salt = randomBytes(SALT_LENGTH);
	const key = deriveKey(secret, salt);
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, key, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});

	const plaintext = JSON.stringify(manifest);
	const encrypted = Buffer.concat([
		cipher.update(plaintext, 'utf8'),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	return [
		salt.toString('base64'),
		iv.toString('base64'),
		authTag.toString('base64'),
		encrypted.toString('base64'),
	].join(':');
}

export function decryptSyncManifest(
	ciphertext: string,
	signingSecret: string,
): ConnectionsSyncManifest {
	const secret = signingSecret.trim();
	if (!secret) {
		throw new Error('Signing secret is required to decrypt sync manifest');
	}

	const [saltB64, ivB64, authTagB64, encryptedB64] = ciphertext.split(':');
	if (!saltB64 || !ivB64 || !authTagB64 || !encryptedB64) {
		throw new Error('Invalid encrypted sync manifest format');
	}

	const salt = Buffer.from(saltB64, 'base64');
	const iv = Buffer.from(ivB64, 'base64');
	const authTag = Buffer.from(authTagB64, 'base64');
	const encrypted = Buffer.from(encryptedB64, 'base64');
	const key = deriveKey(secret, salt);

	const decipher = createDecipheriv(ALGORITHM, key, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]);

	const parsed = JSON.parse(decrypted.toString('utf8')) as unknown;
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Invalid sync manifest payload');
	}

	const record = parsed as Record<string, unknown>;
	if (!Array.isArray(record.tenants) || !Array.isArray(record.plugins)) {
		throw new Error('Sync manifest missing tenants or plugins');
	}

	return {
		tenants: record.tenants
			.filter(
				(entry): entry is { id: string } =>
					!!entry &&
					typeof entry === 'object' &&
					typeof (entry as { id?: unknown }).id === 'string',
			)
			.map((entry) => ({ id: entry.id })),
		plugins: record.plugins
			.filter(
				(entry): entry is ConnectionsSyncPlugin =>
					!!entry &&
					typeof entry === 'object' &&
					typeof (entry as { id?: unknown }).id === 'string',
			)
			.map((entry) => ({
				id: entry.id,
				authType:
					typeof entry.authType === 'string' || entry.authType === null
						? entry.authType
						: null,
				configured: entry.configured === true,
				missingFields: Array.isArray(entry.missingFields)
					? entry.missingFields.filter(
							(field): field is string => typeof field === 'string',
						)
					: [],
			})),
		syncedAt:
			typeof record.syncedAt === 'string'
				? record.syncedAt
				: new Date().toISOString(),
	};
}

export function parseSyncDeliveryBody(
	body: string,
): EncryptedSyncPayload | null {
	const sync = parseSyncFromDeliveryBody(body);
	return sync ? { encrypted: sync.encrypted } : null;
}
