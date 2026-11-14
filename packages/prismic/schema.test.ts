import {
	DocumentSchema,
	DocumentsGetInputSchema,
	DocumentsSearchInputSchema,
	MigrationCreateInputSchema,
	MigrationUpdateInputSchema,
	PrismicJsonValueSchema,
	RefSchema,
	RepositoryInfoInputSchema,
} from './endpoints/types';
import { PrismicSchema } from './schema';

// unknown: one test builds a partial input and deletes a key from it to prove
// each required field is enforced, so the interim record has no static type.
type Untyped = unknown; // unknown: see the note above.

describe('Prismic plugin schema', () => {
	it('declares a semver version', () => {
		expect(PrismicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PrismicSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PrismicSchema.entities)).toBe(false);
	});
});

describe('repository metadata', () => {
	it('parses a ref, which every query is pinned to', () => {
		expect(
			RefSchema.safeParse({
				id: 'master',
				ref: 'X47BMBAAACAAVh4N',
				label: 'Master',
				isMasterRef: true,
			}).success,
		).toBe(true);
	});

	it('accepts a repository id that can be a host label', () => {
		expect(RepositoryInfoInputSchema.safeParse({}).success).toBe(true);
		expect(
			RepositoryInfoInputSchema.safeParse({ repository: 'my-cafe' }).success,
		).toBe(true);
		expect(
			RepositoryInfoInputSchema.safeParse({ repository: 'My Cafe' }).success,
		).toBe(false);
		expect(
			RepositoryInfoInputSchema.safeParse({ repository: 'my_cafe' }).success,
		).toBe(false);
	});
});

describe('document schemas', () => {
	it('parses the fields the Content API returns', () => {
		expect(
			DocumentSchema.safeParse({
				id: 'ZMI65RQAADkECUFM',
				uid: 'example-page',
				type: 'page',
				lang: 'en-us',
				tags: ['Red'],
				data: { title: 'Hello' },
				slugs: ['example-page'],
				href: 'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=abc',
				url: 'https://my-cafe.com/example-page',
				first_publication_date: '2026-01-01T00:00:00+0000',
				last_publication_date: '2026-01-02T00:00:00+0000',
				alternate_languages: [
					{ id: 'doc_fr', lang: 'fr-fr', type: 'page', uid: 'exemple' },
				],
				linked_documents: [],
			}).success,
		).toBe(true);
	});

	it('keeps a body whose fields the custom type defines', () => {
		const parsed = DocumentSchema.parse({
			id: 'doc_1',
			data: {
				title: 'Hello',
				rich_text: [{ type: 'paragraph', text: 'Hi', spans: [] }],
				group: [{ price: 10 }],
				flag: false,
				empty: null,
			},
		});

		expect(parsed.data).toMatchObject({
			title: 'Hello',
			flag: false,
			empty: null,
		});
	});

	it('rejects a document whose id is a number', () => {
		expect(DocumentSchema.safeParse({ id: 42 }).success).toBe(false);
	});
});

describe('document query inputs', () => {
	it('accepts every published filter', () => {
		expect(
			DocumentsSearchInputSchema.safeParse({
				page: 1,
				pageSize: 100,
				orderings: '[my.page.date desc]',
				q: '[[at(document.type, "page")]]',
				lang: 'en-us',
				tags: ['Red', 'Blue'],
				after: 'cursor-1',
				ref: 'X47BMBAAACAAVh4N',
			}).success,
		).toBe(true);
	});

	it('accepts an empty query, which returns the first page', () => {
		expect(DocumentsSearchInputSchema.safeParse({}).success).toBe(true);
	});

	it('accepts a nextPage, which replaces every other filter', () => {
		expect(
			DocumentsSearchInputSchema.safeParse({
				nextPage:
					'https://my-cafe.cdn.prismic.io/api/v2/documents/search?page=2',
			}).success,
		).toBe(true);
	});

	it('rejects a page below 1 and a page size below 1', () => {
		expect(DocumentsSearchInputSchema.safeParse({ page: 0 }).success).toBe(
			false,
		);
		expect(DocumentsSearchInputSchema.safeParse({ pageSize: 0 }).success).toBe(
			false,
		);
	});

	it('rejects an empty tag, which would widen the query', () => {
		expect(DocumentsSearchInputSchema.safeParse({ tags: [''] }).success).toBe(
			false,
		);
	});

	it('requires an id on a single read', () => {
		expect(DocumentsGetInputSchema.safeParse({}).success).toBe(false);
		expect(DocumentsGetInputSchema.safeParse({ id: 'doc_1' }).success).toBe(
			true,
		);
	});
});

describe('migration input rules', () => {
	it('requires title, type, lang and data on create', () => {
		expect(
			MigrationCreateInputSchema.safeParse({
				title: 'Example page',
				type: 'page',
				lang: 'en-us',
				data: { title: 'Hello' },
			}).success,
		).toBe(true);

		for (const missing of ['title', 'type', 'lang', 'data'] as const) {
			const input: Record<string, Untyped> = {
				title: 'Example page',
				type: 'page',
				lang: 'en-us',
				data: { title: 'Hello' },
			};
			delete input[missing];
			expect(MigrationCreateInputSchema.safeParse(input).success).toBe(false);
		}
	});

	it('accepts tags and a translation link on create', () => {
		expect(
			MigrationCreateInputSchema.safeParse({
				title: 'Example page',
				type: 'page',
				lang: 'fr-fr',
				uid: 'exemple',
				data: {},
				tags: ['Red'],
				alternate_language_id: 'ZRFHsxIAAFYAsY--',
			}).success,
		).toBe(true);
	});

	it('requires at least one change on update', () => {
		expect(MigrationUpdateInputSchema.safeParse({ id: 'doc_1' }).success).toBe(
			false,
		);
		expect(
			MigrationUpdateInputSchema.safeParse({ id: 'doc_1', title: 'New' })
				.success,
		).toBe(true);
		expect(
			MigrationUpdateInputSchema.safeParse({ id: 'doc_1', tags: ['Red'] })
				.success,
		).toBe(true);
	});

	it('does not accept type, lang or a translation link on update, which Prismic ignores', () => {
		const parsed = MigrationUpdateInputSchema.parse({
			id: 'doc_1',
			title: 'New',
			type: 'page',
			lang: 'fr-fr',
			alternate_language_id: 'abc',
		});

		expect('type' in parsed).toBe(false);
		expect('lang' in parsed).toBe(false);
		expect('alternate_language_id' in parsed).toBe(false);
	});
});

describe('the shared JSON value schema', () => {
	it('accepts every JSON shape a document body can hold', () => {
		for (const value of [
			'text',
			42,
			true,
			null,
			[1, 'two'],
			{ nested: { list: [true, null] } },
		]) {
			expect(PrismicJsonValueSchema.safeParse(value).success).toBe(true);
		}
	});

	it('rejects a value JSON cannot carry', () => {
		expect(PrismicJsonValueSchema.safeParse(undefined).success).toBe(false);
		expect(PrismicJsonValueSchema.safeParse(() => 1).success).toBe(false);
	});
});
