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
import { lobEndpointsNested } from './endpoints';
import type { LobEndpointInputs, LobEndpointOutputs } from './endpoints/types';
import {
	LobEndpointInputSchemas,
	LobEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LobSchema } from './schema';

export type LobPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLobPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lobEndpointsNested>;
};

export type LobContext = CorsairPluginContext<
	typeof LobSchema,
	LobPluginOptions
>;

export type LobKeyBuilderContext = KeyBuilderContext<LobPluginOptions>;

export type LobBoundEndpoints = BindEndpoints<typeof lobEndpointsNested>;

type LobEndpoint<K extends keyof LobEndpointOutputs> = CorsairEndpoint<
	LobContext,
	LobEndpointInputs[K & keyof LobEndpointInputs],
	LobEndpointOutputs[K]
>;

export type LobEndpoints = {
	[K in keyof LobEndpointOutputs]: LobEndpoint<K>;
};

export const lobEndpointSchemas = {
	'usVerifications.verify': {
		input: LobEndpointInputSchemas.usVerificationsVerify,
		output: LobEndpointOutputSchemas.usVerificationsVerify,
	},
	'usVerifications.bulk': {
		input: LobEndpointInputSchemas.usVerificationsBulk,
		output: LobEndpointOutputSchemas.usVerificationsBulk,
	},
	'intlVerifications.verify': {
		input: LobEndpointInputSchemas.intlVerificationsVerify,
		output: LobEndpointOutputSchemas.intlVerificationsVerify,
	},
	'intlVerifications.bulk': {
		input: LobEndpointInputSchemas.intlVerificationsBulk,
		output: LobEndpointOutputSchemas.intlVerificationsBulk,
	},
	'autocomplete.usAutocomplete': {
		input: LobEndpointInputSchemas.autocompleteUsAutocomplete,
		output: LobEndpointOutputSchemas.autocompleteUsAutocomplete,
	},
	'zip.usZipLookup': {
		input: LobEndpointInputSchemas.zipUsZipLookup,
		output: LobEndpointOutputSchemas.zipUsZipLookup,
	},
	'reverseGeocode.lookup': {
		input: LobEndpointInputSchemas.reverseGeocodeLookup,
		output: LobEndpointOutputSchemas.reverseGeocodeLookup,
	},
	'identityValidation.validate': {
		input: LobEndpointInputSchemas.identityValidationValidate,
		output: LobEndpointOutputSchemas.identityValidationValidate,
	},
	'addresses.create': {
		input: LobEndpointInputSchemas.addressesCreate,
		output: LobEndpointOutputSchemas.addressesCreate,
	},
	'addresses.get': {
		input: LobEndpointInputSchemas.addressesGet,
		output: LobEndpointOutputSchemas.addressesGet,
	},
	'addresses.list': {
		input: LobEndpointInputSchemas.addressesList,
		output: LobEndpointOutputSchemas.addressesList,
	},
	'addresses.delete': {
		input: LobEndpointInputSchemas.addressesDelete,
		output: LobEndpointOutputSchemas.addressesDelete,
	},
	'postcards.send': {
		input: LobEndpointInputSchemas.postcardsSend,
		output: LobEndpointOutputSchemas.postcardsSend,
	},
	'postcards.get': {
		input: LobEndpointInputSchemas.postcardsGet,
		output: LobEndpointOutputSchemas.postcardsGet,
	},
	'postcards.list': {
		input: LobEndpointInputSchemas.postcardsList,
		output: LobEndpointOutputSchemas.postcardsList,
	},
	'postcards.cancel': {
		input: LobEndpointInputSchemas.postcardsCancel,
		output: LobEndpointOutputSchemas.postcardsCancel,
	},
	'letters.send': {
		input: LobEndpointInputSchemas.lettersSend,
		output: LobEndpointOutputSchemas.lettersSend,
	},
	'letters.get': {
		input: LobEndpointInputSchemas.lettersGet,
		output: LobEndpointOutputSchemas.lettersGet,
	},
	'letters.list': {
		input: LobEndpointInputSchemas.lettersList,
		output: LobEndpointOutputSchemas.lettersList,
	},
	'letters.cancel': {
		input: LobEndpointInputSchemas.lettersCancel,
		output: LobEndpointOutputSchemas.lettersCancel,
	},
	'checks.send': {
		input: LobEndpointInputSchemas.checksSend,
		output: LobEndpointOutputSchemas.checksSend,
	},
	'checks.get': {
		input: LobEndpointInputSchemas.checksGet,
		output: LobEndpointOutputSchemas.checksGet,
	},
	'checks.list': {
		input: LobEndpointInputSchemas.checksList,
		output: LobEndpointOutputSchemas.checksList,
	},
	'checks.cancel': {
		input: LobEndpointInputSchemas.checksCancel,
		output: LobEndpointOutputSchemas.checksCancel,
	},
	'selfMailers.send': {
		input: LobEndpointInputSchemas.selfMailersSend,
		output: LobEndpointOutputSchemas.selfMailersSend,
	},
	'selfMailers.get': {
		input: LobEndpointInputSchemas.selfMailersGet,
		output: LobEndpointOutputSchemas.selfMailersGet,
	},
	'selfMailers.list': {
		input: LobEndpointInputSchemas.selfMailersList,
		output: LobEndpointOutputSchemas.selfMailersList,
	},
	'selfMailers.cancel': {
		input: LobEndpointInputSchemas.selfMailersCancel,
		output: LobEndpointOutputSchemas.selfMailersCancel,
	},
	'snapPacks.send': {
		input: LobEndpointInputSchemas.snapPacksSend,
		output: LobEndpointOutputSchemas.snapPacksSend,
	},
	'snapPacks.get': {
		input: LobEndpointInputSchemas.snapPacksGet,
		output: LobEndpointOutputSchemas.snapPacksGet,
	},
	'snapPacks.list': {
		input: LobEndpointInputSchemas.snapPacksList,
		output: LobEndpointOutputSchemas.snapPacksList,
	},
	'snapPacks.cancel': {
		input: LobEndpointInputSchemas.snapPacksCancel,
		output: LobEndpointOutputSchemas.snapPacksCancel,
	},
	'booklets.send': {
		input: LobEndpointInputSchemas.bookletsSend,
		output: LobEndpointOutputSchemas.bookletsSend,
	},
	'booklets.get': {
		input: LobEndpointInputSchemas.bookletsGet,
		output: LobEndpointOutputSchemas.bookletsGet,
	},
	'booklets.list': {
		input: LobEndpointInputSchemas.bookletsList,
		output: LobEndpointOutputSchemas.bookletsList,
	},
	'booklets.cancel': {
		input: LobEndpointInputSchemas.bookletsCancel,
		output: LobEndpointOutputSchemas.bookletsCancel,
	},
	'bankAccounts.create': {
		input: LobEndpointInputSchemas.bankAccountsCreate,
		output: LobEndpointOutputSchemas.bankAccountsCreate,
	},
	'bankAccounts.get': {
		input: LobEndpointInputSchemas.bankAccountsGet,
		output: LobEndpointOutputSchemas.bankAccountsGet,
	},
	'bankAccounts.list': {
		input: LobEndpointInputSchemas.bankAccountsList,
		output: LobEndpointOutputSchemas.bankAccountsList,
	},
	'bankAccounts.delete': {
		input: LobEndpointInputSchemas.bankAccountsDelete,
		output: LobEndpointOutputSchemas.bankAccountsDelete,
	},
	'bankAccounts.verify': {
		input: LobEndpointInputSchemas.bankAccountsVerify,
		output: LobEndpointOutputSchemas.bankAccountsVerify,
	},
	'billingGroups.create': {
		input: LobEndpointInputSchemas.billingGroupsCreate,
		output: LobEndpointOutputSchemas.billingGroupsCreate,
	},
	'billingGroups.get': {
		input: LobEndpointInputSchemas.billingGroupsGet,
		output: LobEndpointOutputSchemas.billingGroupsGet,
	},
	'billingGroups.list': {
		input: LobEndpointInputSchemas.billingGroupsList,
		output: LobEndpointOutputSchemas.billingGroupsList,
	},
	'billingGroups.update': {
		input: LobEndpointInputSchemas.billingGroupsUpdate,
		output: LobEndpointOutputSchemas.billingGroupsUpdate,
	},
	'buckslips.create': {
		input: LobEndpointInputSchemas.buckslipsCreate,
		output: LobEndpointOutputSchemas.buckslipsCreate,
	},
	'buckslips.get': {
		input: LobEndpointInputSchemas.buckslipsGet,
		output: LobEndpointOutputSchemas.buckslipsGet,
	},
	'buckslips.list': {
		input: LobEndpointInputSchemas.buckslipsList,
		output: LobEndpointOutputSchemas.buckslipsList,
	},
	'buckslips.update': {
		input: LobEndpointInputSchemas.buckslipsUpdate,
		output: LobEndpointOutputSchemas.buckslipsUpdate,
	},
	'buckslips.delete': {
		input: LobEndpointInputSchemas.buckslipsDelete,
		output: LobEndpointOutputSchemas.buckslipsDelete,
	},
	'buckslips.listOrders': {
		input: LobEndpointInputSchemas.buckslipsListOrders,
		output: LobEndpointOutputSchemas.buckslipsListOrders,
	},
	'buckslips.createOrder': {
		input: LobEndpointInputSchemas.buckslipsCreateOrder,
		output: LobEndpointOutputSchemas.buckslipsCreateOrder,
	},
	'cards.create': {
		input: LobEndpointInputSchemas.cardsCreate,
		output: LobEndpointOutputSchemas.cardsCreate,
	},
	'cards.get': {
		input: LobEndpointInputSchemas.cardsGet,
		output: LobEndpointOutputSchemas.cardsGet,
	},
	'cards.list': {
		input: LobEndpointInputSchemas.cardsList,
		output: LobEndpointOutputSchemas.cardsList,
	},
	'cards.update': {
		input: LobEndpointInputSchemas.cardsUpdate,
		output: LobEndpointOutputSchemas.cardsUpdate,
	},
	'cards.delete': {
		input: LobEndpointInputSchemas.cardsDelete,
		output: LobEndpointOutputSchemas.cardsDelete,
	},
	'cards.listOrders': {
		input: LobEndpointInputSchemas.cardsListOrders,
		output: LobEndpointOutputSchemas.cardsListOrders,
	},
	'cards.createOrder': {
		input: LobEndpointInputSchemas.cardsCreateOrder,
		output: LobEndpointOutputSchemas.cardsCreateOrder,
	},
	'campaigns.create': {
		input: LobEndpointInputSchemas.campaignsCreate,
		output: LobEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.get': {
		input: LobEndpointInputSchemas.campaignsGet,
		output: LobEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.list': {
		input: LobEndpointInputSchemas.campaignsList,
		output: LobEndpointOutputSchemas.campaignsList,
	},
	'campaigns.update': {
		input: LobEndpointInputSchemas.campaignsUpdate,
		output: LobEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: LobEndpointInputSchemas.campaignsDelete,
		output: LobEndpointOutputSchemas.campaignsDelete,
	},
	'campaigns.send': {
		input: LobEndpointInputSchemas.campaignsSend,
		output: LobEndpointOutputSchemas.campaignsSend,
	},
	'creatives.create': {
		input: LobEndpointInputSchemas.creativesCreate,
		output: LobEndpointOutputSchemas.creativesCreate,
	},
	'creatives.get': {
		input: LobEndpointInputSchemas.creativesGet,
		output: LobEndpointOutputSchemas.creativesGet,
	},
	'creatives.update': {
		input: LobEndpointInputSchemas.creativesUpdate,
		output: LobEndpointOutputSchemas.creativesUpdate,
	},
	'uploads.create': {
		input: LobEndpointInputSchemas.uploadsCreate,
		output: LobEndpointOutputSchemas.uploadsCreate,
	},
	'uploads.get': {
		input: LobEndpointInputSchemas.uploadsGet,
		output: LobEndpointOutputSchemas.uploadsGet,
	},
	'uploads.list': {
		input: LobEndpointInputSchemas.uploadsList,
		output: LobEndpointOutputSchemas.uploadsList,
	},
	'uploads.update': {
		input: LobEndpointInputSchemas.uploadsUpdate,
		output: LobEndpointOutputSchemas.uploadsUpdate,
	},
	'uploads.delete': {
		input: LobEndpointInputSchemas.uploadsDelete,
		output: LobEndpointOutputSchemas.uploadsDelete,
	},
	'uploads.uploadFile': {
		input: LobEndpointInputSchemas.uploadsUploadFile,
		output: LobEndpointOutputSchemas.uploadsUploadFile,
	},
	'uploads.createExport': {
		input: LobEndpointInputSchemas.uploadsCreateExport,
		output: LobEndpointOutputSchemas.uploadsCreateExport,
	},
	'uploads.getExport': {
		input: LobEndpointInputSchemas.uploadsGetExport,
		output: LobEndpointOutputSchemas.uploadsGetExport,
	},
	'uploads.getReport': {
		input: LobEndpointInputSchemas.uploadsGetReport,
		output: LobEndpointOutputSchemas.uploadsGetReport,
	},
	'informedDelivery.list': {
		input: LobEndpointInputSchemas.informedDeliveryList,
		output: LobEndpointOutputSchemas.informedDeliveryList,
	},
	'informedDelivery.create': {
		input: LobEndpointInputSchemas.informedDeliveryCreate,
		output: LobEndpointOutputSchemas.informedDeliveryCreate,
	},
	'informedDelivery.get': {
		input: LobEndpointInputSchemas.informedDeliveryGet,
		output: LobEndpointOutputSchemas.informedDeliveryGet,
	},
	'informedDelivery.update': {
		input: LobEndpointInputSchemas.informedDeliveryUpdate,
		output: LobEndpointOutputSchemas.informedDeliveryUpdate,
	},
	'resourceProofs.create': {
		input: LobEndpointInputSchemas.resourceProofsCreate,
		output: LobEndpointOutputSchemas.resourceProofsCreate,
	},
	'resourceProofs.get': {
		input: LobEndpointInputSchemas.resourceProofsGet,
		output: LobEndpointOutputSchemas.resourceProofsGet,
	},
	'resourceProofs.update': {
		input: LobEndpointInputSchemas.resourceProofsUpdate,
		output: LobEndpointOutputSchemas.resourceProofsUpdate,
	},
	'templates.create': {
		input: LobEndpointInputSchemas.templatesCreate,
		output: LobEndpointOutputSchemas.templatesCreate,
	},
	'templates.get': {
		input: LobEndpointInputSchemas.templatesGet,
		output: LobEndpointOutputSchemas.templatesGet,
	},
	'templates.list': {
		input: LobEndpointInputSchemas.templatesList,
		output: LobEndpointOutputSchemas.templatesList,
	},
	'templates.update': {
		input: LobEndpointInputSchemas.templatesUpdate,
		output: LobEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: LobEndpointInputSchemas.templatesDelete,
		output: LobEndpointOutputSchemas.templatesDelete,
	},
	'templateVersions.create': {
		input: LobEndpointInputSchemas.templateVersionsCreate,
		output: LobEndpointOutputSchemas.templateVersionsCreate,
	},
	'templateVersions.get': {
		input: LobEndpointInputSchemas.templateVersionsGet,
		output: LobEndpointOutputSchemas.templateVersionsGet,
	},
	'templateVersions.list': {
		input: LobEndpointInputSchemas.templateVersionsList,
		output: LobEndpointOutputSchemas.templateVersionsList,
	},
	'templateVersions.update': {
		input: LobEndpointInputSchemas.templateVersionsUpdate,
		output: LobEndpointOutputSchemas.templateVersionsUpdate,
	},
	'templateVersions.delete': {
		input: LobEndpointInputSchemas.templateVersionsDelete,
		output: LobEndpointOutputSchemas.templateVersionsDelete,
	},
	'domains.create': {
		input: LobEndpointInputSchemas.domainsCreate,
		output: LobEndpointOutputSchemas.domainsCreate,
	},
	'domains.get': {
		input: LobEndpointInputSchemas.domainsGet,
		output: LobEndpointOutputSchemas.domainsGet,
	},
	'domains.list': {
		input: LobEndpointInputSchemas.domainsList,
		output: LobEndpointOutputSchemas.domainsList,
	},
	'domains.delete': {
		input: LobEndpointInputSchemas.domainsDelete,
		output: LobEndpointOutputSchemas.domainsDelete,
	},
	'links.create': {
		input: LobEndpointInputSchemas.linksCreate,
		output: LobEndpointOutputSchemas.linksCreate,
	},
	'links.get': {
		input: LobEndpointInputSchemas.linksGet,
		output: LobEndpointOutputSchemas.linksGet,
	},
	'links.list': {
		input: LobEndpointInputSchemas.linksList,
		output: LobEndpointOutputSchemas.linksList,
	},
	'links.update': {
		input: LobEndpointInputSchemas.linksUpdate,
		output: LobEndpointOutputSchemas.linksUpdate,
	},
	'links.delete': {
		input: LobEndpointInputSchemas.linksDelete,
		output: LobEndpointOutputSchemas.linksDelete,
	},
	'qrCodes.list': {
		input: LobEndpointInputSchemas.qrCodesList,
		output: LobEndpointOutputSchemas.qrCodesList,
	},
	'account.getBalance': {
		input: LobEndpointInputSchemas.accountGetBalance,
		output: LobEndpointOutputSchemas.accountGetBalance,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lobEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const lobEndpointMeta = {
	'usVerifications.verify': {
		riskLevel: 'read',
		description:
			'Verify one US address with USPS data and get its deliverability, standardized components and confidence score',
	},
	'usVerifications.bulk': {
		riskLevel: 'read',
		description:
			'Verify up to 20 US addresses in one synchronous call; each row comes back as a verification or a per-row error',
	},
	'intlVerifications.verify': {
		riskLevel: 'read',
		description:
			'Verify one international address and get its deliverability, coverage level and parsed components',
	},
	'intlVerifications.bulk': {
		riskLevel: 'read',
		description:
			'Verify up to 20 international addresses in one call; each row comes back as a verification or a per-row error. Bills each row on a live key',
	},
	'autocomplete.usAutocomplete': {
		riskLevel: 'read',
		description:
			'Complete a partial US address into up to 10 suggestion lines, optionally restricted to deliverable addresses',
	},
	'zip.usZipLookup': {
		riskLevel: 'read',
		description:
			'Look up a 5-digit US ZIP code and get its cities, county, FIPS code and default city',
	},
	'reverseGeocode.lookup': {
		riskLevel: 'read',
		description:
			'Find the US ZIP and ZIP+4 areas nearest a latitude and longitude, sorted by distance',
	},
	'identityValidation.validate': {
		riskLevel: 'read',
		description:
			'Score how likely a person or company is associated with a US address (0-100, with a high/medium/low confidence)',
	},
	'addresses.create': {
		riskLevel: 'write',
		description:
			'Create a US or international address in the Lob address book for reuse as a mail to or from address',
	},
	'addresses.get': {
		riskLevel: 'read',
		description: 'Read one address book entry by its adr_ ID',
	},
	'addresses.list': {
		riskLevel: 'read',
		description:
			'Page through the address book with before/after cursors, optional metadata and date filters',
	},
	'addresses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an address book entry. Lob marks it deleted and does not restore it',
	},
	'postcards.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a real postcard that Lob prints and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice',
	},
	'postcards.get': {
		riskLevel: 'read',
		description:
			'Read one postcard by its psc_ ID, including print status and the signed PDF preview URL',
	},
	'postcards.list': {
		riskLevel: 'read',
		description:
			'Page through postcards with cursors and filters (status, size, campaign, send date, metadata)',
	},
	'postcards.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a postcard before it goes to production. Works only within the cancellation window; a cancelled piece cannot be restored',
	},
	'letters.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a real letter that Lob prints, stuffs and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice',
	},
	'letters.get': {
		riskLevel: 'read',
		description:
			'Read one letter by its ltr_ ID, including tracking number and events on certified or registered mail',
	},
	'letters.list': {
		riskLevel: 'read',
		description:
			'Page through letters with cursors and filters (status, color, campaign, send date, metadata)',
	},
	'letters.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a letter before it goes to production. Works only within the cancellation window; a cancelled piece cannot be restored',
	},
	'checks.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Print and mail a real check drawn on a verified bank account. Moves money and is billed per piece; pass an idempotency_key so a replay returns the original check',
	},
	'checks.get': {
		riskLevel: 'read',
		description:
			'Read one check by its chk_ ID, including status, tracking events and the PDF preview URL',
	},
	'checks.list': {
		riskLevel: 'read',
		description:
			'Page through checks with cursors and filters (status, send date, metadata)',
	},
	'checks.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a check before it goes to production. A cancelled check cannot be restored',
	},
	'selfMailers.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Print and mail a real self mailer (a folded piece, no envelope). Billed per piece and not recallable once in production; pass an idempotency_key',
	},
	'selfMailers.get': {
		riskLevel: 'read',
		description:
			'Read one self mailer by its sfm_ ID, including status and tracking events',
	},
	'selfMailers.list': {
		riskLevel: 'read',
		description:
			'Page through self mailers with cursors and filters (status, size, campaign, send date, metadata)',
	},
	'selfMailers.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a self mailer before it goes to production. A cancelled piece cannot be restored',
	},
	'snapPacks.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Print and mail a real snap pack (a sealed pressure-seal mailer). Billed per piece and not recallable once in production; pass an idempotency_key',
	},
	'snapPacks.get': {
		riskLevel: 'read',
		description:
			'Read one snap pack by its ord_ ID, including status and tracking events',
	},
	'snapPacks.list': {
		riskLevel: 'read',
		description:
			'Page through snap packs with cursors and filters (status, campaign, send date, metadata)',
	},
	'snapPacks.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a snap pack before it goes to production. A cancelled piece cannot be restored',
	},
	'booklets.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Print and mail a real booklet. Billed per piece and not recallable once in production; pass an idempotency_key',
	},
	'booklets.get': {
		riskLevel: 'read',
		description:
			'Read one booklet by its ord_ ID, including status and tracking events',
	},
	'booklets.list': {
		riskLevel: 'read',
		description:
			'Page through booklets with cursors and filters (status, campaign, send date, metadata)',
	},
	'booklets.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a booklet before it goes to production. A cancelled piece cannot be restored',
	},
	'bankAccounts.create': {
		riskLevel: 'write',
		description:
			'Add a US bank account for checks. Lob sends micro-deposits that bankAccounts.verify confirms',
	},
	'bankAccounts.get': {
		riskLevel: 'read',
		description:
			'Read one bank account by its bank_ ID, including whether it is verified',
	},
	'bankAccounts.list': {
		riskLevel: 'read',
		description:
			'Page through bank accounts with cursors, date and metadata filters',
	},
	'bankAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a bank account. Checks can no longer draw on it',
	},
	'bankAccounts.verify': {
		riskLevel: 'write',
		description:
			'Verify a bank account with its two micro-deposit amounts or its descriptor code',
	},
	'billingGroups.create': {
		riskLevel: 'write',
		description: 'Create a billing group to split mail costs by team or client',
	},
	'billingGroups.get': {
		riskLevel: 'read',
		description: 'Read one billing group by its bg_ ID',
	},
	'billingGroups.list': {
		riskLevel: 'read',
		description:
			'Page through billing groups with limit/offset, date filters and sorting',
	},
	'billingGroups.update': {
		riskLevel: 'write',
		description: "Change a billing group's name or description",
	},
	'buckslips.create': {
		riskLevel: 'write',
		description:
			'Create a buckslip (a letter insert) from front and back artwork. Printing happens only when you order stock',
	},
	'buckslips.get': {
		riskLevel: 'read',
		description:
			'Read one buckslip by its bck_ ID, including stock quantities and status',
	},
	'buckslips.list': {
		riskLevel: 'read',
		description: 'Page through buckslips with cursors',
	},
	'buckslips.update': {
		riskLevel: 'write',
		description:
			"Change a buckslip's description or auto-reorder settings. Auto-reorder places billed print orders when stock runs low",
	},
	'buckslips.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a buckslip',
	},
	'buckslips.listOrders': {
		riskLevel: 'read',
		description: 'List the print orders placed for a buckslip',
	},
	'buckslips.createOrder': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Order a print run of a buckslip (at least 5,000). Lob prints and bills the whole order',
	},
	'cards.create': {
		riskLevel: 'write',
		description:
			'Create a card (a plastic or paper insert) from front and back artwork. Printing happens only when you order stock',
	},
	'cards.get': {
		riskLevel: 'read',
		description:
			'Read one card by its card_ ID, including stock quantities and status',
	},
	'cards.list': {
		riskLevel: 'read',
		description: 'Page through cards with cursors',
	},
	'cards.update': {
		riskLevel: 'write',
		description:
			"Change a card's description or auto-reorder settings. Auto-reorder places billed print orders when stock runs low",
	},
	'cards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a card',
	},
	'cards.listOrders': {
		riskLevel: 'read',
		description: 'List the print orders placed for a card',
	},
	'cards.createOrder': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Order a print run of a card (at least 10,000). Lob prints and bills the whole order',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a draft campaign for bulk mail. Nothing mails until campaigns.send',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Read one campaign by its cmp_ ID, with its creatives and uploads',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'Page through campaigns with cursors',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			"Change a campaign's name, schedule, use type or other settings",
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a campaign',
	},
	'campaigns.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a campaign: Lob prints, mails and bills a piece for every row of its audience upload. Cannot be undone after the cancel window',
	},
	'creatives.create': {
		riskLevel: 'write',
		description:
			'Add the artwork (a postcard, letter or self mailer creative) to a campaign',
	},
	'creatives.get': {
		riskLevel: 'read',
		description: 'Read one creative by its crv_ ID',
	},
	'creatives.update': {
		riskLevel: 'write',
		description: "Change a creative's return address, description or metadata",
	},
	'uploads.create': {
		riskLevel: 'write',
		description:
			'Create an audience upload for a campaign and map its CSV columns to address fields and merge variables',
	},
	'uploads.get': {
		riskLevel: 'read',
		description:
			'Read one upload by its upl_ ID, including processing state and row counts',
	},
	'uploads.list': {
		riskLevel: 'read',
		description: 'List audience uploads, optionally for one campaign',
	},
	'uploads.update': {
		riskLevel: 'write',
		description: "Change an upload's column mappings or metadata",
	},
	'uploads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an audience upload',
	},
	'uploads.uploadFile': {
		riskLevel: 'write',
		description:
			'Attach the audience CSV file to an upload; Lob validates its rows asynchronously',
	},
	'uploads.createExport': {
		riskLevel: 'write',
		description:
			"Start an export of an upload's rows (all, failures or successes)",
	},
	'uploads.getExport': {
		riskLevel: 'read',
		description: 'Read an upload export, including its download URL once ready',
	},
	'uploads.getReport': {
		riskLevel: 'read',
		description: "Page through an upload's per-row validation report",
	},
	'informedDelivery.list': {
		riskLevel: 'read',
		description: 'List USPS Informed Delivery campaigns',
	},
	'informedDelivery.create': {
		riskLevel: 'write',
		description:
			'Create a USPS Informed Delivery campaign (an email preview with a ride-along image and link) pending approval',
	},
	'informedDelivery.get': {
		riskLevel: 'read',
		description: 'Read one Informed Delivery campaign by its USPS campaign ID',
	},
	'informedDelivery.update': {
		riskLevel: 'write',
		description: "Change an Informed Delivery campaign's details or approve it",
	},
	'resourceProofs.create': {
		riskLevel: 'write',
		description:
			'Render a proof of a postcard, letter or self mailer for review, without mailing anything',
	},
	'resourceProofs.get': {
		riskLevel: 'read',
		description:
			'Read one resource proof by its res_prf_ ID, including the rendered PDF URL',
	},
	'resourceProofs.update': {
		riskLevel: 'write',
		description: 'Re-render a resource proof with a different template',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Save an HTML template that mailpieces can name by tmpl_ ID',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Read one template by its tmpl_ ID, with its published version',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'Page through templates with cursors, date and metadata filters',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			"Change a template's description or which version is published",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a template and its versions',
	},
	'templateVersions.create': {
		riskLevel: 'write',
		description: 'Add a new HTML version to a template',
	},
	'templateVersions.get': {
		riskLevel: 'read',
		description: 'Read one template version by its vrsn_ ID',
	},
	'templateVersions.list': {
		riskLevel: 'read',
		description: "Page through a template's versions",
	},
	'templateVersions.update': {
		riskLevel: 'write',
		description:
			"Change a template version's description, engine or required variables",
	},
	'templateVersions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a template version (not the published one)',
	},
	'domains.create': {
		riskLevel: 'write',
		description: 'Register a custom domain for short links',
	},
	'domains.get': {
		riskLevel: 'read',
		description:
			'Read one short-link domain, including whether its DNS is configured',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'Page through short-link domains',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a short-link domain; its links stop resolving',
	},
	'links.create': {
		riskLevel: 'write',
		description: 'Create a short link that redirects to a long URL',
	},
	'links.get': {
		riskLevel: 'read',
		description: 'Read one short link',
	},
	'links.list': {
		riskLevel: 'read',
		description: 'Page through short links, optionally by campaign or domain',
	},
	'links.update': {
		riskLevel: 'write',
		description: "Change a short link's target URL, title or metadata",
	},
	'links.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a short link; printed copies stop resolving',
	},
	'qrCodes.list': {
		riskLevel: 'read',
		description:
			'List QR code scan analytics for mailpieces, optionally only scanned codes or given piece IDs',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description:
			"Read the account's current Lob Credits balance (live keys only; a test key gets 401)",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lobEndpointsNested>;

export type BaseLobPlugin<T extends LobPluginOptions> = CorsairPlugin<
	'lob',
	typeof LobSchema,
	typeof lobEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLobPlugin = BaseLobPlugin<LobPluginOptions>;

export type ExternalLobPlugin<T extends LobPluginOptions> = BaseLobPlugin<T>;

export function lob<const T extends LobPluginOptions>(
	incomingOptions: LobPluginOptions & T = {} as LobPluginOptions & T,
): ExternalLobPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lob',
		schema: LobSchema,
		options: options,
		hooks: options.hooks,
		endpoints: lobEndpointsNested,
		webhooks: {},
		endpointMeta: lobEndpointMeta,
		endpointSchemas: lobEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LobKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('lob', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLobPlugin;
}

export type {
	LobEndpointInputs,
	LobEndpointOutputs,
} from './endpoints/types';
export type {
	IntlVerification,
	LobAddress,
	UsVerification,
} from './endpoints/types-base';
