import { z } from 'zod';

// Inputs use the Delivery API's own parameter names. Outputs are `.loose()` and
// their fields nullish, so a field Kontent adds or omits cannot fail a read that
// has already happened. Every shape here was checked against a live response of
// the public sample environment.
// Reference: https://kontent.ai/learn/reference/delivery-api

const CodenameSchema = z
	.string()
	.min(1)
	.describe('The item, type or taxonomy codename, such as `about_us`.');

// The Delivery API key with preview access lives on the account
// (`delivery_api_key`), never in a call's arguments, so it stays out of logs,
// approval records and an agent's context. A call only says whether it wants
// preview content.
const PREVIEW_SCHEMA = z
	.boolean()
	.describe(
		'Read the latest version, including unpublished content, from the Preview API. Needs a Delivery API key with preview access stored on the account.',
	);

export const KONTENT_DEFAULT_LIMIT = 10;
export const KONTENT_MAX_LIMIT = 2000;

// The Delivery API accepts `depth` from 0 to 2 and **silently clamps** anything
// outside it: a live probe of `depth=99` answered 200 with depth 2 applied. The
// bound is therefore enforced here, because a caller who asks for 99 would
// otherwise get an answer that looks complete and is not.
const DEPTH_SCHEMA = z
	.number()
	.int()
	.min(0)
	.max(2)
	.optional()
	.describe(
		'How deep to resolve linked items: `0` returns no `modular_content`, `1` and `2` go deeper. Kontent clamps anything outside 0 to 2 without saying so.',
	);

const PaginationInputSchema = z.object({
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Items to skip. Defaults to 0.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(KONTENT_MAX_LIMIT)
		.optional()
		.describe(
			`Items per page, at most ${KONTENT_MAX_LIMIT}. Without it Kontent returns everything from \`skip\` on in one answer.`,
		),
});

const PaginationSchema = z
	.object({
		skip: z.number().nullish(),
		limit: z.number().nullish(),
		count: z.number().nullish().describe('Items in this page.'),
		next_page: z
			.string()
			.nullish()
			.describe(
				'A full URL for the next page, or an empty string on the last one.',
			),
	})
	.loose();

export type KontentPagination = z.infer<typeof PaginationSchema>;

// `order` and `next_page` are what a caller pages and sorts with, so both are
// accepted as inputs and reported back on the answer.
const ListInputBase = PaginationInputSchema.extend({
	order: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A sort, such as `system.last_modified` or `elements.price[asc]`. Suffix the field with `[desc]` to reverse it; a `-` prefix is refused with a 400.',
		),
	preview: PREVIEW_SCHEMA.optional(),
});

// ── shared element shape ──────────────────────────────────────────────────

// An element's `value` type follows its `type`: text is a string, a number is a
// number, `modular_content` is an array of codenames, assets an array of objects.
// unknown: no single static type covers every element type, and a caller's type
// list decides which it gets.
const ElementSchema = z
	.object({
		type: z
			.string()
			.describe(
				'`text`, `rich_text`, `number`, `date_time`, `modular_content`, `asset`, `taxonomy` and so on.',
			),
		name: z.string().nullish(),
		// Optional because some element types carry no value: a live `url_slug`
		// element arrives as `{ type, name }` with no `value` key at all.
		value: z.unknown().optional(),
	})
	.loose();

export type KontentElement = z.infer<typeof ElementSchema>;

const ElementFieldsSchema = z.record(z.string(), ElementSchema);

// ── items ─────────────────────────────────────────────────────────────────

const ItemSystemSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		codename: z.string().nullish(),
		language: z.string().nullish(),
		type: z.string().nullish(),
		collection: z.string().nullish(),
		sitemap_locations: z.array(z.string()).nullish(),
		last_modified: z.string().nullish().describe('ISO 8601.'),
		workflow: z.string().nullish(),
		workflow_step: z.string().nullish(),
	})
	.loose();

export type KontentItemSystem = z.infer<typeof ItemSystemSchema>;

export const KontentItemSchema = z
	.object({
		system: ItemSystemSchema,
		elements: ElementFieldsSchema.nullish(),
	})
	.loose();

export type KontentItem = z.infer<typeof KontentItemSchema>;

// One Kontent filter is `system.<property>` or `elements.<codename>`, an
// optional operator such as `[gt]` or `[in]`, then `=value` unless the operator
// takes none (`[empty]`, `[nempty]`). Filters are joined with `&`.
const FILTER = String.raw`(?:system|elements)\.[A-Za-z0-9_]+(?:\[[a-z]+\])?(?:=[^&]*)?`;
const FILTER_EXPRESSIONS = new RegExp(`^${FILTER}(?:&${FILTER})*$`);

