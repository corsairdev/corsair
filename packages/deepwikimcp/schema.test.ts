import {
	DeepwikiMcpEndpointInputSchemas,
	DeepwikiMcpEndpointOutputSchemas,
} from './endpoints/types';
import { DeepwikiMcpSchema } from './schema';

describe('DeepwikiMcp schema', () => {
	it('declares a semver version', () => {
		expect(DeepwikiMcpSchema.version).toBeDefined();
		expect(DeepwikiMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DeepwikiMcpSchema.entities).toBe('object');
		expect(DeepwikiMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DeepwikiMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(DeepwikiMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates ask_question inputs and outputs', () => {
		expect(
			DeepwikiMcpEndpointInputSchemas.askQuestion.parse({
				repoName: ['facebook/react'],
				question: 'What is React?',
			}),
		).toEqual({ repoName: ['facebook/react'], question: 'What is React?' });
		expect(() =>
			DeepwikiMcpEndpointInputSchemas.askQuestion.parse({
				repoName: 'facebook/react',
				question: '',
			}),
		).toThrow();
		expect(
			DeepwikiMcpEndpointOutputSchemas.askQuestion.parse({
				content: [{ type: 'text', text: 'React is a library.' }],
			}),
		).toEqual({ content: [{ type: 'text', text: 'React is a library.' }] });
	});

	it('validates read_wiki_contents inputs and outputs', () => {
		expect(
			DeepwikiMcpEndpointInputSchemas.readWikiContents.parse({
				repoName: 'facebook/react',
			}),
		).toEqual({ repoName: 'facebook/react' });
		expect(() =>
			DeepwikiMcpEndpointInputSchemas.readWikiContents.parse({
				repoName: 'react',
			}),
		).toThrow();
		expect(
			DeepwikiMcpEndpointOutputSchemas.readWikiContents.parse({
				content: [{ type: 'text', text: 'Documentation' }],
			}),
		).toBeDefined();
	});

	it('validates read_wiki_structure inputs and outputs', () => {
		expect(
			DeepwikiMcpEndpointInputSchemas.readWikiStructure.parse({
				repoName: 'facebook/react',
			}),
		).toEqual({ repoName: 'facebook/react' });
		expect(() =>
			DeepwikiMcpEndpointInputSchemas.readWikiStructure.parse({
				repoName: 'facebook',
			}),
		).toThrow();
		expect(
			DeepwikiMcpEndpointOutputSchemas.readWikiStructure.parse({
				content: [{ type: 'text', text: 'Topics' }],
			}),
		).toBeDefined();
	});
});
