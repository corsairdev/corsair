import type { DataForSeoEndpoints } from '..';
import { call } from './call';

export const userData: DataForSeoEndpoints['accountUserData'] = (ctx, input) =>
	call(
		ctx,
		'accountUserData',
		'account.userData',
		{
			method: 'GET',
			path: '/v3/appendix/user_data',
		},
		input,
	);
