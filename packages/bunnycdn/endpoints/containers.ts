import type { BunnycdnContext } from '../index';
import { api, apiVoid } from './helpers';
import type {
	BunnycdnEndpointOutputs,
	ContainerImageRefInput,
	ContainerImageTagsInput,
	ContainerPublicImagesSearchInput,
	ContainerRegistryDeleteInput,
	ContainersCursorInput,
	ContainerVolumesListInput,
	OptimalBaseRegionInput,
} from './types';

// Base https://api.bunny.net/mc
// Docs: https://bunny.net/docs/magic-containers/api-reference

export async function applicationsList(
	ctx: BunnycdnContext,
	input: ContainersCursorInput = {},
): Promise<BunnycdnEndpointOutputs['containersCursor']> {
	return api(ctx, 'mc', 'GET', '/apps', {
		query: { nextCursor: input.nextCursor, limit: input.limit },
	});
}

export async function nodesList(
	ctx: BunnycdnContext,
	input: ContainersCursorInput = {},
): Promise<BunnycdnEndpointOutputs['containersCursor']> {
	return api(ctx, 'mc', 'GET', '/nodes', {
		query: { nextCursor: input.nextCursor, limit: input.limit },
	});
}

export async function regionsList(
	ctx: BunnycdnContext,
	input: ContainersCursorInput = {},
): Promise<BunnycdnEndpointOutputs['containersCursor']> {
	return api(ctx, 'mc', 'GET', '/regions', {
		query: { nextCursor: input.nextCursor, limit: input.limit },
	});
}

export async function optimalBaseRegion(
	ctx: BunnycdnContext,
	input: OptimalBaseRegionInput = {},
): Promise<BunnycdnEndpointOutputs['optimalBaseRegion']> {
	return api(ctx, 'mc', 'GET', '/regions/optimal', {
		query: { cdnServerToken: input.cdnServerToken },
	});
}

export async function userLimits(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['optimalBaseRegion']> {
	return api(ctx, 'mc', 'GET', '/limits');
}

export async function registriesList(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['containersCursor']> {
	return api(ctx, 'mc', 'GET', '/registries');
}

export async function registryDelete(
	ctx: BunnycdnContext,
	input: ContainerRegistryDeleteInput,
): Promise<BunnycdnEndpointOutputs['containerRegistryDelete']> {
	const registryId = encodeURIComponent(String(input.registryId));
	return apiVoid(ctx, 'mc', 'DELETE', `/registries/${registryId}`);
}

export async function imageTags(
	ctx: BunnycdnContext,
	input: ContainerImageTagsInput,
): Promise<BunnycdnEndpointOutputs['containerImageTags']> {
	return api(ctx, 'mc', 'POST', '/registries/tags', {
		body: {
			registryId: input.registryId,
			imageName: input.imageName,
			imageNamespace: input.imageNamespace,
		},
	});
}

export async function imageDigest(
	ctx: BunnycdnContext,
	input: ContainerImageRefInput,
): Promise<BunnycdnEndpointOutputs['containerImageRef']> {
	return api(ctx, 'mc', 'POST', '/registries/digest', {
		body: {
			registryId: input.registryId,
			imageName: input.imageName,
			imageNamespace: input.imageNamespace,
			tag: input.tag,
		},
	});
}

export async function configSuggestions(
	ctx: BunnycdnContext,
	input: ContainerImageRefInput,
): Promise<BunnycdnEndpointOutputs['containerImageRef']> {
	return api(ctx, 'mc', 'POST', '/registries/config-suggestions', {
		body: {
			registryId: input.registryId,
			imageName: input.imageName,
			imageNamespace: input.imageNamespace,
			tag: input.tag,
		},
	});
}

export async function publicImagesSearch(
	ctx: BunnycdnContext,
	input: ContainerPublicImagesSearchInput,
): Promise<BunnycdnEndpointOutputs['containerPublicImagesSearch']> {
	return api(ctx, 'mc', 'POST', '/registries/public-images/search', {
		body: {
			registryId: input.registryId,
			prefix: input.prefix,
			size: input.size,
			page: input.page,
		},
	});
}

export async function volumesList(
	ctx: BunnycdnContext,
	input: ContainerVolumesListInput,
): Promise<BunnycdnEndpointOutputs['containerVolumesList']> {
	const appId = encodeURIComponent(input.appId);
	return api(ctx, 'mc', 'GET', `/apps/${appId}/volumes`);
}
