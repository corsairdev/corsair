import { logEventFromContext } from 'corsair/core';
import { fixerGet } from '../client';
import type { FixerEndpoints } from '../index';
import { FixerEndpointInputSchemas, FixerEndpointOutputSchemas } from './types';

export const list: FixerEndpoints['symbolsList'] = async (ctx, rawInput) => {
	FixerEndpointInputSchemas.symbolsList.parse(rawInput ?? {});

	const raw = await fixerGet<unknown>('/symbols', ctx.key, {});
	const result = FixerEndpointOutputSchemas.symbolsList.parse(raw);

	await logEventFromContext(ctx, 'fixer.symbols.list', {}, 'completed');

	return result;
};
