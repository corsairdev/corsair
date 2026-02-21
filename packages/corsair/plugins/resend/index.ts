import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import { Domains, Emails } from './endpoints';
import type {
	ResendEndpointInputs,
	ResendEndpointOutputs,
} from './endpoints/types';
import { ResendSchema } from './schema';
import type {
	DomainCreatedEvent,
	DomainUpdatedEvent,
	EmailBouncedEvent,
	EmailClickedEvent,
	EmailComplainedEvent,
	EmailDeliveredEvent,
	EmailFailedEvent,
	EmailOpenedEvent,
	EmailReceivedEvent,
	EmailSentEvent,
	ResendWebhookOutputs,
} from './webhooks';
import { DomainWebhooks, EmailWebhooks } from './webhooks';

export type ResendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalResendPlugin['hooks'];
	webhookHooks?: InternalResendPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type ResendContext = CorsairPluginContext<
	typeof ResendSchema,
	ResendPluginOptions
>;
export type ResendKeyBuilderContext = KeyBuilderContext<ResendPluginOptions>;

export type ResendBoundEndpoints = BindEndpoints<typeof resendEndpointsNested>;

type ResendEndpoint<K extends keyof ResendEndpointOutputs> = CorsairEndpoint<
	ResendContext,
	ResendEndpointInputs[K],
	ResendEndpointOutputs[K]
>;

export type ResendEndpoints = {
	emailsSend: ResendEndpoint<'emailsSend'>;
	emailsGet: ResendEndpoint<'emailsGet'>;
	emailsList: ResendEndpoint<'emailsList'>;
	domainsCreate: ResendEndpoint<'domainsCreate'>;
	domainsGet: ResendEndpoint<'domainsGet'>;
	domainsList: ResendEndpoint<'domainsList'>;
	domainsDelete: ResendEndpoint<'domainsDelete'>;
	domainsVerify: ResendEndpoint<'domainsVerify'>;
};

type ResendWebhook<
	K extends keyof ResendWebhookOutputs,
	TEvent,
> = CorsairWebhook<ResendContext, TEvent, ResendWebhookOutputs[K]>;

export type ResendWebhooks = {
	emailSent: ResendWebhook<'emailSent', EmailSentEvent>;
	emailDelivered: ResendWebhook<'emailDelivered', EmailDeliveredEvent>;
	emailBounced: ResendWebhook<'emailBounced', EmailBouncedEvent>;
	emailOpened: ResendWebhook<'emailOpened', EmailOpenedEvent>;
	emailClicked: ResendWebhook<'emailClicked', EmailClickedEvent>;
	emailComplained: ResendWebhook<'emailComplained', EmailComplainedEvent>;
	emailFailed: ResendWebhook<'emailFailed', EmailFailedEvent>;
	emailReceived: ResendWebhook<'emailReceived', EmailReceivedEvent>;
	domainCreated: ResendWebhook<'domainCreated', DomainCreatedEvent>;
	domainUpdated: ResendWebhook<'domainUpdated', DomainUpdatedEvent>;
};

export type ResendBoundWebhooks = BindWebhooks<ResendWebhooks>;

const resendEndpointsNested = {
	emails: {
		send: Emails.send,
		get: Emails.get,
		list: Emails.list,
	},
	domains: {
		create: Domains.create,
		get: Domains.get,
		list: Domains.list,
		delete: Domains.delete,
		verify: Domains.verify,
	},
} as const;

const resendWebhooksNested = {
	emails: {
		sent: EmailWebhooks.sent,
		delivered: EmailWebhooks.delivered,
		bounced: EmailWebhooks.bounced,
		opened: EmailWebhooks.opened,
		clicked: EmailWebhooks.clicked,
		complained: EmailWebhooks.complained,
		failed: EmailWebhooks.failed,
		received: EmailWebhooks.received,
	},
	domains: {
		created: DomainWebhooks.created,
		updated: DomainWebhooks.updated,
	},
} as const;

const defaultAuthType = 'api_key' as const;

export type BaseResendPlugin<T extends ResendPluginOptions> = CorsairPlugin<
	'resend',
	typeof ResendSchema,
	typeof resendEndpointsNested,
	typeof resendWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalResendPlugin = BaseResendPlugin<ResendPluginOptions>;

export type ExternalResendPlugin<T extends ResendPluginOptions> =
	BaseResendPlugin<T>;

export function resend<const T extends ResendPluginOptions>(
	incomingOptions: ResendPluginOptions & T = {} as ResendPluginOptions & T,
): ExternalResendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'resend',
		schema: ResendSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: resendEndpointsNested,
		webhooks: resendWebhooksNested,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasResendSignature =
				'svix-signature' in headers || 'x-resend-signature' in headers;
			return hasResendSignature;
		},
		errorHandlers: options.errorHandlers,
		keyBuilder: async (ctx: ResendKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalResendPlugin;
}

export {
	createResendEventMatch,
	verifyResendWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DomainCreatedEvent,
	DomainUpdatedEvent,
	EmailBouncedEvent,
	EmailClickedEvent,
	EmailComplainedEvent,
	EmailDeliveredEvent,
	EmailFailedEvent,
	EmailOpenedEvent,
	EmailReceivedEvent,
	EmailSentEvent,
	ResendEventMap,
	ResendEventName,
	ResendWebhookEvent,
	ResendWebhookOutputs,
	ResendWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CreateDomainResponse,
	DeleteDomainResponse,
	Domain,
	Email,
	GetDomainResponse,
	GetEmailResponse,
	ListDomainsResponse,
	ListEmailsResponse,
	ResendEndpointOutputs,
	SendEmailResponse,
	VerifyDomainResponse,
} from './endpoints/types';