/** The parameter name of each filter, such as `elements.price[gt]`. */
function filterNames(expression: string): string[] {
	return expression.split('&').map((filter) => {
		const at = filter.indexOf('=');
		return at === -1 ? filter : filter.slice(0, at);
	});
}

/** Splits `in_filter` into the query parameters Kontent reads, one per filter. */
export function filterParams(expression: string): Record<string, string> {
	const params: Record<string, string> = {};
	for (const filter of expression.split('&')) {
		const at = filter.indexOf('=');
		if (at === -1) params[filter] = '';
		else params[filter.slice(0, at)] = filter.slice(at + 1);
	}
	return params;
}

const ItemsListInputSchema = ListInputBase.extend({
	depth: DEPTH_SCHEMA,
	type: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Only items of this content type codename, sent as `system.type`.',
		),
	language: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Read content in this language codename, such as `es-ES`. Items not translated into it fall back to another language; add `system.language=es-ES` to `in_filter` to drop them.',
		),
	collection: z
		.string()
		.min(1)
		.optional()
		.describe('Only this collection codename, sent as `system.collection`.'),
	in_filter: z
		.string()
		.regex(
			FILTER_EXPRESSIONS,
			'Use Kontent filters such as `elements.price[gt]=10`, joined with `&`',
		)
		// A query keeps one value per name, so a repeated filter would drop a
		// condition the caller asked for.
		.refine(
			(expression) =>
				new Set(filterNames(expression)).size ===
				filterNames(expression).length,
			'Each filter may appear once in `in_filter`; use an operator such as `[any]` or `[all]` for several values',
		)
		.optional()
		.describe(
			'Kontent filters, such as `elements.price[gt]=10` or `system.type[in]=article,coffee&elements.title[nempty]`. Each `&`-separated filter is sent as its own query parameter, and an item must match all of them.',
		),
	elements: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Return only these element codenames. Sent as one comma-separated `elements` value.',
		),
}).superRefine((input, ctx) => {
	// `type` and `collection` go out as `system.type` and `system.collection`,
	// so the same filter in `in_filter` would replace them.
	const names = input.in_filter ? filterNames(input.in_filter) : [];
	for (const [field, name] of [
		['type', 'system.type'],
		['collection', 'system.collection'],
	] as const) {
		if (input[field] !== undefined && names.includes(name)) {
			ctx.addIssue({
				code: 'custom',
				path: ['in_filter'],
				message: `\`${field}\` is already sent as \`${name}\`; drop one of them`,
			});
		}
	}
});

export type ItemsListInput = z.input<typeof ItemsListInputSchema>;

const ItemsListResponseSchema = z
	.object({
		items: z.array(KontentItemSchema),
		// unknown: linked items come back keyed by codename, each an item shape
		// this plugin does not restate because `depth` decides which arrive.
		modular_content: z.record(z.string(), z.unknown()).nullish(),
		pagination: PaginationSchema.nullish(),
		next_skip: z
			.number()
			.nullable()
			.describe('The `skip` for the next page; null on the last page.'),
	})
	.loose();

export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

const ItemGetInputSchema = z.object({
	codename: CodenameSchema,
	depth: DEPTH_SCHEMA,
	language: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Read the item in this language codename. An untranslated item falls back to another language; check `system.language` on the answer.',
		),
	elements: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Return only these element codenames. Sent as one comma-separated `elements` value.',
		),
	preview: PREVIEW_SCHEMA.optional(),
});

export type ItemGetInput = z.input<typeof ItemGetInputSchema>;

const ItemGetResponseSchema = z
	.object({
		item: KontentItemSchema,
		modular_content: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type ItemGetResponse = z.infer<typeof ItemGetResponseSchema>;

// ── types ─────────────────────────────────────────────────────────────────

const TypeSystemSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		codename: z.string().nullish(),
		last_modified: z.string().nullish(),
	})
	.loose();

