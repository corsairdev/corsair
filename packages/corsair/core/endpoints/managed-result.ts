import { z } from 'zod';
import type { CorsairDatabase } from '../../db/kysely/database';
import { createKyselyEntityClient } from '../../db/kysely/orm';

export const MANAGED_RESULT_ENTITY = 'managed_result';
const MAX_RESULT_BYTES = 256 * 1024;
// The call has already succeeded; a stalled write may not hold its answer or usage report longer than this.
const SAVE_WAIT_MS = 1_000;

const schema = z.record(z.string(), z.unknown());

/**
 * Keeps what a paid call returned as a sealed entity, so search can find it.
 * Best effort: the call has already been paid for and succeeded, so a failed
 * save only warns. Keyed by the call's idempotency key, a retry overwrites.
 */
export async function saveManagedResult(input: {
	database: CorsairDatabase | undefined;
	getAccountId: (() => Promise<string>) | undefined;
	kek?: string;
	encryptDataAtRest?: boolean;
	idempotencyKey: string;
	operation: string;
	// unknown: whatever the provider returned and the caller sent.
	args: unknown;
	result: unknown;
}): Promise<void> {
	const { database, getAccountId } = input;
	if (!database || !getAccountId) return;
	const warn = (err: unknown) =>
		console.warn(
			`[corsair] could not save the result of ${input.operation}: ${err instanceof Error ? err.message : String(err)}`,
		);
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		const base = {
			operation: input.operation,
			args: input.args,
			at: new Date().toISOString(),
		};
		const json = JSON.stringify(input.result) ?? '';
		const data =
			new TextEncoder().encode(json).length > MAX_RESULT_BYTES
				? { ...base, truncated: true }
				: { ...base, result: input.result };
		const write = createKyselyEntityClient(
			database.db,
			getAccountId,
			MANAGED_RESULT_ENTITY,
			'1',
			schema,
			input.encryptDataAtRest && input.kek
				? { encryptDataAtRest: true, kek: input.kek }
				: undefined,
		).upsertByEntityId(input.idempotencyKey, data);
		// A write that outlives the wait still finishes; a late failure is only logged.
		write.catch(() => {});
		await Promise.race([
			write,
			new Promise((_, reject) => {
				timer = setTimeout(
					() => reject(new Error(`timed out after ${SAVE_WAIT_MS} ms`)),
					SAVE_WAIT_MS,
				);
			}),
		]);
	} catch (err) {
		warn(err);
	} finally {
		clearTimeout(timer);
	}
}
