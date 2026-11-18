import {
	BuiltWithCompanyFinancial,
	BuiltWithDomain,
	BuiltWithDomainCoverage,
	BuiltWithDomainTechnology,
	BuiltWithListSite,
	BuiltWithMcpServer,
	BuiltWithProduct,
	BuiltWithRecommendation,
	BuiltWithRedirect,
	BuiltWithSocialLink,
	BuiltWithTechnology,
} from './database';

export const BuiltWithSchema = {
	version: '1.0.0',
	entities: {
		domains: BuiltWithDomain,
		domainTechnologies: BuiltWithDomainTechnology,
		technologies: BuiltWithTechnology,
		domainCoverage: BuiltWithDomainCoverage,
		listSites: BuiltWithListSite,
		recommendations: BuiltWithRecommendation,
		redirects: BuiltWithRedirect,
		companyFinancials: BuiltWithCompanyFinancial,
		socialLinks: BuiltWithSocialLink,
		products: BuiltWithProduct,
		mcpServers: BuiltWithMcpServer,
	},
} as const;
