import type { CanvaEndpoints } from '../index';
import { callCanva, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

export const listSigningKeys: CanvaEndpoints['keysList'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['keysList']>(
		ctx,
		'keys.list',
		{ ...input },
		'v1/connect/keys',
	);

export const getAppJwks: CanvaEndpoints['appsGetJwks'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['appsGetJwks']>(
		ctx,
		'apps.getJwks',
		{ ...input },
		`v1/apps/${seg(input.appId)}/jwks`,
	);
