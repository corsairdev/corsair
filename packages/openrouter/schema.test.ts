import {
	OpenRouterGenerationEntity,
	OpenRouterModelEntity,
	OpenRouterProviderEntity,
	OpenrouterSchema,
} from './schema';

describe('Openrouter schema', () => {
	it('declares a semver version', () => {
		expect(OpenrouterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to OpenRouter resources', () => {
		expect(Object.keys(OpenrouterSchema.entities).sort()).toEqual(
			['generations', 'models', 'providers'].sort(),
		);
		expect(
			OpenRouterModelEntity.parse({
				id: 'openai/gpt-4o-mini',
				name: 'GPT-4o mini',
			}),
		).toMatchObject({ id: 'openai/gpt-4o-mini', name: 'GPT-4o mini' });
		expect(
			OpenRouterProviderEntity.parse({ slug: 'openai', name: 'OpenAI' }),
		).toMatchObject({ slug: 'openai', name: 'OpenAI' });
		expect(OpenRouterGenerationEntity.parse({ id: 'gen-1' })).toMatchObject({
			id: 'gen-1',
		});
	});
});
