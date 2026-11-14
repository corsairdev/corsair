import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	AddressBook,
	Auth,
	Basket,
	Bundles,
	Cards,
	CustomCards,
	Fonts,
	GiftCards,
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
	Inserts,
	Orders,
	Prospecting,
	QrCodes,
	Shipping,
	Signatures,
	Templates,
} from './endpoints';
import type {
	HandwryttenEndpointInputs,
	HandwryttenEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HandwryttenSchema } from './schema';

export type HandwryttenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalHandwryttenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof handwryttenEndpointsNested>;
};

export type HandwryttenContext = CorsairPluginContext<
	typeof HandwryttenSchema,
	HandwryttenPluginOptions
>;

export type HandwryttenKeyBuilderContext =
	KeyBuilderContext<HandwryttenPluginOptions>;

export type HandwryttenBoundEndpoints = BindEndpoints<
	typeof handwryttenEndpointsNested
>;

type HandwryttenEndpoint<K extends keyof HandwryttenEndpointOutputs> =
	CorsairEndpoint<
		HandwryttenContext,
		HandwryttenEndpointInputs[K],
		HandwryttenEndpointOutputs[K]
	>;

export type HandwryttenEndpoints = {
	'cards.list': HandwryttenEndpoint<'cards.list'>;
	'cards.get': HandwryttenEndpoint<'cards.get'>;
	'cards.sections': HandwryttenEndpoint<'cards.sections'>;
	'cards.categories': HandwryttenEndpoint<'cards.categories'>;

	'customCards.dimensions': HandwryttenEndpoint<'customCards.dimensions'>;
	'customCards.presetImages': HandwryttenEndpoint<'customCards.presetImages'>;
	'customCards.listImages': HandwryttenEndpoint<'customCards.listImages'>;
	'customCards.uploadImage': HandwryttenEndpoint<'customCards.uploadImage'>;
	'customCards.checkImage': HandwryttenEndpoint<'customCards.checkImage'>;
	'customCards.deleteImage': HandwryttenEndpoint<'customCards.deleteImage'>;
	'customCards.create': HandwryttenEndpoint<'customCards.create'>;
	'customCards.delete': HandwryttenEndpoint<'customCards.delete'>;

	'orders.sendSingle': HandwryttenEndpoint<'orders.sendSingle'>;
	'orders.addToBasket': HandwryttenEndpoint<'orders.addToBasket'>;
	'orders.get': HandwryttenEndpoint<'orders.get'>;
	'orders.cancel': HandwryttenEndpoint<'orders.cancel'>;

	'basket.count': HandwryttenEndpoint<'basket.count'>;
	'basket.clear': HandwryttenEndpoint<'basket.clear'>;
	'basket.send': HandwryttenEndpoint<'basket.send'>;

	'fonts.list': HandwryttenEndpoint<'fonts.list'>;

	'signatures.list': HandwryttenEndpoint<'signatures.list'>;

	'addressBook.countries': HandwryttenEndpoint<'addressBook.countries'>;
	'addressBook.states': HandwryttenEndpoint<'addressBook.states'>;
	'addressBook.listRecipients': HandwryttenEndpoint<'addressBook.listRecipients'>;
	'addressBook.addRecipient': HandwryttenEndpoint<'addressBook.addRecipient'>;
	'addressBook.updateRecipient': HandwryttenEndpoint<'addressBook.updateRecipient'>;
	'addressBook.deleteRecipient': HandwryttenEndpoint<'addressBook.deleteRecipient'>;
	'addressBook.listSenders': HandwryttenEndpoint<'addressBook.listSenders'>;
	'addressBook.getSender': HandwryttenEndpoint<'addressBook.getSender'>;
	'addressBook.addSender': HandwryttenEndpoint<'addressBook.addSender'>;
	'addressBook.updateSender': HandwryttenEndpoint<'addressBook.updateSender'>;
	'addressBook.deleteSender': HandwryttenEndpoint<'addressBook.deleteSender'>;
	'addressBook.setDefaultSender': HandwryttenEndpoint<'addressBook.setDefaultSender'>;

	'templates.categories': HandwryttenEndpoint<'templates.categories'>;
	'templates.list': HandwryttenEndpoint<'templates.list'>;
	'templates.get': HandwryttenEndpoint<'templates.get'>;
	'templates.create': HandwryttenEndpoint<'templates.create'>;
	'templates.update': HandwryttenEndpoint<'templates.update'>;
	'templates.delete': HandwryttenEndpoint<'templates.delete'>;

	'giftCards.list': HandwryttenEndpoint<'giftCards.list'>;

	'inserts.list': HandwryttenEndpoint<'inserts.list'>;

	'bundles.list': HandwryttenEndpoint<'bundles.list'>;

	'qrCodes.list': HandwryttenEndpoint<'qrCodes.list'>;
	'qrCodes.create': HandwryttenEndpoint<'qrCodes.create'>;
	'qrCodes.delete': HandwryttenEndpoint<'qrCodes.delete'>;
	'qrCodes.dashboard': HandwryttenEndpoint<'qrCodes.dashboard'>;
	'qrCodes.frames': HandwryttenEndpoint<'qrCodes.frames'>;

	'shipping.stampOptions': HandwryttenEndpoint<'shipping.stampOptions'>;

	'prospecting.calculateTargets': HandwryttenEndpoint<'prospecting.calculateTargets'>;
	'prospecting.preview': HandwryttenEndpoint<'prospecting.preview'>;
	'prospecting.createOrder': HandwryttenEndpoint<'prospecting.createOrder'>;

	'auth.getUser': HandwryttenEndpoint<'auth.getUser'>;
	'auth.checkAuth': HandwryttenEndpoint<'auth.checkAuth'>;
	'auth.setTestMode': HandwryttenEndpoint<'auth.setTestMode'>;
	'auth.logout': HandwryttenEndpoint<'auth.logout'>;
};

