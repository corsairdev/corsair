import { AsyncLocalStorage } from 'node:async_hooks';

const noPersistScope = new AsyncLocalStorage<true>();

/**
 * Runs `fn` in a scope where entity writes and event logging are skipped.
 * `upsertByEntityId` returns the row it would have stored; deletes report
 * nothing deleted. Account and integration writes (keys, DEK, token refresh)
 * are not affected. Inert unless entered. Guards the plugin `ctx.db` ORM only,
 * not the separate `corsair.orm` client in db/kysely/orm.ts.
 */
export function runWithoutPersist<T>(fn: () => T): T {
	return noPersistScope.run(true, fn);
}

/** Whether the current async context is inside a {@link runWithoutPersist} scope. */
export function isNoPersistActive(): boolean {
	return noPersistScope.getStore() === true;
}
