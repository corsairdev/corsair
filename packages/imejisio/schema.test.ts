import {
	ImejisioEndpointInputSchemas,
	ImejisioEndpointOutputSchemas,
	RenderDesignInputSchema,
	RenderDesignResponseSchema,
	RenderHostedResponseSchema,
	RenderSignedResponseSchema,
	RenderStreamResponseSchema,
} from './endpoints/types';
import { ImejisioSchema } from './schema';
import { ImejisioRender } from './schema/database';

describe('endpoint schema registry', () => {
	it('exposes an input and output schema for every operation', () => {
		expect(Object.keys(ImejisioEndpointInputSchemas)).toEqual(['renderDesign']);
		expect(Object.keys(ImejisioEndpointOutputSchemas)).toEqual([
			'renderDesign',
		]);
		expect(ImejisioEndpointInputSchemas.renderDesign).toBe(
			RenderDesignInputSchema,
		);
		expect(ImejisioEndpointOutputSchemas.renderDesign).toBe(
			RenderDesignResponseSchema,
		);
	});
});

describe('RenderDesignInputSchema', () => {
	it('applies the defaults documented in the official OpenAPI spec', () => {
		const parsed = RenderDesignInputSchema.parse({ designId: 'des_1' });
		expect(parsed).toEqual({
			designId: 'des_1',
			format: 'jpeg',
			delivery: 'stream',
		});
	});

	it('rejects a missing or empty designId', () => {
		expect(() => RenderDesignInputSchema.parse({})).toThrow();
		expect(() => RenderDesignInputSchema.parse({ designId: '' })).toThrow();
	});

	it('accepts every supported output format and rejects others', () => {
		const formats: Array<'png' | 'jpeg' | 'webp' | 'pdf'> = [
			'png',
			'jpeg',
			'webp',
			'pdf',
		];
		for (const format of formats) {
			expect(
				RenderDesignInputSchema.parse({ designId: 'des_1', format }).format,
			).toBe(format);
		}
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', format: 'gif' }),
		).toThrow();
	});

	it('bounds quality to 1-100', () => {
		expect(
			RenderDesignInputSchema.parse({ designId: 'des_1', quality: 1 }).quality,
		).toBe(1);
		expect(
			RenderDesignInputSchema.parse({ designId: 'des_1', quality: 100 })
				.quality,
		).toBe(100);
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', quality: 0 }),
		).toThrow();
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', quality: 101 }),
		).toThrow();
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', quality: 50.5 }),
		).toThrow();
	});

	it('bounds expiresIn to 1-10080 minutes (7 days)', () => {
		expect(
			RenderDesignInputSchema.parse({ designId: 'des_1', expiresIn: 10080 })
				.expiresIn,
		).toBe(10080);
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', expiresIn: 0 }),
		).toThrow();
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', expiresIn: 10081 }),
		).toThrow();
	});

	it('validates the delivery modes', () => {
		const deliveries: Array<'stream' | 'hosted' | 'signed'> = [
			'stream',
			'hosted',
			'signed',
		];
		for (const delivery of deliveries) {
			expect(
				RenderDesignInputSchema.parse({ designId: 'des_1', delivery }).delivery,
			).toBe(delivery);
		}
		expect(() =>
			RenderDesignInputSchema.parse({ designId: 'des_1', delivery: 'inline' }),
		).toThrow();
	});

	it('accepts arbitrary dynamic-field overrides', () => {
		const parsed = RenderDesignInputSchema.parse({
			designId: 'des_1',
			overrides: { 'headline.text': 'Hi', price: { value: 42 } },
		});
		expect(parsed.overrides).toEqual({
			'headline.text': 'Hi',
			price: { value: 42 },
		});
	});

	it('does not accept the render key as a business parameter', () => {
		// unknown justified: testing that runtime schema strips unaccepted credential fields passed dynamically.
		const inputWithLeakedKey: unknown = {
			designId: 'des_1',
			'dma-api-key': 'leaked-key',
		};
		const parsed = RenderDesignInputSchema.parse(inputWithLeakedKey);
		expect(parsed).toEqual({
			designId: 'des_1',
			delivery: 'stream',
			format: 'jpeg',
		});
		expect(parsed).not.toHaveProperty('dma-api-key');
	});
});

describe('RenderDesignResponseSchema', () => {
	it('parses a normalized stream response', () => {
		expect(
			RenderStreamResponseSchema.parse({
				delivery: 'stream',
				format: 'png',
				contentType: 'image/png',
				base64: 'aGk=',
			}),
		).toEqual({
			delivery: 'stream',
			format: 'png',
			contentType: 'image/png',
			base64: 'aGk=',
		});
	});

	it('parses a hosted response and preserves undeclared properties', () => {
		const parsed = RenderHostedResponseSchema.parse({
			success: true,
			delivery: 'hosted',
			url: 'https://cdn.imejis.io/renders/a.png',
			requestId: 'req_1',
		});
		expect(parsed.url).toBe('https://cdn.imejis.io/renders/a.png');
		expect(parsed.requestId).toBe('req_1');
	});

	it('parses a signed response with its expiry', () => {
		const parsed = RenderSignedResponseSchema.parse({
			delivery: 'signed',
			url: 'https://cdn.imejis.io/renders/a.jpeg?token=x',
			expiresAt: '2026-09-14T12:00:00.000Z',
		});
		expect(parsed.expiresAt).toBe('2026-09-14T12:00:00.000Z');
	});

	it('rejects a non-URL url', () => {
		expect(() =>
			RenderHostedResponseSchema.parse({
				delivery: 'hosted',
				url: 'not-a-url',
			}),
		).toThrow();
	});

	it('discriminates on delivery and rejects an unknown mode', () => {
		expect(
			RenderDesignResponseSchema.parse({
				delivery: 'hosted',
				url: 'https://cdn.imejis.io/renders/a.png',
			}).delivery,
		).toBe('hosted');
		expect(() =>
			RenderDesignResponseSchema.parse({
				delivery: 'inline',
				url: 'https://cdn.imejis.io/renders/a.png',
			}),
		).toThrow();
		expect(() => RenderDesignResponseSchema.parse({})).toThrow();
	});
});

describe('ImejisioSchema', () => {
	it('declares a versioned renders entity', () => {
		expect(ImejisioSchema.version).toBe('1.0.0');
		expect(ImejisioSchema.entities.renders).toBe(ImejisioRender);
	});

	it('accepts a stored hosted render', () => {
		const row = ImejisioRender.parse({
			designId: 'des_1',
			delivery: 'hosted',
			url: 'https://cdn.imejis.io/renders/a.png',
			format: 'png',
			file: { size: 1024 },
			renderedAt: '2026-09-14T07:25:16.000Z',
		});
		expect(row.renderedAt).toBeInstanceOf(Date);
		expect(row.delivery).toBe('hosted');
	});

	it('rejects a stream render, which Imejis never stores', () => {
		expect(() =>
			ImejisioRender.parse({
				designId: 'des_1',
				delivery: 'stream',
				url: 'https://cdn.imejis.io/renders/a.png',
				renderedAt: new Date(),
			}),
		).toThrow();
	});

	it('requires designId, url and renderedAt', () => {
		expect(() =>
			ImejisioRender.parse({ delivery: 'hosted', renderedAt: new Date() }),
		).toThrow();
		expect(() =>
			ImejisioRender.parse({
				designId: 'des_1',
				delivery: 'hosted',
				url: 'nope',
				renderedAt: new Date(),
			}),
		).toThrow();
	});
});
