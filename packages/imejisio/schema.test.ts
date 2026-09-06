import {
	ListDesignsInputSchema,
	PaginatedDesignsSchema,
} from './endpoints/types';
import { ImejisioSchema } from './schema';

describe('Imejisio schema', () => {
	it('declares a semver version', () => {
		expect(ImejisioSchema.version).toBeDefined();
		expect(ImejisioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ImejisioSchema.entities).toBe('object');
		expect(ImejisioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ImejisioSchema.entities))).toBe(true);
		for (const entity of Object.values(ImejisioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('ListDesignsInputSchema', () => {
	it('accepts empty input object', () => {
		const result = ListDesignsInputSchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBeUndefined();
			expect(result.data.limit).toBeUndefined();
		}
	});

	it('accepts valid page and limit values', () => {
		const result = ListDesignsInputSchema.safeParse({ page: 1, limit: 10 });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}

		const boundaryResult = ListDesignsInputSchema.safeParse({
			page: 100,
			limit: 100,
		});
		expect(boundaryResult.success).toBe(true);
	});

	it('rejects invalid page (< 1)', () => {
		expect(ListDesignsInputSchema.safeParse({ page: 0 }).success).toBe(false);
		expect(ListDesignsInputSchema.safeParse({ page: -1 }).success).toBe(false);
	});

	it('rejects non-integer page', () => {
		expect(ListDesignsInputSchema.safeParse({ page: 1.5 }).success).toBe(false);
	});

	it('rejects invalid limit (< 1)', () => {
		expect(ListDesignsInputSchema.safeParse({ limit: 0 }).success).toBe(false);
		expect(ListDesignsInputSchema.safeParse({ limit: -5 }).success).toBe(false);
	});

	it('rejects invalid limit (> 100)', () => {
		expect(ListDesignsInputSchema.safeParse({ limit: 101 }).success).toBe(
			false,
		);
		expect(ListDesignsInputSchema.safeParse({ limit: 500 }).success).toBe(
			false,
		);
	});

	it('rejects non-integer limit', () => {
		expect(ListDesignsInputSchema.safeParse({ limit: 10.5 }).success).toBe(
			false,
		);
	});
});

describe('PaginatedDesignsSchema', () => {
	it('parses representative successful response from official OpenAPI spec', () => {
		const fixture = {
			docs: [
				{
					_id: '65a1234567890abcdef12345',
					name: 'Social Media Banner',
					updatedAt: '2025-01-20T14:32:00.000Z',
				},
				{
					_id: '65a9876543210fedcba54321',
					name: 'Product Poster',
					updatedAt: '2025-01-22T09:15:30.000Z',
				},
			],
			page: 1,
			totalPages: 3,
			hasNextPage: true,
		};

		const parsed = PaginatedDesignsSchema.parse(fixture);
		expect(parsed.docs).toHaveLength(2);
		expect(parsed.docs[0]?._id).toBe('65a1234567890abcdef12345');
		expect(parsed.docs[0]?.name).toBe('Social Media Banner');
		expect(parsed.docs[0]?.updatedAt).toBe('2025-01-20T14:32:00.000Z');
		expect(parsed.docs[1]?._id).toBe('65a9876543210fedcba54321');
		expect(parsed.page).toBe(1);
		expect(parsed.totalPages).toBe(3);
		expect(parsed.hasNextPage).toBe(true);
	});

	it('parses an empty page of designs', () => {
		const emptyPage = {
			docs: [],
			page: 1,
			totalPages: 0,
			hasNextPage: false,
		};

		const parsed = PaginatedDesignsSchema.parse(emptyPage);
		expect(parsed.docs).toEqual([]);
		expect(parsed.page).toBe(1);
		expect(parsed.totalPages).toBe(0);
		expect(parsed.hasNextPage).toBe(false);
	});

	it('preserves additional properties on loose schemas', () => {
		const withExtra = {
			docs: [
				{
					_id: 'design_1',
					name: 'Custom Graphic',
					updatedAt: '2025-01-01T00:00:00Z',
					thumbnailUrl: 'https://cdn.imejis.io/thumb/1.png',
				},
			],
			page: 1,
			totalPages: 1,
			hasNextPage: false,
			totalDocs: 1,
		};

		const parsed = PaginatedDesignsSchema.parse(withExtra);
		expect((parsed.docs[0] as Record<string, unknown>).thumbnailUrl).toBe(
			'https://cdn.imejis.io/thumb/1.png',
		);
		expect((parsed as Record<string, unknown>).totalDocs).toBe(1);
	});
});
