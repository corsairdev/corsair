import { workflowNodeStarted } from './client-messages';
import {
	assistantRequest,
	endOfCallReport,
	statusUpdate,
	toolCalls,
	transferDestinationRequest,
} from './server-messages';

export const ServerMessageWebhooks = {
	assistantRequest,
	toolCalls,
	transferDestinationRequest,
	endOfCallReport,
	statusUpdate,
};

export const ClientMessageWebhooks = {
	workflowNodeStarted,
};

export * from './types';
