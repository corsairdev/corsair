import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Addresses,
	Campaigns,
	Events,
	Files,
	Groups,
	Letters,
	Postcards,
	Recipients,
	Reporting,
	Selections,
	Sms,
	Tools,
} from './endpoints';
import type {
	StannpEndpointInputs,
	StannpEndpointOutputs,
} from './endpoints/types';
import {
	StannpEndpointInputSchemas,
	StannpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StannpSchema } from './schema';
import {
	campaignStatus,
	mailpieceStatus,
	recipientEvents,
	testUrl,
} from './webhooks';
import type {
	StannpWebhookEvent,
	StannpWebhookOutputs,
	StannpWebhookPayload,
} from './webhooks/types';
import {
	matchStannpWebhook,
	StannpWebhookEventSchemas,
} from './webhooks/types';

export type StannpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Stannp API key (account settings, at the bottom of the page). */
	key?: string;
	/** Which Stannp platform the account lives on. Defaults to us. */
	region?: 'us' | 'eu';
	/**
	 * Secret set on the webhook in Stannp. Overrides the one stored with
	 * keys.set_webhook_signature. Deliveries are only verified when a secret
	 * is set here or on the webhook, matching Stannp's optional signing.
	 */
	webhookSecret?: string;
	hooks?: InternalStannpPlugin['hooks'];
	webhookHooks?: InternalStannpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stannpEndpointsNested>;
};

export type StannpContext = CorsairPluginContext<
	typeof StannpSchema,
	StannpPluginOptions
>;

export type StannpKeyBuilderContext = KeyBuilderContext<StannpPluginOptions>;

export type StannpBoundEndpoints = BindEndpoints<typeof stannpEndpointsNested>;

type StannpEndpoint<K extends keyof StannpEndpointOutputs> = CorsairEndpoint<
	StannpContext,
	StannpEndpointInputs[K],
	StannpEndpointOutputs[K]
>;

export type StannpEndpoints = {
	[K in keyof StannpEndpointOutputs]: StannpEndpoint<K>;
};

type StannpWebhook<K extends StannpWebhookEvent> = CorsairWebhook<
	StannpContext,
	StannpWebhookPayload,
	StannpWebhookOutputs[K]
>;

export type StannpWebhooks = {
	[K in StannpWebhookEvent]: StannpWebhook<K>;
};

export type StannpBoundWebhooks = BindWebhooks<StannpWebhooks>;

const stannpEndpointsNested = {
	account: {
		balance: Account.balance,
		topup: Account.topup,
	},
	addresses: {
		validate: Addresses.validate,
	},
	postcards: {
		create: Postcards.create,
		get: Postcards.get,
		cancel: Postcards.cancel,
	},
	letters: {
		create: Letters.create,
		post: Letters.post,
		get: Letters.get,
		cancel: Letters.cancel,
	},
	recipients: {
		list: Recipients.list,
		get: Recipients.get,
		create: Recipients.create,
		delete: Recipients.remove,
		import: Recipients.importFile,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		addRecipients: Groups.addRecipients,
		removeRecipients: Groups.removeRecipients,
		purge: Groups.purge,
		calculate: Groups.calculate,
		delete: Groups.remove,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		sample: Campaigns.sample,
		approve: Campaigns.approve,
		cost: Campaigns.cost,
		availableDates: Campaigns.availableDates,
		book: Campaigns.book,
		delete: Campaigns.remove,
	},
	events: {
		create: Events.create,
	},
	selections: {
		create: Selections.create,
	},
	reporting: {
		summary: Reporting.summary,
		list: Reporting.list,
	},
	files: {
		upload: Files.upload,
		createFolder: Files.createFolder,
		listFolders: Files.listFolders,
	},
	sms: {
		create: Sms.create,
	},
	tools: {
		templates: Tools.templates,
		pdfMerge: Tools.pdfMerge,
	},
} as const;

export const stannpWebhooksNested = {
	webhooks: { testUrl },
	mailpieces: { status: mailpieceStatus },
	campaigns: { status: campaignStatus },
	events: { created: recipientEvents },
} as const;

