import {
	CreateMemoryInputSchema,
	CreateMemoryOutputSchema,
	CreatePipeInputSchema,
	CreatePipeOutputSchema,
	DeleteMemoryInputSchema,
	DeleteMemoryOutputSchema,
	DeletePipeInputSchema,
	DeletePipeOutputSchema,
	GetMemoryInputSchema,
	GetMemoryOutputSchema,
	GetPipeInputSchema,
	GetPipeOutputSchema,
	ListMemoryInputSchema,
	ListMemoryOutputSchema,
	ListPipesInputSchema,
	ListPipesOutputSchema,
	RunPipeInputSchema,
	RunPipeOutputSchema,
	UpdatePipeInputSchema,
	UpdatePipeOutputSchema,
	WebSearchInputSchema,
	WebSearchOutputSchema,
} from './endpoints/types';
import { LangbaseSchema } from './schema';
import { langbaseEntities } from './schema/database';

describe('Langbase schema', () => {
	it('declares a semver version', () => {
		expect(LangbaseSchema.version).toBeDefined();
		expect(LangbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(LangbaseSchema.entities).toBe(langbaseEntities);
		expect(LangbaseSchema.entities).toEqual({});
	});
});

describe('Langbase endpoint schemas', () => {
	it('validates pipes endpoint schemas', () => {
		expect(
			RunPipeInputSchema.safeParse({
				messages: [{ role: 'user', content: 'Hello AI' }],
			}).success,
		).toBe(true);
		expect(
			RunPipeInputSchema.safeParse({
				messages: [{ role: 'invalid_role', content: 'Hello' }],
			}).success,
		).toBe(false);
		expect(
			RunPipeOutputSchema.safeParse({
				completion: 'Hello human!',
			}).success,
		).toBe(true);

		expect(ListPipesInputSchema.safeParse({}).success).toBe(true);
		expect(ListPipesOutputSchema.safeParse({ pipes: [] }).success).toBe(true);

		expect(GetPipeInputSchema.safeParse({ name: 'chat-agent' }).success).toBe(
			true,
		);
		expect(GetPipeInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			GetPipeOutputSchema.safeParse({
				pipe: { name: 'chat-agent', model: 'openai:gpt-4o' },
			}).success,
		).toBe(true);

		expect(
			CreatePipeInputSchema.safeParse({
				name: 'rag-pipe',
				model: 'openai:gpt-4o',
			}).success,
		).toBe(true);
		expect(CreatePipeInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			CreatePipeOutputSchema.safeParse({
				pipe: { name: 'rag-pipe' },
			}).success,
		).toBe(true);

		expect(
			UpdatePipeInputSchema.safeParse({
				name: 'rag-pipe',
				description: 'Updated description',
			}).success,
		).toBe(true);
		expect(
			UpdatePipeOutputSchema.safeParse({
				pipe: { name: 'rag-pipe', description: 'Updated' },
			}).success,
		).toBe(true);

		expect(DeletePipeInputSchema.safeParse({ name: 'rag-pipe' }).success).toBe(
			true,
		);
		expect(DeletePipeInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			DeletePipeOutputSchema.safeParse({
				success: true,
			}).success,
		).toBe(true);
	});

	it('validates memory endpoint schemas', () => {
		expect(ListMemoryInputSchema.safeParse({}).success).toBe(true);
		expect(ListMemoryOutputSchema.safeParse({ memories: [] }).success).toBe(
			true,
		);

		expect(GetMemoryInputSchema.safeParse({ name: 'docs-memory' }).success).toBe(
			true,
		);
		expect(GetMemoryInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			GetMemoryOutputSchema.safeParse({
				memory: { name: 'docs-memory', documents_count: 42 },
			}).success,
		).toBe(true);

		expect(
			CreateMemoryInputSchema.safeParse({
				name: 'new-memory',
				embedding_model: 'openai:text-embedding-3-small',
			}).success,
		).toBe(true);
		expect(CreateMemoryInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			CreateMemoryOutputSchema.safeParse({
				memory: { name: 'new-memory' },
			}).success,
		).toBe(true);

		expect(DeleteMemoryInputSchema.safeParse({ name: 'old-memory' }).success).toBe(
			true,
		);
		expect(
			DeleteMemoryOutputSchema.safeParse({
				success: true,
			}).success,
		).toBe(true);
	});

	it('validates tools endpoint schemas', () => {
		expect(
			WebSearchInputSchema.safeParse({
				query: 'Langbase documentation',
				totalResults: 5,
			}).success,
		).toBe(true);
		expect(WebSearchInputSchema.safeParse({ query: '' }).success).toBe(false);
		expect(
			WebSearchOutputSchema.safeParse({
				results: [{ title: 'Langbase', url: 'https://langbase.com' }],
			}).success,
		).toBe(true);
	});
});
