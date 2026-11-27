import { z } from 'zod';

/** One VPNDetection lookup stored locally, keyed by the normalized address. */
export const VpndetectionLookupEntity = z.object({
	ip: z.string().min(1),
	is_vpn: z.boolean(),
	is_tor: z.boolean().optional(),
	is_relay: z.boolean().optional(),
	is_bogon: z.boolean().optional(),
	is_anycast: z.boolean().optional(),
	tor_provider: z.string().optional(),
	relay_provider: z.string().optional(),
	country: z.string().optional(),
	asn: z.number().optional(),
	asn_name: z.string().optional(),
	asn_type: z.string().optional(),
	hostname: z.string().optional(),
});

export type VpndetectionLookupEntity = z.infer<typeof VpndetectionLookupEntity>;
