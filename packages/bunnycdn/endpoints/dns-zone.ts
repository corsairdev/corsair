import type { BunnycdnContext } from '../index';
import { api, apiVoid } from './helpers';
import type {
	BunnycdnEndpointOutputs,
	DnsRecordCreateInput,
	DnsRecordDeleteInput,
	DnsRecordUpdateInput,
	DnsZoneAvailabilityInput,
	DnsZoneGetInput,
	DnsZoneListInput,
} from './types';

export async function list(
	ctx: BunnycdnContext,
	input: DnsZoneListInput = {},
): Promise<BunnycdnEndpointOutputs['dnsZoneList']> {
	return api(ctx, 'core', 'GET', '/dnszone', {
		query: {
			page: input.page,
			perPage: input.perPage,
			search: input.search,
		},
	});
}

export async function get(
	ctx: BunnycdnContext,
	input: DnsZoneGetInput,
): Promise<BunnycdnEndpointOutputs['dnsZoneGet']> {
	return api(ctx, 'core', 'GET', `/dnszone/${input.id}`);
}

export async function createRecord(
	ctx: BunnycdnContext,
	input: DnsRecordCreateInput,
): Promise<BunnycdnEndpointOutputs['dnsRecordCreate']> {
	return api(ctx, 'core', 'PUT', `/dnszone/${input.zoneId}/records`, {
		body: { ...input.record },
	});
}

export async function updateRecord(
	ctx: BunnycdnContext,
	input: DnsRecordUpdateInput,
): Promise<BunnycdnEndpointOutputs['dnsRecordUpdate']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/dnszone/${input.zoneId}/records/${input.id}`,
		{ body: { ...input.record } },
	);
}

export async function deleteRecord(
	ctx: BunnycdnContext,
	input: DnsRecordDeleteInput,
): Promise<BunnycdnEndpointOutputs['dnsRecordDelete']> {
	return apiVoid(
		ctx,
		'core',
		'DELETE',
		`/dnszone/${input.zoneId}/records/${input.id}`,
	);
}

export async function checkAvailability(
	ctx: BunnycdnContext,
	input: DnsZoneAvailabilityInput = {},
): Promise<BunnycdnEndpointOutputs['dnsZoneAvailability']> {
	return api(ctx, 'core', 'POST', '/dnszone/checkavailability', {
		body: { Name: input.name },
	});
}
