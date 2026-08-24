import type { EventLoggingContext } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { FormbricksApiVersion } from '../client';
import { isResourceAbsent } from '../error-handlers';
import { auditPayload } from './logging';
import type { EntityEvictor } from './persist';
import { evictEntity } from './persist';
import { formbricksCall } from './shared';

/**
 * The delete flow, shared by every operation that removes a record.
 *
 * It is here from the start rather than added after review, because the bug it prevents was
 * found by a reviewer on the previous integration and is not obvious from either half:
 *
 * A delete of a *named* resource is safe to replay - the second attempt reports not-found - so
 * these operations are deliberately absent from `NON_IDEMPOTENT_OPERATIONS` and therefore **are**
 * retried after a network or 5xx failure. But if the first attempt succeeded remotely and only
 * its response was lost, the replay receives a 404. If the request throws before the eviction
 * runs, the caller is told the deletion failed **while the local mirror still holds the record** -
 * which for a webhook means a target URL the account believes it deleted, and for a contact
 * attribute key means the schema that makes respondent data legible.
 *
 * So a 404 on a delete is treated as **confirmed absence**: the record is not there, whether this
 * call removed it or an earlier attempt did. Either way the mirror must be evicted, so the flow
 * continues instead of aborting. The audit payload records `already_absent` so an operator can
 * still tell the two cases apart.
 *
 * **What is deliberately not swallowed.** Only a 404 counts. Every other status - a 500, a 403, a
 * 422 - is a genuine failure and propagates. Formbricks has one 404 shape rather than separate
 * route-absent and resource-absent envelopes, so the check is on status alone; `isResourceAbsent`
 * records what that costs.
 */

/** The subset of a context the delete flow needs. */
type DeleteFlowContext = {
	key: string;
	options?: { host?: string };
} & EventLoggingContext;

type DeleteFlowOptions<Input extends Record<string, unknown>> = {
	/** Which API version serves this delete. */
	version: FormbricksApiVersion;
	/** Path to DELETE, without a leading slash or version prefix. */
	path: string;
	/** The event name, e.g. `formbricks.surveys.delete`. */
	event: string;
	/** The operation's input, for the audit payload. */
	input: Input;
	/** Identifier keys from `input` that may be recorded in the audit payload. */
	identifierKeys: readonly (keyof Input & string)[];
	/**
	 * The id reported back to the caller. Passed explicitly rather than derived from `mirror`,
	 * because several deletes mirror nothing and would otherwise report an empty id.
	 */
	resultId: string;
	/** The entity id to evict, and the store holding it. Omit when nothing is mirrored. */
	mirror?: {
		store: EntityEvictor | undefined;
		entityId: string | number | undefined | null;
		label: string;
		/**
		 * `true` when a surviving row would breach a promise rather than merely be stale - a
		 * webhook's target URL, or the attribute key that resolves respondent data. A required
		 * eviction that fails raises rather than warns.
		 */
		required?: boolean;
	};
};

/**
 * Issues the DELETE, evicts the mirrored row, logs the outcome, and reports it.
 *
 * The ordering is deliberate, and each alternative loses something:
 *
 * - The event is logged **after** the eviction, so its status reflects what actually happened
 *   rather than what was about to be attempted.
 * - The eviction failure is rethrown **after** logging, so a deletion that did happen remotely
 *   still leaves an audit record.
 * - The failure is held in a container rather than tested for truthiness, because a thrown value
 *   may legitimately be falsy and `if (error)` would silently swallow it here.
 */
export async function deleteAndEvict<
	Ctx extends DeleteFlowContext,
	Input extends Record<string, unknown>,
>(
	ctx: Ctx,
	options: DeleteFlowOptions<Input>,
): Promise<{ success: true; id: string; already_absent: boolean }> {
	const { version, path, event, input, identifierKeys, resultId, mirror } =
		options;

	let alreadyAbsent = false;
	try {
		await formbricksCall<unknown>(ctx, version, path, { method: 'DELETE' });
	} catch (error) {
		// Only absence is tolerated. Anything else is a genuine failure and must not be reported
		// as a deletion.
		if (!isResourceAbsent(error)) throw error;
		alreadyAbsent = true;
	}

	let evictionFailure: { error: unknown } | undefined;
	if (mirror) {
		try {
			await evictEntity(mirror.store, mirror.entityId, mirror.label, {
				required: mirror.required,
			});
		} catch (error) {
			evictionFailure = { error };
		}
	}
	const evicted = evictionFailure === undefined;

	await logEventFromContext(
		ctx,
		event,
		{
			...auditPayload(input, identifierKeys),
			// Distinguishes "this call removed it" from "it was already gone", which is what a
			// replayed delete looks like.
			already_absent: alreadyAbsent,
			...(mirror ? { mirror_evicted: evicted } : {}),
		},
		evicted ? 'completed' : 'failed',
	);

	if (evictionFailure) throw evictionFailure.error;

	return { success: true, id: resultId, already_absent: alreadyAbsent };
}
