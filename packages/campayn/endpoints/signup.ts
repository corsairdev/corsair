import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { CAMPAYN_API_BASE, makeCampaynRequest } from '../client';
import { SignupInputSchema, SignupResponseOutputSchema } from './types';

const CAMPAYN_SIGNUP_BASE = CAMPAYN_API_BASE.replace(/\/api\/v1$/, '');

export const signup: CampaynEndpoints['signup'] = async (ctx, rawInput) => {
	const input = SignupInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>('signup', ctx.key, {
		method: 'POST',
		baseUrl: CAMPAYN_SIGNUP_BASE,
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

	await logEventFromContext(ctx, 'campayn.signup.signup', {}, 'completed');
	return response;
};
