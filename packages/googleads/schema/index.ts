import { GoogleAdsCampaign, GoogleAdsCustomerList } from './database';

export const GoogleAdsSchema = {
	version: '1.0.0',
	entities: {
		campaigns: GoogleAdsCampaign,
		customerLists: GoogleAdsCustomerList,
	},
} as const;
