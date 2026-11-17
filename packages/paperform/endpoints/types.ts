import { z } from 'zod';

// ── Inputs ──────────────────────────────────────────────────────────────────

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const IdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9]+$/),
});
export type IdInput = z.infer<typeof IdInputSchema>;

const FormRef = z
	.string()
	.min(1)
	.describe('Form slug, custom slug or id (from forms.list).');

/** Paging and date filters Paperform takes on every list. */
export const PageShape = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page. Paperform defaults to 20.'),
	skip: z.number().int().min(0).optional().describe('Results to skip.'),
	afterId: z.string().min(1).optional().describe('Only results after this id.'),
	beforeId: z
		.string()
		.min(1)
		.optional()
		.describe('Only results before this id.'),
	afterDate: z
		.string()
		.min(1)
		.optional()
		.describe('Only results created after this date (YYYY-MM-DD or ISO).'),
	beforeDate: z
		.string()
		.min(1)
		.optional()
		.describe('Only results created before this date (YYYY-MM-DD or ISO).'),
	sort: z.enum(['ASC', 'DESC']).optional().describe('Order by creation date.'),
};
export const PageInputSchema = z.object(PageShape);
export type PageInput = z.infer<typeof PageInputSchema>;

export const SearchPageInputSchema = z.object({
	search: z.string().min(1).optional().describe('Text to search for.'),
	...PageShape,
});
export type SearchPageInput = z.infer<typeof SearchPageInputSchema>;

export const SpaceFormsInputSchema = IdInputSchema;

export const FormInputSchema = z.object({ form: FormRef });
export type FormInput = z.infer<typeof FormInputSchema>;

export const FormSearchInputSchema = z.object({
	form: FormRef,
	search: z.string().min(1).optional().describe('Text to search for.'),
});
export type FormSearchInput = z.infer<typeof FormSearchInputSchema>;

export const FormPageInputSchema = z.object({ form: FormRef, ...PageShape });
export type FormPageInput = z.infer<typeof FormPageInputSchema>;

export const SubmissionInputSchema = z.object({
	form: FormRef,
	id: z.string().min(1).describe('Submission id.'),
});
export type SubmissionInput = z.infer<typeof SubmissionInputSchema>;

export const ProductInputSchema = z.object({
	form: FormRef,
	sku: z.string().min(1).describe('Product SKU.'),
});
export type ProductInput = z.infer<typeof ProductInputSchema>;

export const ProductUpdateInputSchema = ProductInputSchema.extend({
	name: z.string().min(1).optional(),
	price: z.number().min(0).optional(),
	quantity: z
		.number()
		.int()
		.min(0)
		.nullable()
		.optional()
		.describe('Stock left. null removes the limit.'),
	minimum: z.number().int().min(0).nullable().optional(),
	maximum: z.number().int().min(0).nullable().optional(),
	discountable: z.boolean().optional(),
});
export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

export const CouponInputSchema = z.object({
	form: FormRef,
	code: z.string().min(1).describe('Coupon code.'),
});
export type CouponInput = z.infer<typeof CouponInputSchema>;

const CouponFields = {
	enabled: z.boolean().optional(),
	target: z
		.enum(['price', 'subscription'])
		.optional()
		.describe('What the discount applies to.'),
	discountAmount: z.number().min(0).optional(),
	discountPercentage: z.number().min(0).max(100).optional(),
	expiresAt: z
		.string()
		.min(1)
		.nullable()
		.optional()
		.describe('ISO date-time the coupon stops working. null never expires.'),
};

export const CouponCreateInputSchema = CouponInputSchema.extend(CouponFields);
export type CouponCreateInput = z.infer<typeof CouponCreateInputSchema>;

export const CouponUpdateInputSchema = CouponInputSchema.extend(CouponFields);
export type CouponUpdateInput = z.infer<typeof CouponUpdateInputSchema>;

export const WebhookCreateInputSchema = z.object({
	form: FormRef,
	targetUrl: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Use an https URL')
		.describe('HTTPS URL Paperform posts each submission to.'),
	triggers: z
		.array(z.enum(['submission', 'partial_submission']))
		.min(1)
		.describe('Events that fire the webhook.'),
});
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;

export const WebhookIdInputSchema = z.object({
	id: z.string().min(1).describe('Webhook id.'),
});
export type WebhookIdInput = z.infer<typeof WebhookIdInputSchema>;