const handwryttenEndpointsNested = {
	cards: {
		list: Cards.list,
		get: Cards.get,
		sections: Cards.sections,
		categories: Cards.categories,
	},
	customCards: {
		dimensions: CustomCards.dimensions,
		presetImages: CustomCards.presetImages,
		listImages: CustomCards.listImages,
		uploadImage: CustomCards.uploadImage,
		checkImage: CustomCards.checkImage,
		deleteImage: CustomCards.deleteImage,
		create: CustomCards.create,
		delete: CustomCards.deleteCustomCard,
	},
	orders: {
		sendSingle: Orders.sendSingle,
		addToBasket: Orders.addToBasket,
		get: Orders.get,
		cancel: Orders.cancel,
	},
	basket: {
		count: Basket.count,
		clear: Basket.clear,
		send: Basket.send,
	},
	fonts: {
		list: Fonts.list,
	},
	signatures: {
		list: Signatures.list,
	},
	addressBook: {
		countries: AddressBook.countries,
		states: AddressBook.states,
		listRecipients: AddressBook.listRecipients,
		addRecipient: AddressBook.addRecipient,
		updateRecipient: AddressBook.updateRecipient,
		deleteRecipient: AddressBook.deleteRecipient,
		listSenders: AddressBook.listSenders,
		getSender: AddressBook.getSender,
		addSender: AddressBook.addSender,
		updateSender: AddressBook.updateSender,
		deleteSender: AddressBook.deleteSender,
		setDefaultSender: AddressBook.setDefaultSender,
	},
	templates: {
		categories: Templates.categories,
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.deleteTemplate,
	},
	giftCards: {
		list: GiftCards.list,
	},
	inserts: {
		list: Inserts.list,
	},
	bundles: {
		list: Bundles.list,
	},
	qrCodes: {
		list: QrCodes.list,
		create: QrCodes.create,
		delete: QrCodes.deleteQrCode,
		dashboard: QrCodes.dashboard,
		frames: QrCodes.frames,
	},
	shipping: {
		stampOptions: Shipping.stampOptions,
	},
	prospecting: {
		calculateTargets: Prospecting.calculateTargets,
		preview: Prospecting.preview,
		createOrder: Prospecting.createOrder,
	},
	auth: {
		getUser: Auth.getUser,
		checkAuth: Auth.checkAuth,
		setTestMode: Auth.setTestMode,
		logout: Auth.logout,
	},
} as const;

