import type { EnginemailerN8nEndpoints } from '..';
import { makeEnginemailerN8nRequest } from '../n8n-client';
import type { EnginemailerEndpointOutputs } from './types';

const get = <T>(
	ctx: { key: string },
	path: string,
	// N8N polling filters vary by event endpoint and are schema-validated.
	query?: Record<string, unknown>,
	) => {
	const transportQuery: Record<string, string | number | boolean | undefined> =
		{};
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === 'All') continue;
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			value === undefined
		) {
			transportQuery[key] = value;
		}
	}
	return makeEnginemailerN8nRequest<T>(path, ctx.key, {
		method: 'GET',
		query: transportQuery,
	});
};

const post = <T>(
	ctx: { key: string },
	path: string,
	// N8N actions accept provider-defined JSON; operation schemas validate inputs.
	body: Record<string, unknown>,
) => makeEnginemailerN8nRequest<T>(path, ctx.key, { method: 'POST', body });

export const n8nEndpoints: EnginemailerN8nEndpoints = {
	addOrUpdateSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['addOrUpdateSubscriber']>(
			ctx,
			'/addupdatesubscriber',
			input,
		),
	deactivateSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['deactivateSubscriber']>(
			ctx,
			'/unsubscribe',
			input,
		),
	deleteN8nSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['deleteN8nSubscriber']>(
			ctx,
			'/deletesubscriber',
			input,
		),
	findSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['findSubscriber']>(
			ctx,
			'/findsubscriber',
			input,
		),
	sendEmail: (ctx, input) =>
		post<EnginemailerEndpointOutputs['sendEmail']>(ctx, '/sendemail', input),
	tagSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['tagSubscriber']>(
			ctx,
			'/tagtosubcategory',
			input,
		),
	untagSubscriber: (ctx, input) =>
		post<EnginemailerEndpointOutputs['untagSubscriber']>(
			ctx,
			'/untagtosubcategory',
			input,
		),
	newSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['newSubscribers']>(
			ctx,
			'/newsubscribers',
			input,
		),
	unsubscribedSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['unsubscribedSubscribers']>(
			ctx,
			'/unsubscribe',
			input,
		),
	taggedSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['taggedSubscribers']>(
			ctx,
			'/subscriberstagged',
			input,
		),
	deletedSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['deletedSubscribers']>(
			ctx,
			'/subscribersdeleted',
			input,
		),
	untaggedSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['untaggedSubscribers']>(
			ctx,
			'/subscribersuntagged',
			input,
		),
	modifiedSubscribers: (ctx, input) =>
		get<EnginemailerEndpointOutputs['modifiedSubscribers']>(
			ctx,
			'/subscribersmodified',
			input,
		),
	autoresponderTriggered: (ctx, input) =>
		get<EnginemailerEndpointOutputs['autoresponderTriggered']>(
			ctx,
			'/subscriberautorespondertriggered',
			input,
		),
	autoresponderCompleted: (ctx, input) =>
		get<EnginemailerEndpointOutputs['autoresponderCompleted']>(
			ctx,
			'/subscriberautorespondercompleted',
			input,
		),
	connect: (ctx, input) =>
		get<EnginemailerEndpointOutputs['connect']>(ctx, '/connect', input),
	listForms: (ctx, input) =>
		get<EnginemailerEndpointOutputs['listForms']>(ctx, '/listforms', input),
	listPages: (ctx, input) =>
		get<EnginemailerEndpointOutputs['listPages']>(ctx, '/listpages', input),
	listPopups: (ctx, input) =>
		get<EnginemailerEndpointOutputs['listPopups']>(ctx, '/listpopups', input),
};
