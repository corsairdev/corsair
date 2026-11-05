import { webhooksOperations } from '../operations/webhooks';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof webhooksOperations)[number]['name']) {
	const operation = webhooksOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listWebhooksDefinition = getOperation('listWebhooks');
export const listWebhooks: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listWebhooksDefinition,
	);
	await syncWebflowOperationResult(ctx, listWebhooksDefinition, input, result);
	await logWebflowOperation(ctx, input, listWebhooksDefinition);
	return result;
};

const deleteWebhookDefinition = getOperation('deleteWebhook');
export const deleteWebhook: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteWebhookDefinition,
	);
	await syncWebflowOperationResult(ctx, deleteWebhookDefinition, input, result);
	await logWebflowOperation(ctx, input, deleteWebhookDefinition);
	return result;
};

export const WebhooksEndpoints = {
	listWebhooks,
	deleteWebhook,
} as const;
