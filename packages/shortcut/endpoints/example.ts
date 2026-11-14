import { logEventFromContext } from 'corsair/core';
import type { ShortcutEndpoints } from '..';
import type { ShortcutEndpointOutputs } from './types';
import { makeShortcutRequest } from '../client';

export const get: ShortcutEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeShortcutRequest<ShortcutEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'shortcut.example.get', { ...input }, 'completed');
	return response;
};
