import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { PaperformContext } from './context';
import {
	createCoupon,
	createWebhook,
	deleteCoupon,
	deleteSubmission,
	deleteWebhook,
	getCoupon,
	getForm,
	getPartialSubmission,
	getProduct,
	getSpace,
	getSubmission,
	listCoupons,
	listFields,
	listForms,
	listPartialSubmissions,
	listProducts,
	listSpaceForms,
	listSpaces,
	listSubmissions,
	listTranslations,
	listWebhooks,
	signFile,
	updateCoupon,
	updateProduct,
} from './endpoints';
import {
	CouponCreateInputSchema,
	CouponInputSchema,
	CouponListResponseSchema,
	CouponResponseSchema,
	CouponUpdateInputSchema,
	DeletedResponseSchema,
	FieldListResponseSchema,
	FileSignInputSchema,
	FileSignResponseSchema,
	FormInputSchema,
	FormListResponseSchema,
	FormPageInputSchema,
	FormResponseSchema,
	FormSearchInputSchema,
	IdInputSchema,
	PageInputSchema,
	PartialSubmissionListResponseSchema,
	PartialSubmissionResponseSchema,
	ProductInputSchema,
	ProductListResponseSchema,
	ProductResponseSchema,
	ProductUpdateInputSchema,
	SearchPageInputSchema,
	SpaceListResponseSchema,
	SpaceResponseSchema,
	SubmissionInputSchema,
	SubmissionListResponseSchema,
	SubmissionResponseSchema,
	TranslationListResponseSchema,
	WebhookCreateInputSchema,
	WebhookIdInputSchema,
	WebhookListResponseSchema,
	WebhookResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PaperformSchema } from './schema';

export type { PaperformContext };

export type PaperformPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPaperformPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof paperformEndpointsNested>;
};

export type PaperformKeyBuilderContext =
	KeyBuilderContext<PaperformPluginOptions>;

const paperformEndpointsNested = {
	forms: { list: listForms, get: getForm },
	fields: { list: listFields },
	submissions: {
		list: listSubmissions,
		get: getSubmission,
		delete: deleteSubmission,
	},
	partialSubmissions: {
		list: listPartialSubmissions,
		get: getPartialSubmission,
	},
	products: { list: listProducts, get: getProduct, update: updateProduct },
	coupons: {
		list: listCoupons,
		get: getCoupon,
		create: createCoupon,
		update: updateCoupon,
		delete: deleteCoupon,
	},
	webhooks: {
		list: listWebhooks,
		create: createWebhook,
		delete: deleteWebhook,
	},
	files: { sign: signFile },
	spaces: { list: listSpaces, get: getSpace, forms: listSpaceForms },
	translations: { list: listTranslations },
} as const;

const paperformWebhooksNested = {} as const;

