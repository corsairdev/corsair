import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeVpndetectionRequest } from '../client';
import type { VpndetectionContext } from '../context';
import { VpndetectionLookupEntity } from '../schema/database';
import type { LookupIpInput, LookupIpResponse } from './types';
import { LookupIpInputSchema, LookupIpResponseSchema } from './types';

export const lookup: CorsairEndpoint<
	VpndetectionContext,
	LookupIpInput,
	LookupIpResponse
> = async (ctx, input) => {
	const parsed = LookupIpInputSchema.parse(input);
	// `unknown` until LookupIpResponseSchema parses it: the body is untrusted provider JSON.
	const body = await makeVpndetectionRequest<unknown>(ctx.key ?? '', parsed.ip);
	const result = LookupIpResponseSchema.parse(body);

	await storeLookup(ctx, parsed.ip, result);
	await logEventFromContext(
		ctx,
		'vpndetection.ip.lookup',
		{ self: parsed.ip === undefined },
		'completed',
	);

	return result;
};

async function storeLookup(
	ctx: VpndetectionContext,
	ip: string | undefined,
	result: LookupIpResponse,
): Promise<void> {
	if (!ip || !ctx.db?.lookups) return;
	const row = VpndetectionLookupEntity.safeParse(toRow(result));
	if (!row.success) return;
	try {
		await ctx.db.lookups.upsertByEntityId(row.data.ip, row.data);
	} catch {
		console.warn('Failed to save VPNDetection lookup');
	}
}

/** Empty strings in the answer mean unknown, so they are left out of the row. */
function toRow(result: LookupIpResponse): Record<string, unknown> {
	const text = (value: string | undefined) => value || undefined;
	return {
		ip: result.ip,
		is_vpn: result.is_vpn,
		is_tor: result.is_tor,
		is_relay: result.is_relay,
		is_bogon: result.is_bogon,
		is_anycast: result.is_anycast,
		tor_provider: text(result.tor?.provider_name),
		relay_provider: text(result.relay?.provider_name),
		country: text(result.location?.country),
		asn: result.asn?.asn || undefined,
		asn_name: text(result.asn?.name),
		asn_type: text(result.asn?.type),
		hostname: text(result.hostname),
	};
}

export const Ip = { lookup };
