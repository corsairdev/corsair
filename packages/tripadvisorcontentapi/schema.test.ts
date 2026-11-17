import { TripadvisorContentApiSchema } from './schema';
import { TripadvisorReviewEntity } from './schema/database';

describe('Tripadvisor Content API schema', () => {
	it('declares locations, photos, and reviews', () => {
		expect(TripadvisorContentApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(TripadvisorContentApiSchema.entities).sort()).toEqual([
			'locations',
			'photos',
			'reviews',
		]);
	});

	it('rejects a review with no id', () => {
		expect(TripadvisorReviewEntity.safeParse({ rating: 5 }).success).toBe(
			false,
		);
	});
});
