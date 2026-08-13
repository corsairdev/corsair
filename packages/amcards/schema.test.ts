import { AmcardsEndpointOutputSchemas } from './endpoints/types';
import {
	AmcardsCard,
	AmcardsCategory,
	AmcardsContact,
	AmcardsGift,
	AmcardsPublicTemplate,
	AmcardsSchema,
} from './schema';

describe('Amcards schema', () => {
	it('declares a semver version', () => {
		expect(AmcardsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the five official v1 resources', () => {
		expect(AmcardsSchema.entities.cards).toBe(AmcardsCard);
		expect(AmcardsSchema.entities.contacts).toBe(AmcardsContact);
		expect(AmcardsSchema.entities.categories).toBe(AmcardsCategory);
		expect(AmcardsSchema.entities.gifts).toBe(AmcardsGift);
		expect(AmcardsSchema.entities.templates).toBe(AmcardsPublicTemplate);
	});
});

describe('documented field names parse', () => {
	it('contact fields from the official contact resource', () => {
		const parsed = AmcardsContact.parse({
			id: 1,
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: 'ada@example.com',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-02T00:00:00Z',
		});
		expect(parsed.email).toBe('ada@example.com');
	});

	it('category title / priority / hierarchy', () => {
		const parsed = AmcardsCategory.parse({
			id: 2,
			title: 'Birthday',
			priority: 1,
			hierarchy: ['Occasions', 'Birthday'],
		});
		expect(parsed.priority).toBe(1);
	});

	it('gift name / price / shipping_cost', () => {
		const parsed = AmcardsGift.parse({
			id: 3,
			name: 'Mug',
			description: 'Ceramic mug',
			price: '12.00',
			shipping_cost: '4.00',
			available: true,
		});
		expect(parsed.shipping_cost).toBe('4.00');
	});

	it('accepts both DRF results and Tastypie objects list envelopes', () => {
		const drf = AmcardsEndpointOutputSchemas.getCards.parse({
			count: 1,
			next: null,
			previous: null,
			results: [{ id: 7 }],
		});
		const tasty = AmcardsEndpointOutputSchemas.getCards.parse({
			meta: { limit: 20, offset: 0, total_count: 1 },
			objects: [{ id: 7 }],
		});
		expect(drf).toBeTruthy();
		expect(tasty).toBeTruthy();
	});
});
