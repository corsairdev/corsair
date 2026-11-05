import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	emptyOutputSchema,
	SessionsCloseInputSchema,
	SessionsCreateInputSchema,
	SessionsRefreshInputSchema,
	sessionSchema,
} from './types';

export const create: ExcelEndpoints['sessionsCreate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.sessions.create',
		SessionsCreateInputSchema,
		sessionSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/createSession`,
			headers: sessionHeaders(body.sessionId),
			body: { persistChanges: body.persistChanges },
		}),
		(body, response) => ({
			itemId: body.itemId ?? body.itemPath ?? null,
			sessionId: response.id,
			persistChanges: body.persistChanges,
		}),
	);
};

export const close: ExcelEndpoints['sessionsClose'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.sessions.close',
		SessionsCloseInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/closeSession`,
			headers: sessionHeaders(body.sessionId),
			body: {},
		}),
		(body) => ({
			itemId: body.itemId ?? body.itemPath ?? null,
		}),
	);
};

export const refresh: ExcelEndpoints['sessionsRefresh'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.sessions.refresh',
		SessionsRefreshInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/refreshSession`,
			headers: sessionHeaders(body.sessionId),
			body: {},
		}),
		(body) => ({
			itemId: body.itemId ?? body.itemPath ?? null,
		}),
	);
};
