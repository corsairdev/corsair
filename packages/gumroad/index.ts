import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	CustomFields,
	Earnings,
	Emails,
	Files,
	Licenses,
	Media,
	OfferCodes,
	Payouts,
	Products,
	Public,
	ResourceSubscriptions,
	Sales,
	Subscribers,
	TaxForms,
	User,
	VariantCategories,
	Workflows,
} from './endpoints';
import type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
} from './endpoints/types';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GumroadSchema } from './schema';

export type GumroadPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGumroadPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gumroadEndpointsNested>;
};

export type GumroadContext = CorsairPluginContext<
	typeof GumroadSchema,
	GumroadPluginOptions
>;

export type GumroadKeyBuilderContext = KeyBuilderContext<GumroadPluginOptions>;

export type GumroadBoundEndpoints = BindEndpoints<
	typeof gumroadEndpointsNested
>;

type GumroadEndpoint<K extends keyof GumroadEndpointOutputs> = CorsairEndpoint<
	GumroadContext,
	GumroadEndpointInputs[K],
	GumroadEndpointOutputs[K]
>;

export type GumroadEndpoints = {
	productsList: GumroadEndpoint<'productsList'>;
	productsGet: GumroadEndpoint<'productsGet'>;
	productsCreate: GumroadEndpoint<'productsCreate'>;
	productsUpdate: GumroadEndpoint<'productsUpdate'>;
	productsDelete: GumroadEndpoint<'productsDelete'>;
	productsEnable: GumroadEndpoint<'productsEnable'>;
	productsDisable: GumroadEndpoint<'productsDisable'>;
	productsReviewsList: GumroadEndpoint<'productsReviewsList'>;
	productsCategoriesList: GumroadEndpoint<'productsCategoriesList'>;
	productsCoversAdd: GumroadEndpoint<'productsCoversAdd'>;
	productsCoversDelete: GumroadEndpoint<'productsCoversDelete'>;
	productsThumbnailSet: GumroadEndpoint<'productsThumbnailSet'>;
	productsThumbnailDelete: GumroadEndpoint<'productsThumbnailDelete'>;
	offerCodesList: GumroadEndpoint<'offerCodesList'>;
	offerCodesGet: GumroadEndpoint<'offerCodesGet'>;
	offerCodesUpdate: GumroadEndpoint<'offerCodesUpdate'>;
	offerCodesListForProduct: GumroadEndpoint<'offerCodesListForProduct'>;
	offerCodesGetForProduct: GumroadEndpoint<'offerCodesGetForProduct'>;
	offerCodesCreateForProduct: GumroadEndpoint<'offerCodesCreateForProduct'>;
	offerCodesUpdateForProduct: GumroadEndpoint<'offerCodesUpdateForProduct'>;
	offerCodesDeleteForProduct: GumroadEndpoint<'offerCodesDeleteForProduct'>;
	variantCategoriesList: GumroadEndpoint<'variantCategoriesList'>;
	variantCategoriesCreate: GumroadEndpoint<'variantCategoriesCreate'>;
	variantCategoriesGet: GumroadEndpoint<'variantCategoriesGet'>;
	variantCategoriesUpdate: GumroadEndpoint<'variantCategoriesUpdate'>;
	variantCategoriesDelete: GumroadEndpoint<'variantCategoriesDelete'>;
	variantCategoriesVariantsList: GumroadEndpoint<'variantCategoriesVariantsList'>;
	variantCategoriesVariantsCreate: GumroadEndpoint<'variantCategoriesVariantsCreate'>;
	variantCategoriesVariantsGet: GumroadEndpoint<'variantCategoriesVariantsGet'>;
	variantCategoriesVariantsUpdate: GumroadEndpoint<'variantCategoriesVariantsUpdate'>;
	variantCategoriesVariantsDelete: GumroadEndpoint<'variantCategoriesVariantsDelete'>;
	customFieldsList: GumroadEndpoint<'customFieldsList'>;
	customFieldsCreate: GumroadEndpoint<'customFieldsCreate'>;
	customFieldsUpdate: GumroadEndpoint<'customFieldsUpdate'>;
	customFieldsDelete: GumroadEndpoint<'customFieldsDelete'>;
	userGet: GumroadEndpoint<'userGet'>;
	userCustomHtmlGet: GumroadEndpoint<'userCustomHtmlGet'>;
	userCustomHtmlUpdate: GumroadEndpoint<'userCustomHtmlUpdate'>;
	userCustomHtmlPreview: GumroadEndpoint<'userCustomHtmlPreview'>;
	userRefundPolicyGet: GumroadEndpoint<'userRefundPolicyGet'>;
	userRefundPolicyUpdate: GumroadEndpoint<'userRefundPolicyUpdate'>;
	publicProduct: GumroadEndpoint<'publicProduct'>;
	publicProfile: GumroadEndpoint<'publicProfile'>;
	mediaList: GumroadEndpoint<'mediaList'>;
	mediaCreate: GumroadEndpoint<'mediaCreate'>;
	mediaDelete: GumroadEndpoint<'mediaDelete'>;
	filesPresign: GumroadEndpoint<'filesPresign'>;
	filesComplete: GumroadEndpoint<'filesComplete'>;
	filesAbort: GumroadEndpoint<'filesAbort'>;
	emailsList: GumroadEndpoint<'emailsList'>;
	emailsGet: GumroadEndpoint<'emailsGet'>;
	emailsCreate: GumroadEndpoint<'emailsCreate'>;
	emailsPreview: GumroadEndpoint<'emailsPreview'>;
	emailsSend: GumroadEndpoint<'emailsSend'>;
	emailsSchedule: GumroadEndpoint<'emailsSchedule'>;
	emailsUnschedule: GumroadEndpoint<'emailsUnschedule'>;
	emailsDelete: GumroadEndpoint<'emailsDelete'>;
	workflowsList: GumroadEndpoint<'workflowsList'>;
	workflowsGet: GumroadEndpoint<'workflowsGet'>;
	workflowsEmailsAdd: GumroadEndpoint<'workflowsEmailsAdd'>;
	workflowsEmailsUpdate: GumroadEndpoint<'workflowsEmailsUpdate'>;
	resourceSubscriptionsSubscribe: GumroadEndpoint<'resourceSubscriptionsSubscribe'>;
	resourceSubscriptionsList: GumroadEndpoint<'resourceSubscriptionsList'>;
	resourceSubscriptionsTestEvent: GumroadEndpoint<'resourceSubscriptionsTestEvent'>;
	resourceSubscriptionsUnsubscribe: GumroadEndpoint<'resourceSubscriptionsUnsubscribe'>;
	salesList: GumroadEndpoint<'salesList'>;
	salesGet: GumroadEndpoint<'salesGet'>;
	salesMarkAsShipped: GumroadEndpoint<'salesMarkAsShipped'>;
	salesRefund: GumroadEndpoint<'salesRefund'>;
	salesRevokeAccess: GumroadEndpoint<'salesRevokeAccess'>;
	salesUndoRevokeAccess: GumroadEndpoint<'salesUndoRevokeAccess'>;
	salesResendReceipt: GumroadEndpoint<'salesResendReceipt'>;
	subscribersList: GumroadEndpoint<'subscribersList'>;
	subscribersGet: GumroadEndpoint<'subscribersGet'>;
	licensesVerify: GumroadEndpoint<'licensesVerify'>;
	licensesEnable: GumroadEndpoint<'licensesEnable'>;
	licensesDisable: GumroadEndpoint<'licensesDisable'>;
	licensesDecrementUsesCount: GumroadEndpoint<'licensesDecrementUsesCount'>;
	licensesRotate: GumroadEndpoint<'licensesRotate'>;
	payoutsList: GumroadEndpoint<'payoutsList'>;
	payoutsGet: GumroadEndpoint<'payoutsGet'>;
	payoutsUpcoming: GumroadEndpoint<'payoutsUpcoming'>;
	taxFormsList: GumroadEndpoint<'taxFormsList'>;
	taxFormsDownload: GumroadEndpoint<'taxFormsDownload'>;
	earningsGet: GumroadEndpoint<'earningsGet'>;
};

