import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	DeleteApiKeyInputSchema,
	DeleteApiKeyOutputSchema,
	DeleteWebhookInputSchema,
	DeleteWebhookOutputSchema,
	GetInitialFinishedAfterTimestampInputSchema,
	GetInitialFinishedAfterTimestampOutputSchema,
	ListCertificatesInputSchema,
	ListCertificatesOutputSchema,
	ListWebhooksInputSchema,
	ListWebhooksOutputSchema,
} from './types';

const THREE_MONTHS_IN_SECONDS = 60 * 60 * 24 * 90;
const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;

export const listCertificates: ClassmarkerEndpoints['listCertificates'] =
	async (ctx, input) => {
		const parsedInput = ListCertificatesInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'listCertificates',
			path: '/v1/certificates.json',
			input: parsedInput,
			inputSchema: ListCertificatesInputSchema,
			outputSchema: ListCertificatesOutputSchema,
		});
	};

export const listWebhooks: ClassmarkerEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const parsedInput = ListWebhooksInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'listWebhooks',
		path: '/v1/webhooks.json',
		input: parsedInput,
		inputSchema: ListWebhooksInputSchema,
		outputSchema: ListWebhooksOutputSchema,
	});
};

export const deleteWebhook: ClassmarkerEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const parsedInput = DeleteWebhookInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'deleteWebhook',
		path: `/v1/webhooks/${parsedInput.webhook_id}.json`,
		method: 'DELETE',
		input: parsedInput,
		inputSchema: DeleteWebhookInputSchema,
		outputSchema: DeleteWebhookOutputSchema,
		logPayload: {
			webhook_id: parsedInput.webhook_id,
		},
	});
};

export const deleteApiKey: ClassmarkerEndpoints['deleteApiKey'] = async (
	ctx,
	input,
) => {
	const parsedInput = DeleteApiKeyInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'deleteApiKey',
		path: `/v1/api_keys/${parsedInput.api_key_id}.json`,
		method: 'DELETE',
		input: parsedInput,
		inputSchema: DeleteApiKeyInputSchema,
		outputSchema: DeleteApiKeyOutputSchema,
		logPayload: {
			api_key_id: parsedInput.api_key_id,
		},
	});
};

export const getInitialFinishedAfterTimestamp: ClassmarkerEndpoints['getInitialFinishedAfterTimestamp'] =
	async (_ctx, input) => {
		GetInitialFinishedAfterTimestampInputSchema.parse(input);

		const nowInSeconds = Math.floor(Date.now() / 1000);
		const lowerBound = nowInSeconds - THREE_MONTHS_IN_SECONDS;
		const defaultCursor = nowInSeconds - TWO_WEEKS_IN_SECONDS;
		const finishedAfterTimestamp = Math.max(lowerBound, defaultCursor);

		return GetInitialFinishedAfterTimestampOutputSchema.parse({
			finishedAfterTimestamp,
		});
	};
