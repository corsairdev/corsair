import { GoogleAnalyticsAccount, GoogleAnalyticsProperty } from './database';

export const GoogleAnalyticsSchema = {
	version: '1.0.0',
	entities: {
		accounts: GoogleAnalyticsAccount,
		properties: GoogleAnalyticsProperty,
	},
} as const;
