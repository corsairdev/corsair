import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	compactQuery,
	habiticaAnonymousCall,
	habiticaCall,
	pathSegment,
	withRedactedPathValue,
} from './shared';
import type { HabiticaEndpointOutputs } from './types';

/**
 * Static game data, server status and the shops.
 *
 * None of it is mirrored. It is not row-shaped - the content catalogue is one
 * 2.65 MB document with no id to key rows by - and `schema/database.ts`
 * explains why that makes it a good cache and a poor entity.
 *
 * Several of these routes take no credentials. They still send `x-client`,
 * which they require: `/content` answers 400 `Missing x-client headers.`
 * without it despite needing no authentication.
 */

/**
 * Fetches the whole content catalogue.
 *
 * The catalog says this is "~9MB". It measured **2.65 MB** across 56 top-level
 * keys on 2026-08-15, returned in about 2.4 seconds - comfortably inside the
 * shared transport's 20 second timeout, which was the open question. The
 * figure is recorded here because "does it fit" mattered more than the exact
 * size, and the answer is yes with room to spare.
 */
export const get: HabiticaEndpoints['contentGet'] = async (ctx, input) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['contentGet']
	>('content', { query: compactQuery({ language: input.language }) });

	await logEventFromContext(
		ctx,
		'habitica.content.get',
		{ ...auditPayload(input, ['language']), keys: Object.keys(result).length },
		'completed',
	);
	return result;
};

/**
 * Fetches the content catalogue with some categories removed.
 *
 * **`filter` excludes the keys you name. It does not select them.** This
 * contradicts the catalog, which describes the operation as returning content
 * "filtered by a specific category type" - so a caller following the catalog
 * asks for quests and receives all 55 other categories instead, with a 200 and
 * nothing to indicate anything went wrong.
 *
 * Established by comparing key sets rather than reading status codes, on
 * 2026-08-15:
 *
 * ```
 * no filter                  56 keys, 2713 KB
 * filter=quests              55 keys, 2491 KB   - the missing key is `quests`
 * filter=gear                55 keys, 1332 KB
 * filter=quests,gear         54 keys, 1111 KB
 * filter=notARealContentKey  56 keys, 2713 KB   - unknown keys ignored silently
 * ```
 *
 * The server's own helper names the argument `removedKeys`, which settles what
 * was intended.
 *
 * The behaviour is passed through rather than inverted here. Reversing it in
 * the plugin would make this integration disagree with every other Habitica
 * client and with the API's own documentation, and would silently break if the
 * API were ever fixed. The name stays as Habitica spells it; the meaning is
 * documented where a caller will meet it, in the input schema and here.
 */
export const getByType: HabiticaEndpoints['contentGetByType'] = async (
	ctx,
	input,
) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['contentGetByType']
	>('content', {
		query: compactQuery({ filter: input.filter, language: input.language }),
	});

	await logEventFromContext(
		ctx,
		'habitica.content.getByType',
		{
			...auditPayload(input, ['filter', 'language']),
			keys: Object.keys(result).length,
		},
		'completed',
	);
	return result;
};

/**
 * Checks that the API is up.
 *
 * The one route that needs neither credentials nor `x-client`, which makes it
 * the only safe pre-flight check.
 */
export const status: HabiticaEndpoints['status'] = async (ctx, input) => {
	const result =
		await habiticaAnonymousCall<HabiticaEndpointOutputs['status']>('status');

	await logEventFromContext(
		ctx,
		'habitica.status',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Reads world events, the world boss and seasonal themes. */
export const worldState: HabiticaEndpoints['worldState'] = async (
	ctx,
	input,
) => {
	const result =
		await habiticaAnonymousCall<HabiticaEndpointOutputs['worldState']>(
			'world-state',
		);

	await logEventFromContext(
		ctx,
		'habitica.worldState',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/**
 * Lists a model's field paths and types.
 *
 * The valid vocabulary is `user, tag, challenge, group, habit, daily, todo,
 * reward` - enumerated by asking the API, one value at a time, rather than
 * taken from the catalog. The catalog says "user, group, challenge, tag, or
 * task"; `task` is **not** valid and returns 400. The four task types are
 * addressed individually instead, which is why the input enum has eight members
 * rather than five.
 */
export const modelPaths: HabiticaEndpoints['modelPaths'] = async (
	ctx,
	input,
) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['modelPaths']
	>(`models/${pathSegment(input.model)}/paths`);

	await logEventFromContext(
		ctx,
		'habitica.modelPaths',
		{ ...auditPayload(input, ['model']), paths: Object.keys(result).length },
		'completed',
	);
	return result;
};

/** Reads the latest Bailey announcement. */
export const news: HabiticaEndpoints['newsGet'] = async (ctx, input) => {
	const result =
		await habiticaAnonymousCall<HabiticaEndpointOutputs['newsGet']>('news');

	await logEventFromContext(
		ctx,
		'habitica.news.get',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Dismisses the current announcement so it reappears later. */
export const dismissNews: HabiticaEndpoints['newsDismiss'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['newsDismiss']>(
		ctx,
		'news/tell-me-later',
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.news.dismiss',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Lists the gear available in the market, organised by class. */
export const marketGear: HabiticaEndpoints['shopsMarketGear'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['shopsMarketGear']>(
		ctx,
		'shops/market-gear',
		{
			query: compactQuery({ language: input.language }),
		},
	);

	await logEventFromContext(
		ctx,
		'habitica.shops.marketGear',
		auditPayload(input, ['language']),
		'completed',
	);
	return result;
};

/** Lists what the Time Travellers shop sells for hourglasses. */
export const timeTravelers: HabiticaEndpoints['shopsTimeTravelers'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['shopsTimeTravelers']
	>(ctx, 'shops/time-travelers', {
		query: compactQuery({ language: input.language }),
	});

	await logEventFromContext(
		ctx,
		'habitica.shops.timeTravelers',
		auditPayload(input, ['language']),
		'completed',
	);
	return result;
};

/**
 * Checks whether a coupon code is valid.
 *
 * The code is **not** logged. A valid coupon is a bearer instrument - anyone
 * holding the string can redeem it - so recording one in a retained event log
 * would turn the audit trail into something worth stealing. Only the outcome is
 * recorded.
 *
 * It is kept out of thrown errors for the same reason. Habitica takes the code
 * as a path parameter, and the shared transport redacts sensitive query
 * parameters but not path segments, so a failed validation would otherwise
 * carry the code in `error.url`.
 */
export const validateCoupon: HabiticaEndpoints['validateCoupon'] = async (
	ctx,
	input,
) => {
	const result = await withRedactedPathValue(input.code, () =>
		habiticaCall<HabiticaEndpointOutputs['validateCoupon']>(
			ctx,
			`coupons/validate/${pathSegment(input.code)}`,
			{ method: 'POST' },
		),
	);

	await logEventFromContext(ctx, 'habitica.coupons.validate', {}, 'completed');
	return result;
};
