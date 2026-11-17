import { SerplySchema } from './schema';
import {
	SerplyArticleEntity,
	SerplyImageEntity,
	SerplyPlaceEntity,
} from './schema/database';

describe('Serply schema', () => {
	it('declares the documented entities', () => {
		expect(SerplySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(SerplySchema.entities).sort()).toEqual([
			'articles',
			'images',
			'places',
		]);
	});

	it('rejects rows with no id', () => {
		expect(
			SerplyImageEntity.safeParse({ src: 'https://example.com' }).success,
		).toBe(false);
		expect(SerplyPlaceEntity.safeParse({ name: 'Shop' }).success).toBe(false);
		expect(SerplyArticleEntity.parse({ id: 'W1', title: 'Paper' }).id).toBe(
			'W1',
		);
	});
});
