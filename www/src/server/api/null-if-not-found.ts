import { TRPCError } from '@trpc/server';

// tRPC procedures report a missing record by throwing NOT_FOUND. Server
// components want null instead, so the route can call notFound() and answer
// 404 rather than 500. Every other error still throws.
export async function nullIfNotFound<T>(
	promise: Promise<T>,
): Promise<T | null> {
	try {
		return await promise;
	} catch (err) {
		if (err instanceof TRPCError && err.code === 'NOT_FOUND') return null;
		throw err;
	}
}
