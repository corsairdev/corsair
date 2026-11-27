import { z } from 'zod';

export const LookupIpInputSchema = z.object({
	// An address, never any string: `myip` would reach the self-lookup path
	// and be saved as if the caller had named an address.
	ip: z
		.union([z.ipv4(), z.ipv6()])
		.optional()
		.describe(
			'IPv4 or IPv6 address. Omit it and the service looks up the caller address.',
		),
});

export type LookupIpInput = z.infer<typeof LookupIpInputSchema>;

/** Who runs a Tor node or a privacy relay, when the dataset knows. Empty otherwise. */
const NetworkDetailSchema = z
	.object({
		provider: z.string().optional(),
		provider_name: z.string().optional(),
		confidence: z.string().optional(),
		last_seen: z.string().optional(),
	})
	.passthrough();

const LocationSchema = z
	.object({
		continent: z.string().optional(),
		continent_name: z.string().optional(),
		country: z.string().optional(),
		country_name: z.string().optional(),
		timezone: z.string().optional(),
		currency_code: z.string().optional(),
		currency_name: z.string().optional(),
		currency_symbol: z.string().optional(),
		flag_emoji: z.string().optional(),
		flag_unicode: z.string().optional(),
	})
	.passthrough();

const AsnSchema = z
	.object({
		asn: z.number().optional(),
		name: z.string().optional(),
		domain: z.string().optional(),
		type: z.string().optional(),
		prefix: z.string().optional(),
		country: z.string().optional(),
		rpki_status: z.string().optional(),
	})
	.passthrough();

/**
 * The fields every answer carries, with or without a key. A key adds the
 * fields its plan includes, which pass through unchanged.
 * https://docs.vpndetection.io/api
 */
export const LookupIpResponseSchema = z
	.object({
		ip: z.string(),
		is_vpn: z.boolean(),
		is_tor: z.boolean().optional(),
		is_relay: z.boolean().optional(),
		is_bogon: z.boolean().optional(),
		is_anycast: z.boolean().optional(),
		tor: NetworkDetailSchema.optional(),
		relay: NetworkDetailSchema.optional(),
		location: LocationSchema.optional(),
		asn: AsnSchema.optional(),
		hostname: z.string().optional(),
	})
	.passthrough();

export type LookupIpResponse = z.infer<typeof LookupIpResponseSchema>;

export const VpndetectionEndpointInputSchemas = {
	lookup: LookupIpInputSchema,
} as const;

export const VpndetectionEndpointOutputSchemas = {
	lookup: LookupIpResponseSchema,
} as const;

export type VpndetectionEndpointInputs = {
	[K in keyof typeof VpndetectionEndpointInputSchemas]: z.infer<
		(typeof VpndetectionEndpointInputSchemas)[K]
	>;
};

export type VpndetectionEndpointOutputs = {
	[K in keyof typeof VpndetectionEndpointOutputSchemas]: z.infer<
		(typeof VpndetectionEndpointOutputSchemas)[K]
	>;
};
