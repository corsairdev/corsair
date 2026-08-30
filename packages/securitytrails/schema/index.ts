import {
	SecuritytrailsCertificate,
	SecuritytrailsCompanyIpRange,
	SecuritytrailsDomain,
	SecuritytrailsIp,
	SecuritytrailsProject,
} from './database';

export const SecuritytrailsSchema = {
	version: '1.0.0',
	entities: {
		domains: SecuritytrailsDomain,
		certificates: SecuritytrailsCertificate,
		ips: SecuritytrailsIp,
		projects: SecuritytrailsProject,
		companyIpRanges: SecuritytrailsCompanyIpRange,
	},
} as const;

export {
	SecuritytrailsCertificate,
	SecuritytrailsCompanyIpRange,
	SecuritytrailsDomain,
	SecuritytrailsIp,
	SecuritytrailsProject,
};