const gumroadEndpointsNested = {
	products: {
		list: Products.list,
		get: Products.get,
		create: Products.create,
		update: Products.update,
		delete: Products.remove,
		enable: Products.enable,
		disable: Products.disable,
		reviewsList: Products.reviewsList,
		categoriesList: Products.categoriesList,
		coversAdd: Products.coversAdd,
		coversDelete: Products.coversDelete,
		thumbnailSet: Products.thumbnailSet,
		thumbnailDelete: Products.thumbnailDelete,
	},
	offerCodes: {
		list: OfferCodes.list,
		get: OfferCodes.get,
		update: OfferCodes.update,
		listForProduct: OfferCodes.listForProduct,
		getForProduct: OfferCodes.getForProduct,
		createForProduct: OfferCodes.createForProduct,
		updateForProduct: OfferCodes.updateForProduct,
		deleteForProduct: OfferCodes.deleteForProduct,
	},
	variantCategories: {
		list: VariantCategories.list,
		create: VariantCategories.create,
		get: VariantCategories.get,
		update: VariantCategories.update,
		delete: VariantCategories.remove,
		variantsList: VariantCategories.variantsList,
		variantsCreate: VariantCategories.variantsCreate,
		variantsGet: VariantCategories.variantsGet,
		variantsUpdate: VariantCategories.variantsUpdate,
		variantsDelete: VariantCategories.variantsDelete,
	},
	customFields: {
		list: CustomFields.list,
		create: CustomFields.create,
		update: CustomFields.update,
		delete: CustomFields.remove,
	},
	user: {
		get: User.get,
		customHtmlGet: User.customHtmlGet,
		customHtmlUpdate: User.customHtmlUpdate,
		customHtmlPreview: User.customHtmlPreview,
		refundPolicyGet: User.refundPolicyGet,
		refundPolicyUpdate: User.refundPolicyUpdate,
	},
	public: {
		product: Public.product,
		profile: Public.profile,
	},
	media: {
		list: Media.list,
		create: Media.create,
		delete: Media.remove,
	},
	files: {
		presign: Files.presign,
		complete: Files.complete,
		abort: Files.abort,
	},
	emails: {
		list: Emails.list,
		get: Emails.get,
		create: Emails.create,
		preview: Emails.preview,
		send: Emails.send,
		schedule: Emails.schedule,
		unschedule: Emails.unschedule,
		delete: Emails.remove,
	},
	workflows: {
		list: Workflows.list,
		get: Workflows.get,
		emailsAdd: Workflows.emailsAdd,
		emailsUpdate: Workflows.emailsUpdate,
	},
	resourceSubscriptions: {
		subscribe: ResourceSubscriptions.subscribe,
		list: ResourceSubscriptions.list,
		testEvent: ResourceSubscriptions.testEvent,
		unsubscribe: ResourceSubscriptions.unsubscribe,
	},
	sales: {
		list: Sales.list,
		get: Sales.get,
		markAsShipped: Sales.markAsShipped,
		refund: Sales.refund,
		revokeAccess: Sales.revokeAccess,
		undoRevokeAccess: Sales.undoRevokeAccess,
		resendReceipt: Sales.resendReceipt,
	},
	subscribers: {
		list: Subscribers.list,
		get: Subscribers.get,
	},
	licenses: {
		verify: Licenses.verify,
		enable: Licenses.enable,
		disable: Licenses.disable,
		decrementUsesCount: Licenses.decrementUsesCount,
		rotate: Licenses.rotate,
	},
	payouts: {
		list: Payouts.list,
		get: Payouts.get,
		upcoming: Payouts.upcoming,
	},
	taxForms: {
		list: TaxForms.list,
		download: TaxForms.download,
	},
	earnings: {
		get: Earnings.get,
	},
} as const;

