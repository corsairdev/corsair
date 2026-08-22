import { ping as accountPing, usage as accountUsage } from './account';
import { associatedIps as companyAssociatedIps } from './company';
import { get as domainGet, ssl as domainSsl } from './domain';
import { search as ipsSearch, stats as ipsStats } from './ips';
import {
	bulkStaticAssetRules as projectsBulkStaticAssetRules,
	list as projectsList,
} from './projects';
import { get as scrollGet } from './scroll';
import { query as sqlQuery, scroll as sqlScroll } from './sql';

export const Account = {
	ping: accountPing,
	usage: accountUsage,
};

export const Domain = {
	get: domainGet,
	ssl: domainSsl,
};

export const Ips = {
	search: ipsSearch,
	stats: ipsStats,
};

export const Scroll = {
	get: scrollGet,
};

export const Sql = {
	query: sqlQuery,
	scroll: sqlScroll,
};

export const Company = {
	associatedIps: companyAssociatedIps,
};

export const Projects = {
	list: projectsList,
	bulkStaticAssetRules: projectsBulkStaticAssetRules,
};

export * from './types';
