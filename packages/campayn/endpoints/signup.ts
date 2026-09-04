import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import { SignupInputSchema, SignupResponseOutputSchema } from './types';

export const signup: CampaynEndpoints['signup'] = async (ctx, rawInput) => {
	const input = SignupInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>('../signup', ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
			first_name: input.first_name,
			last_name: input.last_name,
			password: input.password,
			subdomain: input.subdomain,
			site: input.site,
		},
	});
	const response = SignupResponseOutputSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.signup.signup',
		{ email: input.email },
		'completed',
	);
	return response;
};
