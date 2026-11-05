import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type { ApiKeyInfoResponse } from './types';

export const info: AshbyEndpoints['apiKey.info'] = async (ctx, _input) => {
	return await ashbyCall<ApiKeyInfoResponse>(ctx, 'apiKey.info', {});
};
