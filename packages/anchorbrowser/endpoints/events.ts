import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const signalEventRoute = getRoute('signalEvent');
export const signalEvent: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, signalEventRoute);
};

const waitForEventRoute = getRoute('waitForEvent');
export const waitForEvent: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, waitForEventRoute);
};

export const EventsEndpoints = {
	signalEvent,
	waitForEvent,
} as const;
