import { Ip2whoisDomainEntity, Ip2whoisHostedDomainEntity } from './database';

export const Ip2whoisSchema = {
	version: '1.0.0',
	entities: {
		domains: Ip2whoisDomainEntity,
		hostedDomains: Ip2whoisHostedDomainEntity,
	},
} as const;
