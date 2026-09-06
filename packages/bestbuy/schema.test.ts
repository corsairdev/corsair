/**
 * Declared keys match official Remix attribute names.
 * https://bestbuyapis.github.io/api-documentation/
 */

import type { z } from 'zod';
import { BestBuySchema } from './schema';
import {
	BestBuyCategoryEntity,
	BestBuyProductEntity,
	BestBuyReviewEntity,
	BestBuyStoreEntity,
} from './schema/database';

const PRODUCT_KEYS = [
	'sku',
	'name',
	'upc',
	'manufacturer',
	'modelNumber',
	'color',
	'condition',
	'description',
	'longDescription',
	'customerReviewAverage',
	'customerReviewCount',
	'customerTopRated',
	'salePrice',
	'regularPrice',
	'onSale',
	'onlineAvailability',
	'inStoreAvailability',
	'inStorePickup',
	'image',
	'url',
	'addToCartUrl',
	'class',
	'classId',
	'department',
	'departmentId',
	'subclass',
	'subclassId',
	'categoryPath',
	'offers',
	'active',
	'type',
	'itemUpdateDate',
];

const CATEGORY_KEYS = ['id', 'name', 'url', 'path', 'subCategories'];

const STORE_KEYS = [
	'storeId',
	'name',
	'longName',
	'address',
	'address2',
	'city',
	'region',
	'postalCode',
	'fullPostalCode',
	'country',
	'lat',
	'lng',
	'distance',
	'location',
	'locationType',
	'storeType',
	'phone',
	'hours',
	'hoursAmPm',
	'gmtOffset',
	'detailedHours',
	'services',
];

const REVIEW_KEYS = [
	'id',
	'sku',
	'title',
	'comment',
	'rating',
	'submissionTime',
	'recommended',
	'qualityRating',
	'valueRating',
	'easeOfUseRating',
	'reviewer',
];

describe('Best Buy schema', () => {
	it('declares a semver version', () => {
		expect(BestBuySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors the four Remix collections', () => {
		expect(Object.keys(BestBuySchema.entities).sort()).toEqual([
			'categories',
			'products',
			'reviews',
			'stores',
		]);
	});

	describe('every documented key is declared', () => {
		const cases: [string, { shape: Record<string, z.ZodType> }, string[]][] = [
			['product', BestBuyProductEntity, PRODUCT_KEYS],
			['category', BestBuyCategoryEntity, CATEGORY_KEYS],
			['store', BestBuyStoreEntity, STORE_KEYS],
			['review', BestBuyReviewEntity, REVIEW_KEYS],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				expect(capturedKeys.filter((k) => !declared.includes(k))).toEqual([]);
			});
		}
	});

	it('accepts a sparse show= subset', () => {
		expect(
			BestBuyProductEntity.safeParse({ sku: 8880044, name: 'Batman' }).success,
		).toBe(true);
		expect(
			BestBuyCategoryEntity.safeParse({ id: 'abcat0100000' }).success,
		).toBe(true);
		expect(
			BestBuyStoreEntity.safeParse({ storeId: 281, city: 'Richfield' }).success,
		).toBe(true);
		expect(
			BestBuyReviewEntity.safeParse({ id: '1', sku: 43900, rating: 5 }).success,
		).toBe(true);
	});
});