export const stannpEndpointSchemas = {
	'account.balance': {
		input: StannpEndpointInputSchemas.accountBalance,
		output: StannpEndpointOutputSchemas.accountBalance,
	},
	'account.topup': {
		input: StannpEndpointInputSchemas.accountTopup,
		output: StannpEndpointOutputSchemas.accountTopup,
	},
	'addresses.validate': {
		input: StannpEndpointInputSchemas.addressesValidate,
		output: StannpEndpointOutputSchemas.addressesValidate,
	},
	'postcards.create': {
		input: StannpEndpointInputSchemas.postcardsCreate,
		output: StannpEndpointOutputSchemas.postcardsCreate,
	},
	'postcards.get': {
		input: StannpEndpointInputSchemas.postcardsGet,
		output: StannpEndpointOutputSchemas.postcardsGet,
	},
	'postcards.cancel': {
		input: StannpEndpointInputSchemas.postcardsCancel,
		output: StannpEndpointOutputSchemas.postcardsCancel,
	},
	'letters.create': {
		input: StannpEndpointInputSchemas.lettersCreate,
		output: StannpEndpointOutputSchemas.lettersCreate,
	},
	'letters.post': {
		input: StannpEndpointInputSchemas.lettersPost,
		output: StannpEndpointOutputSchemas.lettersPost,
	},
	'letters.get': {
		input: StannpEndpointInputSchemas.lettersGet,
		output: StannpEndpointOutputSchemas.lettersGet,
	},
	'letters.cancel': {
		input: StannpEndpointInputSchemas.lettersCancel,
		output: StannpEndpointOutputSchemas.lettersCancel,
	},
	'recipients.list': {
		input: StannpEndpointInputSchemas.recipientsList,
		output: StannpEndpointOutputSchemas.recipientsList,
	},
	'recipients.get': {
		input: StannpEndpointInputSchemas.recipientsGet,
		output: StannpEndpointOutputSchemas.recipientsGet,
	},
	'recipients.create': {
		input: StannpEndpointInputSchemas.recipientsCreate,
		output: StannpEndpointOutputSchemas.recipientsCreate,
	},
	'recipients.delete': {
		input: StannpEndpointInputSchemas.recipientsDelete,
		output: StannpEndpointOutputSchemas.recipientsDelete,
	},
	'recipients.import': {
		input: StannpEndpointInputSchemas.recipientsImport,
		output: StannpEndpointOutputSchemas.recipientsImport,
	},
	'groups.list': {
		input: StannpEndpointInputSchemas.groupsList,
		output: StannpEndpointOutputSchemas.groupsList,
	},
	'groups.create': {
		input: StannpEndpointInputSchemas.groupsCreate,
		output: StannpEndpointOutputSchemas.groupsCreate,
	},
	'groups.addRecipients': {
		input: StannpEndpointInputSchemas.groupsAddRecipients,
		output: StannpEndpointOutputSchemas.groupsAddRecipients,
	},
	'groups.removeRecipients': {
		input: StannpEndpointInputSchemas.groupsRemoveRecipients,
		output: StannpEndpointOutputSchemas.groupsRemoveRecipients,
	},
	'groups.purge': {
		input: StannpEndpointInputSchemas.groupsPurge,
		output: StannpEndpointOutputSchemas.groupsPurge,
	},
	'groups.calculate': {
		input: StannpEndpointInputSchemas.groupsCalculate,
		output: StannpEndpointOutputSchemas.groupsCalculate,
	},
	'groups.delete': {
		input: StannpEndpointInputSchemas.groupsDelete,
		output: StannpEndpointOutputSchemas.groupsDelete,
	},
	'campaigns.list': {
		input: StannpEndpointInputSchemas.campaignsList,
		output: StannpEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: StannpEndpointInputSchemas.campaignsGet,
		output: StannpEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: StannpEndpointInputSchemas.campaignsCreate,
		output: StannpEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.sample': {
		input: StannpEndpointInputSchemas.campaignsSample,
		output: StannpEndpointOutputSchemas.campaignsSample,
	},
	'campaigns.approve': {
		input: StannpEndpointInputSchemas.campaignsApprove,
		output: StannpEndpointOutputSchemas.campaignsApprove,
	},
	'campaigns.cost': {
		input: StannpEndpointInputSchemas.campaignsCost,
		output: StannpEndpointOutputSchemas.campaignsCost,
	},
	'campaigns.availableDates': {
		input: StannpEndpointInputSchemas.campaignsAvailableDates,
		output: StannpEndpointOutputSchemas.campaignsAvailableDates,
	},
	'campaigns.book': {
		input: StannpEndpointInputSchemas.campaignsBook,
		output: StannpEndpointOutputSchemas.campaignsBook,
	},
	'campaigns.delete': {
		input: StannpEndpointInputSchemas.campaignsDelete,
		output: StannpEndpointOutputSchemas.campaignsDelete,
	},
	'events.create': {
		input: StannpEndpointInputSchemas.eventsCreate,
		output: StannpEndpointOutputSchemas.eventsCreate,
	},
	'selections.create': {
		input: StannpEndpointInputSchemas.selectionsCreate,
		output: StannpEndpointOutputSchemas.selectionsCreate,
	},
	'reporting.summary': {
		input: StannpEndpointInputSchemas.reportingSummary,
		output: StannpEndpointOutputSchemas.reportingSummary,
	},
	'reporting.list': {
		input: StannpEndpointInputSchemas.reportingList,
		output: StannpEndpointOutputSchemas.reportingList,
	},
	'files.upload': {
		input: StannpEndpointInputSchemas.filesUpload,
		output: StannpEndpointOutputSchemas.filesUpload,
	},
	'files.createFolder': {
		input: StannpEndpointInputSchemas.filesCreateFolder,
		output: StannpEndpointOutputSchemas.filesCreateFolder,
	},
	'files.listFolders': {
		input: StannpEndpointInputSchemas.filesListFolders,
		output: StannpEndpointOutputSchemas.filesListFolders,
	},
	'sms.create': {
		input: StannpEndpointInputSchemas.smsCreate,
		output: StannpEndpointOutputSchemas.smsCreate,
	},
	'tools.templates': {
		input: StannpEndpointInputSchemas.toolsTemplates,
		output: StannpEndpointOutputSchemas.toolsTemplates,
	},
	'tools.pdfMerge': {
		input: StannpEndpointInputSchemas.toolsPdfMerge,
		output: StannpEndpointOutputSchemas.toolsPdfMerge,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stannpEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const stannpEndpointMeta = {
	'account.balance': {
		riskLevel: 'read',
		description: 'Read the account balance',
	},
	'account.topup': {
		riskLevel: 'write',
		description:
			'Top up the account balance from the saved card; the amount is charged for real',
	},
	'addresses.validate': {
		riskLevel: 'read',
		description:
			'Validate a UK or US postal address and get the corrected form with a validity flag',
	},
	'postcards.create': {
		riskLevel: 'write',
		description:
			'Create and mail a postcard to one recipient; test mode renders a PDF proof without posting or charging',
	},
	'postcards.get': {
		riskLevel: 'read',
		description:
			'Get one postcard mailpiece with its status, tracking and cost',
	},
	'postcards.cancel': {
		riskLevel: 'write',
		description: 'Cancel a postcard that has not started processing yet',
	},
	'letters.create': {
		riskLevel: 'write',
		description:
			'Create and mail a letter merged from a template or PDF; test mode renders a PDF proof without posting or charging',
	},
	'letters.post': {
		riskLevel: 'write',
		description:
			'Post an already mail-merged letter PDF whose address the API reads with OCR',
	},
	'letters.get': {
		riskLevel: 'read',
		description: 'Get one letter mailpiece with its status, tracking and cost',
	},
	'letters.cancel': {
		riskLevel: 'write',
		description: 'Cancel a letter that has not started processing yet',
	},
	'recipients.list': {
		riskLevel: 'read',
		description:
			'List recipients with their addresses and blacklist flag, filtered by group and paged with offset and limit',
	},
	'recipients.get': {
		riskLevel: 'read',
		description: 'Get one recipient by id',
	},
	'recipients.create': {
		riskLevel: 'write',
		description:
			'Create a recipient, optionally into a group, with duplicate handling and custom fields',
	},
	'recipients.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a recipient from the account; this cannot be undone',
	},
	'recipients.import': {
		riskLevel: 'write',
		description:
			'Import a CSV or XLS data file into a group, with column remapping and duplicate handling',
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List mailing groups with recipient counts and import progress, paged with offset and limit',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new empty mailing group',
	},
	'groups.addRecipients': {
		riskLevel: 'write',
		description: 'Add recipients to a group',
	},
	'groups.removeRecipients': {
		riskLevel: 'write',
		description:
			'Remove recipients from a group; the recipients stay on the account',
	},
	'groups.purge': {
		riskLevel: 'destructive',
		description:
			'Remove every recipient from a group; with delete_recipients the recipients are deleted account-wide, which cannot be undone',
	},
	'groups.calculate': {
		riskLevel: 'write',
		description: 'Recalculate a group so its statistics are up to date',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a mailing group; with delete_recipients the recipients are deleted account-wide, which cannot be undone',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns with status, recipient counts and cost',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Get one campaign by id',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign for a group from a template, copied design or uploaded artwork; nothing sends until it is booked',
	},
	'campaigns.sample': {
		riskLevel: 'write',
		description:
			'Produce a PDF sample of the campaign; the link is valid for 30 minutes',
	},
	'campaigns.approve': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Approve a campaign, locking its design and recipient selection; the lock cannot be undone',
	},
	'campaigns.cost': {
		riskLevel: 'read',
		description:
			'Price a campaign: per-piece rates and totals for validated, non-validated and international recipients',
	},
	'campaigns.availableDates': {
		riskLevel: 'read',
		description: 'List the dates a campaign can be booked for',
	},
	'campaigns.book': {
		riskLevel: 'write',
		description:
			'Book a campaign for dispatch on a date, paying from the balance; this starts a real mailing',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a campaign that has not been booked; this cannot be undone',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Record an event against a recipient for tracking, conversions and automation triggers',
	},
	'selections.create': {
		riskLevel: 'write',
		description:
			'Create an auto-filter selection that targets a subset of a group',
	},
	'reporting.summary': {
		riskLevel: 'read',
		description: 'Count mailpieces per delivery status within a date range',
	},
	'reporting.list': {
		riskLevel: 'read',
		description:
			'List mailpieces in a date range, optionally filtered by status or tag',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file by URL into the secure file transfer area',
	},
	'files.createFolder': {
		riskLevel: 'write',
		description: 'Create a folder in the secure file transfer area',
	},
	'files.listFolders': {
		riskLevel: 'read',
		description: 'List the folders in the secure file transfer area',
	},
	'sms.create': {
		riskLevel: 'write',
		description:
			'Send an SMS to a phone number or stored recipient; test mode builds it without sending or charging',
	},
	'tools.templates': {
		riskLevel: 'read',
		description: 'List the design templates on the account',
	},
	'tools.pdfMerge': {
		riskLevel: 'read',
		description: 'Merge several PDFs by URL into one file',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof stannpEndpointsNested>;

function webhookSchema<K extends StannpWebhookEvent>(
	event: K,
	description: string,
) {
	return {
		description,
		payload: StannpWebhookEventSchemas[event],
		response: StannpWebhookEventSchemas[event],
	};
}

const stannpWebhookSchemas = {
	'webhooks.testUrl': webhookSchema(
		'testUrl',
		'Validation POST sent once when a webhook is created; the platform keeps the webhook only if this answers HTTP 200',
	),
	'mailpieces.status': webhookSchema(
		'mailpieceStatus',
		'A mailpiece changed status: printing, dispatched, cancelled, local_delivery, delivered or returned; up to 50 mailpieces per call',
	),
	'campaigns.status': webhookSchema(
		'campaignStatus',
		'A campaign changed status: printing, dispatched or cancelled; up to 50 campaigns per call',
	),
	'events.created': webhookSchema(
		'recipientEvents',
		'A new recipient event was recorded; up to 50 events per call',
	),
} as const satisfies RequiredPluginWebhookSchemas<typeof stannpWebhooksNested>;

// The webhook secret: the plugin's webhookSecret option, else the one stored
// with keys.set_webhook_signature. Stannp signs deliveries only when a
// secret is set on the webhook, so an absent secret means unverified
// deliveries rather than a failure.
export async function resolveWebhookSecret(
	options: { webhookSecret?: string } | undefined,
	keys: { get_webhook_signature: () => Promise<string | null> } | undefined,
): Promise<string | undefined> {
	const fromOption = options?.webhookSecret?.trim();
	if (fromOption) return fromOption;
	try {
		const stored = (await keys?.get_webhook_signature())?.trim();
		return stored || undefined;
	} catch (error) {
		console.warn('Failed to read the Stannp webhook secret:', error);
		return undefined;
	}
}

export type BaseStannpPlugin<T extends StannpPluginOptions> = CorsairPlugin<
	'stannp',
	typeof StannpSchema,
	typeof stannpEndpointsNested,
	typeof stannpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalStannpPlugin = BaseStannpPlugin<StannpPluginOptions>;

export type ExternalStannpPlugin<T extends StannpPluginOptions> =
	BaseStannpPlugin<T>;

export function stannp<const T extends StannpPluginOptions>(
	incomingOptions: StannpPluginOptions & T = {} as StannpPluginOptions & T,
): ExternalStannpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'stannp',
		schema: StannpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: stannpEndpointsNested,
		webhooks: stannpWebhooksNested,
		endpointMeta: stannpEndpointMeta,
		endpointSchemas: stannpEndpointSchemas,
		webhookSchemas: stannpWebhookSchemas,
		pluginWebhookMatcher: matchStannpWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StannpKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// An empty secret means deliveries are accepted unverified,
				// matching a webhook created without a secret in Stannp.
				return (await resolveWebhookSecret(options, ctx.keys)) ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('stannp', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStannpPlugin;
}

export { StannpAPIError } from './client';
export type {
	StannpCampaign,
	StannpEndpointInputs,
	StannpEndpointOutputs,
	StannpGroup,
	StannpMailpiece,
	StannpRecipient,
	StannpRecipientAddress,
	StannpTemplate,
} from './endpoints/types';
export type {
	StannpWebhookEvent,
	StannpWebhookOutputs,
	StannpWebhookPayload,
} from './webhooks/types';
export {
	matchStannpWebhook,
	STANNP_SIGNATURE_HEADER,
	StannpWebhookEventSchemas,
	verifyStannpWebhook,
} from './webhooks/types';
