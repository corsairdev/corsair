import { z } from 'zod';
import type { CorsairDatabase } from '../../db/kysely/database';
import { createKyselyEntityClient } from '../../db/kysely/orm';

export const MANAGED_RESULT_ENTITY = 'managed_result';
const MAX_RESULT_BYTES = 256 * 1024;

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
	try {
		const base = {
			operation: input.operation,
			args: input.args,
			at: new Date().toISOString(),
		};
		const json = JSON.stringify(input.result) ?? '';
		const data =
			json.length > MAX_RESULT_BYTES
				? { ...base, truncated: true }
				: { ...base, result: input.result };
		await createKyselyEntityClient(
			database.db,
			getAccountId,
			MANAGED_RESULT_ENTITY,
			'1',
			schema,
			input.encryptDataAtRest && input.kek
				? { encryptDataAtRest: true, kek: input.kek }
				: undefined,
		).upsertByEntityId(input.idempotencyKey, data);
	} catch (err) {
		console.warn(
			`[corsair] could not save the result of ${input.operation}: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
