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

	const now = Date.now();
	pruneExpired(now);

	if (consumedKeys.has(trimmedKey)) {
		return { ok: false, error: 'Delivery request already consumed' };
	}

	consumedKeys.set(trimmedKey, now + ttlMs);
	return { ok: true };
}

export function resetDeliveryReplayGuardForTests(): void {
	consumedKeys.clear();
}
