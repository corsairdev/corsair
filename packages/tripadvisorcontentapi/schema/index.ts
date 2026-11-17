import {
	TripadvisorLocationEntity,
	TripadvisorPhotoEntity,
	TripadvisorReviewEntity,
} from './database';

export const TripadvisorContentApiSchema = {
	version: '1.0.0',
	entities: {
		locations: TripadvisorLocationEntity,
		photos: TripadvisorPhotoEntity,
		reviews: TripadvisorReviewEntity,
	},
} as const;
