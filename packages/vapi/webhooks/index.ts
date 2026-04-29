import {
	assistantRequest,
	toolCalls,
	transferDestinationRequest,
	endOfCallReport,
	statusUpdate,
} from './server-messages';
import { workflowNodeStarted } from './client-messages';

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
