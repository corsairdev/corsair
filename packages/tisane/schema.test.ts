import { TisaneEndpointOutputSchemas } from './endpoints/types';
import { TisaneSchema } from './schema';

describe('Tisane schema', () => {
	it('declares a semver version', () => {
		expect(TisaneSchema.version).toBeDefined();
		expect(TisaneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares empty entities because nothing is persisted', () => {
		expect(TisaneSchema.entities).toEqual({});
	});

	it('parses documented sentiment_expressions and entities_summary', () => {
		const parsed = TisaneEndpointOutputSchemas.textParse.parse({
			text: 'Hello Tisane API!',
			entities_summary: [
				{
					name: 'Tisane API',
					type: 'software',
					mentions: [{ sentence_index: 0, offset: 6, length: 10 }],
				},
			],
			sentiment_expressions: [
				{
					polarity: 'neutral',
					offset: 0,
					length: 17,
					sentence_index: 0,
				},
			],
			topics: ['natural language processing'],
		});
		expect(parsed.entities_summary?.[0]?.name).toBe('Tisane API');
		expect(parsed.sentiment_expressions?.[0]?.polarity).toBe('neutral');
		expect(parsed.topics?.[0]).toBe('natural language processing');
	});
});
