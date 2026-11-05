import type { AnyApiEndpoints } from '..';
import { call } from './call';

export const getBalance: AnyApiEndpoints['accountGetBalance'] = (ctx, input) =>
	call(ctx, 'accountGetBalance', 'account.getBalance', input, () => ({
		method: 'GET',
		path: '/v1/balance',
	}));