export const paperformEndpointSchemas = {
	'forms.list': {
		input: SearchPageInputSchema,
		output: FormListResponseSchema,
	},
	'forms.get': { input: FormInputSchema, output: FormResponseSchema },
	'fields.list': {
		input: FormSearchInputSchema,
		output: FieldListResponseSchema,
	},
	'submissions.list': {
		input: FormPageInputSchema,
		output: SubmissionListResponseSchema,
	},
	'submissions.get': {
		input: SubmissionInputSchema,
		output: SubmissionResponseSchema,
	},
	'submissions.delete': {
		input: SubmissionInputSchema,
		output: DeletedResponseSchema,
	},
	'partialSubmissions.list': {
		input: FormPageInputSchema,
		output: PartialSubmissionListResponseSchema,
	},
	'partialSubmissions.get': {
		input: SubmissionInputSchema,
		output: PartialSubmissionResponseSchema,
	},
	'products.list': {
		input: FormSearchInputSchema,
		output: ProductListResponseSchema,
	},
	'products.get': { input: ProductInputSchema, output: ProductResponseSchema },
	'products.update': {
		input: ProductUpdateInputSchema,
		output: ProductResponseSchema,
	},
	'coupons.list': { input: FormInputSchema, output: CouponListResponseSchema },
	'coupons.get': { input: CouponInputSchema, output: CouponResponseSchema },
	'coupons.create': {
		input: CouponCreateInputSchema,
		output: CouponResponseSchema,
	},
	'coupons.update': {
		input: CouponUpdateInputSchema,
		output: CouponResponseSchema,
	},
	'coupons.delete': { input: CouponInputSchema, output: DeletedResponseSchema },
	'webhooks.list': {
		input: FormPageInputSchema,
		output: WebhookListResponseSchema,
	},
	'webhooks.create': {
		input: WebhookCreateInputSchema,
		output: WebhookResponseSchema,
	},
	'webhooks.delete': {
		input: WebhookIdInputSchema,
		output: DeletedResponseSchema,
	},
	'files.sign': { input: FileSignInputSchema, output: FileSignResponseSchema },
	'spaces.list': {
		input: SearchPageInputSchema,
		output: SpaceListResponseSchema,
	},
	'spaces.get': { input: IdInputSchema, output: SpaceResponseSchema },
	'spaces.forms': { input: IdInputSchema, output: FormListResponseSchema },
	'translations.list': {
		input: PageInputSchema,
		output: TranslationListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof paperformEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const write = (description: string) =>
	({ riskLevel: 'write', description }) as const;
const destructive = (description: string) =>
	({ riskLevel: 'destructive', description }) as const;

const paperformEndpointMeta = {
	'forms.list': read(
		'List forms, newest first by default. Filter with search, page with limit and skip.',
	),
	'forms.get': read('Get one form by slug, custom slug or id.'),
	'fields.list': read(
		'List the questions on a form: each field key, title and type. Submission answers are keyed by these field keys.',
	),
	'submissions.list': read(
		'List the completed submissions of a form, with their answers keyed by field key. Filter by date or id, page with limit and skip.',
	),
	'submissions.get': read('Get one submission of a form, with its answers.'),
	'submissions.delete': destructive(
		'Delete one submission. It cannot be recovered.',
	),
	'partialSubmissions.list': read(
		'List partial (unfinished) submissions of a form. Paperform keeps them only when partial submissions are turned on for the form.',
	),
	'partialSubmissions.get': read('Get one partial submission of a form.'),
	'products.list': read(
		'List the products sold on a form, with price and stock.',
	),
	'products.get': read('Get one product on a form by SKU.'),
	'products.update': write(
		'Change a product on a form (name, price, stock, min/max per order). Fields you leave out stay as they are.',
	),
	'coupons.list': read('List the coupon codes on a form.'),
	'coupons.get': read('Get one coupon on a form by code.'),
	'coupons.create': write(
		'Create a coupon code on a form, with a fixed amount or percentage off.',
	),
	'coupons.update': write(
		'Change a coupon (enable or disable, discount, expiry). Fields you leave out stay as they are.',
	),
	'coupons.delete': destructive('Delete a coupon code from a form.'),
	'webhooks.list': read("List a form's webhooks."),
	'webhooks.create': write(
		'Add a webhook that posts each new submission (and optionally partial submission) of a form to an https URL.',
	),
	'webhooks.delete': destructive('Delete a webhook by id.'),
	'files.sign': read(
		'Get a signed download link for a file uploaded in a submission. Links last 7 days.',
	),
	'spaces.list': read('List spaces (folders of forms).'),
	'spaces.get': read('Get one space by id.'),
	'spaces.forms': read('List the forms in one space.'),
	'translations.list': read(
		'List form translations (title and language). The mapping text is not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof paperformEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const paperformAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BasePaperformPlugin<T extends PaperformPluginOptions> =
	CorsairPlugin<
		'paperform',
		typeof PaperformSchema,
		typeof paperformEndpointsNested,
		typeof paperformWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPaperformPlugin =
	BasePaperformPlugin<PaperformPluginOptions>;
export type ExternalPaperformPlugin<T extends PaperformPluginOptions> =
	BasePaperformPlugin<T>;

export function paperform<const T extends PaperformPluginOptions>(
	incomingOptions: PaperformPluginOptions & T = {} as PaperformPluginOptions &
		T,
): ExternalPaperformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'paperform',
		authConfig: paperformAuthConfig,
		schema: PaperformSchema,
		options,
		hooks: options.hooks,
		endpoints: paperformEndpointsNested,
		webhooks: paperformWebhooksNested,
		endpointMeta: paperformEndpointMeta,
		endpointSchemas: paperformEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: PaperformKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('paperform', 'api_key');
				return key;
			}
			// No stored key and no key manager: ask for a connection instead of
			// sending an unauthenticated request.
			if (source === 'endpoint')
				throw new AuthMissingError('paperform', 'api_key');
			return '';
		},
	} satisfies InternalPaperformPlugin;
}
