import type { BunnycdnContext } from '../index';
import { api, apiVoid } from './helpers';
import type {
	BunnycdnEndpointOutputs,
	StorageZoneAvailabilityInput,
	StorageZoneCreateInput,
	StorageZoneDeleteInput,
	StorageZoneGetInput,
	StorageZoneListInput,
	StorageZoneUpdateInput,
} from './types';

export async function list(
	ctx: BunnycdnContext,
	input: StorageZoneListInput = {},
): Promise<BunnycdnEndpointOutputs['storageZoneList']> {
	return api(ctx, 'core', 'GET', '/storagezone', {
		query: {
			page: input.page,
			perPage: input.perPage,
			includeDeleted: input.includeDeleted,
			search: input.search,
		},
	});
}

export async function get(
	ctx: BunnycdnContext,
	input: StorageZoneGetInput,
): Promise<BunnycdnEndpointOutputs['storageZoneGet']> {
	return api(ctx, 'core', 'GET', `/storagezone/${input.id}`);
}

export async function create(
	ctx: BunnycdnContext,
	input: StorageZoneCreateInput,
): Promise<BunnycdnEndpointOutputs['storageZoneCreate']> {
	const { name, region, details } = input;
	return api(ctx, 'core', 'POST', '/storagezone', {
		body: { Name: name, Region: region, ...(details ?? {}) },
	});
}

export async function update(
	ctx: BunnycdnContext,
	input: StorageZoneUpdateInput,
): Promise<BunnycdnEndpointOutputs['storageZoneUpdate']> {
	return apiVoid(ctx, 'core', 'POST', `/storagezone/${input.id}`, {
		body: { ...input.settings },
	});
}

export async function remove(
	ctx: BunnycdnContext,
	input: StorageZoneDeleteInput,
): Promise<BunnycdnEndpointOutputs['storageZoneDelete']> {
	return apiVoid(ctx, 'core', 'DELETE', `/storagezone/${input.id}`, {
		query: { deleteLinkedPullZones: input.deleteLinkedPullZones },
	});
}

export async function checkAvailability(
	ctx: BunnycdnContext,
	input: StorageZoneAvailabilityInput = {},
): Promise<BunnycdnEndpointOutputs['storageZoneAvailability']> {
	return api(ctx, 'core', 'POST', '/storagezone/checkavailability', {
		body: { Name: input.name },
	});
}
