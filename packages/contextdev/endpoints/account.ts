import type { ContextDevEndpoints } from '..';
import { call } from './call';

export const usage: ContextDevEndpoints['accountUsage'] = (ctx, input) =>
	call(ctx, 'accountUsage', 'account.usage', 'GET', 'org/usage', input);
