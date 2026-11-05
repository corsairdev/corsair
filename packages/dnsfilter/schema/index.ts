import {
	DnsfilterIpAddress,
	DnsfilterMacAddress,
	DnsfilterNetwork,
	DnsfilterOrganization,
	DnsfilterPolicy,
	DnsfilterScheduledReport,
	DnsfilterSubnet,
	DnsfilterUnblockRequest,
	DnsfilterUser,
	DnsfilterUserAgent,
} from './database';

export const DnsfilterSchema = {
	version: '1.0.0',
	entities: {
		networks: DnsfilterNetwork,
		policies: DnsfilterPolicy,
		organizations: DnsfilterOrganization,
		users: DnsfilterUser,
		userAgents: DnsfilterUserAgent,
		ipAddresses: DnsfilterIpAddress,
		macAddresses: DnsfilterMacAddress,
		subnets: DnsfilterSubnet,
		unblockRequests: DnsfilterUnblockRequest,
		scheduledReports: DnsfilterScheduledReport,
	},
} as const;

export type {
	DnsfilterIpAddress,
	DnsfilterMacAddress,
	DnsfilterNetwork,
	DnsfilterOrganization,
	DnsfilterPolicy,
	DnsfilterScheduledReport,
	DnsfilterSubnet,
	DnsfilterUnblockRequest,
	DnsfilterUser,
	DnsfilterUserAgent,
} from './database';
