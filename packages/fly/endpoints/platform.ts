import { z } from 'zod';
import { defineOperation } from './define';
import { region, tokenInfo } from './schemas';

export const platform = {
	regions: defineOperation({
		description:
			'List Fly regions with their location, capacity and whether they need a paid plan',
		riskLevel: 'read',
		input: z.object({}),
		output: z.object({
			// Fly capitalises this one key.
			Regions: z.array(region),
			nearest: z.string().nullish(),
		}),
		request: () => ({ method: 'GET', path: '/v1/platform/regions' }),
	}),
};

export const tokens = {
	current: defineOperation({
		description:
			'Show which organization, apps and Machine the stored token is scoped to',
		riskLevel: 'read',
		input: z.object({}),
		output: z.object({ tokens: z.array(tokenInfo) }),
		request: () => ({ method: 'GET', path: '/v1/tokens/current' }),
	}),
};
