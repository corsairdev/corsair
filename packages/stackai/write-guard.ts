import type { StackAIContext } from './index';

// Corsair reuses the endpoint context across retries. A fresh context is
// created by our before hook for each public call, including concurrent calls.
const writeAttempts = new WeakMap<object, { error?: unknown }>();

export function createWriteContext<T extends object>(ctx: T): T {
	const fresh = { ...ctx };
	writeAttempts.set(fresh, {});
	return fresh;
}

export async function oncePerWrite<T>(
	ctx: StackAIContext,
	operation: () => Promise<T>,
): Promise<T> {
	const attempt = writeAttempts.get(ctx);
	// Unbound endpoint calls do not pass through the Corsair retry loop.
	if (!attempt) return operation();
	if ('error' in attempt) throw attempt.error;
	try {
		return await operation();
	} catch (error) {
		attempt.error = error;
		throw error;
	}
}
