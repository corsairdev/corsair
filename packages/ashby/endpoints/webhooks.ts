import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	WebhookCreateResponse,
	WebhookDeleteResponse,
	WebhookInfoResponse,
} from './types';

export const info: AshbyEndpoints['webhook.info'] = async (ctx, input) => {
	return await ashbyCall<WebhookInfoResponse>(ctx, 'webhook.info', {
		webhookId: input.webhookId,
	});
};

export const create: AshbyEndpoints['webhook.create'] = async (ctx, input) => {
	return await ashbyCall<WebhookCreateResponse>(ctx, 'webhook.create', {
		url: input.url,
		requestActionNames: input.requestActionNames,
		description: input.description,
		secretToken: input.secretToken,
	});
};

export const remove: AshbyEndpoints['webhook.delete'] = async (ctx, input) => {
	return await ashbyCall<WebhookDeleteResponse>(ctx, 'webhook.delete', {
		webhookId: input.webhookId,
	});
};
