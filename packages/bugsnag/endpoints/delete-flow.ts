import type { EventLoggingContext } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { isResourceAbsent } from '../error-handlers';
import { auditPayload } from './logging';
import type { EntityEvictor } from './persist';
import { evictEntity } from './persist';
import { bugsnagCall } from './shared';

/**
 * The delete flow, shared by every operation that removes a record.
 *
 * It exists because two independently reasonable decisions combined into a privacy bug,
 * and the fix belongs in one place rather than repeated at each call site.
 *
 * **The bug.** A delete of a named resource is safe to replay - the second attempt reports
 * not-found - so `collaborators.delete` and `organizations.delete` are deliberately absent
 * from `NON_IDEMPOTENT_OPERATIONS` and therefore *are* retried after a network or 5xx
 * failure. But if the first attempt succeeded remotely and only its response was lost, the
 * replay receives a 404, the request throws before the eviction runs, and the caller is
 * told the deletion failed **while the local mirror still holds the deleted person's name
 * and email address**. The record is gone at BugSnag and queryable locally, which is the
 * exact situation `BugsnagMirrorEvictionError` was written to prevent.
 *
 * **The fix.** A 404 on a delete is treated as *confirmed absence* rather than as a
 * failure: the record is not there, whether this call removed it or an earlier attempt
 * did. Either way the mirror must be evicted, so the flow continues to the eviction
 * instead of aborting. The audit payload records `already_absent` so an operator can still
 * tell the two cases apart.
 *
 * **What is deliberately *not* swallowed.** Only a *resource*-missing 404 means the record
 * is gone. A *route*-missing 404 - `{"status":404,"error":"Not Found"}` - means this plugin
 * asked for a path that does not exist, which is a bug in the plugin and must never be
 * reported as a successful deletion. `isRouteMissing` draws that line, and it is the same
 * distinction the error handler uses.
 */

type DeleteFlowOptions<Input extends Record<string, unknown>> = {
	/** Path to DELETE, without a leading slash. */
	path: string;
	/** The event name, e.g. `bugsnag.collaborators.delete`. */
	event: string;
	/** The operation's input, for the audit payload. */
	input: Input;
	/** Identifier keys from `input` that may be recorded in the audit payload. */
	identifierKeys: readonly (keyof Input & string)[];
	/**
	 * The id reported back to the caller. Passed explicitly rather than derived from
	 * `mirror`, because several deletes mirror nothing at all and would otherwise report
	 * an empty id.
	 */
	resultId: string;
	/** The entity id to evict, and the store holding it. Omit when nothing is mirrored. */
	mirror?: {
		store: EntityEvictor | undefined;
		entityId: string | number | undefined | null;
		label: string;
		/**
		 * `true` when a surviving row would breach a promise rather than merely be stale -
		 * a collaborator's name and email, or an organization's billing addresses. A
		 * required eviction that fails raises rather than warns.
		 */
		required?: boolean;
	};
};

/**
 * Issues the DELETE, evicts the mirrored row, logs the outcome, and reports it.
 *
 * The ordering is deliberate and the reasons are worth stating, because each alternative
 * loses something:
 *
 * - The event is logged **after** the eviction, so its status reflects what actually
 *   happened rather than what was about to be attempted.
 * - The eviction failure is rethrown **after** logging, so a deletion that did happen
 *   remotely still leaves an audit record. Letting it propagate first would lose that.
 * - The failure is held in a container rather than tested for truthiness, because a thrown
 *   value may legitimately be falsy and `if (error)` would silently swallow it here.
 */
export async function deleteAndEvict<
	// `EventLoggingContext` is what `logEventFromContext` actually requires, so
	// constraining to it lets the context be passed through as-is. An earlier version
	// used `ctx as never` to silence the mismatch, which would have hidden a genuine
	// incompatibility rather than proving there was none.
	Ctx extends { key: string } & EventLoggingContext,
	Input extends Record<string, unknown>,
>(
	ctx: Ctx,
	options: DeleteFlowOptions<Input>,
): Promise<{ success: true; id: string; already_absent: boolean }> {
	const { path, event, input, identifierKeys, resultId, mirror } = options;

	let alreadyAbsent = false;
	try {
		await bugsnagCall<unknown>(ctx, path, { method: 'DELETE' });
	} catch (error) {
		// Only a resource-missing 404 is absence. Anything else - including a
		// route-missing 404 - is a genuine failure and must not be reported as a delete.
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
			// Distinguishes "this call removed it" from "it was already gone", which is
			// what a replayed delete looks like.
			already_absent: alreadyAbsent,
			...(mirror ? { mirror_evicted: evicted } : {}),
		},
		evicted ? 'completed' : 'failed',
	);

	if (evictionFailure) throw evictionFailure.error;

	return { success: true, id: resultId, already_absent: alreadyAbsent };
}
