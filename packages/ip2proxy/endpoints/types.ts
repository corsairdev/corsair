import { z } from 'zod';

/** Packages from the IP2Proxy web service. PX1 spends 1 credit. PX11 spends 11. */
export const PROXY_PACKAGES = [
	'PX1',
	'PX2',
	'PX3',
	'PX4',
	'PX5',
	'PX6',
	'PX7',
	'PX8',
	'PX9',
	'PX10',
	'PX11',
] as const;

export const ProxyPackageSchema = z.enum(PROXY_PACKAGES);

export const CheckProxyInputSchema = z.object({
	/** IPv4 or IPv6. Omitted, the service looks up the caller address. */
	ip: z.string().min(1).optional(),
	/** Defaults to PX1 on the service when omitted. */
	package: ProxyPackageSchema.optional(),
});

export type CheckProxyInput = z.infer<typeof CheckProxyInputSchema>;

/**
 * Fields the service returns for a successful lookup. Lower packages omit
 * the later fields, so only `response` is required.
 * https://www.ip2location.com/web-service/ip2proxy
 */
export const CheckProxyResponseSchema = z
	.object({
		response: z.string(),
		countryCode: z.string().optional(),
		countryName: z.string().optional(),
		regionName: z.string().optional(),
		cityName: z.string().optional(),
		isp: z.string().optional(),
		domain: z.string().optional(),
		usageType: z.string().optional(),
		asn: z.string().optional(),
		as: z.string().optional(),
		lastSeen: z.number().optional(),
		proxyType: z.string().optional(),
		isProxy: z.enum(['YES', 'NO']).optional(),
		threat: z.string().optional(),
		provider: z.string().optional(),
		creditsConsumed: z.number().optional(),
	})
	.passthrough();

export type CheckProxyResponse = z.infer<typeof CheckProxyResponseSchema>;

export const Ip2proxyEndpointInputSchemas = {
	checkProxy: CheckProxyInputSchema,
} as const;

export const Ip2proxyEndpointOutputSchemas = {
	checkProxy: CheckProxyResponseSchema,
} as const;

export type Ip2proxyEndpointInputs = {
	[K in keyof typeof Ip2proxyEndpointInputSchemas]: z.infer<
		(typeof Ip2proxyEndpointInputSchemas)[K]
	>;
};

export type Ip2proxyEndpointOutputs = {
	[K in keyof typeof Ip2proxyEndpointOutputSchemas]: z.infer<
		(typeof Ip2proxyEndpointOutputSchemas)[K]
	>;
};
