import { TRPCError } from '@trpc/server';

export function getActionErrorMessage(
	error: unknown,
	fallback = 'Something went wrong',
) {
	if (error instanceof TRPCError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message;
	}

	return fallback;
}
