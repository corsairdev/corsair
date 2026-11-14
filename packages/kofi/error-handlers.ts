import type { CorsairErrorHandler } from 'corsair/core';

// This plugin makes no HTTP request of its own: Ko-fi has no REST API, so the
// only operation answers from a static catalog and the webhook path verifies a
// token. Nothing here can be rate limited or time out, and the handler set says
// so rather than inventing retry behaviour for calls that never happen.
export const errorHandlers = {
	// A delivery whose token does not match is refused, and retrying it would
	// only repeat the refusal.
	AUTH_ERROR: {
		match: (error: Error) =>
			error.message.includes('verification_token') ||
			error.message.includes('verification token'),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A refused body is the sender's problem and does not improve on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim an error no builtin covers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
