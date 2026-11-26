import * as Account from './account';
import * as AccountExtra from './account-extra';
import * as Addresses from './addresses';
import * as Autocomplete from './autocomplete';
import * as Campaigns from './campaigns';
import * as IntlVerifications from './intl-verifications';
import * as Inventory from './inventory';
import * as Letters from './letters';
import * as Links from './links';
import * as Mail from './mailpieces';
import * as Postcards from './postcards';
import * as Templates from './templates';
import * as UsVerifications from './us-verifications';
import * as Zip from './zip';

// The nested shape callers write: `api.<group>.<op>`. Groups follow the
// sections of Lob's API reference (OpenAPI 1.22.0).
export const lobEndpointsNested = {
	usVerifications: {
		verify: UsVerifications.verify,
		bulk: UsVerifications.bulk,
	},
	intlVerifications: {
		verify: IntlVerifications.verify,
		bulk: AccountExtra.intlVerificationsBulk,
	},
	autocomplete: {
		usAutocomplete: Autocomplete.usAutocomplete,
	},
	zip: {
		usZipLookup: Zip.usZipLookup,
	},
	reverseGeocode: {
		lookup: AccountExtra.reverseGeocodeLookup,
	},
	identityValidation: {
		validate: AccountExtra.identityValidationValidate,
	},
	addresses: {
		create: Addresses.create,
		get: Addresses.get,
		list: Addresses.list,
		// `delete` is reserved, so the function is `remove`.
		delete: Addresses.remove,
	},
	postcards: {
		send: Postcards.send,
		get: Postcards.get,
		list: Mail.postcardsList,
		cancel: Mail.postcardsCancel,
	},
	letters: {
		send: Letters.send,
		get: Letters.get,
		list: Mail.lettersList,
		cancel: Mail.lettersCancel,
	},
	checks: {
		send: Mail.checksSend,
		get: Mail.checksGet,
		list: Mail.checksList,
		cancel: Mail.checksCancel,
	},
	selfMailers: {
		send: Mail.selfMailersSend,
		get: Mail.selfMailersGet,
		list: Mail.selfMailersList,
		cancel: Mail.selfMailersCancel,
	},
	snapPacks: {
		send: Mail.snapPacksSend,
		get: Mail.snapPacksGet,
		list: Mail.snapPacksList,
		cancel: Mail.snapPacksCancel,
	},
	booklets: {
		send: Mail.bookletsSend,
		get: Mail.bookletsGet,
		list: Mail.bookletsList,
		cancel: Mail.bookletsCancel,
	},
	bankAccounts: {
		create: AccountExtra.bankAccountsCreate,
		get: AccountExtra.bankAccountsGet,
		list: AccountExtra.bankAccountsList,
		delete: AccountExtra.bankAccountsDelete,
		verify: AccountExtra.bankAccountsVerify,
	},
	billingGroups: {
		create: AccountExtra.billingGroupsCreate,
		get: AccountExtra.billingGroupsGet,
		list: AccountExtra.billingGroupsList,
		update: AccountExtra.billingGroupsUpdate,
	},
	buckslips: {
		create: Inventory.buckslipsCreate,
		get: Inventory.buckslipsGet,
		list: Inventory.buckslipsList,
		update: Inventory.buckslipsUpdate,
		delete: Inventory.buckslipsDelete,
		listOrders: Inventory.buckslipsListOrders,
		createOrder: Inventory.buckslipsCreateOrder,
	},
	cards: {
		create: Inventory.cardsCreate,
		get: Inventory.cardsGet,
		list: Inventory.cardsList,
		update: Inventory.cardsUpdate,
		delete: Inventory.cardsDelete,
		listOrders: Inventory.cardsListOrders,
		createOrder: Inventory.cardsCreateOrder,
	},
	campaigns: {
		create: Campaigns.campaignsCreate,
		get: Campaigns.campaignsGet,
		list: Campaigns.campaignsList,
		update: Campaigns.campaignsUpdate,
		delete: Campaigns.campaignsDelete,
		send: Campaigns.campaignsSend,
	},
	creatives: {
		create: Campaigns.creativesCreate,
		get: Campaigns.creativesGet,
		update: Campaigns.creativesUpdate,
	},
	uploads: {
		create: Campaigns.uploadsCreate,
		get: Campaigns.uploadsGet,
		list: Campaigns.uploadsList,
		update: Campaigns.uploadsUpdate,
		delete: Campaigns.uploadsDelete,
		uploadFile: Campaigns.uploadsUploadFile,
		createExport: Campaigns.uploadsCreateExport,
		getExport: Campaigns.uploadsGetExport,
		getReport: Campaigns.uploadsGetReport,
	},
	informedDelivery: {
		list: Campaigns.informedDeliveryList,
		create: Campaigns.informedDeliveryCreate,
		get: Campaigns.informedDeliveryGet,
		update: Campaigns.informedDeliveryUpdate,
	},
	resourceProofs: {
		create: Campaigns.resourceProofsCreate,
		get: Campaigns.resourceProofsGet,
		update: Campaigns.resourceProofsUpdate,
	},
	templates: {
		create: Templates.templatesCreate,
		get: Templates.templatesGet,
		list: Templates.templatesList,
		update: Templates.templatesUpdate,
		delete: Templates.templatesDelete,
	},
	templateVersions: {
		create: Templates.templateVersionsCreate,
		get: Templates.templateVersionsGet,
		list: Templates.templateVersionsList,
		update: Templates.templateVersionsUpdate,
		delete: Templates.templateVersionsDelete,
	},
	domains: {
		create: Links.domainsCreate,
		get: Links.domainsGet,
		list: Links.domainsList,
		delete: Links.domainsDelete,
	},
	links: {
		create: Links.linksCreate,
		get: Links.linksGet,
		list: Links.linksList,
		update: Links.linksUpdate,
		delete: Links.linksDelete,
	},
	qrCodes: {
		list: Links.qrCodesList,
	},
	account: {
		getBalance: Account.getBalance,
	},
} as const;

export * from './registry';
export * from './types';
