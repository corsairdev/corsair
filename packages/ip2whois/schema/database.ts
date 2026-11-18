import { z } from 'zod';

/** One WHOIS record stored locally. `domain` is the looked-up name. */
export const Ip2whoisDomainEntity = z.object({
	domain: z.string().min(1),
	domain_id: z.string().optional(),
	status: z.string().optional(),
	create_date: z.string().optional(),
	update_date: z.string().optional(),
	expire_date: z.string().optional(),
	domain_age: z.number().optional(),
	whois_server: z.string().optional(),
	nameservers: z.array(z.string()).optional(),
});

/** One domain found on a host address. */
export const Ip2whoisHostedDomainEntity = z.object({
	domain: z.string().min(1),
	hostIp: z.string().min(1),
});

export type Ip2whoisDomainEntity = z.infer<typeof Ip2whoisDomainEntity>;
export type Ip2whoisHostedDomainEntity = z.infer<
	typeof Ip2whoisHostedDomainEntity
>;
