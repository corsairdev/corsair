export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset =
	process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const sanityApiVersion =
	process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01';

export function assertSanityEnv() {
	if (!sanityProjectId) {
		throw new Error(
			'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
		);
	}

	if (!sanityDataset) {
		throw new Error('Missing environment variable: NEXT_PUBLIC_SANITY_DATASET');
	}
}
