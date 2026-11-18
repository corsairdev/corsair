import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const getProfile: AnyApiEndpoints['instagramGetProfile'] = (
	ctx,
	input,
) =>
	runSku(
		ctx,
		'instagramGetProfile',
		'instagram.getProfile',
		'instagram.profile',
		input,
	);
