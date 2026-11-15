import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call } from './call';

const REQUESTS = '/users/me/relation-requests';

export const list: UnipileEndpoints['relationRequestsList'] = (ctx, input) =>
	call(
		ctx,
		'relationRequestsList',
		'relationRequests.list',
		input,
		(parsed) => ({
			method: 'GET',
			path: accountPath(parsed.account_id, REQUESTS),
			query: {
				type: parsed.type,
				offset: parsed.offset,
				cursor: parsed.cursor,
				limit: parsed.limit,
			},
		}),
	);

// Sends a LinkedIn invitation. Never retried on a timeout or 5xx (see
// error-handlers.ts): a second invitation is worse than a missing one.
export const create: UnipileEndpoints['relationRequestsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'relationRequestsCreate',
		'relationRequests.create',
		input,
		(parsed) => ({
			method: 'POST',
			path: accountPath(parsed.account_id, REQUESTS),
			body: { user_id: parsed.user_id, message: parsed.message },
		}),
	);

// Withdraws a sent invitation or declines a received one.
export const cancel: UnipileEndpoints['relationRequestsCancel'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'relationRequestsCancel',
		'relationRequests.cancel',
		input,
		(parsed) => ({
			method: 'POST',
			path: accountPath(
				parsed.account_id,
				`${REQUESTS}/${segment(parsed.request_id)}/cancel`,
			),
		}),
	);

export const accept: UnipileEndpoints['relationRequestsAccept'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'relationRequestsAccept',
		'relationRequests.accept',
		input,
		(parsed) => ({
			method: 'POST',
			path: accountPath(
				parsed.account_id,
				`${REQUESTS}/${segment(parsed.request_id)}/accept`,
			),
		}),
	);