// A type's `elements` is a map of codename to an element definition, which is
// what tells a caller how to read an item's `elements`.
const TypeElementSchema = z
	.object({
		type: z.string(),
		name: z.string().nullish(),
		taxonomy_group: z.string().nullish(),
		// Only a `multiple_choice` element has options.
		options: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						codename: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const KontentTypeSchema = z
	.object({
		system: TypeSystemSchema,
		elements: z.record(z.string(), TypeElementSchema).nullish(),
	})
	.loose();

export type KontentType = z.infer<typeof KontentTypeSchema>;

const TypesListInputSchema = ListInputBase;

export type TypesListInput = z.input<typeof TypesListInputSchema>;

const TypesListResponseSchema = z
	.object({
		types: z.array(KontentTypeSchema),
		pagination: PaginationSchema.nullish(),
		next_skip: z.number().nullable(),
	})
	.loose();

export type TypesListResponse = z.infer<typeof TypesListResponseSchema>;

const TypeGetInputSchema = z.object({
	codename: CodenameSchema,
	preview: PREVIEW_SCHEMA.optional(),
});

export type TypeGetInput = z.input<typeof TypeGetInputSchema>;

// Kontent answers the type itself, with `system` at the root; the handler wraps
// it as `{ type }`, the way `items.get` answers `{ item }`.
const TypeGetResponseSchema = z.object({ type: KontentTypeSchema }).loose();

export type TypeGetResponse = z.infer<typeof TypeGetResponseSchema>;

// ── taxonomies ────────────────────────────────────────────────────────────

// A taxonomy term nests its children, so the schema refers to itself. Zod 4
// needs the type declared first and the getter kept lazy, or the recursive
// reference is evaluated before `TaxonomyTermSchema` exists.
export type KontentTaxonomyTerm = {
	name?: string | null;
	codename?: string | null;
	terms?: KontentTaxonomyTerm[] | null;
};

const TaxonomyTermSchema: z.ZodType<KontentTaxonomyTerm> = z.lazy(() =>
	z
		.object({
			name: z.string().nullish(),
			codename: z.string().nullish(),
			terms: z.array(TaxonomyTermSchema).nullish(),
		})
		.loose(),
);

export const KontentTaxonomySchema = z
	.object({
		system: z
			.object({
				id: z.string(),
				name: z.string().nullish(),
				codename: z.string().nullish(),
				last_modified: z.string().nullish(),
			})
			.loose(),
		terms: z.array(TaxonomyTermSchema).nullish(),
	})
	.loose();

export type KontentTaxonomy = z.infer<typeof KontentTaxonomySchema>;

const TaxonomiesListInputSchema = ListInputBase;

export type TaxonomiesListInput = z.input<typeof TaxonomiesListInputSchema>;

const TaxonomiesListResponseSchema = z
	.object({
		taxonomies: z.array(KontentTaxonomySchema),
		pagination: PaginationSchema.nullish(),
		next_skip: z.number().nullable(),
	})
	.loose();

export type TaxonomiesListResponse = z.infer<
	typeof TaxonomiesListResponseSchema
>;

// ── languages ─────────────────────────────────────────────────────────────

export const KontentLanguageSchema = z
	.object({
		system: z
			.object({
				id: z.string(),
				name: z.string().nullish(),
				codename: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

export type KontentLanguage = z.infer<typeof KontentLanguageSchema>;

const LanguagesListInputSchema = ListInputBase;

export type LanguagesListInput = z.input<typeof LanguagesListInputSchema>;

const LanguagesListResponseSchema = z
	.object({
		languages: z.array(KontentLanguageSchema),
		pagination: PaginationSchema.nullish(),
		next_skip: z.number().nullable(),
	})
	.loose();

export type LanguagesListResponse = z.infer<typeof LanguagesListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KontentEndpointInputs = {
	itemsList: ItemsListInput;
	itemsGet: ItemGetInput;
	typesList: TypesListInput;
	typesGet: TypeGetInput;
	taxonomiesList: TaxonomiesListInput;
	languagesList: LanguagesListInput;
};

export type KontentEndpointOutputs = {
	itemsList: ItemsListResponse;
	itemsGet: ItemGetResponse;
	typesList: TypesListResponse;
	typesGet: TypeGetResponse;
	taxonomiesList: TaxonomiesListResponse;
	languagesList: LanguagesListResponse;
};

export const KontentEndpointInputSchemas = {
	itemsList: ItemsListInputSchema,
	itemsGet: ItemGetInputSchema,
	typesList: TypesListInputSchema,
	typesGet: TypeGetInputSchema,
	taxonomiesList: TaxonomiesListInputSchema,
	languagesList: LanguagesListInputSchema,
} as const;

export const KontentEndpointOutputSchemas = {
	itemsList: ItemsListResponseSchema,
	itemsGet: ItemGetResponseSchema,
	typesList: TypesListResponseSchema,
	typesGet: TypeGetResponseSchema,
	taxonomiesList: TaxonomiesListResponseSchema,
	languagesList: LanguagesListResponseSchema,
} as const;
