import { z } from 'zod';
import { AeroleadsLinkedinDetails } from '../schema/database';

export const GetLinkedinDetailsInputSchema = z.object({
	linkedin_url: z
		.string()
		.url()
		.refine(
			(val) => {
				try {
					const url = new URL(val);
					const host = url.hostname.toLowerCase();
					const hostOk =
						host === 'linkedin.com' || host.endsWith('.linkedin.com');
					return hostOk && /^\/in\/[^/]+/i.test(url.pathname);
				} catch {
					return false;
				}
			},
			{ message: 'Must be a valid LinkedIn profile URL' },
		)
		.describe('The LinkedIn profile URL of the prospect'),
});
export type GetLinkedinDetailsInput = z.infer<
	typeof GetLinkedinDetailsInputSchema
>;

export const GetLinkedinDetailsResponseSchema =
	AeroleadsLinkedinDetails.passthrough();
export type GetLinkedinDetailsResponse = z.infer<
	typeof GetLinkedinDetailsResponseSchema
>;

export type AeroleadsEndpointInputs = {
	linkedinDetailsGet: GetLinkedinDetailsInput;
};

export type AeroleadsEndpointOutputs = {
	linkedinDetailsGet: GetLinkedinDetailsResponse;
};

export const AeroleadsEndpointInputSchemas = {
	linkedinDetailsGet: GetLinkedinDetailsInputSchema,
} as const;

export const AeroleadsEndpointOutputSchemas = {
	linkedinDetailsGet: GetLinkedinDetailsResponseSchema,
} as const;
