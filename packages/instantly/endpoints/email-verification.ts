import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const verify: InstantlyEndpoints['emailVerificationVerify'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailVerificationVerify',
		'emailVerification.verify',
		input,
		(body) => ({ method: 'POST', path: '/email-verification', body }),
		{},
	);

export const getStatus: InstantlyEndpoints['emailVerificationGetStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailVerificationGetStatus',
		'emailVerification.getStatus',
		input,
		({ email }) => ({
			method: 'GET',
			path: `/email-verification/${segment(email)}`,
		}),
		{},
	);
