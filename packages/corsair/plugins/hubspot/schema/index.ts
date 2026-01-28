import { z } from 'zod';
import {
	HubSpotCompany,
	HubSpotContact,
	HubSpotDeal,
	HubSpotEngagement,
	HubSpotTicket,
} from './database';

export const HubSpotCredentials = z.object({
	token: z.string(),
});

export type HubSpotCredentials = z.infer<typeof HubSpotCredentials>;

export const HubSpotSchema = {
	version: '1.0.0',
	entities: {
		contacts: HubSpotContact,
		companies: HubSpotCompany,
		deals: HubSpotDeal,
		tickets: HubSpotTicket,
		engagements: HubSpotEngagement,
	},
} as const;
