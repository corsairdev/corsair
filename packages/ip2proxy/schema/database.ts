import { z } from 'zod';

/** One IP2Proxy lookup stored locally. `ip` is the address the caller asked about. */
export const Ip2proxyCheckEntity = z.object({
	ip: z.string().min(1),
	response: z.string(),
	countryCode: z.string().optional(),
	countryName: z.string().optional(),
	regionName: z.string().optional(),
	cityName: z.string().optional(),
	isp: z.string().optional(),
	domain: z.string().optional(),
	usageType: z.string().optional(),
	asn: z.union([z.number(), z.string()]).optional(),
	as: z.string().optional(),
	lastSeen: z.union([z.number(), z.string()]).optional(),
	proxyType: z.string().optional(),
	// YES, NO, or DCH on PX2 to PX4; a plain string so a new value still saves.
	isProxy: z.string().optional(),
	threat: z.string().optional(),
	provider: z.string().optional(),
	creditsConsumed: z.number().optional(),
});

export type Ip2proxyCheckEntity = z.infer<typeof Ip2proxyCheckEntity>;
