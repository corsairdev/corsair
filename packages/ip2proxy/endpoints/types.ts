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
	ip: z
		.string()
		.min(1)
		.optional()
		.describe(
			'IPv4 or IPv6 address. Omit it and the service looks up the caller address.',
		),
	package: ProxyPackageSchema.optional().describe(
		'PX1 through PX11. Omit it and the service uses PX1. PX1 spends 1 credit and PX11 spends 11.',
	),
});

export type CheckProxyInput = z.infer<typeof CheckProxyInputSchema>;

/**
 * The docs show `asn` as a string and `lastSeen` as a number, while IP2Location's
 * own Go client reads both as strings, so either type is accepted.
 */
const NumberOrString = z.union([z.number(), z.string()]);

/**
 * `isProxy` is `YES` or `NO`, and `DCH` for data-center addresses on PX2 to PX4.
 * It stays a plain string so a value added later does not fail a paid lookup.
 */
const IsProxySchema = z.string();

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
		asn: NumberOrString.optional(),
		as: z.string().optional(),
		lastSeen: NumberOrString.optional(),
		proxyType: z.string().optional(),
		isProxy: IsProxySchema.optional(),
		threat: z.string().optional(),
		provider: z.string().optional(),
		creditsConsumed: z.number().optional(),
	})
	.passthrough();

export type CheckProxyResponse = z.infer<typeof CheckProxyResponseSchema>;

export const GetCreditsInputSchema = z.object({});

export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

/**
 * `?key=…&check=1` returns the remaining credits in `response`. IP2Location's
 * Go client reads it as a string; a number is accepted too.
 * https://www.ip2location.com/web-service/ip2proxy
 */
export const GetCreditsResponseSchema = z
	.object({
		response: NumberOrString,
	})
	.passthrough();

export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

export const Ip2proxyEndpointInputSchemas = {
	checkProxy: CheckProxyInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

export const Ip2proxyEndpointOutputSchemas = {
	checkProxy: CheckProxyResponseSchema,
	getCredits: GetCreditsResponseSchema,
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
