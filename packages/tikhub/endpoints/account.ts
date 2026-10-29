import type { TikHubEndpoints } from '..';
import { call } from './call';

export const getInfo: TikHubEndpoints['accountGetInfo'] = (ctx, input) =>
	call(
		ctx,
		'accountGetInfo',
		'account.getInfo',
		'/api/v1/tikhub/user/get_user_info',
		input,
	);
