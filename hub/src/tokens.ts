import { randomBytes } from 'crypto';

export function createOpaqueToken(prefix: string): string {
	return `${prefix}_${randomBytes(32).toString('base64url')}`;
}

export function createShortId(prefix: string): string {
	return `${prefix}_${randomBytes(8).toString('base64url')}`;
}