export const FileSignInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe('File URL from a submission answer (a paperform.co file link).'),
});
export type FileSignInput = z.infer<typeof FileSignInputSchema>;

// ── Outputs ─────────────────────────────────────────────────────────────────
// Paperform returns more fields than these and adds new ones over time, so the
// objects are loose: known fields are typed, the rest pass through.

const Str = z.string().nullable().optional();
// Paperform sends ids as strings, but space and some other ids as numbers.
const IdOut = z.string();

export const PageInfoSchema = z.object({
	total: z.number().optional(),
	hasMore: z.boolean().optional(),
	limit: z.number().optional(),
	skip: z.number().optional(),
});

export const FormSchema = z
	.object({
		id: IdOut,
		slug: Str,
		custom_slug: Str,
		space_id: z.string().optional(),
		title: Str,
		description: Str,
		url: Str,
		live: z.boolean().optional(),
		submission_count: z.number().optional(),
		created_at_utc: Str,
		updated_at_utc: Str,
	})
	.loose();

export const SpaceSchema = z
	.object({
		id: IdOut,
		name: Str,
		created_at_utc: Str,
		updated_at_utc: Str,
	})
	.loose();

export const TranslationSchema = z
	.object({ id: IdOut, title: Str, language: Str })
	.loose();

export const FieldSchema = z
	.object({
		key: z.string(),
		title: Str,
		type: Str,
		required: z.boolean().nullable().optional(),
		custom_key: Str,
	})
	.loose();

export const SubmissionSchema = z
	.object({
		id: IdOut,
		form_id: Str,
		// Answers keyed by field key; each field type has its own value shape.
		data: z.record(z.string(), z.unknown()).optional(),
		// Device, charge and pdf objects vary by form; passed through as sent.
		device: z.unknown().optional(),
		charge: z.unknown().optional(),
		pdfs: z.unknown().optional(),
		created_at_utc: Str,
	})
	.loose();

export const PartialSubmissionSchema = z
	.object({
		id: IdOut,
		form_id: Str,
		// Answers so far, keyed by field key.
		data: z.record(z.string(), z.unknown()).optional(),
		last_answered: Str,
		submitted_at_utc: Str,
		created_at_utc: Str,
		updated_at_utc: Str,
	})
	.loose();

// The live API sends price as a string ("10") although its spec says number.
const NumLike = z.union([z.number(), z.string()]).nullable().optional();

export const ProductSchema = z
	.object({
		SKU: Str,
		name: Str,
		price: NumLike,
		quantity: NumLike,
		minimum: NumLike,
		maximum: NumLike,
		discountable: z.boolean().nullable().optional(),
		sold: NumLike,
	})
	.loose();

export const CouponSchema = z
	.object({
		code: z.string(),
		enabled: z.boolean().optional(),
		target: Str,
		discountAmount: z.number().nullable().optional(),
		discountPercentage: z.number().nullable().optional(),
		expiresAt: Str,
	})
	.loose();

export const WebhookSchema = z
	.object({
		id: IdOut,
		target_url: Str,
		triggers: z.array(z.string()).optional(),
		created_at_utc: Str,
	})
	.loose();

export const FormListResponseSchema = z.object({
	forms: z.array(FormSchema),
	page: PageInfoSchema,
});
export type FormListResponse = z.infer<typeof FormListResponseSchema>;

export const FormResponseSchema = z.object({ form: FormSchema });
export type FormResponse = z.infer<typeof FormResponseSchema>;

export const SpaceListResponseSchema = z.object({
	spaces: z.array(SpaceSchema),
	page: PageInfoSchema,
});
export type SpaceListResponse = z.infer<typeof SpaceListResponseSchema>;

export const SpaceResponseSchema = z.object({ space: SpaceSchema });
export type SpaceResponse = z.infer<typeof SpaceResponseSchema>;

export const TranslationListResponseSchema = z.object({
	translations: z.array(TranslationSchema),
	page: PageInfoSchema,
});
export type TranslationListResponse = z.infer<
	typeof TranslationListResponseSchema
>;

export const FieldListResponseSchema = z.object({
	fields: z.array(FieldSchema),
});
export type FieldListResponse = z.infer<typeof FieldListResponseSchema>;

