/**
 * Process-local replay set for browser/server delivery JTIs.
 *
 * Note: this Map is per Node process. Multi-instance / serverless fleets need a
 * shared store (Redis/DB) for cross-replica replay protection — this guard still
 * blocks same-process replays and is the contract exercised by hub delivery tests.
 */
const consumedKeys = new Map<string, number>();

function pruneExpired(now: number): void {
	for (const [key, expiresAt] of consumedKeys) {
		if (expiresAt <= now) {
			consumedKeys.delete(key);
		}
	}
}

export function consumeDeliveryReplayKey(
	key: string,
	ttlMs: number,
): { ok: true } | { ok: false; error: string } {
	const trimmedKey = key.trim();
	if (!trimmedKey) {
		return { ok: false, error: 'Delivery replay key is required' };
	}

	if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
		return {
			ok: false,
			error: 'Delivery replay TTL must be a positive number',
		};
	}

	const now = Date.now();
	pruneExpired(now);

	const existingExpiry = consumedKeys.get(trimmedKey);
	if (existingExpiry !== undefined && existingExpiry > now) {
		return { ok: false, error: 'Delivery request already consumed' };
	}

	consumedKeys.set(trimmedKey, now + ttlMs);
	return { ok: true };
}

export function resetDeliveryReplayGuardForTests(): void {
	consumedKeys.clear();
}
