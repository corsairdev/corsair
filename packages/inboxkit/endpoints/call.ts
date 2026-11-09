import { asRecord, logEventFromContext } from 'corsair/core';
import type { ZodError } from 'zod';
import type { InboxkitContext } from '..';
import type { InboxkitRequest } from '../client';
import { InboxkitError, makeInboxkitRequest } from '../client';
import { outcomeUnknown, withReadRetries } from '../error-handlers';
import type {
	InboxkitEndpointOutputs,
	InboxkitOperation,
	InboxkitParsedInputs,
} from './types';
import {
	INBOXKIT_OPERATIONS,
	InboxkitEndpointInputSchemas,
	InboxkitEndpointOutputSchemas,
} from './types';

/** Logging never fails a call: the InboxKit side already happened. */
export async function safeLog(
	ctx: InboxkitContext,
	event: string,
	fields: Record<string, string | number | boolean | undefined> = {},
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields, 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

function summarize(error: ZodError): string {
	return error.issues
		.slice(0, 3)
		.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
		.join('; ');
}

/**
 * The team's only workspace, for a call that names none. Asks each time, so a
 * team that adds a second workspace gets the error below rather than a stale
 * answer. Several workspaces is an error even for a read: guessing could buy
 * mailboxes in the wrong one.
 */
async function soleWorkspace(ctx: InboxkitContext): Promise<string> {
	const answer = asRecord(
		await withReadRetries(() =>
			makeInboxkitRequest(ctx.key, {
				method: 'GET',
				path: '/v1/api/workspaces/list',
			}),
		),
	);
	const workspaces = (
		Array.isArray(answer?.workspaces) ? answer.workspaces : []
	) as Array<{ uid?: string; name?: string }>;
	const [only] = workspaces;
	if (workspaces.length === 1 && only?.uid) return only.uid;
	const named = workspaces
		.map((workspace) => `${workspace.name} (${workspace.uid})`)
		.join(', ');
	throw new InboxkitError(
		`This call needs a workspace, and the team has ${workspaces.length}. Pass workspaceId, or set it on the plugin. Workspaces: ${named || 'none'}.`,
		'workspace_required',
	);
}

/**
 * Validates the input, sends the request, validates the response and logs the
 * call. Reads are retried; everything else is sent once. Whatever the response
 * looks like, a call InboxKit accepted never throws, since an agent would repeat
 * it: a response that doesn't fit its schema comes back as it was sent, with
 * parse_warning. Only the operation name is logged, because inputs and results
 * hold passwords, API keys and addresses.
 */
export async function call<K extends InboxkitOperation>(
	ctx: InboxkitContext,
	operation: K,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: InboxkitParsedInputs[K]) => InboxkitRequest,
	options: {
		after?: (
			result: InboxkitEndpointOutputs[K],
			parsed: InboxkitParsedInputs[K],
			workspaceId: string | undefined,
		) => Promise<void>;
		onSuccess?: (parsed: InboxkitParsedInputs[K]) => Promise<void>;
	} = {},
): Promise<InboxkitEndpointOutputs[K]> {
	const { path: event, read, workspace } = INBOXKIT_OPERATIONS[operation];
	// The schema maps are indexed by a generic key, which TypeScript cannot narrow
	// to the matching schema; parse() returns that schema's type.
	const parsed = InboxkitEndpointInputSchemas[operation].parse(
		input ?? {},
	) as InboxkitParsedInputs[K];

	// workspaceId is the plugin's own argument: it goes in a header, not the request.
	const { workspaceId: named, ...args } = parsed as InboxkitParsedInputs[K] & {
		workspaceId?: string;
	};
	const workspaceId = workspace
		? (named ?? ctx.options?.workspaceId ?? (await soleWorkspace(ctx)))
		: undefined;
	const request = {
		...toRequest(args as InboxkitParsedInputs[K]),
		workspaceId,
	};

	const send = () => makeInboxkitRequest(ctx.key, request);
	// unknown: validated just below.
	let raw: unknown;
	try {
		raw = read ? await withReadRetries(send) : await send();
	} catch (error) {
		if (!read && outcomeUnknown(error) && error instanceof Error) {
			error.message += ` This may still have gone through. Check before repeating ${event}: there is no safe way to retry it, and a repeat may charge or change it twice.`;
		}
		throw error;
	}

	try {
		await options.onSuccess?.(args as InboxkitParsedInputs[K]);
	} catch (error) {
		console.warn(`Failed to update local data after ${event}:`, error);
	}

	const answer = raw === undefined ? {} : raw;
	const checked = InboxkitEndpointOutputSchemas[operation].safeParse(answer);
	if (!checked.success) {
		await safeLog(ctx, `inboxkit.${event}`, { parseWarning: true });
		// Same generic-key limit as above. The fields are as InboxKit sent them.
		return {
			...(asRecord(answer) ?? { body: answer }),
			parse_warning: `InboxKit accepted this, but its response did not match the expected shape (${summarize(checked.error)}). Do not repeat ${event} because of this.`,
		} as InboxkitEndpointOutputs[K];
	}

	const result = checked.data as InboxkitEndpointOutputs[K];
	try {
		await options.after?.(result, args as InboxkitParsedInputs[K], workspaceId);
	} catch (error) {
		console.warn(`Failed to store the result of ${event}:`, error);
	}
	await safeLog(ctx, `inboxkit.${event}`);
	return result;
}
