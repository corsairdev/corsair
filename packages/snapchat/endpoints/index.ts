import type { SnapchatEndpoints } from '../index';
import { SNAPCHAT_OPERATIONS } from '../operations';
import { createSnapchatEndpoint } from './factory';

export const Actions = Object.fromEntries(
	SNAPCHAT_OPERATIONS.map((operation) => [
		operation.name,
		createSnapchatEndpoint(operation.name, operation.id),
	]),
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: SnapchatEndpoints[K];
};

export * from './types';