export const gumroadEndpointSchemas = {
	'products.list': {
		input: GumroadEndpointInputSchemas.productsList,
		output: GumroadEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: GumroadEndpointInputSchemas.productsGet,
		output: GumroadEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: GumroadEndpointInputSchemas.productsCreate,
		output: GumroadEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: GumroadEndpointInputSchemas.productsUpdate,
		output: GumroadEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: GumroadEndpointInputSchemas.productsDelete,
		output: GumroadEndpointOutputSchemas.productsDelete,
	},
	'products.enable': {
		input: GumroadEndpointInputSchemas.productsEnable,
		output: GumroadEndpointOutputSchemas.productsEnable,
	},
	'products.disable': {
		input: GumroadEndpointInputSchemas.productsDisable,
		output: GumroadEndpointOutputSchemas.productsDisable,
	},
	'products.reviewsList': {
		input: GumroadEndpointInputSchemas.productsReviewsList,
		output: GumroadEndpointOutputSchemas.productsReviewsList,
	},
	'products.categoriesList': {
		input: GumroadEndpointInputSchemas.productsCategoriesList,
		output: GumroadEndpointOutputSchemas.productsCategoriesList,
	},
	'products.coversAdd': {
		input: GumroadEndpointInputSchemas.productsCoversAdd,
		output: GumroadEndpointOutputSchemas.productsCoversAdd,
	},
	'products.coversDelete': {
		input: GumroadEndpointInputSchemas.productsCoversDelete,
		output: GumroadEndpointOutputSchemas.productsCoversDelete,
	},
	'products.thumbnailSet': {
		input: GumroadEndpointInputSchemas.productsThumbnailSet,
		output: GumroadEndpointOutputSchemas.productsThumbnailSet,
	},
	'products.thumbnailDelete': {
		input: GumroadEndpointInputSchemas.productsThumbnailDelete,
		output: GumroadEndpointOutputSchemas.productsThumbnailDelete,
	},
	'offerCodes.list': {
		input: GumroadEndpointInputSchemas.offerCodesList,
		output: GumroadEndpointOutputSchemas.offerCodesList,
	},
	'offerCodes.get': {
		input: GumroadEndpointInputSchemas.offerCodesGet,
		output: GumroadEndpointOutputSchemas.offerCodesGet,
	},
	'offerCodes.update': {
		input: GumroadEndpointInputSchemas.offerCodesUpdate,
		output: GumroadEndpointOutputSchemas.offerCodesUpdate,
	},
	'offerCodes.listForProduct': {
		input: GumroadEndpointInputSchemas.offerCodesListForProduct,
		output: GumroadEndpointOutputSchemas.offerCodesListForProduct,
	},
	'offerCodes.getForProduct': {
		input: GumroadEndpointInputSchemas.offerCodesGetForProduct,
		output: GumroadEndpointOutputSchemas.offerCodesGetForProduct,
	},
	'offerCodes.createForProduct': {
		input: GumroadEndpointInputSchemas.offerCodesCreateForProduct,
		output: GumroadEndpointOutputSchemas.offerCodesCreateForProduct,
	},
	'offerCodes.updateForProduct': {
		input: GumroadEndpointInputSchemas.offerCodesUpdateForProduct,
		output: GumroadEndpointOutputSchemas.offerCodesUpdateForProduct,
	},
	'offerCodes.deleteForProduct': {
		input: GumroadEndpointInputSchemas.offerCodesDeleteForProduct,
		output: GumroadEndpointOutputSchemas.offerCodesDeleteForProduct,
	},
	'variantCategories.list': {
		input: GumroadEndpointInputSchemas.variantCategoriesList,
		output: GumroadEndpointOutputSchemas.variantCategoriesList,
	},
	'variantCategories.create': {
		input: GumroadEndpointInputSchemas.variantCategoriesCreate,
		output: GumroadEndpointOutputSchemas.variantCategoriesCreate,
	},
	'variantCategories.get': {
		input: GumroadEndpointInputSchemas.variantCategoriesGet,
		output: GumroadEndpointOutputSchemas.variantCategoriesGet,
	},
	'variantCategories.update': {
		input: GumroadEndpointInputSchemas.variantCategoriesUpdate,
		output: GumroadEndpointOutputSchemas.variantCategoriesUpdate,
	},
	'variantCategories.delete': {
		input: GumroadEndpointInputSchemas.variantCategoriesDelete,
		output: GumroadEndpointOutputSchemas.variantCategoriesDelete,
	},
	'variantCategories.variantsList': {
		input: GumroadEndpointInputSchemas.variantCategoriesVariantsList,
		output: GumroadEndpointOutputSchemas.variantCategoriesVariantsList,
	},
	'variantCategories.variantsCreate': {
		input: GumroadEndpointInputSchemas.variantCategoriesVariantsCreate,
		output: GumroadEndpointOutputSchemas.variantCategoriesVariantsCreate,
	},
	'variantCategories.variantsGet': {
		input: GumroadEndpointInputSchemas.variantCategoriesVariantsGet,
		output: GumroadEndpointOutputSchemas.variantCategoriesVariantsGet,
	},
	'variantCategories.variantsUpdate': {
		input: GumroadEndpointInputSchemas.variantCategoriesVariantsUpdate,
		output: GumroadEndpointOutputSchemas.variantCategoriesVariantsUpdate,
	},
	'variantCategories.variantsDelete': {
		input: GumroadEndpointInputSchemas.variantCategoriesVariantsDelete,
		output: GumroadEndpointOutputSchemas.variantCategoriesVariantsDelete,
	},
	'customFields.list': {
		input: GumroadEndpointInputSchemas.customFieldsList,
		output: GumroadEndpointOutputSchemas.customFieldsList,
	},
	'customFields.create': {
		input: GumroadEndpointInputSchemas.customFieldsCreate,
		output: GumroadEndpointOutputSchemas.customFieldsCreate,
	},
	'customFields.update': {
		input: GumroadEndpointInputSchemas.customFieldsUpdate,
		output: GumroadEndpointOutputSchemas.customFieldsUpdate,
	},
	'customFields.delete': {
		input: GumroadEndpointInputSchemas.customFieldsDelete,
		output: GumroadEndpointOutputSchemas.customFieldsDelete,
	},
	'user.get': {
		input: GumroadEndpointInputSchemas.userGet,
		output: GumroadEndpointOutputSchemas.userGet,
	},
	'user.customHtmlGet': {
		input: GumroadEndpointInputSchemas.userCustomHtmlGet,
		output: GumroadEndpointOutputSchemas.userCustomHtmlGet,
	},
	'user.customHtmlUpdate': {
		input: GumroadEndpointInputSchemas.userCustomHtmlUpdate,
		output: GumroadEndpointOutputSchemas.userCustomHtmlUpdate,
	},
	'user.customHtmlPreview': {
		input: GumroadEndpointInputSchemas.userCustomHtmlPreview,
		output: GumroadEndpointOutputSchemas.userCustomHtmlPreview,
	},
	'user.refundPolicyGet': {
		input: GumroadEndpointInputSchemas.userRefundPolicyGet,
		output: GumroadEndpointOutputSchemas.userRefundPolicyGet,
	},
	'user.refundPolicyUpdate': {
		input: GumroadEndpointInputSchemas.userRefundPolicyUpdate,
		output: GumroadEndpointOutputSchemas.userRefundPolicyUpdate,
	},
	'public.product': {
		input: GumroadEndpointInputSchemas.publicProduct,
		output: GumroadEndpointOutputSchemas.publicProduct,
	},
	'public.profile': {
		input: GumroadEndpointInputSchemas.publicProfile,
		output: GumroadEndpointOutputSchemas.publicProfile,
	},
	'media.list': {
		input: GumroadEndpointInputSchemas.mediaList,
		output: GumroadEndpointOutputSchemas.mediaList,
	},
	'media.create': {
		input: GumroadEndpointInputSchemas.mediaCreate,
		output: GumroadEndpointOutputSchemas.mediaCreate,
	},
	'media.delete': {
		input: GumroadEndpointInputSchemas.mediaDelete,
		output: GumroadEndpointOutputSchemas.mediaDelete,
	},
	'files.presign': {
		input: GumroadEndpointInputSchemas.filesPresign,
		output: GumroadEndpointOutputSchemas.filesPresign,
	},
	'files.complete': {
		input: GumroadEndpointInputSchemas.filesComplete,
		output: GumroadEndpointOutputSchemas.filesComplete,
	},
	'files.abort': {
		input: GumroadEndpointInputSchemas.filesAbort,
		output: GumroadEndpointOutputSchemas.filesAbort,
	},
	'emails.list': {
		input: GumroadEndpointInputSchemas.emailsList,
		output: GumroadEndpointOutputSchemas.emailsList,
	},
	'emails.get': {
		input: GumroadEndpointInputSchemas.emailsGet,
		output: GumroadEndpointOutputSchemas.emailsGet,
	},
	'emails.create': {
		input: GumroadEndpointInputSchemas.emailsCreate,
		output: GumroadEndpointOutputSchemas.emailsCreate,
	},
	'emails.preview': {
		input: GumroadEndpointInputSchemas.emailsPreview,
		output: GumroadEndpointOutputSchemas.emailsPreview,
	},
	'emails.send': {
		input: GumroadEndpointInputSchemas.emailsSend,
		output: GumroadEndpointOutputSchemas.emailsSend,
	},
	'emails.schedule': {
		input: GumroadEndpointInputSchemas.emailsSchedule,
		output: GumroadEndpointOutputSchemas.emailsSchedule,
	},
	'emails.unschedule': {
		input: GumroadEndpointInputSchemas.emailsUnschedule,
		output: GumroadEndpointOutputSchemas.emailsUnschedule,
	},
	'emails.delete': {
		input: GumroadEndpointInputSchemas.emailsDelete,
		output: GumroadEndpointOutputSchemas.emailsDelete,
	},
	'workflows.list': {
		input: GumroadEndpointInputSchemas.workflowsList,
		output: GumroadEndpointOutputSchemas.workflowsList,
	},
	'workflows.get': {
		input: GumroadEndpointInputSchemas.workflowsGet,
		output: GumroadEndpointOutputSchemas.workflowsGet,
	},
	'workflows.emailsAdd': {
		input: GumroadEndpointInputSchemas.workflowsEmailsAdd,
		output: GumroadEndpointOutputSchemas.workflowsEmailsAdd,
	},
	'workflows.emailsUpdate': {
		input: GumroadEndpointInputSchemas.workflowsEmailsUpdate,
		output: GumroadEndpointOutputSchemas.workflowsEmailsUpdate,
	},
	'resourceSubscriptions.subscribe': {
		input: GumroadEndpointInputSchemas.resourceSubscriptionsSubscribe,
		output: GumroadEndpointOutputSchemas.resourceSubscriptionsSubscribe,
	},
	'resourceSubscriptions.list': {
		input: GumroadEndpointInputSchemas.resourceSubscriptionsList,
		output: GumroadEndpointOutputSchemas.resourceSubscriptionsList,
	},
	'resourceSubscriptions.testEvent': {
		input: GumroadEndpointInputSchemas.resourceSubscriptionsTestEvent,
		output: GumroadEndpointOutputSchemas.resourceSubscriptionsTestEvent,
	},
	'resourceSubscriptions.unsubscribe': {
		input: GumroadEndpointInputSchemas.resourceSubscriptionsUnsubscribe,
		output: GumroadEndpointOutputSchemas.resourceSubscriptionsUnsubscribe,
	},
	'sales.list': {
		input: GumroadEndpointInputSchemas.salesList,
		output: GumroadEndpointOutputSchemas.salesList,
	},
	'sales.get': {
		input: GumroadEndpointInputSchemas.salesGet,
		output: GumroadEndpointOutputSchemas.salesGet,
	},
	'sales.markAsShipped': {
		input: GumroadEndpointInputSchemas.salesMarkAsShipped,
		output: GumroadEndpointOutputSchemas.salesMarkAsShipped,
	},
	'sales.refund': {
		input: GumroadEndpointInputSchemas.salesRefund,
		output: GumroadEndpointOutputSchemas.salesRefund,
	},
	'sales.revokeAccess': {
		input: GumroadEndpointInputSchemas.salesRevokeAccess,
		output: GumroadEndpointOutputSchemas.salesRevokeAccess,
	},
	'sales.undoRevokeAccess': {
		input: GumroadEndpointInputSchemas.salesUndoRevokeAccess,
		output: GumroadEndpointOutputSchemas.salesUndoRevokeAccess,
	},
	'sales.resendReceipt': {
		input: GumroadEndpointInputSchemas.salesResendReceipt,
		output: GumroadEndpointOutputSchemas.salesResendReceipt,
	},
	'subscribers.list': {
		input: GumroadEndpointInputSchemas.subscribersList,
		output: GumroadEndpointOutputSchemas.subscribersList,
	},
	'subscribers.get': {
		input: GumroadEndpointInputSchemas.subscribersGet,
		output: GumroadEndpointOutputSchemas.subscribersGet,
	},
	'licenses.verify': {
		input: GumroadEndpointInputSchemas.licensesVerify,
		output: GumroadEndpointOutputSchemas.licensesVerify,
	},
	'licenses.enable': {
		input: GumroadEndpointInputSchemas.licensesEnable,
		output: GumroadEndpointOutputSchemas.licensesEnable,
	},
	'licenses.disable': {
		input: GumroadEndpointInputSchemas.licensesDisable,
		output: GumroadEndpointOutputSchemas.licensesDisable,
	},
	'licenses.decrementUsesCount': {
		input: GumroadEndpointInputSchemas.licensesDecrementUsesCount,
		output: GumroadEndpointOutputSchemas.licensesDecrementUsesCount,
	},
	'licenses.rotate': {
		input: GumroadEndpointInputSchemas.licensesRotate,
		output: GumroadEndpointOutputSchemas.licensesRotate,
	},
	'payouts.list': {
		input: GumroadEndpointInputSchemas.payoutsList,
		output: GumroadEndpointOutputSchemas.payoutsList,
	},
	'payouts.get': {
		input: GumroadEndpointInputSchemas.payoutsGet,
		output: GumroadEndpointOutputSchemas.payoutsGet,
	},
	'payouts.upcoming': {
		input: GumroadEndpointInputSchemas.payoutsUpcoming,
		output: GumroadEndpointOutputSchemas.payoutsUpcoming,
	},
	'taxForms.list': {
		input: GumroadEndpointInputSchemas.taxFormsList,
		output: GumroadEndpointOutputSchemas.taxFormsList,
	},
	'taxForms.download': {
		input: GumroadEndpointInputSchemas.taxFormsDownload,
		output: GumroadEndpointOutputSchemas.taxFormsDownload,
	},
	'earnings.get': {
		input: GumroadEndpointInputSchemas.earningsGet,
		output: GumroadEndpointOutputSchemas.earningsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gumroadEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const gumroadEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description:
			"List the authenticated user's Gumroad products with price, publication state and sales counts",
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Get one product by id, including description, price, tags and purchasing-power-parity prices',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a product with name, price in cents, type, tags, refund policy, rich content pages and attached files',
	},
	'products.update': {
		riskLevel: 'write',
		description:
			'Update a product; files and tags are full replacements, and custom_html or cover_ids can be rewritten',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a product',
	},
	'products.enable': {
		riskLevel: 'write',
		description: 'Publish (enable) an existing product',
	},
	'products.disable': {
		riskLevel: 'destructive',
		description: 'Unpublish (disable) an existing product',
	},
	'products.reviewsList': {
		riskLevel: 'read',
		description:
			"List one product's reviews with rating, message and the seller's public reply",
	},
	'products.categoriesList': {
		riskLevel: 'read',
		description:
			'List every product category; a category path feeds the category parameter when creating or updating products',
	},
	'products.coversAdd': {
		riskLevel: 'write',
		description:
			'Attach a cover to a product from a public image/video or YouTube/Vimeo URL',
	},
	'products.coversDelete': {
		riskLevel: 'destructive',
		description: "Permanently delete one of a product's covers by id",
	},
	'products.thumbnailSet': {
		riskLevel: 'write',
		description:
			"Set a product's thumbnail from a public image URL or a direct-upload signed blob id",
	},
	'products.thumbnailDelete': {
		riskLevel: 'destructive',
		description: "Remove a product's thumbnail",
	},
	'offerCodes.list': {
		riskLevel: 'read',
		description:
			"List the store's non-deleted offer codes, newest first, optionally filtered to automatic sales",
	},
	'offerCodes.get': {
		riskLevel: 'read',
		description: 'Read one store-wide offer code by id',
	},
	'offerCodes.update': {
		riskLevel: 'write',
		description:
			'Update a store-wide offer code schedule, usage cap or minimum; the amount and universality cannot change',
	},
	'offerCodes.listForProduct': {
		riskLevel: 'read',
		description:
			"List all of a product's offer codes with amounts and redemption counts",
	},
	'offerCodes.getForProduct': {
		riskLevel: 'read',
		description: "Read one of a product's offer codes by id",
	},
	'offerCodes.createForProduct': {
		riskLevel: 'write',
		description:
			'Create a fixed-amount or percentage offer code for a product, optionally universal, automatic and scheduled',
	},
	'offerCodes.updateForProduct': {
		riskLevel: 'write',
		description:
			"Update one of a product's offer codes: usage cap, minimum, automatic application and validity window",
	},
	'offerCodes.deleteForProduct': {
		riskLevel: 'destructive',
		description: "Permanently delete one of a product's offer codes",
	},
	'variantCategories.list': {
		riskLevel: 'read',
		description: "List a product's variant categories",
	},
	'variantCategories.create': {
		riskLevel: 'write',
		description: 'Create a variant category on a product by title',
	},
	'variantCategories.get': {
		riskLevel: 'read',
		description: "Read one of a product's variant categories by id",
	},
	'variantCategories.update': {
		riskLevel: 'write',
		description: "Rename one of a product's variant categories",
	},
	'variantCategories.delete': {
		riskLevel: 'destructive',
		description: "Permanently delete a product's variant category",
	},
	'variantCategories.variantsList': {
		riskLevel: 'read',
		description: "List the variants in one of a product's variant categories",
	},
	'variantCategories.variantsCreate': {
		riskLevel: 'write',
		description:
			'Create a variant with a name, price difference in cents and optional purchase cap',
	},
	'variantCategories.variantsGet': {
		riskLevel: 'read',
		description: 'Read one variant by id',
	},
	'variantCategories.variantsUpdate': {
		riskLevel: 'write',
		description: 'Update a variant name, price difference or purchase cap',
	},
	'variantCategories.variantsDelete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a variant',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: "List a product's checkout custom fields",
	},
	'customFields.create': {
		riskLevel: 'write',
		description:
			"Add a custom field to a product's checkout, optionally required",
	},
	'customFields.update': {
		riskLevel: 'write',
		description: "Flip whether one of a product's custom fields is required",
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: "Permanently delete a product's custom field by name",
	},
	'user.get': {
		riskLevel: 'read',
		description:
			"Read the authenticated user's profile: name, bio, links and (with view_sales) email",
	},
	'user.customHtmlGet': {
		riskLevel: 'read',
		description:
			"Read the profile's custom HTML landing page plus a rendered fallback of the current storefront",
	},
	'user.customHtmlUpdate': {
		riskLevel: 'write',
		description:
			'Publish or clear the profile custom HTML landing page; the response carries a sanitization report and the previous HTML for rollback',
	},
	'user.customHtmlPreview': {
		riskLevel: 'write',
		description:
			'Sanitize profile HTML and return the sanitized result without saving anything',
	},
	'user.refundPolicyGet': {
		riskLevel: 'read',
		description: 'Read the account-level refund policy',
	},
	'user.refundPolicyUpdate': {
		riskLevel: 'write',
		description:
			'Update the account-level refund policy period and its fine print (max 3000 characters)',
	},
	'public.product': {
		riskLevel: 'read',
		description:
			'Read the public product page data for a permalink (price, covers, description, reviews); no authentication required',
	},
	'public.profile': {
		riskLevel: 'read',
		description:
			"Read a creator's public profile with up to 100 visible products; no authentication required",
	},
	'media.list': {
		riskLevel: 'read',
		description: "List the authenticated user's media library files",
	},
	'media.create': {
		riskLevel: 'write',
		description:
			'Add a media library file from a public image URL or a direct-upload signed blob id',
	},
	'media.delete': {
		riskLevel: 'destructive',
		description: 'Delete a media library file by id',
	},
	'files.presign': {
		riskLevel: 'write',
		description:
			'Start a multipart file upload and get presigned S3 URLs per 100 MB part (max 20 GB); the binary PUTs to S3 are client-side',
	},
	'files.complete': {
		riskLevel: 'write',
		description:
			'Finalize a multipart upload with the S3 upload id, key and part etags, returning the canonical file URL',
	},
	'files.abort': {
		riskLevel: 'write',
		description: 'Cancel a multipart upload started by files.presign',
	},
	'emails.list': {
		riskLevel: 'read',
		description:
			"List the seller's audience emails, optionally filtered to published, scheduled or draft state",
	},
	'emails.get': {
		riskLevel: 'read',
		description: 'Read one audience email by id',
	},
	// publish="true" or draft="false" sends to the whole audience at once, so
	// creating can have the same one-way effect as emails.send.
	'emails.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a draft audience email by subject, HTML body and audience, or send it immediately with publish=true',
	},
	'emails.preview': {
		riskLevel: 'write',
		description:
			"Send a preview of an audience email to the seller's own address",
	},
	'emails.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Publish a draft audience email and send it to its audience',
	},
	'emails.schedule': {
		riskLevel: 'write',
		description:
			"Schedule a draft audience email to publish at a set time in the seller's timezone",
	},
	'emails.unschedule': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled audience email and turn it back into a draft',
	},
	'emails.delete': {
		riskLevel: 'destructive',
		description: 'Delete an audience email',
	},
	'workflows.list': {
		riskLevel: 'read',
		description: "List the seller's active workflows, newest first",
	},
	'workflows.get': {
		riskLevel: 'read',
		description:
			'Read one workflow with its email steps and delivery statistics',
	},
	'workflows.emailsAdd': {
		riskLevel: 'write',
		description:
			'Append one email step to a workflow with a delay in hours, days, weeks or months',
	},
	'workflows.emailsUpdate': {
		riskLevel: 'write',
		description:
			'Update one workflow email step subject, body or delay without changing publication state',
	},
	'resourceSubscriptions.subscribe': {
		riskLevel: 'write',
		description:
			'Subscribe a post URL to one of the 8 resource event types (sales, refunds, disputes, subscription changes); receiving deliveries is out of scope',
	},
	'resourceSubscriptions.list': {
		riskLevel: 'read',
		description: 'List active subscriptions for one resource event type',
	},
	'resourceSubscriptions.testEvent': {
		riskLevel: 'write',
		description: 'Queue a sample event for a resource subscription post URL',
	},
	'resourceSubscriptions.unsubscribe': {
		riskLevel: 'destructive',
		description: 'Delete a resource subscription by id',
	},
	'sales.list': {
		riskLevel: 'read',
		description:
			'List successful sales, filterable by date range, product, buyer email, order id, name or license key',
	},
	'sales.get': {
		riskLevel: 'read',
		description:
			'Get one sale by id with price, fees, taxes, refund and chargeback state',
	},
	'sales.markAsShipped': {
		riskLevel: 'write',
		description:
			'Mark a physical sale as shipped with an optional tracking URL',
	},
	'sales.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refund a sale fully, or partially with amount_cents; returns the updated sale',
	},
	'sales.revokeAccess': {
		riskLevel: 'destructive',
		description:
			"Revoke the buyer's access to a sale without refunding it (refused for refunded, physical or subscription sales)",
	},
	'sales.undoRevokeAccess': {
		riskLevel: 'write',
		description: "Restore a buyer's access to a previously revoked sale",
	},
	'sales.resendReceipt': {
		riskLevel: 'write',
		description: "Resend the purchase receipt to the customer's email",
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			"List one product's subscribers with status, recurrence and license key",
	},
	'subscribers.get': {
		riskLevel: 'read',
		description:
			'Read one subscriber by id with status, recurrence and license key',
	},
	'licenses.verify': {
		riskLevel: 'write',
		description:
			'Verify a license key against a product and read its purchase; increments the license use counter unless increment_uses_count is "false"',
	},
	'licenses.enable': {
		riskLevel: 'write',
		description: 'Re-enable a disabled license key and read its purchase',
	},
	'licenses.disable': {
		riskLevel: 'destructive',
		description:
			'Disable a license key so it fails verification, and read its purchase',
	},
	'licenses.decrementUsesCount': {
		riskLevel: 'write',
		description: 'Decrement a license key use counter and read its purchase',
	},
	'licenses.rotate': {
		riskLevel: 'write',
		description:
			'Rotate a license key to a new one; the previous key stops validating immediately',
	},
	'payouts.list': {
		riskLevel: 'read',
		description:
			'List payouts with amount, currency, status and bank destination, filterable by date range',
	},
	'payouts.get': {
		riskLevel: 'read',
		description:
			'Read one payout with its sale ids and optional per-transaction breakdown lines',
	},
	'payouts.upcoming': {
		riskLevel: 'read',
		description:
			'Read the up to two upcoming payouts with their transaction lines',
	},
	'taxForms.list': {
		riskLevel: 'read',
		description:
			'List generated tax forms (1099-K, 1099-MISC) for one tax year or every year',
	},
	'taxForms.download': {
		riskLevel: 'read',
		description:
			'Download a tax form PDF for a year and form type as base64 with filename and content type',
	},
	'earnings.get': {
		riskLevel: 'read',
		description:
			'Read the annual earnings breakdown (gross, fees, taxes, affiliate credit, net) for one tax year',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gumroadEndpointsNested>;

export type BaseGumroadPlugin<T extends GumroadPluginOptions> = CorsairPlugin<
	'gumroad',
	typeof GumroadSchema,
	typeof gumroadEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGumroadPlugin = BaseGumroadPlugin<GumroadPluginOptions>;

export type ExternalGumroadPlugin<T extends GumroadPluginOptions> =
	BaseGumroadPlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

// Gumroad documents these as usable without an OAuth token: the license
// verify endpoint ("does not require an OAuth application") and the two
// public reads. An empty key means the client sends no Authorization header.
const TOKEN_FREE_OPERATIONS = new Set([
	'public.product',
	'public.profile',
	'licenses.verify',
]);

export function gumroad<const T extends GumroadPluginOptions>(
	incomingOptions: GumroadPluginOptions & T = {} as GumroadPluginOptions & T,
): ExternalGumroadPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gumroad',
		schema: GumroadSchema,
		options: options,
		hooks: options.hooks,
		endpoints: gumroadEndpointsNested,
		webhooks: {},
		endpointMeta: gumroadEndpointMeta,
		endpointSchemas: gumroadEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GumroadKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			if (
				source === 'endpoint' &&
				ctx.meteredOperationId !== undefined &&
				TOKEN_FREE_OPERATIONS.has(ctx.meteredOperationId)
			) {
				return '';
			}

			throw new AuthMissingError('gumroad', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGumroadPlugin;
}

export type {
	GumroadForm,
	GumroadFormEntry,
	GumroadJsonBody,
	GumroadMethod,
	GumroadQuery,
} from './client';
export { formEntries, GumroadAPIError } from './client';
export type {
	CustomFieldsCreateInput,
	CustomFieldsCreateResponse,
	CustomFieldsDeleteInput,
	CustomFieldsDeleteResponse,
	CustomFieldsListInput,
	CustomFieldsListResponse,
	CustomFieldsUpdateInput,
	CustomFieldsUpdateResponse,
	EarningsGetInput,
	EarningsGetResponse,
	EmailsCreateInput,
	EmailsCreateResponse,
	EmailsDeleteInput,
	EmailsDeleteResponse,
	EmailsGetInput,
	EmailsGetResponse,
	EmailsListInput,
	EmailsListResponse,
	EmailsPreviewInput,
	EmailsPreviewResponse,
	EmailsScheduleInput,
	EmailsScheduleResponse,
	EmailsSendInput,
	EmailsSendResponse,
	EmailsUnscheduleInput,
	EmailsUnscheduleResponse,
	FilesAbortInput,
	FilesAbortResponse,
	FilesCompleteInput,
	FilesCompleteResponse,
	FilesPresignInput,
	FilesPresignResponse,
	GumroadCategory,
	GumroadCover,
	GumroadCustomField,
	GumroadDownload,
	GumroadEmail,
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
	GumroadMediaFile,
	GumroadOfferCode,
	GumroadProduct,
	GumroadPurchase,
	GumroadRefundPolicy,
	GumroadResourceSubscription,
	GumroadReview,
	GumroadSale,
	GumroadSubscriber,
	GumroadTaxForm,
	GumroadUser,
	GumroadVariant,
	GumroadVariantCategory,
	GumroadWorkflow,
	GumroadWorkflowEmail,
	LicensesDecrementUsesCountInput,
	LicensesDecrementUsesCountResponse,
	LicensesDisableInput,
	LicensesDisableResponse,
	LicensesEnableInput,
	LicensesEnableResponse,
	LicensesRotateInput,
	LicensesRotateResponse,
	LicensesVerifyInput,
	LicensesVerifyResponse,
	MediaCreateInput,
	MediaCreateResponse,
	MediaDeleteInput,
	MediaDeleteResponse,
	MediaListInput,
	MediaListResponse,
	OfferCodesCreateForProductInput,
	OfferCodesCreateForProductResponse,
	OfferCodesDeleteForProductInput,
	OfferCodesDeleteForProductResponse,
	OfferCodesGetForProductInput,
	OfferCodesGetForProductResponse,
	OfferCodesGetInput,
	OfferCodesGetResponse,
	OfferCodesListForProductInput,
	OfferCodesListForProductResponse,
	OfferCodesListInput,
	OfferCodesListResponse,
	OfferCodesUpdateForProductInput,
	OfferCodesUpdateForProductResponse,
	OfferCodesUpdateInput,
	OfferCodesUpdateResponse,
	PayoutsGetInput,
	PayoutsGetResponse,
	PayoutsListInput,
	PayoutsListResponse,
	PayoutsUpcomingInput,
	PayoutsUpcomingResponse,
	ProductsCategoriesListInput,
	ProductsCategoriesListResponse,
	ProductsCoversAddInput,
	ProductsCoversAddResponse,
	ProductsCoversDeleteInput,
	ProductsCoversDeleteResponse,
	ProductsCreateInput,
	ProductsCreateResponse,
	ProductsDeleteInput,
	ProductsDeleteResponse,
	ProductsDisableInput,
	ProductsDisableResponse,
	ProductsEnableInput,
	ProductsEnableResponse,
	ProductsGetInput,
	ProductsGetResponse,
	ProductsListInput,
	ProductsListResponse,
	ProductsReviewsListInput,
	ProductsReviewsListResponse,
	ProductsThumbnailDeleteInput,
	ProductsThumbnailDeleteResponse,
	ProductsThumbnailSetInput,
	ProductsThumbnailSetResponse,
	ProductsUpdateInput,
	ProductsUpdateResponse,
	PublicProductInput,
	PublicProductResponse,
	PublicProfileInput,
	PublicProfileResponse,
	ResourceSubscriptionsListInput,
	ResourceSubscriptionsListResponse,
	ResourceSubscriptionsSubscribeInput,
	ResourceSubscriptionsSubscribeResponse,
	ResourceSubscriptionsTestEventInput,
	ResourceSubscriptionsTestEventResponse,
	ResourceSubscriptionsUnsubscribeInput,
	ResourceSubscriptionsUnsubscribeResponse,
	SalesGetInput,
	SalesGetResponse,
	SalesListInput,
	SalesListResponse,
	SalesMarkAsShippedInput,
	SalesMarkAsShippedResponse,
	SalesRefundInput,
	SalesRefundResponse,
	SalesResendReceiptInput,
	SalesResendReceiptResponse,
	SalesRevokeAccessInput,
	SalesRevokeAccessResponse,
	SalesUndoRevokeAccessInput,
	SalesUndoRevokeAccessResponse,
	SubscribersGetInput,
	SubscribersGetResponse,
	SubscribersListInput,
	SubscribersListResponse,
	TaxFormsDownloadInput,
	TaxFormsDownloadResponse,
	TaxFormsListInput,
	TaxFormsListResponse,
	UserCustomHtmlGetInput,
	UserCustomHtmlGetResponse,
	UserCustomHtmlPreviewInput,
	UserCustomHtmlPreviewResponse,
	UserCustomHtmlUpdateInput,
	UserCustomHtmlUpdateResponse,
	UserGetInput,
	UserGetResponse,
	UserRefundPolicyGetInput,
	UserRefundPolicyGetResponse,
	UserRefundPolicyUpdateInput,
	UserRefundPolicyUpdateResponse,
	VariantCategoriesCreateInput,
	VariantCategoriesCreateResponse,
	VariantCategoriesDeleteInput,
	VariantCategoriesDeleteResponse,
	VariantCategoriesGetInput,
	VariantCategoriesGetResponse,
	VariantCategoriesListInput,
	VariantCategoriesListResponse,
	VariantCategoriesUpdateInput,
	VariantCategoriesUpdateResponse,
	VariantCategoriesVariantsCreateInput,
	VariantCategoriesVariantsCreateResponse,
	VariantCategoriesVariantsDeleteInput,
	VariantCategoriesVariantsDeleteResponse,
	VariantCategoriesVariantsGetInput,
	VariantCategoriesVariantsGetResponse,
	VariantCategoriesVariantsListInput,
	VariantCategoriesVariantsListResponse,
	VariantCategoriesVariantsUpdateInput,
	VariantCategoriesVariantsUpdateResponse,
	WorkflowsEmailsAddInput,
	WorkflowsEmailsAddResponse,
	WorkflowsEmailsUpdateInput,
	WorkflowsEmailsUpdateResponse,
	WorkflowsGetInput,
	WorkflowsGetResponse,
	WorkflowsListInput,
	WorkflowsListResponse,
} from './endpoints/types';
