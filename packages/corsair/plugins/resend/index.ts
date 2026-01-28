import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import type { AuthTypes } from '../../core/constants';
import { Domains, Emails } from './endpoints';
import type { ResendEndpointOutputs } from './endpoints/types';
import type { ResendCredentials } from './schema';
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
	authType: AuthTypes;
	credentials: ResendCredentials;
	hooks?: ResendPlugin['hooks'] | undefined;
	webhookHooks?: ResendPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type ResendContext = CorsairPluginContext<
	typeof ResendSchema,
	ResendPluginOptions
>;

export type ResendBoundEndpoints = BindEndpoints<ResendEndpoints>;

type ResendEndpoint<
	K extends keyof ResendEndpointOutputs,
	Input,
> = CorsairEndpoint<ResendContext, Input, ResendEndpointOutputs[K]>;

export type ResendEndpoints = {
	emailsSend: ResendEndpoint<
		'emailsSend',
		{
			from: string;
			to: string | string[];
			subject: string;
			html?: string;
			text?: string;
			cc?: string | string[];
			bcc?: string | string[];
			reply_to?: string | string[];
			attachments?: Array<{
				filename: string;
				content: string | Buffer;
				path?: string;
			}>;
			tags?: Array<{ name: string; value: string }>;
			headers?: Record<string, string>;
		}
	>;
	emailsGet: ResendEndpoint<'emailsGet', { id: string }>;
	emailsList: ResendEndpoint<
		'emailsList',
		{ limit?: number; cursor?: string } | undefined
	>;
	domainsCreate: ResendEndpoint<
		'domainsCreate',
		{
			name: string;
			region?: 'us-east-1' | 'eu-west-1' | 'sa-east-1';
		}
	>;
	domainsGet: ResendEndpoint<'domainsGet', { id: string }>;
	domainsList: ResendEndpoint<
		'domainsList',
		{ limit?: number; cursor?: string } | undefined
	>;
	domainsDelete: ResendEndpoint<'domainsDelete', { id: string }>;
	domainsVerify: ResendEndpoint<'domainsVerify', { id: string }>;
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

export type ResendPlugin = CorsairPlugin<
	'resend',
	typeof ResendSchema,
	typeof resendEndpointsNested,
	typeof resendWebhooksNested,
	ResendPluginOptions
>;

export function resend(options: ResendPluginOptions) {
	return {
		id: 'resend',
		schema: ResendSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: resendEndpointsNested,
		webhooks: resendWebhooksNested,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers as Record<string, string | undefined>;
			const signature = headers['resend-signature'];
			if (typeof signature === 'string' && signature.length > 0) return true;

			const body = request.body as Record<string, unknown>;
			const type = body?.type;
			return typeof type === 'string' && (type.startsWith('email.') || type.startsWith('domain.'));
		},
		errorHandlers: options.errorHandlers,
	} satisfies ResendPlugin;
}
