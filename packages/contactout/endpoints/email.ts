import type { ContactOutEndpoints } from '..';
import { call } from './call';

export const enrich: ContactOutEndpoints['emailEnrich'] = (ctx, input) =>
	call(ctx, 'emailEnrich', 'email.enrich', 'GET', 'v1/email/enrich', input);

export const verify: ContactOutEndpoints['emailVerify'] = (ctx, input) =>
	call(ctx, 'emailVerify', 'email.verify', 'GET', 'v1/email/verify', input);

export const toLinkedin: ContactOutEndpoints['emailToLinkedin'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailToLinkedin',
		'email.toLinkedin',
		'GET',
		'v1/people/person',
		input,
	);
