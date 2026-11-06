import { logEventFromContext } from 'corsair/core';

type LogContext = Parameters<typeof logEventFromContext>[0];

/**
 * Records a completed event, but never throws. By the time this runs the
 * invitation, message or webhook has already been handled; a database error
 * here must not turn that into a failure the caller would retry.
 */
export async function logCompleted(
	ctx: LogContext,
	event: string,
	fields: Record<string, string | number>,
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields, 'completed');
	} catch (error) {
		console.warn(
			`[corsair:unipile] could not log ${event}:`,
			error instanceof Error ? error.message : error,
		);
	}
}
