import type { CosmicContext } from '..';

export function resolveBucketSlug(
	input: { bucketSlug?: string },
	ctx: CosmicContext,
): string {
	const slug = input.bucketSlug ?? ctx.options.bucketSlug;
	if (!slug) {
		throw new Error(
			'Cosmic bucket slug is required: pass bucketSlug or set the bucketSlug plugin option',
		);
	}
	return encodeURIComponent(slug);
}

export function resolveReadKey(ctx: CosmicContext): string {
	return ctx.options.readKey ?? ctx.key;
}
