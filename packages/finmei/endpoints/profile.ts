import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { safeLog } from './shared';
import type { FinmeiProfile } from './types';
import {
	FinmeiGetProfileInputSchema,
	FinmeiProfileOutputSchema,
} from './types';

export const get: FinmeiEndpoints['profileGet'] = async (ctx, input) => {
	FinmeiGetProfileInputSchema.parse(input ?? {});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProfile;
	}>('/profile', ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiProfileOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'profile.get', {
		businessId: parsed.data.business_id,
	});
	return parsed;
};

export const Profile = {
	get,
};
