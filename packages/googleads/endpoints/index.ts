import * as AdGroups from './ad-groups';
import * as CampaignBudgets from './campaign-budgets';
import * as Campaigns from './campaigns';
import * as Customers from './customers';
import * as GoogleAdsFields from './google-ads-fields';
import * as Reporting from './reporting';

export const ReportingEndpoints = {
	search: Reporting.search,
	searchStream: Reporting.searchStream,
	mutate: Reporting.mutate,
} as const;

export const CampaignsEndpoints = {
	create: Campaigns.create,
	update: Campaigns.update,
	remove: Campaigns.remove,
} as const;

export const CampaignBudgetsEndpoints = {
	create: CampaignBudgets.create,
	update: CampaignBudgets.update,
} as const;

export const AdGroupsEndpoints = {
	create: AdGroups.create,
	update: AdGroups.update,
} as const;

export const CustomersEndpoints = {
	listAccessible: Customers.listAccessible,
	update: Customers.update,
} as const;

export const GoogleAdsFieldsEndpoints = {
	search: GoogleAdsFields.search,
} as const;

export * from './types';
