import createImageUrlBuilder from '@sanity/image-url';
import { createClient, type SanityClient } from 'next-sanity';

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
			useCdn: process.env.NODE_ENV === 'production',
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

export function urlForImage(source: Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]) {
	if (!projectId) {
		throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
	}

	const imageBuilder = createImageUrlBuilder({
		projectId,
		dataset: sanityDataset,
	});

	return imageBuilder.image(source);
}
