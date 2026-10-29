import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const getProfile: AnyApiEndpoints['linkedinGetProfile'] = (ctx, input) =>
	runSku(
		ctx,
		'linkedinGetProfile',
		'linkedin.getProfile',
		'linkedin.profile',
		input,
	);

export const getCompany: AnyApiEndpoints['linkedinGetCompany'] = (ctx, input) =>
	runSku(
		ctx,
		'linkedinGetCompany',
		'linkedin.getCompany',
		'linkedin.company',
		input,
	);