export const handwryttenEndpointSchemas = {
	'cards.list': {
		input: HandwryttenEndpointInputSchemas['cards.list'],
		output: HandwryttenEndpointOutputSchemas['cards.list'],
	},
	'cards.get': {
		input: HandwryttenEndpointInputSchemas['cards.get'],
		output: HandwryttenEndpointOutputSchemas['cards.get'],
	},
	'cards.sections': {
		input: HandwryttenEndpointInputSchemas['cards.sections'],
		output: HandwryttenEndpointOutputSchemas['cards.sections'],
	},
	'cards.categories': {
		input: HandwryttenEndpointInputSchemas['cards.categories'],
		output: HandwryttenEndpointOutputSchemas['cards.categories'],
	},

	'customCards.dimensions': {
		input: HandwryttenEndpointInputSchemas['customCards.dimensions'],
		output: HandwryttenEndpointOutputSchemas['customCards.dimensions'],
	},
	'customCards.presetImages': {
		input: HandwryttenEndpointInputSchemas['customCards.presetImages'],
		output: HandwryttenEndpointOutputSchemas['customCards.presetImages'],
	},
	'customCards.listImages': {
		input: HandwryttenEndpointInputSchemas['customCards.listImages'],
		output: HandwryttenEndpointOutputSchemas['customCards.listImages'],
	},
	'customCards.uploadImage': {
		input: HandwryttenEndpointInputSchemas['customCards.uploadImage'],
		output: HandwryttenEndpointOutputSchemas['customCards.uploadImage'],
	},
	'customCards.checkImage': {
		input: HandwryttenEndpointInputSchemas['customCards.checkImage'],
		output: HandwryttenEndpointOutputSchemas['customCards.checkImage'],
	},
	'customCards.deleteImage': {
		input: HandwryttenEndpointInputSchemas['customCards.deleteImage'],
		output: HandwryttenEndpointOutputSchemas['customCards.deleteImage'],
	},
	'customCards.create': {
		input: HandwryttenEndpointInputSchemas['customCards.create'],
		output: HandwryttenEndpointOutputSchemas['customCards.create'],
	},
	'customCards.delete': {
		input: HandwryttenEndpointInputSchemas['customCards.delete'],
		output: HandwryttenEndpointOutputSchemas['customCards.delete'],
	},

	'orders.sendSingle': {
		input: HandwryttenEndpointInputSchemas['orders.sendSingle'],
		output: HandwryttenEndpointOutputSchemas['orders.sendSingle'],
	},
	'orders.addToBasket': {
		input: HandwryttenEndpointInputSchemas['orders.addToBasket'],
		output: HandwryttenEndpointOutputSchemas['orders.addToBasket'],
	},
	'orders.get': {
		input: HandwryttenEndpointInputSchemas['orders.get'],
		output: HandwryttenEndpointOutputSchemas['orders.get'],
	},
	'orders.cancel': {
		input: HandwryttenEndpointInputSchemas['orders.cancel'],
		output: HandwryttenEndpointOutputSchemas['orders.cancel'],
	},

	'basket.count': {
		input: HandwryttenEndpointInputSchemas['basket.count'],
		output: HandwryttenEndpointOutputSchemas['basket.count'],
	},
	'basket.clear': {
		input: HandwryttenEndpointInputSchemas['basket.clear'],
		output: HandwryttenEndpointOutputSchemas['basket.clear'],
	},
	'basket.send': {
		input: HandwryttenEndpointInputSchemas['basket.send'],
		output: HandwryttenEndpointOutputSchemas['basket.send'],
	},

	'fonts.list': {
		input: HandwryttenEndpointInputSchemas['fonts.list'],
		output: HandwryttenEndpointOutputSchemas['fonts.list'],
	},

	'signatures.list': {
		input: HandwryttenEndpointInputSchemas['signatures.list'],
		output: HandwryttenEndpointOutputSchemas['signatures.list'],
	},

	'addressBook.countries': {
		input: HandwryttenEndpointInputSchemas['addressBook.countries'],
		output: HandwryttenEndpointOutputSchemas['addressBook.countries'],
	},
	'addressBook.states': {
		input: HandwryttenEndpointInputSchemas['addressBook.states'],
		output: HandwryttenEndpointOutputSchemas['addressBook.states'],
	},
	'addressBook.listRecipients': {
		input: HandwryttenEndpointInputSchemas['addressBook.listRecipients'],
		output: HandwryttenEndpointOutputSchemas['addressBook.listRecipients'],
	},
	'addressBook.addRecipient': {
		input: HandwryttenEndpointInputSchemas['addressBook.addRecipient'],
		output: HandwryttenEndpointOutputSchemas['addressBook.addRecipient'],
	},
	'addressBook.updateRecipient': {
		input: HandwryttenEndpointInputSchemas['addressBook.updateRecipient'],
		output: HandwryttenEndpointOutputSchemas['addressBook.updateRecipient'],
	},
	'addressBook.deleteRecipient': {
		input: HandwryttenEndpointInputSchemas['addressBook.deleteRecipient'],
		output: HandwryttenEndpointOutputSchemas['addressBook.deleteRecipient'],
	},
	'addressBook.listSenders': {
		input: HandwryttenEndpointInputSchemas['addressBook.listSenders'],
		output: HandwryttenEndpointOutputSchemas['addressBook.listSenders'],
	},
	'addressBook.getSender': {
		input: HandwryttenEndpointInputSchemas['addressBook.getSender'],
		output: HandwryttenEndpointOutputSchemas['addressBook.getSender'],
	},
	'addressBook.addSender': {
		input: HandwryttenEndpointInputSchemas['addressBook.addSender'],
		output: HandwryttenEndpointOutputSchemas['addressBook.addSender'],
	},
	'addressBook.updateSender': {
		input: HandwryttenEndpointInputSchemas['addressBook.updateSender'],
		output: HandwryttenEndpointOutputSchemas['addressBook.updateSender'],
	},
	'addressBook.deleteSender': {
		input: HandwryttenEndpointInputSchemas['addressBook.deleteSender'],
		output: HandwryttenEndpointOutputSchemas['addressBook.deleteSender'],
	},
	'addressBook.setDefaultSender': {
		input: HandwryttenEndpointInputSchemas['addressBook.setDefaultSender'],
		output: HandwryttenEndpointOutputSchemas['addressBook.setDefaultSender'],
	},

	'templates.categories': {
		input: HandwryttenEndpointInputSchemas['templates.categories'],
		output: HandwryttenEndpointOutputSchemas['templates.categories'],
	},
	'templates.list': {
		input: HandwryttenEndpointInputSchemas['templates.list'],
		output: HandwryttenEndpointOutputSchemas['templates.list'],
	},
	'templates.get': {
		input: HandwryttenEndpointInputSchemas['templates.get'],
		output: HandwryttenEndpointOutputSchemas['templates.get'],
	},
	'templates.create': {
		input: HandwryttenEndpointInputSchemas['templates.create'],
		output: HandwryttenEndpointOutputSchemas['templates.create'],
	},
	'templates.update': {
		input: HandwryttenEndpointInputSchemas['templates.update'],
		output: HandwryttenEndpointOutputSchemas['templates.update'],
	},
	'templates.delete': {
		input: HandwryttenEndpointInputSchemas['templates.delete'],
		output: HandwryttenEndpointOutputSchemas['templates.delete'],
	},

	'giftCards.list': {
		input: HandwryttenEndpointInputSchemas['giftCards.list'],
		output: HandwryttenEndpointOutputSchemas['giftCards.list'],
	},

	'inserts.list': {
		input: HandwryttenEndpointInputSchemas['inserts.list'],
		output: HandwryttenEndpointOutputSchemas['inserts.list'],
	},

	'bundles.list': {
		input: HandwryttenEndpointInputSchemas['bundles.list'],
		output: HandwryttenEndpointOutputSchemas['bundles.list'],
	},

	'qrCodes.list': {
		input: HandwryttenEndpointInputSchemas['qrCodes.list'],
		output: HandwryttenEndpointOutputSchemas['qrCodes.list'],
	},
	'qrCodes.create': {
		input: HandwryttenEndpointInputSchemas['qrCodes.create'],
		output: HandwryttenEndpointOutputSchemas['qrCodes.create'],
	},
	'qrCodes.delete': {
		input: HandwryttenEndpointInputSchemas['qrCodes.delete'],
		output: HandwryttenEndpointOutputSchemas['qrCodes.delete'],
	},
	'qrCodes.dashboard': {
		input: HandwryttenEndpointInputSchemas['qrCodes.dashboard'],
		output: HandwryttenEndpointOutputSchemas['qrCodes.dashboard'],
	},
	'qrCodes.frames': {
		input: HandwryttenEndpointInputSchemas['qrCodes.frames'],
		output: HandwryttenEndpointOutputSchemas['qrCodes.frames'],
	},

	'shipping.stampOptions': {
		input: HandwryttenEndpointInputSchemas['shipping.stampOptions'],
		output: HandwryttenEndpointOutputSchemas['shipping.stampOptions'],
	},

	'prospecting.calculateTargets': {
		input: HandwryttenEndpointInputSchemas['prospecting.calculateTargets'],
		output: HandwryttenEndpointOutputSchemas['prospecting.calculateTargets'],
	},
	'prospecting.preview': {
		input: HandwryttenEndpointInputSchemas['prospecting.preview'],
		output: HandwryttenEndpointOutputSchemas['prospecting.preview'],
	},
	'prospecting.createOrder': {
		input: HandwryttenEndpointInputSchemas['prospecting.createOrder'],
		output: HandwryttenEndpointOutputSchemas['prospecting.createOrder'],
	},

	'auth.getUser': {
		input: HandwryttenEndpointInputSchemas['auth.getUser'],
		output: HandwryttenEndpointOutputSchemas['auth.getUser'],
	},
	'auth.checkAuth': {
		input: HandwryttenEndpointInputSchemas['auth.checkAuth'],
		output: HandwryttenEndpointOutputSchemas['auth.checkAuth'],
	},
	'auth.setTestMode': {
		input: HandwryttenEndpointInputSchemas['auth.setTestMode'],
		output: HandwryttenEndpointOutputSchemas['auth.setTestMode'],
	},
	'auth.logout': {
		input: HandwryttenEndpointInputSchemas['auth.logout'],
		output: HandwryttenEndpointOutputSchemas['auth.logout'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof handwryttenEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const handwryttenEndpointMeta = {
	'cards.list': {
		riskLevel: 'read',
		description:
			'List available greeting cards and designs with optional filtering and pagination',
	},
	'cards.get': {
		riskLevel: 'read',
		description: 'Get details, dimensions, and cover image for a specific card',
	},
	'cards.sections': {
		riskLevel: 'read',
		description: 'List cards grouped by category sections',
	},
	'cards.categories': {
		riskLevel: 'read',
		description: 'List all card categories and taxonomies',
	},

	'customCards.dimensions': {
		riskLevel: 'read',
		description:
			'List supported card dimensions and print orientations for custom cards',
	},
	'customCards.presetImages': {
		riskLevel: 'read',
		description: 'List preset cover images available for custom card design',
	},
	'customCards.listImages': {
		riskLevel: 'read',
		description: 'List custom logos and user-uploaded images',
	},
	'customCards.uploadImage': {
		riskLevel: 'write',
		description: 'Upload a custom logo or image for card customization',
	},
	'customCards.checkImage': {
		riskLevel: 'read',
		description:
			'Check image quality, resolution, and DPI for printing compatibility',
	},
	'customCards.deleteImage': {
		riskLevel: 'destructive',
		description: 'Delete a previously uploaded custom logo or image',
	},
	'customCards.create': {
		riskLevel: 'write',
		description:
			'Create a custom card template with uploaded cover or inside artwork',
	},
	'customCards.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a custom card template',
	},

	'orders.sendSingle': {
		riskLevel: 'destructive',
		description:
			'Place a single real handwritten card order (spends credits and triggers robotic fulfillment)',
	},
	'orders.addToBasket': {
		riskLevel: 'write',
		description:
			'Add a handwritten card order to the shopping basket for batch sending',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Get status and details for an existing order by ID',
	},
	'orders.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an order before it enters robotic production',
	},

	'basket.count': {
		riskLevel: 'read',
		description: 'Get current item count in the shopping basket',
	},
	'basket.clear': {
		riskLevel: 'destructive',
		description: 'Remove all pending orders and clear the shopping basket',
	},
	'basket.send': {
		riskLevel: 'destructive',
		description:
			'Submit and charge all pending orders in the shopping basket for robotic fulfillment',
	},

	'fonts.list': {
		riskLevel: 'read',
		description:
			'List available realistic handwriting font styles and stroke properties',
	},

	'signatures.list': {
		riskLevel: 'read',
		description: 'List user handwriting signatures saved on the account',
	},

	'addressBook.countries': {
		riskLevel: 'read',
		description:
			'List supported destination countries and country codes for mailing',
	},
	'addressBook.states': {
		riskLevel: 'read',
		description: 'List states and provinces for a given country',
	},
	'addressBook.listRecipients': {
		riskLevel: 'read',
		description: 'List saved recipient mailing addresses from the address book',
	},
	'addressBook.addRecipient': {
		riskLevel: 'destructive',
		description: 'Add a new recipient address to the user address book',
	},
	'addressBook.updateRecipient': {
		riskLevel: 'destructive',
		description:
			'Update an existing recipient address in the user address book',
	},
	'addressBook.deleteRecipient': {
		riskLevel: 'destructive',
		description: 'Delete a recipient address from the user address book',
	},
	'addressBook.listSenders': {
		riskLevel: 'read',
		description: 'List saved return/sender addresses from the account',
	},
	'addressBook.getSender': {
		riskLevel: 'read',
		description: 'Get default sender return address and account billing info',
	},
	'addressBook.addSender': {
		riskLevel: 'destructive',
		description: 'Add a new sender return address to the account',
	},
	'addressBook.updateSender': {
		riskLevel: 'destructive',
		description: 'Update the sender return address on the account',
	},
	'addressBook.deleteSender': {
		riskLevel: 'destructive',
		description: 'Delete a sender return address from the account',
	},
	'addressBook.setDefaultSender': {
		riskLevel: 'destructive',
		description: 'Set an address as the default sender return address',
	},

	'templates.categories': {
		riskLevel: 'read',
		description: 'List template categories available for card messages',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List saved message templates with optional category filter',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a specific message template by ID',
	},
	'templates.create': {
		riskLevel: 'destructive',
		description: 'Create a new saved message template in the user account',
	},
	'templates.update': {
		riskLevel: 'destructive',
		description: 'Update an existing message template in the user account',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message template from the user account',
	},

	'giftCards.list': {
		riskLevel: 'read',
		description:
			'List physical merchant gift cards and denominations that can be enclosed in notes',
	},

	'inserts.list': {
		riskLevel: 'read',
		description:
			'List custom marketing inserts and business cards available for envelope insertion',
	},

	'bundles.list': {
		riskLevel: 'read',
		description:
			'List product bundles and gift pairings available to enclose with cards',
	},

	'qrCodes.list': {
		riskLevel: 'read',
		description: 'List trackable QR codes created in the account',
	},
	'qrCodes.create': {
		riskLevel: 'write',
		description:
			'Create a dynamic trackable QR code to print on handwritten cards',
	},
	'qrCodes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a trackable QR code by ID',
	},
	'qrCodes.dashboard': {
		riskLevel: 'read',
		description: 'Get scan analytics and statistics for created QR codes',
	},
	'qrCodes.frames': {
		riskLevel: 'read',
		description: 'List decorative frame designs available for printed QR codes',
	},

	'shipping.stampOptions': {
		riskLevel: 'read',
		description:
			'List postage stamp options (first-class vs presorted mail) and rates',
	},

	'prospecting.calculateTargets': {
		riskLevel: 'read',
		description:
			'Calculate target recipient counts based on demographic and geographic filters',
	},
	'prospecting.preview': {
		riskLevel: 'read',
		description:
			'Preview prospecting order pricing and recipient volume before sending',
	},
	'prospecting.createOrder': {
		riskLevel: 'destructive',
		description:
			'Create a direct-mail prospecting campaign order with targeted recipient lists',
	},

	'auth.getUser': {
		riskLevel: 'read',
		description:
			'Get authenticated user profile details, email, and credit balance',
	},
	'auth.checkAuth': {
		riskLevel: 'read',
		description:
			'Check API key authentication status and whether test mode is active',
	},
	'auth.setTestMode': {
		riskLevel: 'write',
		description:
			'Enable or disable account test mode for simulating orders without fulfillment charges',
	},
	'auth.logout': {
		riskLevel: 'write',
		description: 'Invalidate current session credentials',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof handwryttenEndpointsNested
>;

export const handwryttenAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHandwryttenPlugin<T extends HandwryttenPluginOptions> =
	CorsairPlugin<
		'handwrytten',
		typeof HandwryttenSchema,
		typeof handwryttenEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHandwryttenPlugin =
	BaseHandwryttenPlugin<HandwryttenPluginOptions>;

export type ExternalHandwryttenPlugin<T extends HandwryttenPluginOptions> =
	BaseHandwryttenPlugin<T>;

const PUBLIC_ENDPOINTS = new Set([
	'cards.list',
	'cards.get',
	'cards.sections',
	'cards.categories',
	'customCards.dimensions',
	'customCards.presetImages',
	'fonts.list',
	'signatures.list',
	'addressBook.countries',
	'addressBook.states',
	'templates.categories',
	'giftCards.list',
	'inserts.list',
	'bundles.list',
	'shipping.stampOptions',
	'qrCodes.frames',
]);

export function handwrytten<const T extends HandwryttenPluginOptions>(
	incomingOptions: HandwryttenPluginOptions &
		T = {} as HandwryttenPluginOptions & T,
): ExternalHandwryttenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};

	return {
		id: 'handwrytten',
		authConfig: handwryttenAuthConfig,
		schema: HandwryttenSchema,
		options,
		hooks: options.hooks,
		endpoints: handwryttenEndpointsNested,
		webhooks: {},
		endpointMeta: handwryttenEndpointMeta,
		endpointSchemas: handwryttenEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: HandwryttenKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.keys) {
				const apiKey = await ctx.keys.get_api_key();
				if (apiKey && apiKey.trim().length > 0) {
					return apiKey.trim();
				}
			}
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			throw new AuthMissingError('handwrytten', 'api_key');
		},
	} satisfies InternalHandwryttenPlugin;
}

export * from './endpoints';
