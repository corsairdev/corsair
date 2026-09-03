import { DocusignClient } from '../client';
import type { DocusignExecutionContext } from './types';

export function resolveClient(
	contextOrClient: DocusignExecutionContext | unknown,
): DocusignClient {
	if (contextOrClient instanceof DocusignClient) {
		return contextOrClient;
	}
	if (
		typeof contextOrClient === 'object' &&
		contextOrClient !== null &&
		'client' in contextOrClient &&
		contextOrClient.client instanceof DocusignClient
	) {
		return contextOrClient.client;
	}
	throw new Error(
		'Invalid execution context: DocuSign client is not initialized or accessible.',
	);
}
