import { WitAiSchema } from './schema';
import {
	WitAiApp,
	WitAiEntity,
	WitAiIntent,
	WitAiTag,
	WitAiTrait,
	WitAiUtterance,
	WitAiVoice,
} from './schema/database';

const ENTITIES = {
	apps: WitAiApp,
	intents: WitAiIntent,
	entities: WitAiEntity,
	traits: WitAiTrait,
	utterances: WitAiUtterance,
	voices: WitAiVoice,
	tags: WitAiTag,
} as const;

describe('WitAi schema', () => {
	it('declares a semver version', () => {
		expect(WitAiSchema.version).toBeDefined();
		expect(WitAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all registered entities', () => {
		expect(typeof WitAiSchema.entities).toBe('object');
		expect(WitAiSchema.entities).not.toBeNull();
		const declaredKeys = Object.keys(WitAiSchema.entities).sort();
		const expectedKeys = Object.keys(ENTITIES).sort();
		expect(declaredKeys).toEqual(expectedKeys);
		expect(declaredKeys).toHaveLength(7);
	});

	describe('entity parsing and key requirements', () => {
		it('parses an App record carrying required fields', () => {
			const parsed = WitAiApp.safeParse({
				id: 'app-1',
				name: 'my-bot',
				lang: 'en',
				private: false,
			});
			expect(parsed.success).toBe(true);
		});

		it('parses an Intent record carrying required fields', () => {
			const parsed = WitAiIntent.safeParse({
				id: 'intent-1',
				name: 'book_flight',
			});
			expect(parsed.success).toBe(true);
		});

		it('parses an Entity record carrying required fields', () => {
			const parsed = WitAiEntity.safeParse({
				id: 'entity-1',
				name: 'destination',
				roles: [{ id: 'r1', name: 'destination' }],
				lookups: ['keywords', 'free-text'],
			});
			expect(parsed.success).toBe(true);
		});

		it('parses a Trait record carrying required fields', () => {
			const parsed = WitAiTrait.safeParse({
				id: 'trait-1',
				name: 'sentiment',
				values: [{ id: 'v1', value: 'positive' }],
			});
			expect(parsed.success).toBe(true);
		});

		it('parses an Utterance record carrying required fields', () => {
			const parsed = WitAiUtterance.safeParse({
				text: 'book a flight to london',
				intent: { id: 'i1', name: 'book_flight' },
			});
			expect(parsed.success).toBe(true);
		});

		it('parses a Voice record carrying required fields', () => {
			const parsed = WitAiVoice.safeParse({
				name: 'wit$Rebecca',
				locale: 'en_US',
				gender: 'female',
				styles: [{ name: 'default' }],
			});
			expect(parsed.success).toBe(true);
		});

		it('parses a Tag record carrying required fields', () => {
			const parsed = WitAiTag.safeParse({
				id: 'tag-1',
				name: 'v1.0',
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('unrecognised fields are tolerated', () => {
		for (const [name, entity] of Object.entries(ENTITIES)) {
			it(`keeps extra unknown fields on ${name}`, () => {
				const base: Record<string, unknown> =
					name === 'utterances'
						? { text: 'sample' }
						: name === 'voices'
							? { name: 'sample-voice' }
							: { id: `${name}-1`, name: `sample-${name}` };

				const parsed = (entity as any).parse({
					...base,
					future_provider_field: 'retained',
				});
				expect(parsed).toMatchObject({
					future_provider_field: 'retained',
				});
			});
		}
	});
});
