import {
	ListDesignsInputSchema,
	PaginatedDesignsSchema,
	RenderDesignInputSchema,
	RenderDesignResponseSchema,
	RenderHostedResponseSchema,
	RenderSignedResponseSchema,
	RenderStreamResponseSchema,
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

describe('RenderDesignInputSchema', () => {
	it('accepts valid minimal input and applies official OpenAPI defaults', () => {
		const result = RenderDesignInputSchema.safeParse({
			designId: 'render_123',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.designId).toBe('render_123');
			expect(result.data.format).toBe('jpeg');
			expect(result.data.delivery).toBe('stream');
			expect(result.data.quality).toBeUndefined();
			expect(result.data.expiresIn).toBeUndefined();
		}
	});

	it('rejects missing or empty designId', () => {
		expect(RenderDesignInputSchema.safeParse({}).success).toBe(false);
		expect(RenderDesignInputSchema.safeParse({ designId: '' }).success).toBe(
			false,
		);
	});

	it('does NOT expose renderKey as an endpoint business parameter', () => {
		expect('renderKey' in RenderDesignInputSchema.shape).toBe(false);
	});

	it('accepts all supported formats', () => {
		for (const fmt of ['png', 'jpeg', 'webp', 'pdf'] as const) {
			const result = RenderDesignInputSchema.safeParse({
				designId: 'des_1',
				format: fmt,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.format).toBe(fmt);
			}
		}
	});

	it('rejects unsupported formats', () => {
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', format: 'gif' })
				.success,
		).toBe(false);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', format: 'svg' })
				.success,
		).toBe(false);
	});

	it('validates quality bounds (1 to 100)', () => {
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', quality: 1 })
				.success,
		).toBe(true);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', quality: 100 })
				.success,
		).toBe(true);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', quality: 0 })
				.success,
		).toBe(false);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', quality: 101 })
				.success,
		).toBe(false);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', quality: 75.5 })
				.success,
		).toBe(false);
	});

	it('validates delivery options', () => {
		for (const del of ['stream', 'hosted', 'signed'] as const) {
			const result = RenderDesignInputSchema.safeParse({
				designId: 'des_1',
				delivery: del,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.delivery).toBe(del);
			}
		}
		expect(
			RenderDesignInputSchema.safeParse({
				designId: 'des_1',
				delivery: 'invalid',
			}).success,
		).toBe(false);
	});

	it('validates expiresIn bounds (1 to 10080 minutes)', () => {
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', expiresIn: 60 })
				.success,
		).toBe(true);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', expiresIn: 10080 })
				.success,
		).toBe(true);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', expiresIn: 0 })
				.success,
		).toBe(false);
		expect(
			RenderDesignInputSchema.safeParse({ designId: 'des_1', expiresIn: 10081 })
				.success,
		).toBe(false);
	});

	it('accepts dynamic field overrides', () => {
		const result = RenderDesignInputSchema.safeParse({
			designId: 'des_1',
			overrides: {
				title: 'Special Promotion',
				price: 99.99,
				highlight: true,
			},
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.overrides).toEqual({
				title: 'Special Promotion',
				price: 99.99,
				highlight: true,
			});
		}
	});
});

describe('RenderDesignResponseSchema', () => {
	it('parses normalized stream delivery response', () => {
		const fixture = {
			delivery: 'stream' as const,
			format: 'jpeg' as const,
			contentType: 'image/jpeg',
			base64: 'dGVzdC1qcGVnLWJ5dGVz',
		};

		const parsed = RenderStreamResponseSchema.parse(fixture);
		expect(parsed.delivery).toBe('stream');
		expect(parsed.format).toBe('jpeg');
		expect(parsed.contentType).toBe('image/jpeg');
		expect(parsed.base64).toBe('dGVzdC1qcGVnLWJ5dGVz');

		const discriminated = RenderDesignResponseSchema.parse(fixture);
		expect(discriminated.delivery).toBe('stream');
	});

	it('parses hosted delivery response with loose properties preserved', () => {
		const fixture = {
			success: true,
			delivery: 'hosted' as const,
			url: 'https://cdn.imejis.io/renders/hosted-123.jpg',
			format: 'jpeg' as const,
			file: { width: 1200, height: 630, size: 54321 },
			extraServerMeta: 'retained',
		};

		const parsed = RenderHostedResponseSchema.parse(fixture);
		expect(parsed.delivery).toBe('hosted');
		expect(parsed.url).toBe('https://cdn.imejis.io/renders/hosted-123.jpg');
		expect(parsed.format).toBe('jpeg');
		expect((parsed as Record<string, unknown>).extraServerMeta).toBe(
			'retained',
		);

		const discriminated = RenderDesignResponseSchema.parse(fixture);
		expect(discriminated.delivery).toBe('hosted');
	});

	it('parses signed delivery response with expiration timestamp', () => {
		const fixture = {
			success: true,
			delivery: 'signed' as const,
			url: 'https://cdn.imejis.io/signed/signed-123.jpg?token=abc',
			expiresAt: '2026-09-07T12:00:00.000Z',
			format: 'jpeg' as const,
		};

		const parsed = RenderSignedResponseSchema.parse(fixture);
		expect(parsed.delivery).toBe('signed');
		expect(parsed.url).toBe(
			'https://cdn.imejis.io/signed/signed-123.jpg?token=abc',
		);
		expect(parsed.expiresAt).toBe('2026-09-07T12:00:00.000Z');

		const discriminated = RenderDesignResponseSchema.parse(fixture);
		expect(discriminated.delivery).toBe('signed');
	});

	it('rejects invalid or missing delivery mode in discriminated union', () => {
		expect(
			RenderDesignResponseSchema.safeParse({
				url: 'https://example.com/img.jpg',
			}).success,
		).toBe(false);

		expect(
			RenderDesignResponseSchema.safeParse({
				delivery: 'unknown_mode',
				url: 'https://example.com/img.jpg',
			}).success,
		).toBe(false);
	});
});
