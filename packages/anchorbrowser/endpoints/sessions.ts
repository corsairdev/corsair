import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const endAllSessionsRoute = getRoute('endAllSessions');
export const endAllSessions: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, endAllSessionsRoute);
};

const endBrowserSessionRoute = getRoute('endBrowserSession');
export const endBrowserSession: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, endBrowserSessionRoute);
};

const getBrowserSessionRoute = getRoute('getBrowserSession');
export const getBrowserSession: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getBrowserSessionRoute);
};

const listSessionsRoute = getRoute('listSessions');
export const listSessions: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, listSessionsRoute);
};

const startBrowserSessionRoute = getRoute('startBrowserSession');
export const startBrowserSession: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, startBrowserSessionRoute);
};

export const SessionsEndpoints = {
	endAllSessions,
	endBrowserSession,
	getBrowserSession,
	listSessions,
	startBrowserSession,
} as const;
