import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { habiticaExportCall } from './shared';
import type { HabiticaEndpointOutputs } from './types';

/**
 * The three whole-account export documents.
 *
 * They are unlike everything else in this plugin in three ways, and each one
 * was checked live rather than assumed:
 *
 * 1. **They sit outside `/api/v3`**, at `https://habitica.com/export/*`, so
 *    they use a second base URL - the same shape as Loyverse's OIDC routes.
 * 2. **They work with header authentication.** The server source routes them
 *    through `authWithSession` rather than the `authWithHeaders` middleware
 *    every other route uses, which reads as though a browser session were
 *    required. All three returned 200 to the ordinary `x-api-user` /
 *    `x-api-key` pair on 2026-08-15. Recording them as unreachable on the
 *    strength of the source alone would have been wrong.
 * 3. **Two of the three are not JSON** - `text/csv` and `text/html` - so they
 *    cannot go through the shared JSON transport.
 *
 * None of them is mirrored, and none of their bodies is logged. `bytes` is
 * recorded so an operator can see an export happened and roughly how large it
 * was, which is the most that can be said without copying the contents.
 */

/**
 * Exports the whole account as JSON.
 *
 * **This document contains the account holder's email address** under
 * `auth.local.email`, together with their entire task and message history. It
 * is returned to the caller, which is the point of the operation, but it must
 * never be mirrored, never logged, and never captured as a test fixture.
 *
 * The response is parsed here rather than passed through as text, because
 * unlike the other two it genuinely is JSON and a caller asking for
 * `userdata.json` expects an object.
 */
export const userData: HabiticaEndpoints['exportUserData'] = async (ctx) => {
	const raw = await habiticaExportCall(ctx, 'userdata.json');

	let parsed: HabiticaEndpointOutputs['exportUserData'];
	try {
		parsed = JSON.parse(raw.body) as HabiticaEndpointOutputs['exportUserData'];
	} catch (error) {
		// The body is deliberately excluded from the message - it is the whole
		// account, including the email address.
		throw new Error(
			`Habitica returned an export that is not valid JSON (${raw.contentType}, ${raw.body.length} bytes): ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}

	await logEventFromContext(
		ctx,
		'habitica.export.userData',
		{ bytes: raw.body.length },
		'completed',
	);
	return parsed;
};

/**
 * Exports task history as CSV.
 *
 * Returned as text with its content type rather than parsed into rows: the
 * columns follow the account's own tasks, so a parser here would be inventing a
 * schema that a different account breaks.
 */
export const history: HabiticaEndpoints['exportHistoryCsv'] = async (ctx) => {
	const result = await habiticaExportCall(ctx, 'history.csv');

	await logEventFromContext(
		ctx,
		'habitica.export.history',
		{ bytes: result.body.length, contentType: result.contentType },
		'completed',
	);
	return result;
};

/**
 * Exports the inbox as an HTML document.
 *
 * Private correspondence, returned as text and never parsed, mirrored or
 * logged.
 */
export const inbox: HabiticaEndpoints['exportInboxHtml'] = async (ctx) => {
	const result = await habiticaExportCall(ctx, 'inbox.html');

	await logEventFromContext(
		ctx,
		'habitica.export.inbox',
		{ bytes: result.body.length, contentType: result.contentType },
		'completed',
	);
	return result;
};
