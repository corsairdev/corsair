import {
	EchtpostEndpointInputSchemas,
	EchtpostEndpointOutputSchemas,
} from './endpoints/types';
import { EchtpostSchema } from './schema';

describe('Echtpost schema', () => {
	it('declares a semver version', () => {
		expect(EchtpostSchema.version).toBeDefined();
		expect(EchtpostSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EchtpostSchema.entities).toBe('object');
		expect(EchtpostSchema.entities).not.toBeNull();
	});
});

describe('listTemplates', () => {
	it('accepts empty input', () => {
		const result = EchtpostEndpointInputSchemas.listTemplates.parse({});
		expect(result).toEqual({});
	});

	it('accepts all optional fields', () => {
		const result = EchtpostEndpointInputSchemas.listTemplates.parse({
			source: 'user',
			page: 1,
			per_page: 50,
		});
		expect(result.source).toBe('user');
		expect(result.page).toBe(1);
		expect(result.per_page).toBe(50);
	});

	it('rejects per_page above 200', () => {
		expect(() =>
			EchtpostEndpointInputSchemas.listTemplates.parse({ per_page: 201 }),
		).toThrow();
	});

	it('parses a valid template list response', () => {
		const result = EchtpostEndpointOutputSchemas.listTemplates.parse([
			{
				id: 42,
				name: 'Summer Card',
				motive_id: 7,
				preview_url: 'https://example.com/preview.jpg',
				type: 'postcard',
				created_at: '2026-01-01T00:00:00Z',
				source: 'user',
			},
		]);
		expect(result).toHaveLength(1);
		expect(result[0]!.id).toBe(42);
		expect(result[0]!.name).toBe('Summer Card');
	});

	it('parses an empty template list', () => {
		const result = EchtpostEndpointOutputSchemas.listTemplates.parse([]);
		expect(result).toEqual([]);
	});
});

describe('createCard', () => {
	const validInput = {
		motive_id: 7,
		content: 'Hello from Berlin!',
	};

	it('accepts required fields only', () => {
		const result = EchtpostEndpointInputSchemas.createCard.parse(validInput);
		expect(result.motive_id).toBe(7);
		expect(result.content).toBe('Hello from Berlin!');
	});

	it('accepts full input with all optional fields', () => {
		const result = EchtpostEndpointInputSchemas.createCard.parse({
			...validInput,
			font: { family: 'special_elite', size: 12, color: '#000000' },
			deliver_at: '2026-12-25T00:00:00Z',
			recipient_ids: [1, 2, 3],
			group_ids: [10],
			recipients: [
				{
					last_name: 'Müller',
					first_name: 'Hans',
					street: 'Hauptstraße 1',
					zip: '10115',
					city: 'Berlin',
					country_code: 'DE',
					greeting_style: 'formal',
				},
			],
			content_ps: 'P.S. Greetings!',
			deduplicate_recipients: true,
		});
		expect(result.font?.family).toBe('special_elite');
		expect(result.recipients).toHaveLength(1);
		expect(result.recipients?.[0]?.last_name).toBe('Müller');
	});

	it('rejects invalid font family', () => {
		expect(() =>
			EchtpostEndpointInputSchemas.createCard.parse({
				...validInput,
				font: { family: 'comic_sans' },
			}),
		).toThrow();
	});

	it('rejects content_ps longer than 40 chars', () => {
		expect(() =>
			EchtpostEndpointInputSchemas.createCard.parse({
				...validInput,
				content_ps: 'A'.repeat(41),
			}),
		).toThrow();
	});

	it('rejects missing required fields', () => {
		expect(() =>
			EchtpostEndpointInputSchemas.createCard.parse({ content: 'Hello' }),
		).toThrow();
	});

	it('parses a valid card response', () => {
		const result = EchtpostEndpointOutputSchemas.createCard.parse({
			id: 'card_abc123',
			status: 'scheduled',
			motive_id: 7,
			content: 'Hello from Berlin!',
			deliver_at: '2026-12-25T00:00:00Z',
			cancelable: true,
			created_at: '2026-09-08T00:00:00Z',
		});
		expect(result.id).toBe('card_abc123');
		expect(result.status).toBe('scheduled');
		expect(result.cancelable).toBe(true);
	});

	it('rejects invalid card status', () => {
		expect(() =>
			EchtpostEndpointOutputSchemas.createCard.parse({
				id: 'card_abc123',
				status: 'delivered',
			}),
		).toThrow();
	});
});

describe('createCardFromTemplate', () => {
	const validInput = { template_id: 42 };

	it('accepts required fields only', () => {
		const result =
			EchtpostEndpointInputSchemas.createCardFromTemplate.parse(validInput);
		expect(result.template_id).toBe(42);
	});

	it('accepts optional fields', () => {
		const result = EchtpostEndpointInputSchemas.createCardFromTemplate.parse({
			...validInput,
			deliver_at: '2026-12-25T00:00:00Z',
			recipient_ids: [1],
			deduplicate_recipients: false,
		});
		expect(result.deliver_at).toBe('2026-12-25T00:00:00Z');
		expect(result.deduplicate_recipients).toBe(false);
	});

	it('rejects missing template_id', () => {
		expect(() =>
			EchtpostEndpointInputSchemas.createCardFromTemplate.parse({}),
		).toThrow();
	});

	it('parses a valid card response', () => {
		const result = EchtpostEndpointOutputSchemas.createCardFromTemplate.parse({
			id: 'card_xyz789',
			status: 'pending',
		});
		expect(result.id).toBe('card_xyz789');
		expect(result.status).toBe('pending');
	});
});

describe('previewFit', () => {
	const validInput = { content: 'Hello from Berlin!' };

	it('accepts required content only', () => {
		const result = EchtpostEndpointInputSchemas.previewFit.parse(validInput);
		expect(result.content).toBe('Hello from Berlin!');
	});

	it('accepts optional font and sample_greeting', () => {
		const result = EchtpostEndpointInputSchemas.previewFit.parse({
			...validInput,
			font: { family: 'reenie_beanie', size: 14 },
			sample_greeting: 'Sehr geehrter Herr Müller,',
		});
		expect(result.font?.family).toBe('reenie_beanie');
		expect(result.sample_greeting).toBe('Sehr geehrter Herr Müller,');
	});

	it('rejects missing content', () => {
		expect(() => EchtpostEndpointInputSchemas.previewFit.parse({})).toThrow();
	});

	it('parses a fits=true response', () => {
		const result = EchtpostEndpointOutputSchemas.previewFit.parse({
			fits: true,
			lines_used: 3,
			max_lines: 10,
		});
		expect(result.fits).toBe(true);
		expect(result.lines_used).toBe(3);
	});

	it('parses a fits=false response with overflow info', () => {
		const result = EchtpostEndpointOutputSchemas.previewFit.parse({
			fits: false,
			lines_used: 12,
			max_lines: 10,
			overflow_line: 11,
			suggested_font_size: 10,
		});
		expect(result.fits).toBe(false);
		expect(result.overflow_line).toBe(11);
		expect(result.suggested_font_size).toBe(10);
	});
});
