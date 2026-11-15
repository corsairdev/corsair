import createImageUrlBuilder from '@sanity/image-url';
import type { SanityClient } from 'next-sanity';
import { createClient } from 'next-sanity';

import {
	sanityApiVersion,
	sanityDataset,
	sanityProjectId,
} from '../../../sanity/env';

const projectId = sanityProjectId ?? '';

let readClient: SanityClient | undefined;
let writeClient: SanityClient | undefined;

export function getSanityClient(): SanityClient | null {
	if (!projectId) {
		return null;
	}

	if (!readClient) {
		readClient = createClient({
			projectId,
			dataset: sanityDataset,
			apiVersion: sanityApiVersion,
			// Next's data cache already holds these reads under the 'blog' tag, and
			// the Sanity webhook revalidates that tag on publish. Sanity's API CDN can
			// still serve the old result a few seconds after a publish, which would
			// re-cache stale data until the next publish.
			useCdn: false,
		});
	}

	return readClient;
}

export function getSanityWriteClient(): SanityClient | null {
	if (!projectId || !process.env.SANITY_API_WRITE_TOKEN) {
		return null;
	}

	if (!writeClient) {
		writeClient = createClient({
			projectId,
			dataset: sanityDataset,
			apiVersion: sanityApiVersion,
			useCdn: false,
			token: process.env.SANITY_API_WRITE_TOKEN,
		});
	}

	return writeClient;
}

export function urlForImage(
	source: Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0],
) {
	if (!projectId) {
		throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
	}

	const imageBuilder = createImageUrlBuilder({
		projectId,
		dataset: sanityDataset,
	});

	return imageBuilder.image(source);
}