export const SubmissionListResponseSchema = z.object({
	submissions: z.array(SubmissionSchema),
	page: PageInfoSchema,
});
export type SubmissionListResponse = z.infer<
	typeof SubmissionListResponseSchema
>;

export const SubmissionResponseSchema = z.object({
	submission: SubmissionSchema,
});
export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>;

export const PartialSubmissionListResponseSchema = z.object({
	partialSubmissions: z.array(PartialSubmissionSchema),
	page: PageInfoSchema,
});
export type PartialSubmissionListResponse = z.infer<
	typeof PartialSubmissionListResponseSchema
>;

export const PartialSubmissionResponseSchema = z.object({
	partialSubmission: PartialSubmissionSchema,
});
export type PartialSubmissionResponse = z.infer<
	typeof PartialSubmissionResponseSchema
>;

export const ProductListResponseSchema = z.object({
	products: z.array(ProductSchema),
});
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;

export const ProductResponseSchema = z.object({ product: ProductSchema });
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

export const CouponListResponseSchema = z.object({
	coupons: z.array(CouponSchema),
});
export type CouponListResponse = z.infer<typeof CouponListResponseSchema>;

export const CouponResponseSchema = z.object({ coupon: CouponSchema });
export type CouponResponse = z.infer<typeof CouponResponseSchema>;

export const WebhookListResponseSchema = z.object({
	webhooks: z.array(WebhookSchema),
	page: PageInfoSchema,
});
export type WebhookListResponse = z.infer<typeof WebhookListResponseSchema>;

export const WebhookResponseSchema = z.object({ webhook: WebhookSchema });
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

export const DeletedResponseSchema = z.object({ deleted: z.literal(true) });
export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

export const FileSignResponseSchema = z.object({
	fileUrl: z.string(),
	storageUrl: z.string().optional(),
	expiresAt: z.string().nullable().optional(),
});
export type FileSignResponse = z.infer<typeof FileSignResponseSchema>;

export const EndpointInputSchemas = {
	'forms.list': SearchPageInputSchema,
	'forms.get': FormInputSchema,
	'fields.list': FormSearchInputSchema,
	'submissions.list': FormPageInputSchema,
	'submissions.get': SubmissionInputSchema,
	'submissions.delete': SubmissionInputSchema,
	'partialSubmissions.list': FormPageInputSchema,
	'partialSubmissions.get': SubmissionInputSchema,
	'products.list': FormSearchInputSchema,
	'products.get': ProductInputSchema,
	'products.update': ProductUpdateInputSchema,
	'coupons.list': FormInputSchema,
	'coupons.get': CouponInputSchema,
	'coupons.create': CouponCreateInputSchema,
	'coupons.update': CouponUpdateInputSchema,
	'coupons.delete': CouponInputSchema,
	'webhooks.list': FormPageInputSchema,
	'webhooks.create': WebhookCreateInputSchema,
	'webhooks.delete': WebhookIdInputSchema,
	'files.sign': FileSignInputSchema,
	'spaces.list': SearchPageInputSchema,
	'spaces.get': IdInputSchema,
	'spaces.forms': SpaceFormsInputSchema,
	'translations.list': PageInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'forms.list': FormListResponseSchema,
	'forms.get': FormResponseSchema,
	'fields.list': FieldListResponseSchema,
	'submissions.list': SubmissionListResponseSchema,
	'submissions.get': SubmissionResponseSchema,
	'submissions.delete': DeletedResponseSchema,
	'partialSubmissions.list': PartialSubmissionListResponseSchema,
	'partialSubmissions.get': PartialSubmissionResponseSchema,
	'products.list': ProductListResponseSchema,
	'products.get': ProductResponseSchema,
	'products.update': ProductResponseSchema,
	'coupons.list': CouponListResponseSchema,
	'coupons.get': CouponResponseSchema,
	'coupons.create': CouponResponseSchema,
	'coupons.update': CouponResponseSchema,
	'coupons.delete': DeletedResponseSchema,
	'webhooks.list': WebhookListResponseSchema,
	'webhooks.create': WebhookResponseSchema,
	'webhooks.delete': DeletedResponseSchema,
	'files.sign': FileSignResponseSchema,
	'spaces.list': SpaceListResponseSchema,
	'spaces.get': SpaceResponseSchema,
	'spaces.forms': FormListResponseSchema,
	'translations.list': TranslationListResponseSchema,
} as const;
