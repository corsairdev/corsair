import { DocusignClient } from '../client';
import type { DocusignExecutionContext } from './types';

export function resolveClient(
	contextOrClient: DocusignExecutionContext | unknown,
): DocusignClient {
	if (contextOrClient instanceof DocusignClient) {
		return contextOrClient;
	}
	if (
		contextOrClient &&
		typeof contextOrClient === 'object' &&
		'client' in contextOrClient &&
		(contextOrClient as { client: unknown }).client
	) {
		const candidate = (contextOrClient as { client: unknown }).client;
		if (
			candidate instanceof DocusignClient ||
			typeof (candidate as { request?: unknown }).request === 'function'
		) {
			return candidate as DocusignClient;
		}
	}
	if (
		contextOrClient &&
		typeof (contextOrClient as { request?: unknown }).request === 'function'
	) {
		return contextOrClient as DocusignClient;
	}
	throw new Error(
		'Invalid execution context: DocuSign client is not initialized or accessible.',
	);
}
